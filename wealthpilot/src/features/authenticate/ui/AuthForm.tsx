import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth, authApi } from '@entities/auth';
import { Input, Button, ErrorState } from '@shared/ui';
import { errorMessage } from '@shared/lib';
import { loginSchema, registerSchema, recoverSchema } from '../model/schema';
type Mode = 'login' | 'signup' | 'recover';
type Values = { fullName?: string; email?: string; username?: string; usernameOrEmail?: string; password?: string; confirmPassword?: string; recoveryCode?: string; newPassword?: string };
export function AuthForm({ mode }: { mode: Mode }) {
  const navigate = useNavigate(); const location = useLocation(); const auth = useAuth();
  const [show, setShow] = useState(false); const [error, setError] = useState<string | null>(null); const [success, setSuccess] = useState<string | null>(null);
  const schema = mode === 'signup' ? registerSchema : mode === 'recover' ? recoverSchema : loginSchema;
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema as z.ZodType<Values>) });
  const submit = async (values: Values) => {
    setError(null); setSuccess(null);
    try {
      if (mode === 'signup') { const input = registerSchema.parse(values); await auth.register({ fullName: input.fullName, email: input.email, username: input.username, password: input.password }); }
      else if (mode === 'recover') { const result = await authApi.recover(recoverSchema.parse(values)); setSuccess('Password recovered. Save your replacement recovery code privately: ' + (result.recoveryCode ?? 'No replacement code returned. Contact support.') + '. Sign in using your new password.'); return; }
      else await auth.login(loginSchema.parse(values));
      const from = (location.state as { from?: string } | null)?.from;
      navigate(from?.startsWith('/') && !from.startsWith('//') && !['/login', '/signup', '/recover'].some(path => from.startsWith(path)) ? from : '/dashboard', { replace: true });
    } catch (cause: unknown) { setError(errorMessage(cause)); }
  };
  const field = (name: keyof Values, label: string, autoComplete: string, type = 'text') => <Input label={label} autoComplete={autoComplete} type={type} disabled={isSubmitting} error={errors[name]?.message} {...register(name)} />;
  return <form onSubmit={handleSubmit(submit)} className="space-y-4" noValidate>
    {mode === 'signup' ? <>{field('fullName', 'Full name', 'name')}{field('email', 'Email address', 'email', 'email')}{field('username', 'Username', 'username')}</> : field('usernameOrEmail', 'Email or username', 'username')}
    {mode === 'recover' && <>{field('recoveryCode', 'Private recovery code', 'off')}<p className="text-xs leading-relaxed text-muted">Use the code saved when your account was created. This service does not send password-reset emails.</p></>}
    <div className="relative">{mode === 'recover' ? field('newPassword', 'New password', 'new-password', show ? 'text' : 'password') : field('password', 'Password', mode === 'signup' ? 'new-password' : 'current-password', show ? 'text' : 'password')}<button type="button" className="absolute right-3 top-8 rounded p-2 text-muted" aria-label={show ? 'Hide password' : 'Show password'} aria-pressed={show} onClick={() => setShow(!show)}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
    {mode === 'signup' && <>{field('confirmPassword', 'Confirm password', 'new-password', show ? 'text' : 'password')}<p className="text-xs text-muted">Use 12–128 characters. You’ll receive a private account-recovery code after signing up.</p></>}
    {error && <ErrorState message={error} />}{success && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{success} <Link to="/login" className="underline">Sign in</Link></p>}
    <Button type="submit" busy={isSubmitting} className="w-full">{mode === 'signup' ? 'Create account' : mode === 'recover' ? 'Recover account' : 'Sign in'}<ArrowRight size={17} /></Button>
    <div className="flex flex-wrap justify-between gap-3 text-sm text-muted">{mode === 'login' ? <><Link to="/recover" className="text-indigo-700 dark:text-indigo-300">Forgot password?</Link><span>New here? <Link to="/signup" className="font-semibold text-indigo-700 dark:text-indigo-300">Create account</Link></span></> : <span>Already have an account? <Link to="/login" className="font-semibold text-indigo-700 dark:text-indigo-300">Sign in</Link></span>}</div>
  </form>;
}
