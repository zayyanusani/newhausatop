"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createArticle(formData: FormData) {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) redirect("/login");
  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim().toLowerCase();
  const category = String(formData.get("category") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const excerpt = String(formData.get("excerpt") || "").trim();
  const imageUrl = String(formData.get("image_url") || "").trim();
  if (!title || !slug || !category || !content) throw new Error("Cika muhimman bayanai.");
  const { error } = await supabase.from("articles").insert({slug,title,category,content,excerpt,image_url:imageUrl,author_id:userId,status:"draft"});
  if (error) throw new Error(error.message);
  revalidatePath("/admin"); revalidatePath("/");
}
