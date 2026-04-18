import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/supabase/server";
import { ReactNode } from "react";
import AdminShell from "./AdminShell";

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const profile = await getUserProfile();

  // Strict role check
  if (!profile || profile.role !== 'admin') {
    console.log(`Unauthorized admin access attempt: ${profile?.email || 'Guest'} (Role: ${profile?.role || 'none'})`);
    redirect('/');
  }

  return (
    <AdminShell profile={profile}>
      {children}
    </AdminShell>
  );
}
