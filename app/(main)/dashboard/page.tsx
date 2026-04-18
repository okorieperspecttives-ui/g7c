"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Zap, ShoppingBag, Heart, User, ArrowRight, Loader2, CreditCard } from "lucide-react";
import Link from "next/link";
import LayawayReservations from "@/components/dashboard/LayawayReservations";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/auth/login");
        return;
      }

      setUser(session.user);

      // Fetch profile data
      const { data: profileData } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
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

  const stats = [
    { label: "Orders Placed", value: "0", icon: ShoppingBag, color: "bg-blue-500/10 text-blue-500" },
    { label: "Saved Items", value: "0", icon: Heart, color: "bg-pink-500/10 text-pink-500" },
    { label: "Energy Credits", value: "₦0", icon: Zap, color: "bg-yellow-500/10 text-yellow-500" },
  ];

  return (
    <main className="min-h-screen bg-background pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-screen-2xl">
        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl mb-2">
              Hello, <span className="text-primary">{profile?.full_name || user?.email?.split('@')[0]}</span>
            </h1>
            <p className="text-lg text-muted-foreground font-medium">
              Welcome to your energy control center.
            </p>
          </motion.div>
        </header>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-16">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-[2rem] border border-border bg-card p-8 shadow-sm"
            >
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-foreground">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Layaway Section */}
        <div className="mb-16">
          <LayawayReservations />
        </div>

        {/* Activity Section */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-[2.5rem] border border-border bg-card p-10 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Recent Activity</h2>
              <p className="text-muted-foreground mb-8">You haven't made any purchases yet. Start exploring our high-performance solar solutions.</p>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:opacity-90 active:scale-95"
            >
              Start Shopping
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-[2.5rem] border border-border bg-card p-10"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">Quick Profile</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/50">
                <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center text-muted-foreground border border-border">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Email</p>
                  <p className="font-bold text-foreground">{user?.email}</p>
                </div>
              </div>
              <Link
                href="/profile"
                className="block text-center rounded-2xl border border-border py-4 text-sm font-bold text-foreground hover:bg-secondary transition-all"
              >
                View Full Profile
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
