import AppShell from '@/components/AppShell';
import Spark from '@/components/screens/Spark';

export default function SparkPage() {
  return <AppShell current="spark" screen={<Spark />} />;
}
