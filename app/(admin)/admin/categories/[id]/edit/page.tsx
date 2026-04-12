import { createClient } from "@/lib/supabase/server";
import { Category } from "@/lib/types";
import { notFound } from "next/navigation";
import CategoryForm from "../../CategoryForm";

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!category) notFound();

  return <CategoryForm initialData={category as Category} />;
}
