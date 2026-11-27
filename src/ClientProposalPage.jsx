import React,{useEffect,useMemo,useState} from 'react';
import {ArrowRight,ArrowUpRight,BookOpen,Calculator,Check,ChevronRight,GraduationCap,Sparkles,Users,ChartNoAxesCombined,ShieldCheck,Send,LockKeyhole,Copy,X,LogIn} from 'lucide-react';
import './client-proposal.css';
import ProposalTemplateExperience from './ProposalTemplateExperience.jsx';

export default function ClientProposalPage({db,slug,id}){
 const [proposal,setProposal]=useState(null),[loading,setLoading]=useState(true),[error,setError]=useState(''),[packageChoice,setPackageChoice]=useState(''),[careChoice,setCareChoice]=useState(''),[clientName,setClientName]=useState(''),[clientEmail,setClientEmail]=useState(''),[message,setMessage]=useState(''),[busy,setBusy]=useState(false),[notice,setNotice]=useState(''),[credentials,setCredentials]=useState(null),[welcomeVisible,setWelcomeVisible]=useState(false),[pendingResponseId,setPendingResponseId]=useState(null),[noticeType,setNoticeType]=useState(''),[verificationPending,setVerificationPending]=useState(false),[emailVerified,setEmailVerified]=useState(false),[verificationCode,setVerificationCode]=useState('');
 useEffect(()=>{let live=true;(async()=>{if(!db){if(live){setError('This proposal is temporarily unavailable. Please contact Veltrix.');setLoading(false)}return}const{data,error}=await db.from('client_proposals').select('id,slug,client_name,business_name,project_title,template_id,status,proposal_data,published_at,created_at,updated_at').eq(id?'id':'slug',id||slug).eq('status','published').maybeSingle();if(!live)return;if(error||!data){setError('We could not find this proposal. Please check the link or contact Veltrix.')}else{setProposal(data);setClientName(data.client_name||'');setClientEmail('');setWelcomeVisible(true)}setLoading(false)})();return()=>{live=false}},[db,slug,id]);
 useEffect(()=>{if(!proposal?.id)return;const timer=window.setTimeout(()=>setWelcomeVisible(false),3200);return()=>window.clearTimeout(timer)},[proposal?.id]);
 const data=proposal?.proposal_data||{},packages=Array.isArray(data.packages)?data.packages:[],carePlans=Array.isArray(data.carePlans)?data.carePlans:[];
 const logoUrl=(()=>{try{const parsed=new URL(data.logoUrl||'');return ['http:','https:'].includes(parsed.protocol)?parsed.href:''}catch{return ''}})();
 const brandColor=/^#[0-9a-f]{6}$/i.test(data.brandColor||'')?data.brandColor:'#7d986a';
 const chosenPackage=packages.find(p=>p.name===packageChoice),chosenCare=carePlans.find(p=>p.name===careChoice);
 const money=n=>n===null||n===undefined||n===''?'Custom quote':'EGP '+Number(n).toLocaleString('en-US');
 const resendVerification=async()=>{if(!pendingResponseId||!db)return;setBusy(true);const{data,error}=await db.functions.invoke('verify-proposal-email',{body:{action:'send',response_id:pendingResponseId}});if(error||!data?.ok){setNotice(data?.error||'We could not send a new verification code. Please try again later.');setNoticeType('verify')}else{setNotice('A new six-digit verification code has been sent to your email.');setNoticeType('verify')}setBusy(false)};
 const submit=async e=>{
  e.preventDefault();
  if(!pendingResponseId&&(!chosenPackage||!chosenCare)){setNotice('Please choose one website package and one care plan.');setNoticeType('selection');return}
  if(!pendingResponseId&&(!clientName.trim()||!clientEmail.trim())){setNotice('Enter your name and email address to continue.');setNoticeType('selection');return}
  if(!db){setNotice('We cannot connect to the proposal service right now. Please try again.');setNoticeType('connection');return}
  setBusy(true);setNotice('');setNoticeType('');
  let responseId=pendingResponseId;
  try{
   if(!responseId){
    const{data:response,error:saveError}=await db.rpc('submit_client_proposal_response',{
     p_proposal_id:proposal.id,p_client_name:clientName.trim(),p_client_email:clientEmail.trim(),
     p_selected_package:chosenPackage.name,p_package_price:Number(chosenPackage.price),
     p_selected_care_plan:chosenCare.name,p_care_price:chosenCare.price===null||chosenCare.price===undefined?null:Number(chosenCare.price),
     p_message:message.trim()||null
    });
    if(saveError||!response){
     const detail=saveError?.message||'';
     const invalid=/package|care plan|selection|published/i.test(detail);
     setNotice(invalid?'One of your selected options is no longer available. Please review the proposal and choose again.':'We could not save your choices. Please check your connection and try again.');
     setNoticeType(invalid?'selection':'connection');setBusy(false);return;
    }
    responseId=response;setPendingResponseId(responseId);
   }
   if(!emailVerified){
    if(!verificationPending){
     const{data:sent,error:sendError}=await db.functions.invoke('verify-proposal-email',{body:{action:'send',response_id:responseId}});
     if(sendError||!sent?.ok){setNotice(sent?.error||sendError?.message||'We could not send the verification code. Please try again.');setNoticeType('verify');setBusy(false);return}
     setVerificationPending(true);setNotice('We sent a six-digit verification code to your email address. Enter it below to verify ownership and continue.');setNoticeType('verify');setBusy(false);return;
    }
    const{data:verified,error:verifyError}=await db.functions.invoke('verify-proposal-email',{body:{action:'verify',response_id:responseId,code:verificationCode}});
    if(verifyError||!verified?.ok){setNotice(verified?.error||verifyError?.message||'We could not verify that code. Please try again.');setNoticeType('verify');setBusy(false);return}
    setEmailVerified(true);setVerificationPending(false);
   }
   const{data:account,error:accountError}=await db.functions.invoke('provision-proposal-client',{body:{response_id:responseId}});
   if(accountError||!account?.ok){
    const detail=String(account?.error||accountError?.message||'');
    console.error('Client account provisioning failed:',detail);
    const existing=/already exists|already registered|user_already_exists|email.*exists/i.test(detail);
    setNotice(existing?'An account with this email already exists. Please sign in to your client portal or reset your password. Your proposal choices are safely saved.':'Your email is verified and your choices are saved, but we could not create your portal account right now. You can try again without submitting a duplicate.');
    setNoticeType(existing?'existing':'account');setBusy(false);return;
   }
   setCredentials({name:account.client_name,username:account.username,password:account.temporary_password});
   setPendingResponseId(null);setPackageChoice('');setCareChoice('');setEmailVerified(false);setVerificationPending(false);setVerificationCode('');
   try{
    const{data:notificationData,error:notificationError}=await db.functions.invoke('proposal-notifications',{body:{action:'notify',response_id:responseId}});
    if(notificationError||notificationData?.results?.email!=='sent'){
     console.warn('Proposal email notification was not confirmed:',notificationError?.message||notificationData?.results?.email);
     setNotice('Your portal account is ready. Veltrix will review your selection shortly.');
    }else setNotice('Your choices were submitted and Veltrix has been notified.');
   }catch(notificationError){console.warn('Proposal notification failed:',notificationError);setNotice('Your portal account is ready. Veltrix will review your selection shortly.')}
  }catch(err){
   console.error('Proposal submission failed:',err);
   setNotice(responseId?'Your choices are saved. Please try the email verification or account setup step again.':'We could not connect to the server. Your choices have not been confirmed; please try again.');
   setNoticeType(responseId?'verify':'connection');
  }
  setBusy(false);
 };
 if(loading)return <main className="client-proposal-state"><div className="cp-loader"/><p>Preparing your proposal…</p></main>;
 if(error)return <main className="client-proposal-state"><div className="cp-error-mark">v.</div><h1>Proposal unavailable</h1><p>{error}</p><a href="/">Visit Veltrix <ArrowUpRight size={15}/></a></main>;
 if(welcomeVisible&&proposal)return <main className="cp-welcome-screen" aria-live="polite"><div className="cp-welcome-inner"><span className="cp-kicker">A PERSONAL WELCOME FROM VELTRIX</span><div className="cp-welcome-mark">v.</div><h1>Welcome, <em>{proposal.client_name||'there'}</em></h1><p>Your personalized proposal is ready. Take a moment to explore what we have prepared for you.</p><span className="cp-welcome-progress"><i/></span><small>PREPARING YOUR EXPERIENCE</small></div></main>;
 if(proposal.template_id!=='sat') return <><ProposalTemplateExperience proposal={proposal} data={data} packages={packages} carePlans={carePlans} logoUrl={logoUrl} brandColor={brandColor} money={money} packageChoice={packageChoice} setPackageChoice={setPackageChoice} careChoice={careChoice} setCareChoice={setCareChoice} chosenPackage={chosenPackage} chosenCare={chosenCare} clientName={clientName} setClientName={setClientName} clientEmail={clientEmail} setClientEmail={setClientEmail} message={message} setMessage={setMessage} busy={busy} submit={submit} notice={notice} noticeType={noticeType} verificationPending={verificationPending} verificationCode={verificationCode} setVerificationCode={setVerificationCode} resendVerification={resendVerification} pendingResponseId={pendingResponseId}/>{credentials&&<AccountCreatedModal credentials={credentials} onClose={()=>setCredentials(null)}/>}</>;
 return <main className="client-proposal" style={{'--cp-accent':brandColor}}>
  <header className="cp-nav"><a href="/" className="cp-brand">{logoUrl?<img src={logoUrl} alt={proposal.business_name+" logo"}/>:<b>{proposal.business_name.slice(0,1).toUpperCase()}</b>} {proposal.business_name}</a><nav><a href="#learning">The experience</a><a href="#platform">Platform</a><a href="#pricing">Packages</a></nav><a className="cp-nav-cta" href="#pricing">View packages <ArrowUpRight size={15}/></a></header>
  <section className="cp-hero"><div className="cp-hero-copy"><div className="cp-kicker">A PERSONALIZED PROPOSAL / PREPARED FOR {proposal.client_name.toUpperCase()} / {proposal.project_title.toUpperCase()}</div><h1>{data.heroTitle||'Words matter.'}<br/><em>{data.heroAccent||'Make every one count.'}</em></h1><p>{data.intro||'Build reading confidence, sharpen writing and master the skills behind every great SAT score.'}</p><div className="cp-actions"><a className="cp-button-dark" href="#learning">Explore the experience <ArrowRight size={16}/></a><a className="cp-text-link" href="#pricing">See packages & pricing <ArrowUpRight size={15}/></a></div><div className="cp-proof"><span><b>4.9/5</b><small>LEARNER EXPERIENCE</small></span><span><b>1:1</b><small>PERSONAL GUIDANCE</small></span><span><b>100%</b><small>FOCUSED ON PROGRESS</small></span></div></div>
   <div className="cp-roadmap"><div className="cp-roadmap-top"><span>YOUR SAT ROADMAP</span><span>2026 / 27</span></div><div className="cp-roadmap-main"><div className="cp-ring">EN</div><div><small>YOUR LEARNING PATH</small><b>{proposal.business_name} English Mastery</b><p>Personalized. Focused. Measurable.</p></div></div><div className="cp-roadmap-steps"><span><i/> Skill foundations <b>Complete</b></span><span><i/> Guided practice <b>In progress</b></span><span><i/> Full mock exam <b>Up next</b></span></div><div className="cp-roadmap-foot"><span><Sparkles size={14}/> SMALL STEPS. BIG PROGRESS.</span><b>01 / 04</b></div><div className="cp-float cp-float-one"><Check size={15}/> Weekly goal on track</div><div className="cp-float cp-float-two"><BookOpen size={15}/> Reading practice ready</div></div>
  </section>
  <section className="cp-intro-band" id="learning"><div><span className="cp-kicker">LEARN WITH A PLAN</span><h2>A clearer path to your <em>target score.</em></h2><p>Structured lessons, focused practice and progress insights designed to help students feel prepared and supported.</p></div><div className="cp-skill-list">{['Reading comprehension','Craft and structure','Expression of ideas','Standard English conventions'].map((x,i)=><div><span>0{i+1}</span>{x}<Check size={16}/></div>)}</div></section>
  <section className="cp-pathways"><div className="cp-section-heading"><div><span className="cp-kicker">A SMARTER WAY TO PREPARE</span><h2>Everything you need.<br/><em>One clear learning path.</em></h2></div><p>From understanding a concept to feeling confident under timed conditions, every part of the experience has a purpose.</p></div><div className="cp-path-grid">{[['01','Reading & comprehension','Understand passages, identify evidence and read with purpose.'],['02','Writing & language','Build stronger sentences and master grammar in context.'],['03','Practice by skill','Focus on the exact question types that need attention.'],['04','Timed mock exams','Turn preparation into confident test-day performance.']].map(([n,t,d])=><article><span>{n}</span><div><h3>{t}</h3><p>{d}</p></div><ArrowUpRight size={17}/></article>)}</div></section>
  <section className="cp-platform" id="platform"><div className="cp-platform-copy"><span className="cp-kicker">BUILT AROUND REAL PROGRESS</span><h2>A learning space that keeps everyone <em>moving forward.</em></h2><p>Students get a clear view of what to learn next. Tutors get the tools to guide lessons, create practice and understand progress.</p><div className="cp-role-list"><div><BookOpen/><span><b>Student learning space</b><small>Courses, assignments, practice sets and progress tracking.</small></span></div><div><Users/><span><b>Teacher workspace</b><small>Class management, question banks and student insights.</small></span></div><div><Sparkles/><span><b>AI-powered support</b><small>Personal Study Coach and AI Presentation Generator in the Professional plan.</small></span></div></div></div><div className="cp-dashboard"><div className="cp-dash-top"><span>● ● ●　 STUDENT DASHBOARD</span><small>DEMO PREVIEW</small></div><small>GOOD MORNING, ALEX</small><h3>Your next step is clear.</h3><p>Keep your momentum going.</p><div className="cp-kpis"><div><small>WEEKLY STUDY</small><b>06.5 <i>hrs</i></b></div><div><small>SKILL MASTERY</small><b>78<i>%</i></b></div><div><small>STREAK</small><b>08 <i>days</i></b></div></div><div className="cp-next"><span><small>CONTINUE LEARNING</small><b>Reading: Evidence & Inference</b><small>Lesson 04 · 18 min remaining</small></span><ArrowUpRight/></div><div className="cp-goal"><small>YOUR WEEKLY GOAL</small><b>4 of 5 sessions</b><div><i/></div></div><div className="cp-dash-foot"><span><Sparkles size={14}/> Your Study Coach is ready</span><span>Preview interface</span></div></div></section>
  <section className="cp-tools"><div className="cp-section-heading"><div><span className="cp-kicker">THE RIGHT TOOLS, AT EVERY STEP</span><h2>More than lessons.<br/><em>A complete SAT experience.</em></h2></div><p>One connected experience for students, tutors and academy teams.</p></div><div className="cp-tool-grid"><article><BookOpen/><h3>Structured courses</h3><p>Organized topics and lessons that make preparation easier to follow.</p></article><article><Calculator/><h3>Practice library</h3><p>Question sets and mock exams to build accuracy, confidence and timing.</p></article><article><ChartNoAxesCombined/><h3>Progress insights</h3><p>See strengths, identify gaps and make the next study session count.</p></article><article><GraduationCap/><h3>Personal AI Study Coach</h3><p>Extra guidance to help students stay organized and keep learning moving.</p></article></div></section>
  <section className="cp-pricing-intro"><span className="cp-kicker">READY WHEN YOU ARE</span><h2>Make your next SAT goal <em>feel achievable.</em></h2><p>Explore the packages and choose the learning experience that fits your goals.</p><a className="cp-button-light" href="#pricing">Explore packages <ArrowUpRight size={15}/></a></section>
  <section className="cp-pricing" id="pricing"><div className="cp-section-heading"><div><span className="cp-kicker">CLEAR OPTIONS / TRANSPARENT PRICING</span><h2>Choose the right <em>starting point.</em></h2><p>Every package is a one-time project price in Egyptian pounds. Choose a package and tell us what you need.</p></div><span className="cp-price-note">EGP · ONE-TIME</span></div><div className="cp-package-grid">{packages.map(p=><article className={p.featured?'featured':''}><div className="cp-package-head">{p.featured&&<span>MOST POPULAR</span>}<small>VELTRIX PACKAGE</small><h3>{p.name}</h3><p>{p.description||''}</p></div><div className="cp-price"><b>{money(p.price)}</b><small>one-time payment</small></div><ul>{(p.features||[]).map(f=><li><Check size={14}/>{f}</li>)}</ul><button type="button" className={packageChoice===p.name?'selected':''} onClick={()=>setPackageChoice(p.name)}>{packageChoice===p.name?'Selected':'Choose '+p.name} <Check size={15}/></button></article>)}</div>
   <div className="cp-care-heading"><span className="cp-kicker">ONGOING WEBSITE CARE</span><h3>Choose your monthly care plan.</h3><p>This is a separate choice from your website package.</p></div><div className="cp-care-grid">{carePlans.map(p=><button type="button" className={careChoice===p.name?'selected':''} onClick={()=>setCareChoice(p.name)}><span><b>{p.name}</b><small>{p.name==='Basic Care'?'Essential ongoing website care':'Comprehensive ongoing website care'}</small></span><strong>{money(p.price)}<small> / month</small></strong>{careChoice===p.name&&<Check size={18}/>}</button>)}</div>
   <form className="cp-response" onSubmit={submit}><div><span className="cp-kicker">YOUR DECISION</span><h3>Let's take the next step.</h3><p>Your selected package and care plan will be sent directly to Veltrix.</p></div><div className="cp-form-grid"><label>Your name<input required maxLength="120" readOnly={!!pendingResponseId} value={clientName} onChange={e=>setClientName(e.target.value)} placeholder="Your full name"/></label><label>Email address<input required type="email" maxLength="254" readOnly={!!pendingResponseId} value={clientEmail} onChange={e=>setClientEmail(e.target.value)} placeholder="you@example.com"/></label><label className="wide">Anything you'd like us to know? <textarea rows="3" maxLength="2000" value={message} onChange={e=>setMessage(e.target.value)} placeholder="Questions, preferences or notes…"/></label>{verificationPending&&<label className="wide">Six-digit email verification code<input required inputMode="numeric" autoComplete="one-time-code" maxLength="6" value={verificationCode} onChange={e=>setVerificationCode(e.target.value)} placeholder="Enter the code sent to your email"/></label>}</div><div className="cp-submit-row"><span>{chosenPackage?chosenPackage.name+' · '+money(chosenPackage.price):'Choose a package'}<i>+</i>{chosenCare?chosenCare.name+' · '+money(chosenCare.price)+'/month':'Choose a care plan'}</span><button type="submit" disabled={busy||(!pendingResponseId&&(!chosenPackage||!chosenCare))}>{busy?'Please wait…':verificationPending?'Verify email & continue':pendingResponseId?'Continue account setup':'Submit my choices'} <Send size={15}/></button></div>{verificationPending&&<button type="button" className="cp-text-link" onClick={resendVerification} disabled={busy}>Resend verification code</button>}{notice&&<ProposalNotice notice={notice} type={noticeType} busy={busy}/>}<small className="cp-privacy"><LockKeyhole size={13}/> Your details and selection are shared only with Veltrix for this proposal.</small></form>
  </section>
  {credentials&&<AccountCreatedModal credentials={credentials} onClose={()=>setCredentials(null)}/>}
  <footer className="cp-footer"><a href="/" className="cp-brand">{logoUrl?<img src={logoUrl} alt={proposal.business_name+" logo"}/>:<b>v.</b>} VELTRIX</a><p>Thoughtful digital experiences, built around people.</p><span>© 2026 VELTRIX STUDIO · PROPOSAL FOR {proposal.business_name.toUpperCase()}</span></footer>
 </main>;
}


function AccountCreatedModal({credentials,onClose}){
 const [copied,setCopied]=useState('');
 const copy=async(value,key)=>{try{await navigator.clipboard.writeText(value);setCopied(key);window.setTimeout(()=>setCopied(''),1800)}catch{setCopied('')}};
 return <div className="cp-account-overlay" role="dialog" aria-modal="true" aria-labelledby="cp-account-title">
  <section className="cp-account-modal">
   <button type="button" className="cp-account-close" onClick={onClose} aria-label="Close"><X size={18}/></button>
   <div className="cp-account-mark"><Check size={22}/></div>
   <span className="cp-kicker">YOUR CLIENT SPACE IS READY</span>
   <h2 id="cp-account-title">Welcome to <em>your portal.</em></h2>
   <p>Your package choices have been received and your private Veltrix account has been created.</p>
   <div className="cp-credential"><span>CLIENT NAME</span><b>{credentials.name}</b></div>
   <div className="cp-credential"><span>USERNAME / EMAIL</span><div><b>{credentials.username}</b><button type="button" onClick={()=>copy(credentials.username,'username')}><Copy size={14}/>{copied==='username'?'Copied':'Copy'}</button></div></div>
   <div className="cp-credential cp-password"><span>TEMPORARY PASSWORD</span><div><b>{credentials.password}</b><button type="button" onClick={()=>copy(credentials.password,'password')}><Copy size={14}/>{copied==='password'?'Copied':'Copy'}</button></div></div>
   <small className="cp-account-warning"><LockKeyhole size={14}/> Save these details now. This temporary password is shown only once; you will be asked to change it after your first login.</small>
   <a className="cp-account-open" href="/?portal=1">Open Portal <LogIn size={16}/></a>
   <button type="button" className="cp-account-later" onClick={onClose}>Stay on this proposal</button>
  </section>
 </div>;
}

function ProposalNotice({notice,type,busy}){
 return <div className={'cp-submit-notice cp-submit-notice-'+(type||'info')} role="status" aria-live="polite">
  <div className="cp-submit-notice-copy"><b>{type==='existing'?'An account already exists':type==='selection'?'Please review your selection':type==='connection'?'Connection problem':type==='account'?'Your choices are saved':type==='verify'?'Verify your email':'Update'}</b><p>{notice}</p></div>
  {type==='account'&&<button type="submit" disabled={busy}>Try account setup again</button>}{type==='verify'&&<p>Please check your inbox and spam folder. The code expires after 10 minutes.</p>}
  {type==='existing'&&<div className="cp-submit-notice-actions"><a href="/?portal=1">Go to Client Portal <LogIn size={14}/></a><a href="/?portal=1">Password help</a></div>}
  {type==='connection'&&<button type="submit" disabled={busy}>Try again</button>}
  {type==='selection'&&<a href="#pricing">Review proposal <ArrowUpRight size={14}/></a>}
 </div>;
}
