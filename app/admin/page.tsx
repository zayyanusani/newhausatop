import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createArticle } from "./actions";

export default async function AdminPage(){
  const supabase=await createClient();
  const {data:claims}=await supabase.auth.getClaims();
  const userId=claims?.claims?.sub;
  if(!userId) redirect("/login");
  const {data:profile}=await supabase.from("profiles").select("full_name,role").eq("id",userId).single();
  if(!profile || !["author","editor","admin"].includes(profile.role)) redirect("/");
  const {data:articles}=await supabase.from("articles").select("id,title,category,status,created_at").order("created_at",{ascending:false}).limit(20);
  return <main className="adminPage"><header className="adminHeader"><div><span className="pill">NewHausaTop V3 CMS</span><h1>Sashen Gudanarwa</h1><p>Sannu {profile.full_name||"Edita"} · {profile.role}</p></div><form action={async()=>{ "use server"; const s=await createClient(); await s.auth.signOut(); redirect("/"); }}><button>Fita</button></form></header><section className="adminGrid"><form className="adminCard" action={createArticle}><h2>Sabon Labari</h2><input name="title" required placeholder="Taken labari"/><input name="slug" required placeholder="slug-labari"/><input name="category" required placeholder="Najeriya / Duniya / Fasaha & AI"/><input name="image_url" placeholder="Hoton labari URL"/><textarea name="excerpt" placeholder="Takaitaccen bayani"/><textarea name="content" required placeholder="Cikakken labari" rows={10}/><button className="primary">Ajiye a Draft</button></form><section className="adminCard"><h2>Sabbin Rubuce-rubuce</h2>{articles?.length?articles.map(a=><div className="adminRow" key={a.id}><div><strong>{a.title}</strong><small>{a.category} · {a.status}</small></div></div>):<p>Babu labarai a database tukuna.</p>}</section></section></main>
}
