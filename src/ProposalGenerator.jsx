import React,{useMemo,useState} from 'react';
import {Copy,MessageCircle,Mail,Hash,Check,Sparkles,Eye,Plus,ArrowUpRight} from 'lucide-react';
import './proposal-generator.css';

const templates=[
 {id:'sat',name:'SAT / English Tutor Website',category:'Education',description:'A complete learning platform proposal with the approved SAT packages.',image:'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=900&q=80',packages:[{name:'Starter',price:39000,features:['Professional website','Student and teacher dashboards','SAT English and Math course areas','Lessons, assignments and quizzes','Responsive design']},{name:'Professional',price:49000,featured:true,features:['Everything in Starter','Course and class management','Mock exams and question banks','Student progress analytics','Personal AI Study Coach','AI Presentation Generator']},{name:'Elite',price:60000,features:['Everything in Professional','Advanced AI Student Assistant','AI Teacher Agent','AI assignment feedback','Advanced learning insights']}]},
 {id:'ecommerce',name:'E-commerce Website',category:'Online store',description:'A fashion-led online store inspired by the SALTY Egypt visual direction.',image:'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80',packages:[{name:'Starter',price:32000,features:['Custom storefront design','Product catalogue','Product detail pages','Responsive shopping experience']},{name:'Professional',price:44000,featured:true,features:['Everything in Starter','Shopping cart and checkout flow','Product categories and search','Order management interface','Promotional sections']},{name:'Elite',price:55000,features:['Everything in Professional','Advanced product filtering','Promotions and offers','Sales analytics interface','Enhanced integrations']}]}
];

export default function ProposalGenerator(){
 const [templateId,setTemplateId]=useState('sat');
 const template=useMemo(()=>templates.find(x=>x.id===templateId)||templates[0],[templateId]);
 const [pricingDecision,setPricingDecision]=useState(null);
 const [clientName,setClientName]=useState('');
 const [businessName,setBusinessName]=useState('');
 const [clientEmail,setClientEmail]=useState('');
 const [projectTitle,setProjectTitle]=useState('');
 const [intro,setIntro]=useState('We have prepared a tailored digital experience to help your business grow.');
 const [selectedPackage,setSelectedPackage]=useState('Professional');
 const [care,setCare]=useState('Basic Care');
 const [carePrice,setCarePrice]=useState('4000');
 const [customPrice,setCustomPrice]=useState('');
 const [generated,setGenerated]=useState(null);
 const [notice,setNotice]=useState('');
 const [message,setMessage]=useState('');
 const selected=template.packages.find(p=>p.name===selectedPackage)||template.packages[1];
 const price=customPrice!==''?Number(customPrice):selected.price;
 const makeMessage=()=>`Hello ${clientName||'there'}! 👋

We've prepared a personalized website proposal for ${businessName||'your business'}.

Explore the proposed solution, design direction, features and package details here:
${generated?.url||'[Proposal link]'}

We look forward to hearing what you think!

— Veltrix Team`;
 const createDraft=()=>{
  if(!clientName.trim()||!businessName.trim()){setNotice('Please add the client name and business name first.');return}
  const token=globalThis.crypto?.randomUUID?.().replace(/-/g,'').slice(0,16)||Math.random().toString(36).slice(2,18);
  const url=window.location.origin+'/proposal/'+token;
  const record={id:token,url,clientName:clientName.trim(),businessName:businessName.trim(),clientEmail:clientEmail.trim(),projectTitle:projectTitle.trim()||template.name,template:template.name,package:selectedPackage,price,care,carePrice:Number(carePrice)||0,intro,createdAt:new Date().toISOString(),status:'Draft'};
  setGenerated(record);setMessage('');setNotice('Proposal draft created. The public proposal page still needs its publishing backend before this link can be opened by clients.');
 };
 const copy=async value=>{try{await navigator.clipboard.writeText(value);setNotice('Copied to clipboard.')}catch{setNotice('Clipboard access was blocked. Please copy the text manually.')}};
 const shareText=message||makeMessage();
 const shareWhatsApp=()=>{if(!generated)return;window.open('https://wa.me/?text='+encodeURIComponent(shareText),'_blank','noopener,noreferrer')};
 const shareDiscord=()=>copy(shareText);
 const shareEmail=()=>{if(!generated)return;const subject='Your personalized website proposal | Veltrix';window.location.href='mailto:'+encodeURIComponent(clientEmail)+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(shareText)};
 return <div className="vx-proposal-generator">
  <div className="vx-proposal-generator-head"><div><div className="vx-kicker">VELTRIX / PROPOSAL STUDIO</div><h2>Build a proposal <em>in minutes.</em></h2><p>Choose a saved website template, personalize the client details, then prepare a share message.</p></div><span className="vx-proposal-generator-mark"><Sparkles size={20}/> TEMPLATE LIBRARY</span></div>
  <div className="vx-proposal-template-grid">{templates.map(item=><button type="button" key={item.id} className={'vx-proposal-template '+(templateId===item.id?'active':'')} onClick={()=>{setTemplateId(item.id);setSelectedPackage('Professional');setCustomPrice('');setPricingDecision(null);setGenerated(null);setNotice('')}}><img src={item.image} alt=""/><span className="vx-proposal-template-body"><small>{item.category}</small><b>{item.name}</b><span>{item.description}</span><i>{templateId===item.id?'Selected template':'Use this template'} <ArrowUpRight size={14}/></i></span></button>)}</div>
  {!pricingDecision&&<section className="vx-proposal-pricing-choice"><div className="vx-proposal-pricing-choice-copy"><span className="vx-kicker">NEXT STEP / PRICING</span><h3>Would you like to change the pricing?</h3><p>{template.name} comes with saved package prices. You can keep them as they are or customize this proposal without changing the original template.</p></div><div className="vx-proposal-pricing-choice-actions"><button type="button" className="vx-proposal-keep-prices" onClick={()=>{setPricingDecision('saved');setCustomPrice('')}}><Check size={17}/><span><b>No, keep saved prices</b><small>Continue with the template prices</small></span><ArrowUpRight size={16}/></button><button type="button" className="vx-proposal-change-prices" onClick={()=>setPricingDecision('custom')}><Plus size={17}/><span><b>Yes, customize pricing</b><small>Edit package prices and care fees</small></span><ArrowUpRight size={16}/></button></div></section>}
  {pricingDecision&&<div className="vx-proposal-pricing-mode"><span>{pricingDecision==='saved'?<Check size={15}/>:<Sparkles size={15}/>} {pricingDecision==='saved'?'Using saved template prices':'Custom pricing enabled'}</span><button type="button" onClick={()=>{setPricingDecision(null);setCustomPrice('')}}>Change pricing choice</button></div>}
  {pricingDecision&&<div className="vx-proposal-builder-grid">
   <section className="vx-proposal-builder-card"><div className="vx-proposal-card-title"><span>01</span><div><b>Client details</b><small>Personalize this proposal</small></div></div>
    <div className="vx-proposal-form-grid">
     <label>Client name<input value={clientName} onChange={e=>setClientName(e.target.value)} placeholder="e.g. Khaled Ahmed"/></label>
     <label>Business / brand name<input value={businessName} onChange={e=>setBusinessName(e.target.value)} placeholder="e.g. Khaled SAT Academy"/></label>
     <label>Email address <small>Optional — used to pre-fill email sharing</small><input type="email" value={clientEmail} onChange={e=>setClientEmail(e.target.value)} placeholder="client@example.com"/></label>
     <label>Proposal title<input value={projectTitle} onChange={e=>setProjectTitle(e.target.value)} placeholder={template.name}/></label>
     <label className="wide">Personal introduction<textarea rows="3" value={intro} onChange={e=>setIntro(e.target.value)}/></label>
    </div>
    <div className="vx-proposal-card-title package-title"><span>02</span><div><b>Choose a package</b><small>Default prices are preloaded from this template</small></div></div>
    <div className="vx-proposal-package-list">{template.packages.map(p=><button type="button" key={p.name} className={'vx-proposal-package '+(selectedPackage===p.name?'active':'')} onClick={()=>{setSelectedPackage(p.name);setCustomPrice('')}}><span>{p.featured&&<i>MOST POPULAR</i>}<b>{p.name}</b><small>{p.features.slice(0,3).join(' · ')}</small></span><strong>EGP {p.price.toLocaleString('en-US')}</strong>{selectedPackage===p.name&&<Check size={17}/>}</button>)}</div>
    <div className="vx-proposal-form-grid vx-proposal-price-fields">{pricingDecision==='custom'&&<label>Custom project price (EGP)<small>Leave blank to use the selected package price.</small><input type="number" min="0" value={customPrice} onChange={e=>setCustomPrice(e.target.value)} placeholder={String(selected.price)}/></label>}<label>Monthly care plan<select value={care} onChange={e=>setCare(e.target.value)}><option>Basic Care</option><option>Complete Care</option><option>No care plan</option></select></label>{care!=='No care plan'&&<label>{pricingDecision==='custom'?'Custom care plan price':'Saved care plan price'} (EGP / month)<input type="number" min="0" value={carePrice} onChange={e=>setCarePrice(e.target.value)} disabled={pricingDecision==='saved'}/></label>}</div>
    <button type="button" className="vx-btn-dark vx-proposal-create" onClick={createDraft}><Plus size={16}/> Create proposal draft <ArrowUpRight size={16}/></button>
    {notice&&<p className="vx-proposal-notice" role="status">{notice}</p>}
   </section>
   <aside className="vx-proposal-live-preview"><div className="vx-proposal-preview-top"><span><Eye size={15}/> LIVE SUMMARY</span><small>CLIENT VIEW CONCEPT</small></div><div className="vx-proposal-preview-cover"><img src={template.image} alt=""/><span>VELTRIX / PERSONALIZED PROPOSAL</span></div><div className="vx-proposal-preview-content"><small>PREPARED FOR</small><h3>{clientName||'Your client name'}</h3><p>{businessName||'Your business name'}</p><div className="vx-proposal-preview-divider"/><small>PROPOSED SOLUTION</small><h4>{projectTitle||template.name}</h4><p>{intro}</p><div className="vx-proposal-preview-price"><span>{selectedPackage}</span><b>EGP {price.toLocaleString('en-US')}</b></div><div className="vx-proposal-preview-price muted"><span>{care}</span><b>{care==='No care plan'?'—':'EGP '+(Number(carePrice)||0).toLocaleString('en-US')+'/mo'}</b></div><small className="vx-proposal-preview-template">{template.name} · Template content preloaded</small></div></aside>
  </div>}
  {generated&&<section className="vx-proposal-share-card"><div className="vx-proposal-share-heading"><div><div className="vx-kicker">03 / SHARE YOUR PROPOSAL</div><h3>Ready to share, {generated.clientName.split(' ')[0]}.</h3><p>Your proposal draft is saved in this browser session. Public publishing is the next backend step.</p></div><span className="vx-proposal-status-draft">DRAFT</span></div>
   <div className="vx-proposal-link-box"><div><small>PROPOSAL URL · NOT YET PUBLIC</small><b>{generated.url}</b></div><button type="button" disabled title="Available after public proposal publishing is connected"><Copy size={15}/> Copy link after publishing</button></div>
   <label className="vx-proposal-message-label">Message to send<textarea rows="7" value={message||makeMessage()} onChange={e=>setMessage(e.target.value)}/></label>
   <div className="vx-proposal-share-actions"><button type="button" disabled title="Available after public proposal publishing is connected"><MessageCircle/> WhatsApp</button><button type="button" disabled title="Available after public proposal publishing is connected"><Hash/> Copy for Discord</button><button type="button" disabled title="Available after public proposal publishing is connected"><Mail/> Email</button></div>
   <p className="vx-proposal-share-warning">Sharing is shown here as the intended workflow. Copying and sending will be enabled after we connect secure proposal storage, the public proposal page, and the publish action. This prevents sending a link that is not ready for your client.</p>
  </section>}
 </div>
}
