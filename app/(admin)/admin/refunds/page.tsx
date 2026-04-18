import { createClient } from "@/lib/supabase/server";
import { RotateCcw, Filter, ExternalLink, User, ShoppingBag } from "lucide-react";
import { formatNaira } from "@/lib/products";
import StatusBadge from "../orders/StatusBadge";
import RefundStatusUpdater from "./RefundStatusUpdater";
import Image from "next/image";
import { getPublicUrl } from "@/lib/supabase";

export default async function RefundsPage() {
  const supabase = await createClient();
  
  const { data: refunds, error } = await supabase
    .from("refunds")
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
    console.error("Error fetching refunds:", error);
  }

  const refundList = (refunds as any[]) || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">Refunds</h1>
          <p className="text-sm sm:text-base text-muted-foreground font-medium">Manage and process customer refunds.</p>
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
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Refund Amount</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Fee (10%)</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {refundList.map((refund) => {
                const product = refund.products;
                const imageUrl = product.main_image 
                  ? (product.main_image.startsWith('http') ? product.main_image : getPublicUrl('product-images', product.main_image))
                  : "https://images.unsplash.com/photo-1581094288338-2314dddb7bc3?q=80&w=2070&auto=format&fit=crop";

                return (
                  <tr key={refund.id} className="group transition-colors hover:bg-muted/30">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-border bg-white p-1">
                          <Image src={imageUrl} alt={product.name} fill className="object-contain" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-foreground truncate max-w-[200px]">{product.name}</p>
                          <p className="text-[10px] font-medium text-muted-foreground">ID: {refund.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-foreground">{(refund as any).users?.full_name || "Unknown"}</p>
                      <p className="text-[10px] font-medium text-muted-foreground">{(refund as any).users?.email}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-black text-primary">{formatNaira(refund.refund_amount)}</p>
                      <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest">Original: {formatNaira(refund.paid_amount)}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-destructive">-{formatNaira(refund.restocking_fee)}</p>
                    </td>
                    <td className="px-6 py-5">
                      <StatusBadge status={refund.status} />
                    </td>
                    <td className="px-6 py-5 text-right">
                      <RefundStatusUpdater id={refund.id} currentStatus={refund.status} />
                    </td>
                  </tr>
                );
              })}
              {refundList.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <RotateCcw className="h-10 w-10 text-muted-foreground opacity-20" />
                      <p className="text-sm font-bold text-muted-foreground">No refunds yet.</p>
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
