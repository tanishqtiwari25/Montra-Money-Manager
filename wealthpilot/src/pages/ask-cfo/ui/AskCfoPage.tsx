import { CfoChat } from '@widgets/cfo-chat';
import { PageHeader, Badge } from '@shared/ui';
export function AskCfoPage() { return <div className="space-y-6"><PageHeader eyebrow="A CLEARER WAY TO DECIDE" title="Meet your personal CFO." description="Talk through the things you want, the goals you’re building, and a plan that connects them." action={<Badge tone="brand">Scripted demo advisor</Badge>} /><CfoChat full /></div>; }
