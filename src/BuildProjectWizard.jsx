import React,{useMemo,useState} from 'react';
import {ArrowLeft,ArrowRight,Check,Globe,GraduationCap,ShoppingBag,LayoutDashboard,Briefcase,Sparkles,Send,Plus,Minus,Palette,MonitorSmartphone,Layers,CalendarDays,Link2,Upload,ClipboardList,Calculator,MessageCircle} from 'lucide-react';
import './BuildProjectWizard.css';

const projectTypes=[
 {id:'Business website',label:'Business website',desc:'A polished website for your company.',icon:Briefcase},
 {id:'E-commerce store',label:'Online store',desc:'Products, shopping and orders.',icon:ShoppingBag},
 {id:'Educational platform',label:'Educational platform',desc:'Courses, students and teachers.',icon:GraduationCap},
 {id:'Web application',label:'Web application',desc:'A custom tool or digital product.',icon:LayoutDashboard},
 {id:'Personal portfolio',label:'Portfolio / personal brand',desc:'Showcase your work and expertise.',icon:Globe},
 {id:'Not sure yet',label:'I need guidance',desc:'Help me choose the right direction.',icon:Sparkles}
];
const goals=['Generate more enquiries','Sell products or services','Present my brand professionally','Manage customers or operations','Deliver courses or learning','Automate repetitive work','Build a community','Improve an existing website'];
const featureGroups=[
 {title:'Core experience',items:['CMS / easy content editing','User accounts and dashboards','Payments and checkout','Booking or scheduling','Search and filters','Multi-language support']},
 {title:'Growth and insight',items:['Analytics and reports','SEO foundations','Email marketing','Live chat or support','Customer reviews','CRM / lead management']},
 {title:'Advanced capabilities',items:['AI-powered features','Custom workflows and automation','Third-party integrations','Memberships and subscriptions','Admin panel','API integrations']}
];
const pages=['Home','About','Services / Courses','Pricing','Blog / Resources','Contact','FAQ','Shop / Products','Student / Client dashboard','Admin dashboard','Other'];
const integrations=['Payment gateway','WhatsApp','Email marketing','CRM','Google Analytics','Calendar / booking','Maps','Social media','Learning tools','Accounting tools','Other'];
const styles=['Minimal & elegant','Modern & bold','Editorial & premium','Playful & colorful','Corporate & professional','Creative & experimental'];
const palettes=['Sage & ivory','Black & white','Warm neutrals','Blue & cool tones','Earthy & natural','Vibrant accents','I have brand colors'];
const devices=['Desktop experience','Mobile experience','Tablet experience','All devices equally'];
const maintenance=['No ongoing care for now','Basic monthly maintenance','Complete monthly care','Discuss with Veltrix'];
const languages=['English','Arabic','English and Arabic','Other'];
const budgets=['Under EGP 20,000','EGP 20,000–40,000','EGP 40,000–60,000','EGP 60,000–100,000','EGP 100,000+','Not decided yet'];
const timelines=['As soon as possible','Within 1 month','1–3 months','3–6 months','Flexible'];
const toggle=(value,list,setter)=>setter(old=>old.includes(value)?old.filter(x=>x!==value):[...old,value]);
const ChoiceList=({items,value,onChange})=><div className="vx-wizard-options">{items.map(x=><button type="button" key={x} className={value.includes(x)?'selected':''} onClick={()=>toggle(x,value,onChange)}><span>{value.includes(x)?<Check/>:<Plus/>}</span>{x}</button>)}</div>;
const Field=({label,children,wide=false})=><label className={wide?'wide':''}>{label}{children}</label>;

export default function BuildProjectWizard({db,onClose}){
 const [step,setStep]=useState(0);
 const [project,setProject]=useState('Business website');
 const [goalsSelected,setGoalsSelected]=useState([]);
 const [style,setStyle]=useState('Modern & bold');
 const [palette,setPalette]=useState('Sage & ivory');
 const [devicesSelected,setDevicesSelected]=useState(['All devices equally']);
 const [pagesSelected,setPagesSelected]=useState(['Home','About','Services / Courses','Contact']);
 const [pageCount,setPageCount]=useState(5);
 const [features,setFeatures]=useState([]);
 const [integrationsSelected,setIntegrationsSelected]=useState([]);
 const [languagesSelected,setLanguagesSelected]=useState(['English']);
 const [maintenancePlan,setMaintenancePlan]=useState('Discuss with Veltrix');
 const [budget,setBudget]=useState('EGP 40,000–60,000');
 const [timeline,setTimeline]=useState('1–3 months');
 const [launchDate,setLaunchDate]=useState('');
 const [audience,setAudience]=useState('');
 const [competitors,setCompetitors]=useState('');
 const [references,setReferences]=useState('');
 const [contentReady,setContentReady]=useState('Some content is ready');
 const [uploads,setUploads]=useState([]);
 const [details,setDetails]=useState('');
 const [consultation,setConsultation]=useState('Yes, contact me to arrange a call');
 const [name,setName]=useState('');
 const [email,setEmail]=useState('');
 const [phone,setPhone]=useState('');
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState('');
 const [done,setDone]=useState(false);
 const steps=['Project','Goals','Design','Structure','Integrations','Plan','Review'];
 const toggleValue=(value,list,setter)=>toggle(value,list,setter);
 const estimate=useMemo(()=>{
   let amount=project==='E-commerce store'?42000:project==='Educational platform'||project==='Web application'?49000:project==='Personal portfolio'?30000:35000;
   amount+=Math.max(0,pageCount-5)*1800;
   amount+=features.length*1800;
   amount+=integrationsSelected.length*900;
   if(features.some(x=>x.toLowerCase().includes('ai')))amount+=6500;
   return Math.round(amount/1000)*1000;
 },[project,pageCount,features,integrationsSelected]);
 const recommendation=estimate>=65000||features.length>=9?'Elite':estimate>=42000||features.length>=5?'Professional':'Starter';
 const summary=useMemo(()=>[
   'PROJECT DISCOVERY BRIEF','',
   'Project: '+project,'Goals: '+(goalsSelected.join(', ')||'To discuss'),
   'Audience: '+(audience||'To discuss'),'Design style: '+style,'Color direction: '+palette,
   'Device priorities: '+devicesSelected.join(', '),'Languages: '+languagesSelected.join(', '),
   'Pages / sections: '+pagesSelected.join(', '),'Estimated page count: '+pageCount,
   'Features: '+(features.join(', ')||'To discuss'),'Integrations: '+(integrationsSelected.join(', ')||'To discuss'),
   'Content readiness: '+contentReady,'References: '+(references||'None provided'),
   'Competitors / inspiration: '+(competitors||'None provided'),'Reference files: '+(uploads.join(', ')||'None'),
   'Budget: '+budget,'Preferred timeline: '+timeline,'Target launch: '+(launchDate||'Flexible'),
   'Care plan: '+maintenancePlan,'Consultation: '+consultation,
   details?'Additional notes: '+details:''
 ].filter(Boolean).join('\n'),[project,goalsSelected,audience,style,palette,devicesSelected,languagesSelected,pagesSelected,pageCount,features,integrationsSelected,contentReady,references,competitors,uploads,budget,timeline,launchDate,maintenancePlan,consultation,details]);
 const canContinue=step===0?!!project:step===1?goalsSelected.length>0:step===3?pagesSelected.length>0:true;
 const submit=async e=>{
   e.preventDefault();setError('');
   if(!db){setError('The enquiry service is not connected yet. Please contact Veltrix directly.');return}
   setBusy(true);
   const message=summary+'\n\nEstimated range (indicative): EGP '+estimate.toLocaleString('en-US')+'\nSuggested package: '+recommendation+'\nContact preference: '+consultation;
   const {error:dbError}=await db.from('leads').insert({name:name.trim(),email:email.trim(),whatsapp:phone.trim()||null,service_type:project,package_name:recommendation+' — project discovery',concept_name:project,message,status:'New'});
   setBusy(false);
   if(dbError){setError('We could not send your project brief. Please try again or contact Veltrix directly.');return}
   setDone(true);
 };
 const next=()=>setStep(v=>Math.min(6,v+1));
 return <main className="vx-inner vx-wizard-page">
  <button className="vx-back" onClick={onClose}><ArrowLeft size={15}/> Back to showcase</button>
  <div className="vx-kicker">VELTRIX / PROJECT DISCOVERY</div>
  {done?<section className="vx-wizard-success"><span><Check size={28}/></span><div className="vx-kicker">BRIEF RECEIVED</div><h1>Your next idea<br/><em>starts here.</em></h1><p>Thank you, {name}. Your project brief has been sent to Veltrix. Our team can review it from the Admin enquiries dashboard.</p><button className="vx-btn-dark" onClick={onClose}>Back to showcase <ArrowRight size={16}/></button></section>:<>
   <div className="vx-wizard-heading"><div><h1 className="vx-inner-title">Let’s build something <em>meaningful.</em></h1><p className="vx-inner-intro">A guided project builder that turns your idea into a clear brief, suggested package and indicative estimate.</p></div><div className="vx-wizard-count"><b>0{step+1}</b><span> / 07</span></div></div>
   <div className="vx-wizard-progress" aria-label={'Step '+(step+1)+' of 7'}>{steps.map((s,i)=><div key={s} className={i<=step?'active':''}><i/><span>{s}</span></div>)}</div>
   <section className="vx-wizard-card">
    <div className="vx-wizard-stephead"><span>STEP 0{step+1} / 07</span><h2>{['What are we creating?','What should it help you achieve?','What should it feel like?','Build your website structure.','What should connect to it?','Set your budget and timeline.','Review your project brief.'][step]}</h2><p>{['Choose the closest project type. We can refine the details together.','Select the outcomes that matter most.','Choose a visual direction and device priorities.','Pick the pages and capabilities you may need.','Select external services and languages.','These details help us suggest a sensible starting scope.','Check your selections and send your brief to Veltrix.'][step]}</p></div>
    {step===0&&<div className="vx-wizard-types">{projectTypes.map(item=>{const Icon=item.icon;return <button type="button" key={item.id} className={project===item.id?'selected':''} onClick={()=>setProject(item.id)}><Icon/><b>{item.label}</b><span>{item.desc}</span>{project===item.id&&<Check className="vx-wizard-check"/>}</button>})}</div>}
    {step===1&&<div className="vx-wizard-choicegrid">
      <Field label="Your target audience"><input value={audience} onChange={e=>setAudience(e.target.value)} placeholder="e.g. parents, students, business owners"/></Field>
      <Field label="Project goals" wide><ChoiceList items={goals} value={goalsSelected} onChange={setGoalsSelected}/></Field>
    </div>}
    {step===2&&<div className="vx-wizard-choicegrid">
      <Field label="Visual style"><select value={style} onChange={e=>setStyle(e.target.value)}>{styles.map(x=><option key={x}>{x}</option>)}</select></Field>
      <Field label="Color direction"><select value={palette} onChange={e=>setPalette(e.target.value)}>{palettes.map(x=><option key={x}>{x}</option>)}</select></Field>
      <Field label="Device priorities" wide><ChoiceList items={devices} value={devicesSelected} onChange={setDevicesSelected}/></Field>
      <Field label="Brand assets"><select value={contentReady} onChange={e=>setContentReady(e.target.value)}>{['Everything is ready','Some content is ready','I need help creating content','I need branding as well'].map(x=><option key={x}>{x}</option>)}</select></Field>
      <Field label="Upload inspiration (images, PDF, logo)"><input type="file" multiple accept="image/*,.pdf,.svg" onChange={e=>setUploads(Array.from(e.target.files||[]).map(f=>f.name))}/></Field>
      <Field label="Reference website links" wide><textarea rows="2" value={references} onChange={e=>setReferences(e.target.value)} placeholder="Paste links to websites you like (one per line)"/></Field>
    </div>}
    {step===3&&<div className="vx-wizard-structure">
      <div className="vx-wizard-pages"><div><b>How many pages or main sections?</b><span>Adjust the estimate to match your scope.</span></div><div><button type="button" onClick={()=>setPageCount(v=>Math.max(1,v-1))} aria-label="Fewer pages"><Minus/></button><strong>{pageCount}</strong><button type="button" onClick={()=>setPageCount(v=>Math.min(40,v+1))} aria-label="More pages"><Plus/></button></div></div>
      <p className="vx-wizard-sub-label">Choose the pages you expect to need</p><ChoiceList items={pages} value={pagesSelected} onChange={setPagesSelected}/>
      <p className="vx-wizard-sub-label">Choose the functionality you may need</p>{featureGroups.map(group=><div className="vx-wizard-feature-group" key={group.title}><h3>{group.title}</h3><ChoiceList items={group.items} value={features} onChange={setFeatures}/></div>)}
    </div>}
    {step===4&&<div className="vx-wizard-choicegrid">
      <Field label="Integrations and connected services" wide><ChoiceList items={integrations} value={integrationsSelected} onChange={setIntegrationsSelected}/></Field>
      <Field label="Website languages"><ChoiceList items={languages} value={languagesSelected} onChange={setLanguagesSelected}/></Field>
      <Field label="Ongoing maintenance"><select value={maintenancePlan} onChange={e=>setMaintenancePlan(e.target.value)}>{maintenance.map(x=><option key={x}>{x}</option>)}</select></Field>
      <Field label="Competitor websites / inspiration" wide><textarea rows="3" value={competitors} onChange={e=>setCompetitors(e.target.value)} placeholder="Add competitor names or website URLs"/></Field>
    </div>}
    {step===5&&<div className="vx-wizard-choicegrid">
      <Field label="Approximate budget"><select value={budget} onChange={e=>setBudget(e.target.value)}>{budgets.map(x=><option key={x}>{x}</option>)}</select></Field>
      <Field label="Preferred timeline"><select value={timeline} onChange={e=>setTimeline(e.target.value)}>{timelines.map(x=><option key={x}>{x}</option>)}</select></Field>
      <Field label="Target launch date"><input type="date" value={launchDate} onChange={e=>setLaunchDate(e.target.value)}/></Field>
      <Field label="Would you like a consultation?"><select value={consultation} onChange={e=>setConsultation(e.target.value)}><option>Yes, contact me to arrange a call</option><option>No, email follow-up is fine</option><option>Not sure yet</option></select></Field>
      <Field label="Anything else we should know?" wide><textarea rows="4" maxLength="3000" value={details} onChange={e=>setDetails(e.target.value)} placeholder="Tell us about your idea, requirements, constraints or expectations..."/></Field>
      <div className="vx-wizard-estimate wide"><div><span>INDICATIVE PROJECT ESTIMATE</span><strong>EGP {estimate.toLocaleString('en-US')}</strong><small>Planning estimate only; final pricing follows discovery.</small></div><div><span>SUGGESTED PACKAGE</span><strong>{recommendation}</strong><small>Based on the selected project scope.</small></div></div>
    </div>}
    {step===6&&<div className="vx-wizard-review">
      <div className="vx-wizard-estimate"><div><span>INDICATIVE PROJECT ESTIMATE</span><strong>EGP {estimate.toLocaleString('en-US')}</strong><small>Not a fixed quotation.</small></div><div><span>VELTRIX RECOMMENDS</span><strong>{recommendation}</strong><small>We will confirm after reviewing your brief.</small></div></div>
      <div className="vx-wizard-review-grid">{[['Project',project],['Goals',goalsSelected.join(', ')],['Design',style+' · '+palette],['Structure',pagesSelected.join(', ')],['Features',features.join(', ')],['Integrations',integrationsSelected.join(', ')],['Budget & timing',budget+' · '+timeline],['Care',maintenancePlan]].map(([label,value])=><article key={label}><small>{label}</small><p>{value||'To discuss'}</p></article>)}</div>
      <div className="vx-wizard-summary"><b>Full project brief</b><p>{summary}</p></div>
      <form className="vx-wizard-contact" onSubmit={submit}>
        <Field label="Your name"><input required maxLength="120" value={name} onChange={e=>setName(e.target.value)} placeholder="Full name"/></Field>
        <Field label="Email address"><input required type="email" maxLength="254" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></Field>
        <Field label="Phone / WhatsApp (optional)"><input maxLength="40" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+20 ..."/></Field>
        <div className="vx-wizard-contact-submit"><p>By sending this brief, you are requesting a follow-up from Veltrix. This is not a binding order.</p>{error&&<p className="vx-wizard-error" role="alert">{error}</p>}<button className="vx-btn-dark" disabled={busy}>{busy?'Sending your brief…':'Send project brief'} <Send size={16}/></button></div>
      </form>
    </div>}
    <div className="vx-wizard-actions">{step>0&&<button type="button" className="vx-wizard-back" onClick={()=>setStep(v=>v-1)}><ArrowLeft/> Back</button>}{step<6&&<button type="button" className="vx-btn-dark" disabled={!canContinue} onClick={next}>Continue <ArrowRight size={16}/></button>}{step===6&&<button type="button" className="vx-wizard-back" onClick={()=>setStep(5)}>Edit budget & timing</button>}</div>
   </section>
   <p className="vx-wizard-footnote"><span><Check size={14}/> No commitment required</span><span><Check size={14}/> Your brief stays private</span><span><Check size={14}/> Final scope confirmed together</span></p>
  </>}
 </main>;
}
