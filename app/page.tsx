import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const cats=["Duka","Najeriya","Duniya","Fasaha & AI","Wasanni","Labarin Hausa"];

export default async function Home(){
  const supabase=await createClient();
  const {data:stories,error}=await supabase.from("articles").select("slug,title,excerpt,category,image_url,published_at").eq("status","published").order("published_at",{ascending:false}).limit(12);
  const items=stories??[];
  const featured=items[0];
  return <main>
    <div className="topline"><div>🔴 <b>BREAKING NEWS</b> — Barka da zuwa NewHausaTop</div><div className="date">Sabbin labarai kullum</div></div>
    <header><Link className="brand" href="/"><span className="mark">N</span><div><strong>NewHausaTop</strong><small>Labaran Hausa na zamani</small></div></Link><div className="actions"><form className="search" action="/search"><span>⌕</span><input name="q" placeholder="Nemo labari..." /></form><Link href="/admin">Admin</Link></div></header>
    <nav>{cats.map(c=><Link className={c==="Duka"?"active":""} href={c==="Duka"?"/":"/category/"+encodeURIComponent(c)} key={c}>{c}</Link>)}</nav>
    <section className="ticker"><span>⚡ SABO</span><div>NewHausaTop na kawo maka labarai, fasaha, AI, wasanni da abubuwan duniya cikin Hausa.</div></section>
    <div className="ad">ADVERTISEMENT</div>
    {error&&<div className="ad">An samu matsala wajen loda labarai. A duba Supabase environment variables.</div>}
    {featured ? <section className="hero"><div className="heroText"><span className="pill">{featured.category}</span><h1>{featured.title}</h1><p>{featured.excerpt}</p><Link className="primary" href={"/news/"+featured.slug}>Karanta labari →</Link></div>{featured.image_url&&<Image src={featured.image_url} alt={featured.title} width={1200} height={700} priority/>}</section> : <section className="hero"><div className="heroText"><span className="pill">NewHausaTop</span><h1>Babu labarin da aka wallafa tukuna</h1><p>Shiga /admin ka kirkiri sabon labari, sannan ka wallafa shi daga CMS.</p><Link className="primary" href="/admin">Je zuwa Admin →</Link></div></section>}
    <div className="sectionHead"><h2>Sabbin Labarai</h2><span>{items.length} labarai</span></div>
    <div className="layout"><section className="grid">{items.slice(featured?1:0).map(s=><article className="card" key={s.slug}>{s.image_url&&<Image src={s.image_url} alt={s.title} width={700} height={400}/>}<div className="cardBody"><span>{s.category}</span><h3><Link href={"/news/"+s.slug}>{s.title}</Link></h3><small>{s.published_at?new Date(s.published_at).toLocaleDateString("ha-NG"):""}</small></div></article>)}</section>
    <aside><div className="sideBox"><h3>🔥 Trending News</h3>{items.slice(0,5).map((s,i)=><div className="trend" key={s.slug}><b>0{i+1}</b><div><Link href={"/news/"+s.slug}><strong>{s.title}</strong></Link></div></div>)}</div><div className="sideAd">ADVERTISEMENT</div></aside></div>
    <div className="ad">ADVERTISEMENT</div>
    <section className="topics"><h2>Manyan Sassa</h2><div>{cats.slice(1).map(c=><Link href={"/category/"+encodeURIComponent(c)} key={c}>{c} <span>→</span></Link>)}</div></section>
    <footer><div><div className="brand"><span className="mark">N</span><strong>NewHausaTop</strong></div><p>Gidan labaran Hausa na zamani — Najeriya, Duniya, AI, Fasaha da Wasanni.</p></div><div><b>Raba mu</b><p>Facebook · WhatsApp · X</p></div><div><b>Tuntuɓe mu</b><p>Sabbin labarai kullum</p></div></footer>
  </main>
}