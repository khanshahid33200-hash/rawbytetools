import { notFound } from 'next/navigation';
import AdminDashboardClient from './AdminDashboardClient';

interface AdminPageProps {
  params: Promise<{
    'admin-slug': string;
  }>;
}

export default async function AdminSecretPage({ params }: AdminPageProps) {
  const resolvedParams = await params;
  const adminSlug = process.env.NEXT_PUBLIC_ADMIN_SECRET_SLUG || 'admin-secret-portal-9872';

  if (resolvedParams['admin-slug'] !== adminSlug) {
    notFound();
  }

  return <AdminDashboardClient />;
}
