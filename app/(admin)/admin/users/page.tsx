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
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">Users</h1>
        <p className="text-muted-foreground font-medium">Manage user roles and view customer details.</p>
      </div>

      <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">User</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Contact</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Role</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Joined</th>
                <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {userList.map((user) => (
                <tr key={user.id} className="group transition-colors hover:bg-muted/30">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black border border-primary/20">
                        {user.avatar_url ? (
                          <Image src={user.avatar_url} alt={user.full_name || ""} fill className="object-cover" />
                        ) : (
                          (user.full_name?.[0] || user.email?.[0] || "U").toUpperCase()
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{user.full_name || "Anonymous User"}</p>
                        <p className="text-[10px] font-medium text-muted-foreground truncate max-w-[150px]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-xs font-bold text-foreground">{user.phone || "No phone"}</p>
                    {user.whatsapp_number && <p className="text-[10px] text-emerald-500 font-medium">WhatsApp: {user.whatsapp_number}</p>}
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest ${
                      user.role === "admin" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground"
                    }`}>
                      {user.role === "admin" && <Shield className="h-3 w-3" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-xs font-medium text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString("en-NG", { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </td>
                  <td className="px-8 py-5 text-right">
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
