"use client";

import { useState, useTransition } from "react";
import { updateUserRole } from "../actions";
import { toast } from "sonner";
import { Loader2, ShieldAlert, ShieldCheck } from "lucide-react";

export default function RoleToggleButton({ userId, currentRole }: { userId: string; currentRole: "admin" | "customer" }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = async () => {
    const newRole = currentRole === "admin" ? "customer" : "admin";
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

    startTransition(async () => {
      const result = await updateUserRole(userId, newRole);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`User role updated to ${newRole}`);
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50 ${
        currentRole === "admin" 
          ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white" 
          : "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
      }`}
    >
      {isPending ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : currentRole === "admin" ? (
        <ShieldAlert className="h-3 w-3" />
      ) : (
        <ShieldCheck className="h-3 w-3" />
      )}
      {currentRole === "admin" ? "Demote" : "Promote"}
    </button>
  );
}
