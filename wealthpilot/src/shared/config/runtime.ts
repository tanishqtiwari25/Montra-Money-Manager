export const IS_DEMO = import.meta.env.VITE_DATA_MODE === 'demo';
const localPreview = typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname);
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? (localPreview ? '/api/v1' : 'https://montra-apis-w8pd.onrender.com/api/v1')).replace(/[/]$/, '');
export function currentBusinessDate(): string { return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()); }
