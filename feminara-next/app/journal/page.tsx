import AppShell from '@/components/AppShell';
import Journal from '@/components/screens/Journal';

export default function JournalPage() {
  return <AppShell current="journal" screen={<Journal />} />;
}
