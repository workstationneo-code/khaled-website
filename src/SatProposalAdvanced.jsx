import React,{useMemo,useState} from 'react';
import {ArrowRight,BookOpen,Brain,CalendarDays,Check,ChevronRight,Clock3,FileText,GraduationCap,Layers,MessageCircle,Mic,Monitor,Play,Presentation,ShieldCheck,Sparkles,Star,Users,Vote} from 'lucide-react';
import './sat-proposal-advanced.css';

const featureGroups=[
 {title:'Explore the platform',items:[
  ['Guided product tour','Clickable walkthroughs explain the student, teacher, parent and admin experiences.'],
  ['Role-switching experience','Switch between four sample roles and see how the workspace changes.'],
  ['SAT learning journey','Follow a learner from diagnostic assessment to a target score.'],
  ['Feature explorer','Browse the proposed platform capabilities by category.'],
  ['Device simulator','Preview the concept at desktop, tablet and mobile sizes.']
 ]},
 {title:'SAT learning tools',items:[
  ['Reading & Writing practice','Try a sample passage question with answer feedback.'],
  ['Math practice laboratory','Work through a sample SAT math problem.'],
  ['Weakness detector','See how incorrect answers can reveal topics to revisit.'],
  ['Smart flashcards','Flip sample vocabulary and formula cards.'],
  ['Personalized study planner','Create a sample weekly plan around a target date.'],
  ['Gamification system','Explore points, streaks, badges and learning milestones.'],
  ['Teacher grading laboratory','Preview assignment review and feedback workflows.'],
  ['Live class experience','Explore a sample schedule and session details.']
 ]},
 {title:'AI capability demonstrations',items:[
  ['AI SAT question explainer','See a sample step-by-step question explanation.'],
  ['AI essay feedback','Preview structured writing feedback for clarity and organization.'],
  ['AI teacher copilot','Generate a sample quiz, homework task or lesson outline.'],
  ['AI study recommendations','See example next-step recommendations from sample performance.'],
  ['AI lesson generator','Turn a topic into a sample lesson outline.'],
  ['AI voice tutor','Preview a voice-assistant interaction concept.'],
  ['AI performance report','Generate an illustrative student progress summary.']
 ]},
 {title:'Business & proposal tools',items:[
  ['Business value calculator','Estimate potential time saved using assumptions you can edit.'],
  ['Package comparison laboratory','Compare the official Starter, Professional and Elite packages.'],
  ['Client feedback voting','Collect a local demo vote on design and feature priorities.'],
  ['Future expansion roadmap','Explore possible capabilities in future delivery phases.'],
  ['Veltrix capabilities portfolio','Showcase the agency skills behind the proposed solution.']
 ]},
 {title:'Client & agency workspace',items:[
  ['Client activity timeline','Preview a sample proposal and project activity feed.'],
  ['Proposal version comparison','Compare illustrative revision summaries.'],
  ['Document center','Preview the documents a real client portal could organize.'],
  ['Meeting notes & decisions','Add local notes to a sample project record.'],
  ['Admin proposal builder','Edit a local preview of proposal branding and content.']
 ]}
];
const roles={
 Student:{headline:'Your SAT learning space',stats:['3 active courses','78% progress','2 upcoming tasks'],items:['Continue SAT Math','Reading practice','My mock exams']},
 Teacher:{headline:'Your teaching workspace',stats:['8 active classes','12 submissions','94% attendance'],items:['Review assignments','Create a quiz','View class progress']},
 Parent:{headline:'Your family overview',stats:['2 sessions this week','1 progress report','On track'],items:['Weekly progress','Upcoming sessions','Teacher feedback']},
 Admin:{headline:'Academy operations',stats:['126 learners','12 teachers','4 active courses'],items:['Manage users','Course catalogue','Platform reports']}
};
const demoAnswers={
 'Explain a SAT math question':'DEMO EXPLANATION: identify the known values, choose the relevant equation, solve one step at a time, then verify the result. A live model connection is not enabled.',
 'Review an essay':'DEMO FEEDBACK: the central idea is clear. Strengthen the topic sentence, add a specific supporting example, and use a transition to connect the final paragraph.',
 'Create a teacher quiz':'DEMO QUIZ: 1) Solve a linear equation. 2) Identify the main claim in a short passage. 3) Choose the best transition. This is a sample generated response.',
 'Recommend what to study':'DEMO RECOMMENDATION: revisit linear equations, complete one timed Reading set, then review mistakes before attempting another full practice section.',
 'Generate a lesson':'DEMO LESSON: Topic — Linear functions. Objective, 5-minute explanation, worked example, guided practice, independent question, and exit ticket.',
 'Create a performance report':'DEMO REPORT: practice accuracy is improving in algebra. Reading evidence questions need more review. Suggested next step: two focused practice sessions.'
};
export default function SatProposalAdvanced({lang='en'}){
 const ar=lang==='ar';
 const [role,setRole]=useState('Student'),[device,setDevice]=useState('Desktop'),[tour,setTour]=useState(0),[activeFeature,setActiveFeature]=useState('Guided product tour');
 const [answer,setAnswer]=useState(''),[checked,setChecked]=useState(false),[flipped,setFlipped]=useState(false),[goal,setGoal]=useState('1450'),[studyDays,setStudyDays]=useState('4');
 const [vote,setVote]=useState(''),[notes,setNotes]=useState(''),[savedNotes,setSavedNotes]=useState([]),[brand,setBrand]=useState('SAT Academy'),[tagline,setTagline]=useState('Prepare with confidence'),[aiPrompt,setAiPrompt]=useState(''),[aiResult,setAiResult]=useState('');
 const [hours,setHours]=useState('5'),[rate,setRate]=useState('250');
 const [expanded,setExpanded]=useState('Explore the platform');
 const allFeatures=useMemo(()=>featureGroups.flatMap(g=>g.items),[]);
 const valueSaved=Math.max(0,Number(hours)||0)*Math.max(0,Number(rate)||0)*4;
 const roleData=roles[role];
 const runAI=key=>{setAiPrompt(key);setAiResult(demoAnswers[key]||'This is an illustrative AI response. A live AI provider and safety configuration would be required for production use.')};
 const heading=(n,title,desc)=><div className="vx-adv-heading"><span>{n} / VELTRIX EXPERIENCE</span><h2>{title}</h2><p>{desc}</p></div>;
 return <div className="vx-sat-advanced" dir={ar?'rtl':'ltr'}>
  {heading('05','Explore beyond the proposal','A hands-on look at the learning platform, intelligent tools and the way Veltrix can support your academy.')}
  <section className="vx-adv-panel">
   <div className="vx-adv-panel-head"><div><span className="vx-adv-kicker">01 — GUIDED EXPERIENCE</span><h3>See the platform through every role</h3><p>Switch roles, explore a guided tour and preview different device sizes.</p></div><span className="vx-adv-live">INTERACTIVE CONCEPT</span></div>
   <div className="vx-adv-role-tabs">{Object.keys(roles).map(r=><button key={r} className={role===r?'active':''} onClick={()=>setRole(r)}>{r}</button>)}</div>
   <div className={'vx-adv-device-preview '+device.toLowerCase()}>
    <div className="vx-adv-device-top"><b>{brand}</b><span>{device} preview · {role} view</span></div>
    <div className="vx-adv-device-body"><aside><span>OVERVIEW</span>{roleData.items.map(x=><small key={x}>{x}</small>)}</aside><main><small>WELCOME BACK</small><h3>{roleData.headline}</h3><div className="vx-adv-stats">{roleData.stats.map(s=><b key={s}>{s}</b>)}</div><div className="vx-adv-preview-tile"><GraduationCap/><div><b>{roleData.items[0]}</b><small>Continue exploring this sample workspace</small></div><ArrowRight/></div></main></div>
   </div>
   <div className="vx-adv-controls"><div className="vx-adv-pills">{['Desktop','Tablet','Mobile'].map(d=><button key={d} className={device===d?'active':''} onClick={()=>setDevice(d)}>{d}</button>)}</div><div className="vx-adv-tour"><span>Tour step {tour+1} of 4</span><b>{['Dashboard overview','Learning and teaching','Progress and insights','Next steps'][tour]}</b><button onClick={()=>setTour((tour+1)%4)}>Next step <ArrowRight size={14}/></button></div></div>
  </section>
  <section className="vx-adv-panel">
   <div className="vx-adv-panel-head"><div><span className="vx-adv-kicker">02 — FEATURE EXPLORER</span><h3>Explore the proposed capabilities</h3><p>Choose a category to browse all 30 additional feature concepts.</p></div><Layers/></div>
   <div className="vx-adv-category-list">{featureGroups.map(g=><button key={g.title} className={expanded===g.title?'active':''} onClick={()=>setExpanded(expanded===g.title?'':g.title)}>{g.title}<span>{g.items.length} features</span></button>)}</div>
   {featureGroups.filter(g=>g.title===expanded).map(g=><div className="vx-adv-feature-grid" key={g.title}>{g.items.map(([name,desc],i)=><button key={name} className={activeFeature===name?'active':''} onClick={()=>setActiveFeature(name)}><span>{String(i+1).padStart(2,'0')}</span><b>{name}</b><small>{desc}</small></button>)}</div>)}
   <div className="vx-adv-selected-feature"><Sparkles/><div><b>{activeFeature}</b><span>Selected concept · Explore the relevant interactive demonstration below.</span></div></div>
  </section>
  <section className="vx-adv-panel">
   <div className="vx-adv-panel-head"><div><span className="vx-adv-kicker">03 — SAT LEARNING LAB</span><h3>Try a sample learning session</h3><p>Practice, review, plan and see how progress can be encouraged.</p></div><BookOpen/></div>
   <div className="vx-adv-learning-grid">
    <article><span className="vx-adv-kicker">READING & WRITING</span><h4>What is the main purpose of a passage's concluding sentence?</h4><div className="vx-adv-options">{[['A','Introduce an unrelated idea'],['B','Reinforce the central point'],['C','Add a new character']].map(([k,v])=><button className={answer===k?'active':''} onClick={()=>{setAnswer(k);setChecked(false)}} key={k}>{k}. {v}</button>)}</div><button className="vx-adv-primary" disabled={!answer} onClick={()=>setChecked(true)}>Check answer</button>{checked&&<p className={answer==='B'?'good':'bad'}>{answer==='B'?'Correct — a conclusion reinforces the passage’s central point.':'Not quite. Consider how a conclusion connects to the main idea.'}</p>}</article>
    <article><span className="vx-adv-kicker">SMART FLASHCARDS</span><h4>Quick revision card</h4><button className="vx-adv-flashcard" onClick={()=>setFlipped(!flipped)}>{flipped?'A statement that supports the main claim with relevant evidence.':'What is textual evidence?'}<small>Tap to {flipped?'see the question':'reveal the answer'}</small></button><div className="vx-adv-progress"><i style={{width:flipped?'66%':'33%'}}/></div><small>Sample revision deck · 2 of 6 cards</small></article>
    <article><span className="vx-adv-kicker">STUDY PLANNER</span><h4>Build a weekly SAT routine</h4><label>Target score<input value={goal} onChange={e=>setGoal(e.target.value)} inputMode="numeric"/></label><label>Study days per week<select value={studyDays} onChange={e=>setStudyDays(e.target.value)}><option value="3">3 days</option><option value="4">4 days</option><option value="5">5 days</option><option value="6">6 days</option></select></label><div className="vx-adv-plan-result"><b>{studyDays} study sessions / week</b><span>Suggested focus: Math practice · Reading practice · Review mistakes · Timed test</span></div></article>
    <article><span className="vx-adv-kicker">GAMIFIED PROGRESS</span><h4>Keep the learning momentum</h4><div className="vx-adv-badges"><span>★ 420 XP</span><span>🔥 5-day streak</span><span>✓ First mock test</span></div><div className="vx-adv-progress"><i style={{width:'72%'}}/></div><small>Illustrative achievements and progress points</small></article>
    <article><span className="vx-adv-kicker">WEAKNESS DETECTOR</span><h4>Turn mistakes into a study plan</h4><div className="vx-adv-topic"><span>Algebra</span><b>Needs practice</b><i style={{width:'42%'}}/></div><div className="vx-adv-topic"><span>Geometry</span><b>Developing</b><i style={{width:'68%'}}/></div><div className="vx-adv-topic"><span>Reading evidence</span><b>Strong</b><i style={{width:'88%'}}/></div><small>Sample analysis based on fictional responses</small></article>
    <article><span className="vx-adv-kicker">TEACHER GRADING LAB</span><h4>Assignment review preview</h4><div className="vx-adv-review"><b>Linear equations · Homework 03</b><span>Student response: 2x + 4 = 10 → x = 3</span><label>Feedback<textarea defaultValue="Good working. Show the subtraction step to make your reasoning clear."/></label><span className="vx-adv-grade">Suggested mark: 4 / 5 · Teacher confirms final grade</span></div></article>
    <article><span className="vx-adv-kicker">LIVE CLASS EXPERIENCE</span><h4>Upcoming sample session</h4><div className="vx-adv-session"><CalendarDays/><div><b>Digital SAT Math Workshop</b><small>Wednesday · 5:00 PM · 45 minutes</small></div><span>Preview</span></div><small>Sample schedule only; no live meeting is booked.</small></article>
   </div>
  </section>
  <section className="vx-adv-panel">
   <div className="vx-adv-panel-head"><div><span className="vx-adv-kicker">04 — AI CAPABILITY LAB</span><h3>See what an AI-enabled academy could do</h3><p>These are curated sample outputs, not live AI generation.</p></div><Brain/></div>
   <div className="vx-adv-ai-grid">{Object.entries(demoAnswers).map(([key,val])=><button key={key} className={aiPrompt===key?'active':''} onClick={()=>runAI(key)}><Sparkles/><b>{key}</b><ArrowRight/></button>)}</div>
   <div className="vx-adv-ai-output"><div><span>DEMO OUTPUT</span><b>{aiPrompt||'Choose an AI demonstration'}</b></div><p>{aiResult||'Select one of the demonstrations above to view an illustrative response.'}</p><small>Production AI requires a selected model/provider, server-side integration, usage controls and safety testing.</small></div>
   <div className="vx-adv-voice"><Mic/><div><b>AI voice tutor concept</b><span>Voice interaction preview only — microphone and speech services are not connected.</span></div><button onClick={()=>setAiResult('VOICE TUTOR DEMO: “Let’s work through the question together. What information does the problem give you?”')}>Play sample script</button></div>
  </section>
  <section className="vx-adv-panel">
   <div className="vx-adv-panel-head"><div><span className="vx-adv-kicker">05 — BUSINESS & PROPOSAL LAB</span><h3>Make the proposal work harder</h3><p>Explore business assumptions, official packages, and future priorities.</p></div><Presentation/></div>
   <div className="vx-adv-business-grid">
    <article><h4>Business value calculator</h4><p>Estimate potential administrative time value using your own assumptions.</p><label>Hours saved each week<input value={hours} onChange={e=>setHours(e.target.value)} type="number" min="0"/></label><label>Estimated hourly value (EGP)<input value={rate} onChange={e=>setRate(e.target.value)} type="number" min="0"/></label><strong>EGP {valueSaved.toLocaleString('en-US')} <small>illustrative monthly value</small></strong><small>Calculation: weekly hours × hourly value × 4 weeks. Not a guaranteed saving.</small></article>
    <article><h4>Package comparison laboratory</h4><div className="vx-adv-package-row"><span>Starter</span><b>EGP 39,000</b></div><div className="vx-adv-package-row featured"><span>Professional · Recommended</span><b>EGP 49,000</b></div><div className="vx-adv-package-row"><span>Elite</span><b>EGP 60,000</b></div><small>Official one-time package prices. Care plans remain separate.</small></article>
    <article><h4>Client feedback voting</h4><p>Which area should receive the most attention in the next design review?</p><div className="vx-adv-votes">{['Student experience','Teacher workspace','Parent reporting'].map(x=><button className={vote===x?'active':''} onClick={()=>setVote(x)} key={x}>{x}{vote===x&&<Check size={14}/>}</button>)}</div><small>{vote?'Your local demo vote: '+vote:'Votes are only stored in this browser demo.'}</small></article>
    <article><h4>Future expansion roadmap</h4><div className="vx-adv-roadmap"><span><b>Phase 1</b>Core website and learning platform</span><span><b>Phase 2</b>Advanced reporting and integrations</span><span><b>Phase 3</b>Expanded AI and mobile experience</span></div><small>Illustrative roadmap; delivery scope and dates require agreement.</small></article>
   </div>
  </section>
  <section className="vx-adv-panel">
   <div className="vx-adv-panel-head"><div><span className="vx-adv-kicker">06 — VELTRIX & CLIENT WORKSPACE</span><h3>From proposal to partnership</h3><p>Preview the agency capabilities and the tools a full client workspace could provide.</p></div><Users/></div>
   <div className="vx-adv-workspace-grid">
    <article><h4>Veltrix capabilities portfolio</h4><div className="vx-adv-capabilities">{['Product strategy & UX','Brand-led visual design','Frontend engineering','Backend & integrations','Quality assurance','Launch & support'].map(x=><span key={x}><Check size={13}/>{x}</span>)}</div></article>
    <article><h4>Client activity timeline</h4><div className="vx-adv-timeline"><span><b>Proposal shared</b><small>Illustrative activity · Day 1</small></span><span><b>Requirements reviewed</b><small>Illustrative activity · Day 3</small></span><span><b>Design direction approved</b><small>Illustrative activity · Day 7</small></span><span><b>Development milestone</b><small>Illustrative activity · Day 14</small></span></div></article>
    <article><h4>Proposal version comparison</h4><div className="vx-adv-version"><b>Version 1.0</b><span>Initial scope · Core platform</span></div><div className="vx-adv-version active"><b>Version 2.0</b><span>Expanded scope · AI and analytics concepts</span></div><small>Sample revision history; not connected to a document version store.</small></article>
    <article><h4>Document center</h4>{['Proposal overview.pdf','Project scope.pdf','Brand assets.zip','Meeting summary.pdf'].map(x=><div className="vx-adv-document" key={x}><FileText/><span>{x}</span><small>Sample</small></div>)}<small>Document storage and permissions require authenticated backend integration.</small></article>
    <article><h4>Meeting notes & decisions</h4><textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Add a project note or decision…"/><button className="vx-adv-primary" disabled={!notes.trim()} onClick={()=>{setSavedNotes(v=>[notes.trim(),...v]);setNotes('')}}>Save local note</button>{savedNotes.map((n,i)=><p className="vx-adv-saved-note" key={i}>{n}</p>)}<small>Notes remain in this page session only.</small></article>
    <article><h4>Admin proposal builder</h4><label>Academy / client name<input value={brand} onChange={e=>setBrand(e.target.value)}/></label><label>Hero tagline<input value={tagline} onChange={e=>setTagline(e.target.value)}/></label><div className="vx-adv-brand-preview"><b>{brand||'Your academy'}</b><span>{tagline||'Your tagline'}</span></div><small>Local preview only. Publishing requires admin authentication and a persistent content-management workflow.</small></article>
   </div>
  </section>
  <div className="vx-adv-disclaimer"><ShieldCheck/><p>Demonstration environment: sample learners, scores, activity, votes, documents and AI outputs are illustrative. No client account, real meeting, live AI service, payment, or production record is created by these previews.</p></div>
 </div>
}
