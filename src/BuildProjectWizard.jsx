import React,{useMemo,useState} from 'react';
import {ArrowLeft,ArrowRight,Check,Globe,GraduationCap,ShoppingBag,LayoutDashboard,Briefcase,Sparkles,Send,Plus,Minus} from 'lucide-react';
import './BuildProjectWizard.css';

const projectTypes=[
 {id:'Business website',label:'Business website',desc:'A polished website for your company.',icon:Briefcase},
 {id:'E-commerce store',label:'Online store',desc:'Products, shopping and orders.',icon:ShoppingBag},
 {id:'Educational platform',label:'Educational platform',desc:'Courses, students and teachers.',icon:GraduationCap},
 {id:'Web application',label:'Web application',desc:'A custom tool or digital product.',icon:LayoutDashboard},
 {id:'Personal portfolio',label:'Portfolio / personal brand',desc:'Showcase your work and expertise.',icon:Globe},
 {id:'Not sure yet',label:'I need guidance',desc:'Help me choose the right direction.',icon:Sparkles}
];
const goalOptions=['Generate more enquiries','Sell products or services','Present my brand professionally','Manage customers or operations','Deliver courses or learning','Automate repetitive work'];
const featureOptions=['CMS / easy content editing','User accounts and dashboards','Payments and checkout','Booking or scheduling','Analytics and reports','AI-powered features','Live chat or support','Third-party integrations'];
const budgetOptions=['Under EGP 20,000','EGP 20,000–40,000','EGP 40,000–60,000','EGP 60,000–100,000','EGP 100,000+','Not decided yet'];
const timelines=['As soon as possible','Within 1 month','1–3 months','Flexible'];
export default function BuildProjectWizard({db,onClose}){
 const [step,setStep]=useState(0);
 const [project,setProject]=useState('Business website');
 const [goals,setGoals]=useState([]);
 const [pages,setPages]=useState(5);
 const [features,setFeatures]=useState([]);
 const [budget,setBudget]=useState('EGP 40,000–60,000');
 const [timeline,setTimeline]=useState('1–3 months');
 const [name,setName]=useState('');
 const [email,setEmail]=useState('');
 const [phone,setPhone]=useState('');
 const [details,setDetails]=useState('');
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState('');
 const [done,setDone]=useState(false);
 const steps=['Project','Goals','Scope','Budget','Contact'];
 const toggle=(value,list,setter)=>setter(old=>old.includes(value)?old.filter(x=>x!==value):[...old,value]);
 const canContinue=step===0?!!project:step===1?goals.length>0:step===2?features.length>0:true;
 const summary=useMemo(()=>[`Project: ${project}`,`Goals: ${goals.join(', ')||'To discuss'}`,`Estimated pages: ${pages}`,`Features: ${features.join(', ')||'To discuss'}`,`Budget: ${budget}`,`Timeline: ${timeline}`,details&&`Additional details: ${details}`].filter(Boolean).join('\n'),[project,goals,pages,features,budget,timeline,details]);
 const submit=async e=>{e.preventDefault();setError('');if(!db){setError('The enquiry service is not connected yet. Please try again later.');return}setBusy(true);const{error:dbError}=await db.from('leads').insert({name:name.trim(),email:email.trim(),whatsapp:phone.trim()||null,service_type:project,package_name:'Project discovery wizard',concept_name:project,message:summary,status:'New'});setBusy(false);if(dbError){setError('We could not send your project brief. Please try again.');return}setDone(true)};
 return <main className="vx-inner vx-wizard-page"><button className="vx-back" onClick={onClose}><ArrowLeft size={15}/> Back to showcase</button><div className="vx-kicker">VELTRIX / PROJECT DISCOVERY</div>
 {done?<section className="vx-wizard-success"><span><Check size={28}/></span><div className="vx-kicker">BRIEF RECEIVED</div><h1>Your next idea<br/><em>starts here.</em></h1><p>Thank you, {name}. Your project brief has been sent to Veltrix. Our team can review it from the Admin enquiries dashboard.</p><button className="vx-btn-dark" onClick={onClose}>Back to showcase <ArrowRight size={16}/></button></section>:<>
 <div className="vx-wizard-heading"><div><h1 className="vx-inner-title">Let’s build something <em>meaningful.</em></h1><p className="vx-inner-intro">Tell us what you have in mind. This short guided brief helps us understand your goals before we talk.</p></div><div className="vx-wizard-count"><b>0{step+1}</b><span> / 05</span></div></div>
 <div className="vx-wizard-progress" aria-label={`Step ${step+1} of 5`}>{steps.map((s,i)=><div key={s} className={i<=step?'active':''}><i/><span>{s}</span></div>)}</div>
 <section className="vx-wizard-card">
 <div className="vx-wizard-stephead"><span>STEP 0{step+1}</span><h2>{['What are we creating?','What should it help you achieve?','What does your project need?','Let’s talk about timing and budget.','Where can we reach you?'][step]}</h2><p>{['Choose the closest project type. We can refine the details together.','Select the outcomes that matter most to your business.','Choose the capabilities you may need. Nothing is final yet.','These answers help us suggest a realistic project scope.','Send your brief to the Veltrix team for a personal follow-up.'][step]}</p></div>
 {step===0&&<div className="vx-wizard-types">{projectTypes.map(item=>{const Icon=item.icon;return <button type="button" key={item.id} className={project===item.id?'selected':''} onClick={()=>setProject(item.id)}><Icon/><b>{item.label}</b><span>{item.desc}</span>{project===item.id&&<Check className="vx-wizard-check"/>}</button>})}</div>}
 {step===1&&<div className="vx-wizard-options">{goalOptions.map(x=><button type="button" key={x} className={goals.includes(x)?'selected':''} onClick={()=>toggle(x,goals,setGoals)}><span>{goals.includes(x)?<Check/>:<Plus/>}</span>{x}</button>)}</div>}
 {step===2&&<><div className="vx-wizard-pages"><div><b>How many pages or main sections?</b><span>We can adjust this after discovery.</span></div><div><button type="button" onClick={()=>setPages(v=>Math.max(1,v-1))} aria-label="Fewer pages"><Minus/></button><strong>{pages}</strong><button type="button" onClick={()=>setPages(v=>Math.min(30,v+1))} aria-label="More pages"><Plus/></button></div></div><div className="vx-wizard-options">{featureOptions.map(x=><button type="button" key={x} className={features.includes(x)?'selected':''} onClick={()=>toggle(x,features,setFeatures)}><span>{features.includes(x)?<Check/>:<Plus/>}</span>{x}</button>)}</div></>}
 {step===3&&<div className="vx-wizard-choicegrid"><label>Approximate budget<select value={budget} onChange={e=>setBudget(e.target.value)}>{budgetOptions.map(x=><option key={x}>{x}</option>)}</select></label><label>Preferred timeline<select value={timeline} onChange={e=>setTimeline(e.target.value)}>{timelines.map(x=><option key={x}>{x}</option>)}</select></label><label className="wide">Anything else we should know?<textarea rows="4" maxLength="2000" value={details} onChange={e=>setDetails(e.target.value)} placeholder="Tell us about your audience, references, or an idea you have in mind..."/></label></div>}
 {step===4&&<form className="vx-wizard-contact" onSubmit={submit}><label>Your name<input required maxLength="120" value={name} onChange={e=>setName(e.target.value)} placeholder="Full name"/></label><label>Email address<input required type="email" maxLength="254" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label><label>Phone / WhatsApp <small>(optional)</small><input maxLength="40" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+20 ..."/></label><div className="vx-wizard-summary"><b>Your project brief</b><p>{summary}</p></div>{error&&<p className="vx-wizard-error" role="alert">{error}</p>}<button className="vx-btn-dark" disabled={busy}>{busy?'Sending your brief…':'Send project brief'} <Send size={16}/></button></form>}
 <div className="vx-wizard-actions">{step>0&&<button type="button" className="vx-wizard-back" onClick={()=>setStep(v=>v-1)}><ArrowLeft/> Back</button>}{step<4&&<button type="button" className="vx-btn-dark" disabled={!canContinue} onClick={()=>setStep(v=>v+1)}>Continue <ArrowRight size={16}/></button>}</div>
 </section><p className="vx-wizard-footnote"><span><Check size={14}/> No commitment required</span><span><Check size={14}/> Your brief stays private</span><span><Check size={14}/> We’ll refine scope together</span></p>
 </>}
 </main>;
}
