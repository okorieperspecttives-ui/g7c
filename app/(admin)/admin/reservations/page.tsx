import { createClient } from "@/lib/supabase/server";
import { CreditCard, Filter, ExternalLink, User, ShoppingBag } from "lucide-react";
import { formatNaira } from "@/lib/products";
import StatusBadge from "../orders/StatusBadge";
import ReservationStatusUpdater from "./ReservationStatusUpdater";
import Image from "next/image";
import { getPublicUrl } from "@/lib/supabase";

export default async function ReservationsPage() {
  const supabase = await createClient();
  
  const { data: reservations, error } = await supabase
    .from("layaway_reservations")
    .select(`
      *,
      users (
        full_name,
        email
      ),
      products (
        name,
        main_image
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reservations:", error);
  }

  const reservationList = (reservations as any[]) || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">Pay Small Small</h1>
          <p className="text-sm sm:text-base text-muted-foreground font-medium">Manage customer reservations and payments.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5 text-xs font-bold text-muted-foreground transition-all hover:border-primary/50">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>
      </div>

      <div className="rounded-2xl sm:rounded-3xl border border-border bg-card overflow-hidden shadow-sm mx-2 sm:mx-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Product</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Customer</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Progress</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Balance</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {reservationList.map((res) => {
                const product = res.products;
                const paid = Number(res.paid_amount);
                const total = Number(res.total_amount);
                const remaining = Number(res.remaining_balance);
                const progress = (paid / total) * 100;
                
                const imageUrl = product.main_image 
                  ? (product.main_image.startsWith('http') ? product.main_image : getPublicUrl('product-images', product.main_image))
                  : "https://images.unsplash.com/photo-1581094288338-2314dddb7bc3?q=80&w=2070&auto=format&fit=crop";

                return (
                  <tr key={res.id} className="group transition-colors hover:bg-muted/30">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-border bg-white p-1">
                          <Image src={imageUrl} alt={product.name} fill className="object-contain" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-foreground truncate max-w-[200px]">{product.name}</p>
                          <p className="text-[10px] font-medium text-muted-foreground">ID: {res.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-foreground">{(res as any).users?.full_name || "Unknown"}</p>
                      <p className="text-[10px] font-medium text-muted-foreground">{(res as any).users?.email}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1.5 min-w-[120px]">
                        <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                          <span className="text-primary">{formatNaira(paid)}</span>
                          <span className="text-muted-foreground">{Math.round(progress)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
                        </div>
                        <p className="text-[9px] font-medium text-muted-foreground text-center italic">
                          Total: {formatNaira(total)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-black text-primary">{formatNaira(remaining)}</p>
                    </td>
                    <td className="px-6 py-5">
                      <StatusBadge status={res.status} />
                    </td>
                    <td className="px-6 py-5 text-right">
                      <ReservationStatusUpdater id={res.id} currentStatus={res.status} />
                    </td>
                  </tr>
                );
              })}
              {reservationList.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <CreditCard className="h-10 w-10 text-muted-foreground opacity-20" />
                      <p className="text-sm font-bold text-muted-foreground">No reservations found.</p>
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
