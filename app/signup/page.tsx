"use client";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignupPage(){
 const router=useRouter(); const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [message,setMessage]=useState(""); const [busy,setBusy]=useState(false);
 async function submit(e:FormEvent){e.preventDefault();setBusy(true);setMessage("");const {error}=await createClient().auth.signUp({email,password,options:{data:{full_name:name}}});if(error)setMessage(error.message);else {setMessage("An tura maka email na tabbatarwa. Bayan ka tabbatar, shiga."); setTimeout(()=>router.push("/login"),1200);}setBusy(false);}
 return <main className="authPage"><form className="authCard" onSubmit={submit}><span className="pill">NewHausaTop V3</span><h1>Kirkiri account</h1><p>Marubuci ko edita zai iya amfani da CMS bayan an ba shi role.</p><input required placeholder="Cikakken suna" value={name} onChange={e=>setName(e.target.value)}/><input type="email" required placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/><input type="password" minLength={8} required placeholder="Password (akalla 8)" value={password} onChange={e=>setPassword(e.target.value)}/>{message&&<p>{message}</p>}<button className="primary" disabled={busy}>{busy?"Ana kirkira…":"Kirkiri account"}</button></form></main>
}
