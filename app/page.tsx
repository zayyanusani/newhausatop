"use client";
import {useMemo,useState} from "react";
const stories=[
{cat:"Najeriya",title:"Sabbin labarai daga Najeriya: abubuwan da ke faruwa a yau",time:"Minti 12 da suka wuce",img:"https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?auto=format&fit=crop&w=1200&q=80"},
{cat:"Fasaha & AI",title:"AI na sauya yadda ake aiki, koyo da kirkirar sabbin abubuwa",time:"Minti 28 da suka wuce",img:"https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1000&q=80"},
{cat:"Duniya",title:"Manyan abubuwan da ke faruwa a duniya a wannan makon",time:"Minti 45 da suka wuce",img:"https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1000&q=80"},
{cat:"Wasanni",title:"Wasanni: sakamakon yau da manyan abubuwan da ake jira",time:"Awa 1 da ta wuce",img:"https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1000&q=80"}
];
const cats=["Duka","Najeriya","Duniya","Fasaha & AI","Wasanni","Labarin Hausa"];
export default function Home(){const [dark,setDark]=useState(false);const [q,setQ]=useState("");const [cat,setCat]=useState("Duka");const filtered=useMemo(()=>stories.filter(s=>(cat==="Duka"||s.cat===cat)&&s.title.toLowerCase().includes(q.toLowerCase())),[q,cat]);return <main className={dark?"dark":""}>
<div className="topline"><div>🔴 <b>BREAKING NEWS</b> — Barka da zuwa NewHausaTop</div><div className="date">Asabar, 26 Satumba 2026</div></div>
<header><div className="brand"><span className="mark">N</span><div><strong>NewHausaTop</strong><small>Labaran Hausa na zamani</small></div></div><div className="actions"><label className="search">⌕<input value={q} onChange={e=>setQ(e.target.value)} placeholder="Nemo labari..." /></label><button onClick={()=>setDark(!dark)} aria-label="Canza yanayin launi">{dark?"☀️":"🌙"}</button></div></header>
<nav>{cats.map(c=><button className={cat===c?"active":""} onClick={()=>setCat(c)} key={c}>{c}</button>)}</nav>
<section className="ticker"><span>⚡ SABO</span><div>NewHausaTop na kawo maka labarai, fasaha, AI, wasanni da abubuwan duniya cikin Hausa.</div></section>
<div className="ad">ADVERTISEMENT</div>
<section className="hero"><div className="heroText"><span className="pill">{stories[0].cat}</span><h1>{stories[0].title}</h1><p>Karanta cikakken bayani, mahimman abubuwa da sabbin bayanai cikin Hausa mai saukin fahimta.</p><button className="primary">Karanta labari →</button></div><img src={stories[0].img} alt="" /></section>
<div className="sectionHead"><h2>Sabbin Labarai</h2><span>{filtered.length} labarai</span></div>
<div className="layout"><section className="grid">{filtered.slice(1).map((s,i)=><article className="card" key={s.title}><img src={s.img} alt="" /><div className="cardBody"><span>{s.cat}</span><h3>{s.title}</h3><small>{s.time}</small><div className="share"><button onClick={()=>navigator.clipboard?.writeText(location.href)}>🔗 Kwafi</button><a target="_blank" href={"https://wa.me/?text="+encodeURIComponent(s.title+" — NewHausaTop")}>WhatsApp</a><a target="_blank" href={"https://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(location.href)}>Facebook</a></div></div></article>)}</section>
<aside><div className="sideBox"><h3>🔥 Trending News</h3>{stories.map((s,i)=><div className="trend" key={s.title}><b>0{i+1}</b><div><strong>{s.title}</strong><small>{s.time}</small></div></div>)}</div><div className="sideAd">ADVERTISEMENT</div></aside></div>
<div className="ad">ADVERTISEMENT</div>
<section className="topics"><h2>Manyan Sassa</h2><div>{cats.slice(1).map(c=><button key={c} onClick={()=>setCat(c)}>{c} <span>→</span></button>)}</div></section>
<footer><div><div className="brand"><span className="mark">N</span><strong>NewHausaTop</strong></div><p>Gidan labaran Hausa na zamani — Najeriya, Duniya, AI, Fasaha da Wasanni.</p></div><div><b>Raba mu</b><p>Facebook · WhatsApp · X</p></div><div><b>Tuntuɓe mu</b><p>Sabbin labarai kullum</p></div></footer>
</main>}