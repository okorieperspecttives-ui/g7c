import { LayoutDashboard, ShoppingBag, Tags, Users, TrendingUp, DollarSign } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const stats = [
    { label: "Total Sales", value: "₦0.00", icon: <DollarSign className="h-6 w-6" />, color: "bg-emerald-500/10 text-emerald-500", trend: "0%" },
    { label: "Total Orders", value: "0", icon: <TrendingUp className="h-6 w-6" />, color: "bg-blue-500/10 text-blue-500", trend: "0%" },
    { label: "Products", value: "0", icon: <ShoppingBag className="h-6 w-6" />, color: "bg-amber-500/10 text-amber-500", trend: "0" },
    { label: "Active Users", value: "0", icon: <Users className="h-6 w-6" />, color: "bg-primary/10 text-primary", trend: "0" },
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
        <button className="h-12 rounded-2xl bg-primary px-8 text-sm font-bold text-primary-foreground transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20">
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="group rounded-3xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5">
            <div className="flex items-center justify-between mb-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.color} transition-transform group-hover:scale-110`}>
                {stat.icon}
              </div>
              <span className="text-xs font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">
                {stat.trend}
              </span>
            </div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
            <p className="mt-1 text-3xl font-black text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Placeholder for charts/recent activity */}
        <div className="rounded-3xl border border-border bg-card p-8">
          <h3 className="text-xl font-black text-foreground mb-6">Recent Orders</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-4 border-b border-border/50 last:border-0">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground font-bold">
                    #{1000 + i}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">John Doe</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">2 mins ago</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-primary">₦125,000</p>
                  <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Paid</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-8">
          <h3 className="text-xl font-black text-foreground mb-6">Popular Products</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-4 border-b border-border/50 last:border-0">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-secondary overflow-hidden">
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold">P</div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Sparta H6.6K System</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Inverters</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-foreground">12 sales</p>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-widest">₦2.4M</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
