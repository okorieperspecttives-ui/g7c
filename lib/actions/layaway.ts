"use server";

import { createClient, getUserProfile } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { formatNaira } from "@/lib/products";

/**
 * Creates a new Pay Small Small (layaway) reservation.
 */
export async function createPaySmallSmallReservation(productId: string, totalAmount: number, depositAmount: number) {
  const profile = await getUserProfile();
  if (!profile) {
    return { error: "You must be signed in to make a reservation." };
  }

  const supabase = await createClient();
  
  // Calculate expiry date (90 days from now)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 90);

  const { data, error } = await (supabase.from("layaway_reservations") as any)
    .insert([
      {
        user_id: profile.id,
        product_id: productId,
        total_amount: totalAmount,
        deposit_amount: depositAmount,
        paid_amount: depositAmount, // Initial deposit is the first payment
        status: "active",
        expires_at: expiresAt.toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating reservation:", error);
    return { error: "Failed to create reservation. Please try again." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/profile");
  
  return { success: true, reservation: data };
}

/**
 * Records a payment against an existing layaway reservation.
 */
export async function makeLayawayPayment(reservationId: string, paymentAmount: number) {
  const profile = await getUserProfile();
  if (!profile) {
    return { error: "You must be signed in to make a payment." };
  }

  const supabase = await createClient();

  // 1. Fetch current reservation to check status and calculate new paid_amount
  const { data: reservation, error: fetchError } = await (supabase.from("layaway_reservations") as any)
    .select("*")
    .eq("id", reservationId)
    .eq("user_id", profile.id)
    .single();

  if (fetchError || !reservation) {
    return { error: "Reservation not found." };
  }

  if (reservation.status !== "active") {
    return { error: `This reservation is already ${reservation.status}.` };
  }

  const totalAmount = Number(reservation.total_amount);
  const remainingBalance = Number(reservation.remaining_balance);
  const minPayment = totalAmount * 0.1;

  // Validation: Minimum payment is 10% of total_amount
  // Exception: If remaining balance is less than 10%, user must pay full remaining balance
  if (remainingBalance < minPayment) {
    if (Math.abs(paymentAmount - remainingBalance) > 0.01) {
      return { error: `Remaining balance is less than the 10% minimum. You must pay the full remaining balance of ${formatNaira(remainingBalance)}.` };
    }
  } else {
    if (paymentAmount < minPayment) {
      return { error: `The minimum payment amount is 10% of the total cost (${formatNaira(minPayment)}).` };
    }
  }

  // Ensure payment doesn't exceed balance
  if (paymentAmount > remainingBalance) {
    return { error: `Payment amount cannot exceed the remaining balance of ${remainingBalance}.` };
  }

  const newPaidAmount = Number(reservation.paid_amount) + paymentAmount;
  const isCompleted = Math.abs(newPaidAmount - totalAmount) < 0.01 || newPaidAmount >= totalAmount;

  // 2. Update the reservation
  const { data: updatedData, error: updateError, count } = await (supabase.from("layaway_reservations") as any)
    .update({
      paid_amount: isCompleted ? totalAmount : newPaidAmount,
      status: isCompleted ? "completed" : "active",
      updated_at: new Date().toISOString(),
    })
    .eq("id", reservationId)
    .eq("user_id", profile.id) // Security: ensure user owns this reservation
    .select();

  if (updateError) {
    console.error("Error updating reservation payment:", updateError);
    return { error: "Failed to record payment. Please try again." };
  }

  if (!updatedData || updatedData.length === 0) {
    console.error("No rows updated for reservation:", reservationId);
    return { error: "Payment failed. Please ensure you have permission to update this reservation." };
  }

  // Revalidate multiple paths to ensure UI is in sync
  revalidatePath("/dashboard");
  revalidatePath("/(main)/dashboard", "page");
  revalidatePath("/profile");
  
  return { 
    success: true, 
    completed: isCompleted,
    message: isCompleted ? "Congratulations! Your payment is complete." : "Payment recorded successfully." 
  };
}

/**
 * Fetches all active reservations for the current user.
 */
export async function getMyReservations() {
  const profile = await getUserProfile();
  if (!profile) return { error: "Unauthorized", reservations: [] };

  const supabase = await createClient();
  const { data, error } = await (supabase.from("layaway_reservations") as any)
    .select(`
      *,
      products (
        name,
        main_image,
        markup_price
      )
    `)
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reservations:", error);
    return { error: "Failed to fetch reservations", reservations: [] };
  }

  return { success: true, reservations: data || [] };
}

/**
 * Logic to process expired reservations:
 * 1. Find active reservations where expires_at < now
 * 2. Calculate refund (90% of paid_amount)
 * 3. Mark as cancelled
 * Note: This would typically be run by a cron job or background worker.
 */
export async function processExpiredReservations() {
  const supabase = await createClient();
  const now = new Date().toISOString();

  // 1. Fetch expired active reservations
  const { data: expired, error: fetchError } = await (supabase.from("layaway_reservations") as any)
    .select("*")
    .eq("status", "active")
    .lt("expires_at", now);

  if (fetchError) {
    console.error("Error fetching expired reservations:", fetchError);
    return { error: "Failed to fetch expired reservations" };
  }

  if (!expired || expired.length === 0) {
    return { success: true, processedCount: 0 };
  }

  const results = [];
  for (const res of expired) {
    const paidAmount = Number(res.paid_amount);
    const restockingFee = paidAmount * 0.1;
    const refundAmount = paidAmount - restockingFee;

    // 2. Cancel the reservation and record the fee/refund (logically for now)
    const { error: updateError } = await (supabase.from("layaway_reservations") as any)
      .update({
        status: "cancelled",
        updated_at: new Date().toISOString(),
        // In a real app, you'd also trigger a refund process here
      })
      .eq("id", res.id);

    if (updateError) {
      console.error(`Error cancelling reservation ${res.id}:`, updateError);
      results.push({ id: res.id, success: false });
    } else {
      results.push({ id: res.id, success: true, refund: refundAmount, fee: restockingFee });
    }
  }

  return { 
     success: true, 
     processedCount: expired.length, 
     results 
   };
 }

/**
 * Cancels a reservation and creates a refund record.
 */
export async function cancelPaySmallSmallReservation(reservationId: string) {
  const profile = await getUserProfile();
  if (!profile) {
    return { error: "You must be signed in to cancel a reservation." };
  }

  const supabase = await createClient();

  // 1. Fetch current reservation
  const { data: reservation, error: fetchError } = await (supabase.from("layaway_reservations") as any)
    .select("*")
    .eq("id", reservationId)
    .eq("user_id", profile.id)
    .single();

  if (fetchError || !reservation) {
    return { error: "Reservation not found." };
  }

  if (reservation.status !== "active") {
    return { error: `Cannot cancel a reservation that is already ${reservation.status}.` };
  }

  const paidAmount = Number(reservation.paid_amount);
  const restockingFee = paidAmount * 0.1;
  const refundAmount = paidAmount - restockingFee;

  // 2. Create refund record
  const { error: refundError } = await (supabase.from("refunds") as any).insert([
    {
      layaway_reservation_id: reservation.id,
      user_id: profile.id,
      product_id: reservation.product_id,
      paid_amount: paidAmount,
      refund_amount: refundAmount,
      restocking_fee: restockingFee,
      refund_reason: "Customer cancelled reservation",
      status: "pending",
    },
  ]);

  if (refundError) {
    console.error("Error creating refund record:", refundError);
    return { error: "Failed to create refund record. Please contact support." };
  }

  // 3. Update reservation status to cancelled
  const { error: updateError } = await (supabase.from("layaway_reservations") as any)
    .update({
      status: "cancelled",
      updated_at: new Date().toISOString(),
    })
    .eq("id", reservationId);

  if (updateError) {
    console.error("Error updating reservation status:", updateError);
    return { error: "Failed to update reservation status." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/(main)/dashboard", "page");
  revalidatePath("/profile");

  return { 
     success: true, 
     message: `Reservation cancelled successfully. A refund of ${formatNaira(refundAmount)} (after 10% restocking fee) is being processed.` 
   };
 }

/**
 * Fetches all refunds for the current user.
 */
export async function getMyRefunds() {
  const profile = await getUserProfile();
  if (!profile) return { error: "Unauthorized", refunds: [] };

  const supabase = await createClient();
  const { data, error } = await (supabase.from("refunds") as any)
    .select(`
      *,
      products (
        name,
        main_image
      )
    `)
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching refunds:", error);
    return { error: "Failed to fetch refunds", refunds: [] };
  }

  return { success: true, refunds: data || [] };
}
