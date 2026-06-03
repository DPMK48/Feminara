import AppShell from '@/components/AppShell';
import Bloom from '@/components/screens/Bloom';

export default function BloomPage() {
  return <AppShell current="bloom" screen={<Bloom />} />;
}
