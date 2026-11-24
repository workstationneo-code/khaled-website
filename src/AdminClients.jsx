import React,{useState} from 'react';
import {UserPlus,Copy,Check,KeyRound,ShieldCheck} from 'lucide-react';

export default function AdminClients({db}){
 const [form,setForm]=useState({client_name:'',client_email:'',project_name:'',package_name:'Professional',password:''});
 const [busy,setBusy]=useState(false),[notice,setNotice]=useState(''),[created,setCreated]=useState(null),[copied,setCopied]=useState(false);
 const change=(key,value)=>setForm(v=>({...v,[key]:value}));
 const create=async e=>{
  e.preventDefault();setNotice('');setCreated(null);
  if(!db){setNotice('Database connection is unavailable.');return}
  if(form.password.length<12){setNotice('Use a password with at least 12 characters.');return}
  setBusy(true);
  try{
   const {data,error}=await db.functions.invoke('create-client-project',{body:{client_name:form.client_name,client_email:form.client_email,project_name:form.project_name,package_name:form.package_name,password:form.password}});
   if(error)throw error;
   if(data?.error)throw new Error(data.error);
   setCreated({name:form.client_name,email:form.client_email,password:form.password,project:form.project_name});
   setForm({client_name:'',client_email:'',project_name:'',package_name:'Professional',password:''});
   setNotice('Client account and project workspace created. No invitation email was sent.');
  }catch(err){setNotice(err?.message||'Could not create the client account.')}
  finally{setBusy(false)}
 };
 const copy=async()=>{if(!created)return;const text='Veltrix Client Login\nEmail: '+created.email+'\nTemporary password: '+created.password+'\nPlease change this password after signing in.';try{await navigator.clipboard.writeText(text);setCopied(true)}catch{setNotice('Copy was blocked by the browser. You can select and copy the credentials below.')}};
 return <section className="admin-clients">
  <div className="admin-clients-head"><div><span className="admin-clients-kicker">CLIENT WORKSPACES</span><h3><UserPlus size={19}/> Create a client account</h3><p>Set the client's login password yourself. The system creates the account directly without sending an invitation.</p></div><span className="admin-clients-secure"><ShieldCheck size={15}/> Admin only</span></div>
  <form className="admin-client-form" onSubmit={create}>
   <label>Client full name<input required maxLength="120" value={form.client_name} onChange={e=>change('client_name',e.target.value)} placeholder="e.g. Ahmed Hassan"/></label>
   <label>Client email<input required type="email" maxLength="254" value={form.client_email} onChange={e=>change('client_email',e.target.value)} placeholder="client@example.com"/></label>
   <label>Project name<input required maxLength="160" value={form.project_name} onChange={e=>change('project_name',e.target.value)} placeholder="e.g. SAT Tutor Platform"/></label>
   <label>Package<select value={form.package_name} onChange={e=>change('package_name',e.target.value)}>{['Starter','Professional','Elite','Not selected'].map(x=><option key={x}>{x}</option>)}</select></label>
   <label className="admin-client-password">Set initial password<input required type="password" minLength="12" autoComplete="new-password" value={form.password} onChange={e=>change('password',e.target.value)} placeholder="At least 12 characters"/><small>Choose a unique password and share it privately with the client.</small></label>
   <button className="dark" disabled={busy}><KeyRound size={15}/>{busy?'Creating account…':'Create client account'}</button>
  </form>
  {notice&&<p className="admin-client-notice">{notice}</p>}
  {created&&<div className="admin-client-created"><div><Check size={17}/><b>Client credentials ready</b></div><p>Share these details with {created.name} through a private channel.</p><dl><dt>Login email</dt><dd>{created.email}</dd><dt>Initial password</dt><dd>{created.password}</dd><dt>Project</dt><dd>{created.project}</dd></dl><button type="button" className="outline" onClick={copy}><Copy size={14}/>{copied?'Copied':'Copy login details'}</button><small>The password is stored securely by Supabase Auth, not as readable text in the project database.</small></div>}
 </section>;
}
