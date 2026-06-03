import AppShell from '@/components/AppShell';
import Profile from '@/components/screens/Profile';

export default function ProfilePage() {
  return <AppShell current="profile" screen={<Profile />} />;
}
