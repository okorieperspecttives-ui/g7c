"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Globe,
  Loader2,
  ArrowLeft,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/auth/login");
        return;
      }

      setUser(session.user);

      const { data: profileData } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .single();

      setProfile(profileData);
      setIsLoading(false);
    };

    checkUser();
  }, [supabase, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const profileFields = [
    {
      label: "Full Name",
      value: profile?.full_name || "Not provided",
      icon: User,
    },
    { label: "Email Address", value: user?.email, icon: Mail },
    {
      label: "Phone Number",
      value: profile?.phone || "Not provided",
      icon: Phone,
    },
    {
      label: "Address",
      value: profile?.address || "Not provided",
      icon: MapPin,
    },
    { label: "City", value: profile?.city || "Not provided", icon: Building2 },
    { label: "State", value: profile?.state || "Not provided", icon: Globe },
  ];

  return (
    <main className="min-h-screen bg-background pt-24 pb-20">
      <div className="mx-auto max-w-screen-md px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          {profile?.role === "admin" && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-lg shadow-primary/5"
            >
              <LayoutDashboard className="h-4 w-4" />
              Admin Panel
            </Link>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2.5rem] border border-border bg-card overflow-hidden shadow-2xl"
        >
          <div className="bg-primary/5 p-10 border-b border-border">
            <div className="flex flex-col items-center text-center">
              <div className="h-24 w-24 rounded-full bg-primary/10 border-4 border-background flex items-center justify-center text-3xl font-black text-primary uppercase mb-4">
                {user?.email?.[0]}
              </div>
              <h1 className="text-3xl font-black text-foreground mb-1">
                {profile?.full_name || "User Profile"}
              </h1>
              <p className="text-muted-foreground font-medium">{user?.email}</p>
            </div>
          </div>

          <div className="p-10">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground mb-8">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 gap-8">
              {profileFields.map((field) => (
                <div key={field.label} className="flex items-start gap-6 group">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <field.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 border-b border-border/50 pb-6">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                      {field.label}
                    </p>
                    <p className="text-lg font-bold text-foreground">
                      {field.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <button
                className="w-full rounded-2xl bg-secondary py-4 text-sm font-bold text-foreground transition-all hover:bg-border active:scale-95"
                onClick={() => alert("Edit functionality coming soon!")}
              >
                Edit Profile Details
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
