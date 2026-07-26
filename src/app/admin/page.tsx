import { redirect } from 'next/navigation';

export default function AdminRedirectPage() {
  const secretSlug = process.env.NEXT_PUBLIC_ADMIN_SECRET_SLUG || 'admin-secret-portal-9872';
  redirect(`/${secretSlug}`);
}
