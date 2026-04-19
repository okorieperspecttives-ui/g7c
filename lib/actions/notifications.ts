"use server";

import { createClient, getUserProfile } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type NotificationType = "order" | "reservation" | "refund" | "payment" | "system";

export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: NotificationType,
  link?: string
) {
  console.log(`[DEBUG] Attempting to create notification for user: ${userId}`);
  console.log(`[DEBUG] Notification Data:`, { title, message, type, link });
  
  const supabase = await createClient();

  try {
    const { data, error } = await (supabase.from("notifications") as any).insert([
      {
        user_id: userId,
        title,
        message,
        type,
        link: link || null,
        is_read: false,
        created_at: new Date().toISOString(),
      },
    ]).select();

    if (error) {
      console.error("[DEBUG] Supabase Insert Error:", error.message);
      console.error("[DEBUG] Error details:", error);
      return { success: false, error: error.message };
    }

    console.log("[DEBUG] Notification created successfully:", data);
    revalidatePath("/dashboard");
    return { success: true, data };
  } catch (err: any) {
    console.error("[DEBUG] Unexpected Exception in createNotification:", err.message);
    return { success: false, error: err.message };
  }
}

// Keep sendNotification as an alias for now to avoid breaking existing code while refactoring
export const sendNotification = async (userId: string, type: NotificationType, data: { title: string; message: string; link?: string }) => {
  return createNotification(userId, data.title, data.message, type, data.link);
};

export async function getMyNotifications() {
  const profile = await getUserProfile();
  if (!profile) {
    console.log("[DEBUG] getMyNotifications: No profile found for notifications");
    return { notifications: [], unreadCount: 0 };
  }

  const supabase = await createClient();
  console.log(`[DEBUG] getMyNotifications: Fetching for user ${profile.id}`);
  
  // Fetch unread count first
  const { count: unreadCount, error: countError } = await (supabase.from("notifications") as any)
    .select("*", { count: "exact", head: true })
    .eq("user_id", profile.id)
    .eq("is_read", false);

  if (countError) {
    console.error("[DEBUG] getMyNotifications: Error fetching unread count:", countError);
  }

  // Fetch notifications with sorting: unread first, then newest first
  const { data, error } = await (supabase.from("notifications") as any)
    .select("*")
    .eq("user_id", profile.id)
    .order("is_read", { ascending: true }) // false (0) before true (1)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("[DEBUG] getMyNotifications: Error fetching notifications:", error);
    return { notifications: [], unreadCount: 0 };
  }

  console.log(`[DEBUG] getMyNotifications: Found ${data?.length || 0} total notifications, unread: ${unreadCount || 0}`);
  return { notifications: data || [], unreadCount: unreadCount || 0 };
}

export async function markAsRead(notificationId: string) {
  const profile = await getUserProfile();
  if (!profile) return { error: "Unauthorized" };

  const supabase = await createClient();
  const { error } = await (supabase.from("notifications") as any)
    .update({ is_read: true })
    .eq("id", notificationId)
    .eq("user_id", profile.id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteNotification(notificationId: string) {
  const profile = await getUserProfile();
  if (!profile) return { error: "Unauthorized" };

  const supabase = await createClient();
  const { error } = await (supabase.from("notifications") as any)
    .delete()
    .eq("id", notificationId)
    .eq("user_id", profile.id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard");
  return { success: true };
}

export async function markAllAsRead() {
  const profile = await getUserProfile();
  if (!profile) return { error: "Unauthorized" };

  const supabase = await createClient();
  const { error } = await (supabase.from("notifications") as any)
    .update({ is_read: true })
    .eq("user_id", profile.id)
    .eq("is_read", false);

  if (error) return { error: error.message };
  revalidatePath("/dashboard");
  return { success: true };
}
