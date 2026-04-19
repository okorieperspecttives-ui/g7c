"use server";

import { createClient, getUserProfile } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createNotification } from "@/lib/actions/notifications";

// --- Categories ---

export async function createCategory(formData: FormData) {
  const profile = await getUserProfile();
  if (!profile || profile.role !== "admin") return { error: "Unauthorized" };

  const supabase = await createClient();
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const tagline = formData.get("tagline") as string;
  const description = formData.get("description") as string;
  const imageFile = formData.get("image") as File;
  const is_active = formData.get("is_active") === "true";

  let image_url = null;
  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `categories/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("category-images")
      .upload(filePath, imageFile);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return { error: `Upload failed: ${uploadError.message}` };
    }
    image_url = filePath;
  }

  const { error } = await (supabase.from("categories") as any).insert([{
    name, slug, tagline, description, image_url, is_active
  }]);

  if (error) return { error: error.message };
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function updateCategory(id: string, formData: FormData) {
  const profile = await getUserProfile();
  if (!profile || profile.role !== "admin") return { error: "Unauthorized" };

  const supabase = await createClient();
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const tagline = formData.get("tagline") as string;
  const description = formData.get("description") as string;
  const imageFile = formData.get("image") as File;
  const is_active = formData.get("is_active") === "true";

  const updateData: any = { name, slug, tagline, description, is_active };

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `categories/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("category-images")
      .upload(filePath, imageFile);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return { error: `Upload failed: ${uploadError.message}` };
    }
    updateData.image_url = filePath;
  }

  const { error } = await (supabase.from("categories") as any).update(updateData).eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function deleteCategory(id: string) {
  const profile = await getUserProfile();
  if (!profile || profile.role !== "admin") return { error: "Unauthorized" };

  const supabase = await createClient();
  const { error } = await (supabase.from("categories") as any).delete().eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/categories");
  return { success: true };
}

// --- Brands ---

export async function createBrand(formData: FormData) {
  const profile = await getUserProfile();
  if (!profile || profile.role !== "admin") return { error: "Unauthorized" };

  const supabase = await createClient();
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const logoFile = formData.get("logo") as File;
  const is_active = formData.get("is_active") === "true";

  let logo_url = null;
  if (logoFile && logoFile.size > 0) {
    const fileExt = logoFile.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `logos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("brand-logos")
      .upload(filePath, logoFile);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return { error: `Upload failed: ${uploadError.message}` };
    }
    logo_url = filePath;
  }

  const { error } = await (supabase.from("brands") as any).insert([{
    name, slug, logo_url, is_active
  }]);

  if (error) return { error: error.message };
  revalidatePath("/admin/brands");
  redirect("/admin/brands");
}

export async function updateBrand(id: string, formData: FormData) {
  const profile = await getUserProfile();
  if (!profile || profile.role !== "admin") return { error: "Unauthorized" };

  const supabase = await createClient();
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const logoFile = formData.get("logo") as File;
  const is_active = formData.get("is_active") === "true";

  const updateData: any = { name, slug, is_active };

  if (logoFile && logoFile.size > 0) {
    const fileExt = logoFile.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `logos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("brand-logos")
      .upload(filePath, logoFile);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return { error: `Upload failed: ${uploadError.message}` };
    }
    updateData.logo_url = filePath;
  }

  const { error } = await (supabase.from("brands") as any).update(updateData).eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/brands");
  redirect("/admin/brands");
}

export async function deleteBrand(id: string) {
  const profile = await getUserProfile();
  if (!profile || profile.role !== "admin") return { error: "Unauthorized" };

  const supabase = await createClient();
  const { error } = await (supabase.from("brands") as any).delete().eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/brands");
  return { success: true };
}

// --- Users ---

export async function updateUserRole(userId: string, role: "customer" | "admin") {
  const profile = await getUserProfile();
  if (!profile || profile.role !== "admin") return { error: "Unauthorized" };

  const supabase = await createClient();
  const { error } = await (supabase.from("users") as any).update({ role }).eq("id", userId);

  if (error) return { error: error.message };
  revalidatePath("/admin/users");
  return { success: true };
}

// --- Reservations ---

export async function updateReservationStatus(id: string, status: string) {
  const profile = await getUserProfile();
  if (!profile || profile.role !== "admin") return { error: "Unauthorized" };

  const supabase = await createClient();
  
  // Fetch reservation details for user_id and product name
  const { data: reservation } = await (supabase.from("layaway_reservations") as any)
    .select("user_id, products(name)")
    .eq("id", id)
    .single();

  const { error } = await (supabase.from("layaway_reservations") as any)
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };

  if (reservation?.user_id) {
    await createNotification(
      reservation.user_id,
      "Reservation Status Updated",
      `Your reservation for ${reservation.products?.name} status has been changed to ${status}.`,
      "reservation",
      "/dashboard"
    );
  }

  revalidatePath("/admin/reservations");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteReservation(id: string) {
  const profile = await getUserProfile();
  if (!profile || profile.role !== "admin") return { error: "Unauthorized" };

  const supabase = await createClient();
  const { error } = await (supabase.from("layaway_reservations") as any).delete().eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/reservations");
  revalidatePath("/dashboard");
  return { success: true };
}

// --- Refunds ---

export async function updateRefundStatus(id: string, status: string) {
  const profile = await getUserProfile();
  if (!profile || profile.role !== "admin") return { error: "Unauthorized" };

  const supabase = await createClient();
  const updateData: any = { status };
  if (status === 'processed') {
    updateData.processed_at = new Date().toISOString();
  }

  const { data: refund, error: fetchError } = await (supabase.from("refunds") as any)
    .select("user_id, layaway_reservation_id")
    .eq("id", id)
    .single();

  const { error } = await (supabase.from("refunds") as any)
    .update(updateData)
    .eq("id", id);

  if (error) return { error: error.message };

  if (refund) {
    await createNotification(
      refund.user_id,
      "Refund Status Updated",
      `Your refund for reservation #${refund.layaway_reservation_id.slice(0, 8)} is now ${status}.`,
      "refund",
      "/dashboard"
    );
  }

  revalidatePath("/admin/refunds");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteRefund(id: string) {
  const profile = await getUserProfile();
  if (!profile || profile.role !== "admin") return { error: "Unauthorized" };

  const supabase = await createClient();
  const { error } = await (supabase.from("refunds") as any).delete().eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/refunds");
  revalidatePath("/dashboard");
  return { success: true };
}

// --- Orders ---

export async function updateOrderStatus(orderId: string, status: string) {
  const profile = await getUserProfile();
  if (!profile || profile.role !== "admin") return { error: "Unauthorized" };

  const supabase = await createClient();
  
  // Fetch user_id for the order
  const { data: order } = await (supabase.from("orders") as any)
    .select("user_id")
    .eq("id", orderId)
    .single();

  const { error } = await (supabase.from("orders") as any).update({ status }).eq("id", orderId);

  if (error) return { error: error.message };

  if (order?.user_id) {
    await createNotification(
      order.user_id,
      "Order Status Updated",
      `Your order #${orderId.slice(0, 8)} status has been changed to ${status}.`,
      "order",
      "/dashboard"
    );
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}
