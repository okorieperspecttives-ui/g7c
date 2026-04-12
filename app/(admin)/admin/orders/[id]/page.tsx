import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, User, MapPin, CreditCard, Calendar } from "lucide-react";
import StatusBadge from "../StatusBadge";
import { formatNaira } from "@/lib/products";
import OrderStatusUpdater from "./OrderStatusUpdater";

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: orderData } = await supabase
    .from("orders")
    .select(`
      *,
      users (
        full_name,
        email,
        phone,
        address,
        city,
        state
      ),
      order_items (
        *,
        products (
          name,
          main_image
        )
      )
    `)
    .eq("id", params.id)
    .single();

  const order = orderData as any;

  if (!order) notFound();

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders" className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">Order Details</h1>
            <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest mt-1">ID: {order.id}</p>
          </div>
        </div>
        <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Order Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Order Items */}
          <div className="rounded-[2.5rem] border border-border bg-card overflow-hidden shadow-sm">
            <div className="p-8 border-b border-border/50 bg-muted/30 flex items-center gap-3">
              <Package className="h-5 w-5 text-primary" />
              <h3 className="font-black text-sm uppercase tracking-widest">Order Items</h3>
            </div>
            <div className="divide-y divide-border/50">
              {(order as any).order_items?.map((item: any) => (
                <div key={item.id} className="p-8 flex items-center gap-6">
                  <div className="h-16 w-16 rounded-2xl bg-secondary flex-shrink-0 overflow-hidden border border-border p-2">
                    {/* Image placeholder or real image */}
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs">IMG</div>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-foreground">{item.products?.name || "Product Name"}</p>
                    <p className="text-xs text-muted-foreground font-medium">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-foreground">{formatNaira(item.price_at_time)}</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase">Total: {formatNaira(item.price_at_time * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-8 bg-muted/30 border-t border-border/50">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-bold text-muted-foreground">Subtotal</p>
                <p className="text-sm font-bold text-foreground">{formatNaira(order.total_amount - 5000)}</p>
              </div>
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm font-bold text-muted-foreground">Delivery Fee</p>
                <p className="text-sm font-bold text-foreground">{formatNaira(5000)}</p>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-border/50">
                <p className="text-lg font-black text-foreground uppercase tracking-tight">Total Amount</p>
                <p className="text-2xl font-black text-primary">{formatNaira(order.total_amount)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          {/* Status & Date */}
          <div className="rounded-[2.5rem] border border-border bg-card p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Date</span>
              </div>
              <p className="text-xs font-bold">{new Date(order.created_at).toLocaleDateString("en-NG", { dateStyle: 'long' })}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Payment</span>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-500">Paid</p>
            </div>
            <div className="pt-4 border-t border-border/50">
              <div className="flex items-center gap-2 text-muted-foreground mb-3">
                <Package className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Status</span>
              </div>
              <StatusBadge status={order.status} />
            </div>
          </div>

          {/* Customer Info */}
          <div className="rounded-[2.5rem] border border-border bg-card p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <User className="h-5 w-5 text-primary" />
              <h3 className="font-black text-sm uppercase tracking-widest">Customer</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-bold text-foreground">{order.users?.full_name || "Unknown"}</p>
                <p className="text-xs text-muted-foreground">{order.users?.email}</p>
                <p className="text-xs text-muted-foreground">{order.users?.phone}</p>
              </div>
              <div className="pt-4 border-t border-border/50 space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="text-xs font-medium text-muted-foreground leading-relaxed">
                    {order.users?.address}<br />
                    {order.users?.city}, {order.users?.state}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
