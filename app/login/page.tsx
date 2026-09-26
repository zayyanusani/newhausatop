"use client";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter(); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [error,setError]=useState(""); const [busy,setBusy]=useState(false);
  async function submit(e:FormEvent){e.preventDefault();setBusy(true);setError("");const {error}=await createClient().auth.signInWithPassword({email,password});if(error)setError(error.message);else router.push("/admin");setBusy(false);}
  return <main className="authPage"><form className="authCard" onSubmit={submit}><span className="pill">NewHausaTop V3</span><h1>Shiga Admin</h1><p>Shiga domin sarrafa labarai.</p><input type="email" required placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/><input type="password" required placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}/>{error&&<p className="error">{error}</p>}<button className="primary" disabled={busy}>{busy?"Ana shiga…":"Shiga"}</button></form></main>
}
