import AppShell from '@/components/AppShell';
import Community from '@/components/screens/Community';

export default function CommunityPage() {
  return <AppShell current="community" screen={<Community />} />;
}
