"use server";

import { createClient, getUserProfile } from "@/lib/supabase/server";

export type NotificationType = "order_confirmed" | "reservation_created" | "refund_status_changed" | "payment_received";

export async function sendNotification(userId: string, type: NotificationType, data: any) {
  const supabase = await createClient();

  let title = "";
  let message = "";

  switch (type) {
    case "order_confirmed":
      title = "Order Confirmed";
      message = `Your order #${data.orderId} has been placed successfully. We will contact you shortly for delivery.`;
      break;
    case "reservation_created":
      title = "Reservation Created";
      message = `Your Pay Small Small reservation for ${data.productName} has been created. Please complete your 40% deposit to secure it.`;
      break;
    case "refund_status_changed":
      title = "Refund Status Updated";
      message = `Your refund for reservation #${data.reservationId} is now ${data.status}.`;
      break;
    case "payment_received":
      title = "Payment Received";
      message = `We have received your payment of ${data.amount} for reservation #${data.reservationId}.`;
      break;
  }

  // Attempt to insert into a notifications table. 
  // If the table doesn't exist, this will fail gracefully in the catch block.
  try {
    const { error } = await (supabase.from("notifications") as any).insert([
      {
        user_id: userId,
        title,
        message,
        type,
        metadata: data,
        is_read: false,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.warn("Could not save notification to DB (table might not exist):", error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.warn("Notification system error:", err.message);
    return { success: false, error: err.message };
  }
}
