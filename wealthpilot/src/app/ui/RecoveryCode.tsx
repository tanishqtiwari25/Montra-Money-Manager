import { useState } from 'react';
import { useAuth } from '@entities/auth';
import { Button, Modal } from '@shared/ui';
export function RecoveryCode() {
  const code = useAuth(state => state.recoveryCode); const dismiss = useAuth(state => state.dismissRecovery); const [saved, setSaved] = useState(false);
  return <Modal open={Boolean(code)} title="Save your private recovery code" onClose={() => { if (saved) dismiss(); }}><p className="mb-4 text-sm leading-relaxed text-muted">This code can recover your account if you lose your password. Save it in a password manager or another private place. It is shown only when issued; there is no email-recovery service.</p><code className="block select-all break-all rounded-xl border border-line bg-canvas p-4 text-sm text-ink">{code}</code><label className="my-5 flex items-start gap-3 text-sm text-ink"><input type="checkbox" checked={saved} onChange={event => setSaved(event.target.checked)} className="mt-1" />I have saved this code privately.</label><Button className="w-full" disabled={!saved} onClick={() => { dismiss(); setSaved(false); }}>Continue to my workspace</Button></Modal>;
}
