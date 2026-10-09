"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Story = {
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  image_url: string | null;
  published_at: string | null;
};

const cats = ["Duka", "Najeriya", "Duniya", "Fasaha & AI", "Wasanni", "Labarin Hausa"];

function formatDate(value: string | null) {
  if (!value) return "Sabon labari";
  return new Intl.DateTimeFormat("ha-NG", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value));
}

export default function Home() {
  const [items, setItems] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadStories = async () => {
      try {
        const supabase = createClient();
        const { data, error: queryError } = await supabase
          .from("articles")
          .select("slug,title,excerpt,category,image_url,published_at")
          .eq("status", "published")
          .order("published_at", { ascending: false })
          .limit(13);
        if (queryError) throw queryError;
        setItems((data ?? []) as Story[]);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    loadStories();
  }, []);

  const featured = items[0];
  const secondary = items.slice(1, 4);
  const latest = items.slice(4);

  return (
    <main className="homePage">
      <div className="topline">
        <div><span className="liveDot" /> <b>LABARAI NA YANZU</b><span className="toplineMessage"> — Sahihin labari cikin harshen Hausa</span></div>
        <div className="date">Sabbin labarai kullum</div>
      </div>

      <header className="siteHeader">
        <Link className="brand" href="/" aria-label="NewHausaTop shafin farko">
          <span className="mark">N</span>
          <div><strong>NewHausaTop<span className="brandDot">.</span></strong><small>Labari. Fahimta. Ci gaba.</small></div>
        </Link>
        <div className="actions">
          <form className="search" action="/search" role="search">
            <span aria-hidden="true">⌕</span>
            <input name="q" placeholder="Nemo labari..." aria-label="Nemo labari" />
            <button type="submit" aria-label="Nema">→</button>
          </form>
          <Link className="adminShortcut" href="/admin">Admin ↗</Link>
        </div>
      </header>

      <nav className="categoryNav" aria-label="Sassan labarai">
        {cats.map((category, index) => (
          <Link className={index === 0 ? "active" : ""} href={index === 0 ? "/" : "/category/" + encodeURIComponent(category)} key={category}>{category}</Link>
        ))}
      </nav>

      <section className="ticker" aria-label="Sanarwa">
        <span>⚡ SABO</span>
        <div>Ka kasance tare da NewHausaTop domin samun labaran Najeriya, duniya, fasaha da wasanni.</div>
      </section>

      <div className="ad adBanner">WURIN TALLA</div>

      {error && <div className="notice">An kasa loda labarai. Da fatan za a duba saitunan Supabase sannan a sake gwadawa.</div>}

      {loading ? (
        <section className="loadingPanel"><div className="loadingPulse" /><h2>Ana loda sabbin labarai...</h2><p>Kaɗan kaɗan, muna nemo maka labarai.</p></section>
      ) : featured ? (
        <section className="leadGrid">
          <article className="hero">
            <div className="heroText">
              <span className="eyebrow"><span className="liveDot" /> LABARI NA GABA</span>
              <span className="pill">{featured.category || "Manyan Labarai"}</span>
              <h1>{featured.title}</h1>
              {featured.excerpt && <p>{featured.excerpt}</p>}
              <div className="heroMeta">{formatDate(featured.published_at)} <span>•</span> NewHausaTop</div>
              <Link className="primary" href={"/news/" + featured.slug}>Karanta cikakken labari <span>→</span></Link>
            </div>
            {featured.image_url ? (
              <Link className="heroMedia" href={"/news/" + featured.slug} aria-label={"Karanta: " + featured.title}>
                <Image src={featured.image_url} alt={featured.title} width={1200} height={800} priority />
                <span className="imageCaption">MANYAN LABARAI</span>
              </Link>
            ) : <div className="heroMedia heroPlaceholder"><span>NEWH AUSATOP</span><strong>Labaran da suka shafi rayuwarka.</strong></div>}
          </article>

          <aside className="leadSide">
            <div className="sideHeading"><h2>Manyan Labarai</h2><span>TOP STORIES</span></div>
            {secondary.map((story, index) => (
              <article className="miniStory" key={story.slug}>
                {story.image_url ? <Link className="miniImage" href={"/news/" + story.slug}><Image src={story.image_url} alt={story.title} width={240} height={180} /></Link> : <div className="miniImage miniPlaceholder">NH</div>}
                <div><span className="miniCategory">{story.category || "Labarai"}</span><h3><Link href={"/news/" + story.slug}>{story.title}</Link></h3><small>{formatDate(story.published_at)}</small></div>
                <b className="miniNumber">0{index + 1}</b>
              </article>
            ))}
            {secondary.length === 0 && <p className="emptyHint">Za a nuna manyan labarai a nan idan an wallafa su.</p>}
          </aside>
        </section>
      ) : (
        <section className="hero emptyHero">
          <div className="heroText"><span className="pill">Barka da zuwa</span><h1>Labaran Hausa, cikin sauƙi.</h1><p>NewHausaTop na kawo maka labaran Najeriya, duniya, fasaha da wasanni cikin harshen Hausa.</p><Link className="primary" href="/admin">Wallafa labari na farko →</Link></div>
          <div className="heroMedia heroPlaceholder"><span>NEWH AUSATOP</span><strong>Labari. Fahimta. Ci gaba.</strong></div>
        </section>
      )}

      <div className="sectionHead"><div><span className="sectionKicker">KARANTA SABO</span><h2>Sabbin Labarai</h2></div><span className="storyCount">{items.length} labarai</span></div>

      {latest.length > 0 ? (
        <div className="layout">
          <section className="grid">
            {latest.map(story => (
              <article className="card" key={story.slug}>
                {story.image_url ? <Link className="cardMedia" href={"/news/" + story.slug}><Image src={story.image_url} alt={story.title} width={700} height={440} /></Link> : <div className="cardMedia cardPlaceholder"><span>NH</span></div>}
                <div className="cardBody"><span>{story.category || "Labarai"}</span><h3><Link href={"/news/" + story.slug}>{story.title}</Link></h3>{story.excerpt && <p>{story.excerpt}</p>}<small>{formatDate(story.published_at)}</small></div>
              </article>
            ))}
          </section>
          <aside><div className="sideBox"><h3>🔥 Ana karantawa</h3>{items.slice(0, 5).map((story, index) => <div className="trend" key={story.slug}><b>0{index + 1}</b><div><Link href={"/news/" + story.slug}><strong>{story.title}</strong></Link><small>{story.category || "Labarai"}</small></div></div>)}</div><div className="sideAd">WURIN TALLA</div></aside>
        </div>
      ) : !loading && items.length <= 1 ? <div className="emptyLatest"><h3>{items.length === 1 ? "Babu wasu sabbin labarai tukuna." : "Babu labarin da aka wallafa tukuna."}</h3><p>Da zarar an wallafa labarai daga Admin, za su bayyana a nan.</p></div> : null}

      <div className="ad adBanner">WURIN TALLA</div>

      <section className="topics"><div className="topicsIntro"><span className="sectionKicker">Bincika abin da kake so</span><h2>Manyan Sassa</h2><p>Zaɓi sashe domin gano labaran da suka fi maka muhimmanci.</p></div><div>{cats.slice(1).map(category => <Link href={"/category/" + encodeURIComponent(category)} key={category}><span>{category}</span><b>↗</b></Link>)}</div></section>

      <footer className="siteFooter">
        <div><Link className="brand footerBrand" href="/"><span className="mark">N</span><div><strong>NewHausaTop<span className="brandDot">.</span></strong><small>Labari. Fahimta. Ci gaba.</small></div></Link><p>Gidan labaran Hausa na zamani — Najeriya, duniya, fasaha, AI da wasanni.</p></div>
        <div><b>Ku biyo mu</b><p>Facebook · WhatsApp · X</p></div>
        <div><b>Game da mu</b><p>Labaran da suka shafi al'umma, cikin Hausa mai sauƙin fahimta.</p></div>
        <div className="copyright">© {new Date().getFullYear()} NewHausaTop. An tanadi dukkan haƙƙoƙi.</div>
      </footer>
    </main>
  );
}
