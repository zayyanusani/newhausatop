import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  createArticle,
  updateArticle,
  publishArticle,
  unpublishArticle,
  deleteArticle,
} from "./actions";
import ImageUpload from "./image-upload";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name,role")
    .eq("id", userId)
    .single();

  if (!profile || !["author", "editor", "admin"].includes(profile.role)) redirect("/");

  const { data: articles } = await supabase
    .from("articles")
    .select("id,title,slug,category,excerpt,content,image_url,status,created_at,published_at")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <main className="adminPage">
      <header className="adminHeader">
        <div>
          <span className="pill">NewHausaTop V3.2 CMS</span>
          <h1>Sashen Gudanarwa</h1>
          <p>Sannu {profile.full_name || "Edita"} · {profile.role}</p>
        </div>
        <div className="adminActions">
          <Link href="/" className="adminLink">Duba shafi</Link>
          <form action={async () => {
            "use server";
            const s = await createClient();
            await s.auth.signOut();
            redirect("/");
          }}>
            <button>Fita</button>
          </form>
        </div>
      </header>

      <section className="adminGrid">
        <form className="adminCard" action={createArticle}>
          <h2>➕ Sabon Labari</h2>
          <input name="title" required placeholder="Taken labari" />
          <input name="slug" required placeholder="slug-labari" />
          <input name="category" required placeholder="Najeriya / Duniya / Fasaha & AI" />
          <ImageUpload inputName="image_url" />
          <input name="image_url" placeholder="Ko saka URL na hoto" />
          <textarea name="excerpt" placeholder="Takaitaccen bayani" />
          <textarea name="content" required placeholder="Cikakken labari" rows={10} />
          <button className="primary">Ajiye a Draft</button>
        </form>

        <section className="adminCard">
          <h2>📰 Rubuce-rubuce</h2>
          {articles?.length ? articles.map((a) => (
            <details className="adminItem" key={a.id}>
              <summary>
                <span>
                  <strong>{a.title}</strong>
                  <small>{a.category} · {a.status}</small>
                </span>
                <span className="status">{a.status}</span>
              </summary>

              <form action={updateArticle} className="adminEditForm">
                <input type="hidden" name="id" value={a.id} />
                <input name="title" required defaultValue={a.title} />
                <input name="slug" required defaultValue={a.slug} />
                <input name="category" required defaultValue={a.category} />
                <input name="image_url" defaultValue={a.image_url || ""} placeholder="Hoton labari URL" />
                <textarea name="excerpt" defaultValue={a.excerpt || ""} placeholder="Takaitaccen bayani" />
                <textarea name="content" required defaultValue={a.content} rows={9} />
                <button className="primary">Ajiye Canje-canje</button>
              </form>

              <div className="adminActions">
                {a.status === "published" ? (
                  <form action={unpublishArticle}>
                    <input type="hidden" name="id" value={a.id} />
                    <button>Mayar da Draft</button>
                  </form>
                ) : (
                  <form action={publishArticle}>
                    <input type="hidden" name="id" value={a.id} />
                    <button className="primary">Buga Yanzu</button>
                  </form>
                )}
                {a.status === "published" && (
                  <Link className="adminLink" href={`/news/${a.slug}`}>Duba Labari</Link>
                )}
                <form action={deleteArticle}>
                  <input type="hidden" name="id" value={a.id} />
                  <button className="danger" type="submit">Goge</button>
                </form>
              </div>
            </details>
          )) : <p>Babu labarai a database tukuna.</p>}
        </section>
      </section>
    </main>
  );
}
