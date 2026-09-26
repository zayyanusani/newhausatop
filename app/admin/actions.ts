"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function requireEditor() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", userId).single();
  if (!profile || !["author", "editor", "admin"].includes(profile.role)) redirect("/");
  return { supabase, userId, role: profile.role };
}

function refresh() {
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath("/category/[category]", "page");
}

export async function createArticle(formData: FormData) {
  const { supabase, userId } = await requireEditor();
  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim().toLowerCase();
  const category = String(formData.get("category") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const excerpt = String(formData.get("excerpt") || "").trim();
  const imageUrl = String(formData.get("image_url") || "").trim();
  if (!title || !slug || !category || !content) throw new Error("Cika muhimman bayanai.");
  const { error } = await supabase.from("articles").insert({
    slug, title, category, content, excerpt, image_url: imageUrl || null,
    author_id: userId, status: "draft"
  });
  if (error) throw new Error(error.message);
  refresh();
}

export async function updateArticle(formData: FormData) {
  const { supabase } = await requireEditor();
  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim().toLowerCase();
  const category = String(formData.get("category") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const excerpt = String(formData.get("excerpt") || "").trim();
  const imageUrl = String(formData.get("image_url") || "").trim();
  if (!id || !title || !slug || !category || !content) throw new Error("Cika muhimman bayanai.");
  const { error } = await supabase.from("articles").update({
    slug, title, category, content, excerpt, image_url: imageUrl || null
  }).eq("id", id);
  if (error) throw new Error(error.message);
  refresh();
}

export async function publishArticle(formData: FormData) {
  const { supabase } = await requireEditor();
  const id = String(formData.get("id") || "");
  if (!id) throw new Error("Article ID missing.");
  const { error } = await supabase.from("articles").update({
    status: "published", published_at: new Date().toISOString()
  }).eq("id", id);
  if (error) throw new Error(error.message);
  refresh();
}

export async function unpublishArticle(formData: FormData) {
  const { supabase } = await requireEditor();
  const id = String(formData.get("id") || "");
  if (!id) throw new Error("Article ID missing.");
  const { error } = await supabase.from("articles").update({
    status: "draft", published_at: null
  }).eq("id", id);
  if (error) throw new Error(error.message);
  refresh();
}

export async function deleteArticle(formData: FormData) {
  const { supabase } = await requireEditor();
  const id = String(formData.get("id") || "");
  if (!id) throw new Error("Article ID missing.");
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) throw new Error(error.message);
  refresh();
}
