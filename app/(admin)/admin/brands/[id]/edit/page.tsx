import { createClient } from "@/lib/supabase/server";
import { Brand } from "@/lib/types";
import { notFound } from "next/navigation";
import BrandForm from "../../BrandForm";

export default async function EditBrandPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: brand } = await supabase
    .from("brands")
    .select("*")
    .eq("id", id)
    .single();

  if (!brand) notFound();

  return <BrandForm initialData={brand as Brand} />;
}
