export interface AuthIdentity { id?: string; fullName: string; username: string; email?: string }
export interface AuthResponse { token: string; fullName: string; username: string; recoveryCode: string | null; expiresAt: string }
export interface LoginInput { usernameOrEmail: string; password: string }
export interface RegisterInput { fullName: string; email: string; username: string; password: string }
export interface RecoverInput { usernameOrEmail: string; recoveryCode: string; newPassword: string }
