import { redirect } from 'next/navigation';
import { getSession } from '../../../lib/session';

export const dynamic = 'force-dynamic';

export default async function PagesLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/login');
  return <>{children}</>;
}
