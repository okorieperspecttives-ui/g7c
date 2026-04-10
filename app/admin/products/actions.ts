"use server";

import { createClient, getUserProfile } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(formData: FormData) {
  const profile = await getUserProfile();
  
  if (!profile || profile.role !== "admin") {
    return { error: "Unauthorized. Admin access required." };
  }

  const supabase = await createClient();

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const brand_id = formData.get("brand_id") as string;
  const category_id = formData.get("category_id") as string;
  const short_description = formData.get("short_description") as string;
  const description = formData.get("description") as string;
  const base_price = parseFloat(formData.get("base_price") as string);
  const markup_price = parseFloat(formData.get("markup_price") as string);
  const stock_quantity = parseInt(formData.get("stock_quantity") as string);
  const warranty_months = parseInt(formData.get("warranty_months") as string) || null;
  const is_active = formData.get("is_active") === "true";
  
  const features = JSON.parse(formData.get("features") as string || "[]");
  const certifications = JSON.parse(formData.get("certifications") as string || "[]");
  const specifications = JSON.parse(formData.get("specifications") as string || "[]");

  // Handle Featured Image upload
  const featuredImageFile = formData.get("featured_image") as File;
  let main_image = "";

  if (featuredImageFile && featuredImageFile.size > 0) {
    const fileExt = featuredImageFile.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, featuredImageFile);

    if (uploadError) {
      console.error("Error uploading featured image:", uploadError);
      return { error: "Failed to upload featured image" };
    }

    main_image = filePath;
  }

  // Handle Gallery Images upload
  const galleryFiles = formData.getAll("gallery_images") as File[];
  const gallery_images: string[] = [];

  for (const file of galleryFiles) {
    if (file.size > 0) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `products/gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file);

      if (!uploadError) {
        gallery_images.push(filePath);
      }
    }
  }

  const { data: product, error } = await (supabase.from("products") as any)
    .insert([{
      name,
      slug,
      brand_id,
      category_id,
      short_description,
      description,
      base_price,
      markup_price,
      stock_quantity,
      warranty_months,
      main_image,
      gallery_images,
      features,
      certifications,
      is_active,
    }])
    .select()
    .single();

  if (error || !product) {
    console.error("Error creating product:", error);
    return { error: error?.message || "Failed to create product" };
  }

  // Insert Specifications
  if (specifications.length > 0) {
    const specsToInsert = specifications.map((s: any) => ({
      product_id: (product as any).id,
      label: s.label,
      value: s.value
    }));

    const { error: specsError } = await (supabase.from("product_specs") as any)
      .insert(specsToInsert);

    if (specsError) {
      console.error("Error inserting specifications:", specsError);
    }
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");

  return { success: true, id: (product as any).id };
}

export async function updateProduct(id: string, formData: FormData) {
  const profile = await getUserProfile();
  
  if (!profile || profile.role !== "admin") {
    return { error: "Unauthorized. Admin access required." };
  }

  const supabase = await createClient();

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const brand_id = formData.get("brand_id") as string;
  const category_id = formData.get("category_id") as string;
  const short_description = formData.get("short_description") as string;
  const description = formData.get("description") as string;
  const base_price = parseFloat(formData.get("base_price") as string);
  const markup_price = parseFloat(formData.get("markup_price") as string);
  const stock_quantity = parseInt(formData.get("stock_quantity") as string);
  const warranty_months = parseInt(formData.get("warranty_months") as string) || null;
  const is_active = formData.get("is_active") === "true";

  const features = JSON.parse(formData.get("features") as string || "[]");
  const certifications = JSON.parse(formData.get("certifications") as string || "[]");
  const specifications = JSON.parse(formData.get("specifications") as string || "[]");
  const existingGallery = JSON.parse(formData.get("existing_gallery") as string || "[]");

  const updateData: any = {
    name,
    slug,
    brand_id,
    category_id,
    short_description,
    description,
    base_price,
    markup_price,
    stock_quantity,
    warranty_months,
    features,
    certifications,
    is_active,
    gallery_images: existingGallery,
  };

  // Handle Featured Image upload
  const featuredImageFile = formData.get("featured_image") as File;
  if (featuredImageFile && featuredImageFile.size > 0) {
    const fileExt = featuredImageFile.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, featuredImageFile);

    if (!uploadError) {
      updateData.main_image = filePath;
    }
  }

  // Handle Gallery Images (Append new ones)
  const galleryFiles = formData.getAll("gallery_images") as File[];
  if (galleryFiles.length > 0) {
    const newGallery: string[] = [];
    for (const file of galleryFiles) {
      if (file.size > 0) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `products/gallery/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filePath, file);

        if (!uploadError) {
          newGallery.push(filePath);
        }
      }
    }

    if (newGallery.length > 0) {
      updateData.gallery_images = [...existingGallery, ...newGallery];
    }
  }

  const { error } = await (supabase.from("products") as any)
    .update({
      name,
      slug,
      brand_id,
      category_id,
      short_description,
      description,
      base_price,
      markup_price,
      stock_quantity,
      warranty_months,
      features,
      certifications,
      is_active,
      ...(updateData.main_image ? { main_image: updateData.main_image } : {}),
      gallery_images: updateData.gallery_images || existingGallery,
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating product:", error);
    return { error: error.message };
  }

  // Update Specifications (Delete and Re-insert for simplicity in MVP)
  await (supabase.from("product_specs") as any).delete().eq("product_id", id);
  
  if (specifications.length > 0) {
    const specsToInsert = specifications.map((s: any) => ({
      product_id: id,
      label: s.label,
      value: s.value
    }));

    const { error: specsError } = await (supabase.from("product_specs") as any)
      .insert(specsToInsert);

    if (specsError) {
      console.error("Error updating specifications:", specsError);
    }
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}/edit`);
  revalidatePath(`/products/${id}`);
  revalidatePath("/shop");
  revalidatePath("/");

  return { success: true };
}


export async function deleteProduct(id: string) {
  const profile = await getUserProfile();
  
  if (!profile || profile.role !== "admin") {
    return { error: "Unauthorized. Admin access required." };
  }

  const supabase = await createClient();

  const { error } = await (supabase.from("products") as any)
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting product:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");

  return { success: true };
}
