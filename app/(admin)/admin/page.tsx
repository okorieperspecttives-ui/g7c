import { ShoppingBag, Tags, Users, TrendingUp, DollarSign, Bookmark, ShoppingCart, LayoutDashboard } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch real statistics from Supabase
  const [
    { count: productsCount },
    { count: categoriesCount },
    { count: brandsCount },
    { count: usersCount },
    { count: ordersCount },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("categories").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("brands").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Active Products", value: productsCount || 0, icon: <ShoppingBag className="h-6 w-6" />, color: "bg-amber-500/10 text-amber-500" },
    { label: "Categories", value: categoriesCount || 0, icon: <Tags className="h-6 w-6" />, color: "bg-blue-500/10 text-blue-500" },
    { label: "Brands", value: brandsCount || 0, icon: <Bookmark className="h-6 w-6" />, color: "bg-emerald-500/10 text-emerald-500" },
    { label: "Orders", value: ordersCount || 0, icon: <ShoppingCart className="h-6 w-6" />, color: "bg-purple-500/10 text-purple-500" },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground">
            Dashboard <span className="text-primary text-2xl">Overview</span>
          </h1>
          <p className="mt-2 text-lg text-muted-foreground font-medium">
            Real-time analytics and performance monitoring.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="group rounded-3xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5">
            <div className="flex items-center justify-between mb-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.color} transition-transform group-hover:scale-110`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
            <p className="mt-1 text-3xl font-black text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-8">
          <h3 className="text-xl font-black text-foreground mb-6">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-4 border-b border-border/50">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Database Connection</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Supabase Live</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded-lg">Healthy</p>
              </div>
            </div>
            <div className="flex items-center justify-between py-4 border-b border-border/50">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                  <LayoutDashboard className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Admin API</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Service Role Key</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded-lg">Active</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-8 flex flex-col justify-center items-center text-center">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
            <TrendingUp className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-black text-foreground mb-2">Ready for Growth</h3>
          <p className="text-muted-foreground text-sm max-w-[280px]">
            Your store is connected to live data. Start managing your inventory and tracking your progress.
          </p>
        </div>
      </div>
    </div>
  );
}

