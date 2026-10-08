import { z } from 'zod';
const password = z.string().min(12, 'Use at least 12 characters.').max(128, 'Use at most 128 characters.');
export const loginSchema = z.object({ usernameOrEmail: z.string().trim().min(1, 'Enter your email or username.'), password: z.string().min(1, 'Enter your password.').max(128) });
export const registerSchema = z.object({ fullName: z.string().trim().min(1, 'Enter your full name.').max(80), email: z.string().trim().email('Enter a valid email.'), username: z.string().trim().min(1, 'Choose a username.').max(80), password, confirmPassword: z.string() }).refine(value => value.password === value.confirmPassword, { path: ['confirmPassword'], message: 'Passwords do not match.' });
export const recoverSchema = z.object({ usernameOrEmail: z.string().trim().min(1), recoveryCode: z.string().trim().min(1, 'Enter your private recovery code.'), newPassword: password });
