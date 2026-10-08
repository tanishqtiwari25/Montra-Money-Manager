import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userApi, useUser, type UserProfile } from '@entities/user';
import { useAccounts } from '@entities/account';
import { useGoals } from '@entities/goal';
import { Button, Input, ErrorState, toast } from '@shared/ui';
import { errorMessage } from '@shared/lib';
import { profileSchema, profileToForm, profileFormToInput, type ProfileValues } from '../model/schema';
export function ProfileForm({ profile }: { profile: UserProfile }) {
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } = useForm<ProfileValues>({ resolver: zodResolver(profileSchema), defaultValues: profileToForm(profile) });
  useEffect(() => { void useAccounts.getState().load(); void useGoals.getState().load(); }, []);
  const submit = async (values: ProfileValues) => { setError(null); try { const item = await userApi.update(profileFormToInput(values)); useUser.getState().setProfile(item); reset(profileToForm(item)); toast('Profile and savings preferences updated.'); } catch (cause: unknown) { setError(errorMessage(cause)); } };
  return <form onSubmit={handleSubmit(submit)} className="space-y-5" noValidate><fieldset disabled={isSubmitting} className="grid gap-5 sm:grid-cols-2"><Input label="Full name" error={errors.name?.message} {...register('name')} /><Input label="Contact email" type="email" error={errors.email?.message} {...register('email')} /><Input label="Occupation" error={errors.occupation?.message} {...register('occupation')} /><Input label="Monthly salary (₹)" type="number" step="0.01" error={errors.monthlySalary?.message} {...register('monthlySalary', { valueAsNumber: true })} /><Input label="Monthly goal savings (₹)" type="number" step="0.01" error={errors.monthlyGoalSavings?.message} {...register('monthlyGoalSavings', { valueAsNumber: true })} /><Input label="Emergency fund saved (₹)" type="number" step="0.01" error={errors.emergencyFund?.message} {...register('emergencyFund', { valueAsNumber: true })} /><Input label="Emergency fund target (₹)" type="number" step="0.01" error={errors.emergencyTarget?.message} {...register('emergencyTarget', { valueAsNumber: true })} /><Input label="Currency" value="INR · Indian Rupee (₹)" readOnly /></fieldset>{error && <ErrorState message={error} />}<div className="flex justify-end"><Button type="submit" busy={isSubmitting} disabled={!isDirty}>Save changes</Button></div></form>;
}
