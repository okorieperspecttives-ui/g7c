import { createClient } from "@/lib/supabase/server";
import { ShoppingCart, ExternalLink, Filter } from "lucide-react";
import Link from "next/link";
import StatusBadge from "./StatusBadge";
import { formatNaira } from "@/lib/products";

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      users (
        full_name,
        email
      )
    `)
    .order("created_at", { ascending: false });

  const orderList = (orders as any[]) || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Orders</h1>
          <p className="text-muted-foreground font-medium">Monitor and manage customer orders.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5 text-xs font-bold text-muted-foreground transition-all hover:border-primary/50">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Order #</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Customer</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Amount</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date</th>
                <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {orderList.map((order) => (
                <tr key={order.id} className="group transition-colors hover:bg-muted/30">
                  <td className="px-8 py-5">
                    <span className="text-xs font-black text-foreground uppercase tracking-widest bg-secondary px-2 py-1 rounded-lg">
                      #{order.id.slice(0, 8)}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold text-foreground">{(order as any).users?.full_name || "Unknown Customer"}</p>
                    <p className="text-[10px] font-medium text-muted-foreground">{(order as any).users?.email}</p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-black text-primary">{formatNaira(order.total_amount)}</p>
                  </td>
                  <td className="px-8 py-5">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-xs font-medium text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("en-NG", { day: 'numeric', month: 'short' })}
                    </p>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="p-2 inline-flex rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
              {orderList.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <ShoppingCart className="h-10 w-10 text-muted-foreground opacity-20" />
                      <p className="text-sm font-bold text-muted-foreground">No orders yet.</p>
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
