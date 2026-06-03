import AppShell from '@/components/AppShell';
import FlourishRoute from '@/components/screens/FlourishRoute';

export default function FlourishPage() {
  return <AppShell current="flourish" screen={<FlourishRoute />} />;
}
