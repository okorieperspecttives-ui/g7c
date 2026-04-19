"use server";

import { createClient, getUserProfile } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { sendNotification } from "./notifications";

export async function createOrder(orderData: {
  items: any[];
  totalAmount: number;
  shippingAddress: any;
  paymentMethod: string;
  customerNotes?: string;
}) {
  const profile = await getUserProfile();
  const supabase = await createClient();

  // 1. Create the order
  const { data: order, error: orderError } = await (supabase.from("orders") as any)
    .insert([
      {
        user_id: profile?.id || null,
        status: "pending",
        total_amount: orderData.totalAmount,
        shipping_address: orderData.shippingAddress,
        customer_notes: orderData.customerNotes || null,
        payment_method: orderData.paymentMethod,
      },
    ])
    .select()
    .single();

  if (orderError) {
    console.error("Error creating order:", orderError);
    return { error: "Failed to place order. Please try again." };
  }

  // 2. Create order items
  const orderItems = orderData.items.map((item) => ({
    order_id: order.id,
    product_id: item.id,
    quantity: item.quantity,
    price_at_purchase: item.markup_price || item.price,
    subtotal: (item.markup_price || item.price) * item.quantity,
  }));

  const { error: itemsError } = await (supabase.from("order_items") as any).insert(orderItems);

  if (itemsError) {
    console.error("Error creating order items:", itemsError);
    // We might want to delete the order here if items fail, but for now let's just return error
    return { error: "Order placed but items could not be saved. Please contact support." };
  }

  // 3. Send notification if user is logged in
  if (profile?.id) {
    await sendNotification(profile.id, "order_confirmed", {
      orderId: order.id,
      totalAmount: orderData.totalAmount,
    });
  }

  revalidatePath("/admin/orders");
  revalidatePath("/profile");
  
  return { success: true, orderId: order.id };
}
