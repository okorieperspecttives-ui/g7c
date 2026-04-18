import { createClient } from "@/lib/supabase/server";
import { Users, Shield, User as UserIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import RoleToggleButton from "./RoleToggleButton";
import { User } from "@/lib/types";

export default async function UsersPage() {
  const supabase = await createClient();
  const { data: users } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  const userList = (users as User[]) || [];

  return (
    <div className="space-y-8">
      <div className="px-4 sm:px-0">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">Users</h1>
        <p className="text-sm sm:text-base text-muted-foreground font-medium">Manage user roles and view customer details.</p>
      </div>

      <div className="rounded-2xl sm:rounded-3xl border border-border bg-card overflow-hidden shadow-sm mx-2 sm:mx-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px] sm:min-w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 sm:px-8 py-4 sm:py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">User</th>
                <th className="hidden sm:table-cell px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Contact</th>
                <th className="px-4 sm:px-8 py-4 sm:py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Role</th>
                <th className="hidden md:table-cell px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Joined</th>
                <th className="px-4 sm:px-8 py-4 sm:py-5 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {userList.map((user) => (
                <tr key={user.id} className="group transition-colors hover:bg-muted/30">
                  <td className="px-4 sm:px-8 py-4 sm:py-5">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="relative h-9 w-9 sm:h-10 sm:w-10 overflow-hidden rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center text-primary text-xs sm:text-sm font-black border border-primary/20 shrink-0">
                        {user.avatar_url ? (
                          <Image src={user.avatar_url} alt={user.full_name || ""} fill className="object-cover" />
                        ) : (
                          (user.full_name?.[0] || user.email?.[0] || "U").toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-foreground truncate">{user.full_name || "Anonymous User"}</p>
                        <p className="text-[10px] font-medium text-muted-foreground truncate max-w-[120px] sm:max-w-[150px]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-8 py-5">
                    <p className="text-xs font-bold text-foreground">{user.phone || "No phone"}</p>
                    {user.whatsapp_number && <p className="text-[10px] text-emerald-500 font-medium">WhatsApp: {user.whatsapp_number}</p>}
                  </td>
                  <td className="px-4 sm:px-8 py-4 sm:py-5">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${
                      user.role === "admin" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground"
                    }`}>
                      {user.role === "admin" && <Shield className="h-2.5 w-2.5 sm:h-3 sm:w-3" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="hidden md:table-cell px-8 py-5">
                    <p className="text-xs font-medium text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString("en-NG", { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </td>
                  <td className="px-4 sm:px-8 py-4 sm:py-5 text-right">
                    <RoleToggleButton userId={user.id} currentRole={user.role} />
                  </td>
                </tr>
              ))}
              {userList.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="h-10 w-10 text-muted-foreground opacity-20" />
                      <p className="text-sm font-bold text-muted-foreground">No users found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
