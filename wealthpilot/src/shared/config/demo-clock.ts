import { IS_DEMO, currentBusinessDate } from './runtime';
export const DEMO_TODAY = IS_DEMO ? '2026-10-07' : currentBusinessDate();
export const DEMO_MONTH = DEMO_TODAY.slice(0, 7);
export const TIME_ZONE = 'Asia/Kolkata';
