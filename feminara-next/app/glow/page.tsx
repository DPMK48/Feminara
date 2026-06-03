import AppShell from '@/components/AppShell';
import Glow from '@/components/screens/Glow';

export default function GlowPage() {
  return <AppShell current="glow" screen={<Glow />} />;
}
