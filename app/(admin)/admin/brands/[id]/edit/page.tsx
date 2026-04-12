import { createClient } from "@/lib/supabase/server";
import { Brand } from "@/lib/types";
import { notFound } from "next/navigation";
import BrandForm from "../../BrandForm";

export default async function EditBrandPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: brand } = await supabase
    .from("brands")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!brand) notFound();

  return <BrandForm initialData={brand as Brand} />;
}
