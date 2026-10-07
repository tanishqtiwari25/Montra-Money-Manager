import { Avatar } from '@shared/ui';
import { formatMoney } from '@shared/lib';
import type { UserProfile } from '../model/types';
export function ProfileSummary({ profile }: { profile: UserProfile }) { return <div className="flex items-center gap-3"><Avatar name={profile.name} /><div><p className="font-semibold text-ink">{profile.name}</p><p className="text-xs text-muted">{profile.occupation} · {formatMoney(profile.monthlySalaryPaise)} / month</p></div></div>; }
