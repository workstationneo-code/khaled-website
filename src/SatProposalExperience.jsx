import React,{useMemo,useState} from 'react';
import {ArrowRight,Check,ChevronRight,GraduationCap,BookOpen,BarChart3,CalendarDays,Sparkles,MessageCircle,Play,Monitor,Smartphone,Users,Clock3} from 'lucide-react';
import './sat-proposal-experience.css';

const copy={
 en:{
  eyebrow:'A CLOSER LOOK AT YOUR SAT PLATFORM',title:'See how your academy',accent:'could come to life.',intro:'Explore a working concept, compare the packages side by side and see how we take your project from first conversation to launch.',
  preview:'Explore the platform',student:'Student view',teacher:'Teacher view',parent:'Parent view',live:'INTERACTIVE CONCEPT',demo:'Preview experience',practice:'Practice today',progress:'Your progress',score:'Latest mock score',lessons:'Continue learning',week:'This week',tasks:'Upcoming tasks',course:'SAT Math · Advanced',question:'Quadratic equations',continue:'Continue lesson',teacherTitle:'Teaching overview',classes:'Active classes',submissions:'To review',attendance:'Attendance',parentTitle:'Family overview',weekly:'Weekly progress',sessions:'Sessions completed',feedback:'Teacher feedback',
  compare:'Choose with confidence',compareTitle:'The right foundation.',compareAccent:'Room to grow.',compareText:'Every package is designed around a clear outcome. Professional is our recommended balance of learning tools, management and value.',popular:'MOST POPULAR',oneTime:'one-time',choose:'Choose this package',included:'What’s included',journey:'A clear route to launch',journeyTitle:'From first idea',journeyAccent:'to first lesson.',journeyText:'You always know what stage the project is in, what we need from you and what happens next.',
  steps:[['01','Discovery','We align on your academy, audience, goals and essential features.'],['02','Experience design','We shape the structure, visual direction and key student journeys.'],['03','Build & connect','We develop the website, dashboards and agreed platform features.'],['04','Review & launch','You test the experience, share feedback and approve the launch.']],
  assistant:'Ask the SAT platform guide',assistantText:'Get quick answers about packages, features and the project journey.',suggestions:['What is included in Professional?','How does the student dashboard work?','How long does the project take?'],placeholder:'Ask about your SAT platform…',send:'Ask',disclaimer:'Interactive demo assistant with curated proposal answers. A live generative AI connection can be added as a separately scoped integration.',fallback:'I can help explain the packages, platform features and project stages. Choose one of the suggested questions or ask about a specific feature.',answers:[
   ['professional','Professional is EGP 49,000 one-time. It includes everything in Starter, course and class management, mock exams, question banks, progress analytics, teacher and student management, parent access, scheduling, attendance, Personal AI Study Coach and AI Presentation Generator.'],
   ['student','The student experience can include course pathways, lessons, assignments, quizzes, mock exams and progress insights. The exact screens are finalized during discovery and design.'],
   ['time','The project journey is discovery, experience design, development and integrations, then review and launch. We confirm a realistic schedule after agreeing the final scope.'],
   ['price','Starter is EGP 39,000, Professional is EGP 49,000 and Elite is EGP 60,000. These are one-time website package prices.'],
   ['elite','Elite is EGP 60,000 and adds the premium AI upgrade, including advanced AI learning support, AI teacher assistance and advanced learning insights.']
  ]
 },
 ar:{
  eyebrow:'اكتشف منصة SAT عن قرب',title:'شاهد كيف يمكن أن',accent:'تنبض أكاديميتك بالحياة.',intro:'استكشف نموذجاً تفاعلياً للمنصة، وقارن الباقات، وتعرّف على مراحل تنفيذ مشروعك حتى الإطلاق.',
  preview:'استكشف المنصة',student:'واجهة الطالب',teacher:'واجهة المعلم',parent:'واجهة ولي الأمر',live:'نموذج تفاعلي',demo:'معاينة التجربة',practice:'تدريب اليوم',progress:'تقدمك',score:'آخر نتيجة تجريبية',lessons:'تابع التعلم',week:'هذا الأسبوع',tasks:'المهام القادمة',course:'رياضيات SAT · متقدم',question:'المعادلات التربيعية',continue:'تابع الدرس',teacherTitle:'نظرة عامة للمعلم',classes:'الفصول النشطة',submissions:'للمراجعة',attendance:'الحضور',parentTitle:'متابعة الأسرة',weekly:'التقدم الأسبوعي',sessions:'الحصص المكتملة',feedback:'ملاحظات المعلم',
  compare:'اختر بثقة',compareTitle:'الأساس المناسب.',compareAccent:'ومساحة للنمو.',compareText:'كل باقة مصممة لتحقيق نتيجة واضحة. نوصي بباقة Professional لأنها تحقق التوازن الأفضل بين أدوات التعلم والإدارة والقيمة.',popular:'الأكثر اختياراً',oneTime:'دفعة واحدة',choose:'اختر هذه الباقة',included:'المميزات المتضمنة',journey:'طريق واضح للإطلاق',journeyTitle:'من الفكرة الأولى',journeyAccent:'إلى أول درس.',journeyText:'ستعرف دائماً المرحلة الحالية وما نحتاجه منك والخطوة التالية.',
  steps:[['01','الاكتشاف','نتعرف على الأكاديمية والجمهور والأهداف والخصائص المطلوبة.'],['02','تصميم التجربة','نحدد هيكل المنصة والهوية البصرية ورحلات الطلاب.'],['03','التطوير والربط','نطور الموقع ولوحات التحكم والخصائص المتفق عليها.'],['04','المراجعة والإطلاق','تجرب المنصة وتشارك ملاحظاتك وتعتمد الإطلاق.']],
  assistant:'اسأل مساعد منصة SAT',assistantText:'احصل على إجابات سريعة حول الباقات والخصائص ومراحل المشروع.',suggestions:['ماذا تتضمن باقة Professional؟','كيف تعمل لوحة الطالب؟','كم يستغرق تنفيذ المشروع؟'],placeholder:'اسأل عن منصة SAT…',send:'اسأل',disclaimer:'مساعد تجريبي بإجابات محددة مسبقاً عن العرض. يمكن إضافة اتصال ذكاء اصطناعي توليدي فعلي ضمن نطاق تكامل مستقل.',fallback:'يمكنني شرح الباقات وخصائص المنصة ومراحل المشروع. اختر سؤالاً مقترحاً أو اسأل عن خاصية معينة.',answers:[
   ['professional','باقة Professional بسعر 49,000 جنيه تدفع مرة واحدة. تشمل كل مميزات Starter بالإضافة إلى إدارة الدورات والفصول والاختبارات التجريبية وبنوك الأسئلة وتحليلات التقدم وإدارة المعلمين والطلاب وتقارير أولياء الأمور والجدولة والحضور ومساعد الدراسة الشخصي بالذكاء الاصطناعي ومولد العروض التقديمية.'],
   ['student','يمكن أن تتضمن تجربة الطالب مسارات الدورات والدروس والواجبات والاختبارات والامتحانات التجريبية ومؤشرات التقدم. يتم اعتماد الشاشات النهائية أثناء مرحلة الاكتشاف والتصميم.'],
   ['time','يمر المشروع بمراحل الاكتشاف وتصميم التجربة والتطوير والربط ثم المراجعة والإطلاق. نحدد الجدول الزمني بعد الاتفاق على النطاق النهائي.'],
   ['price','سعر Starter هو 39,000 جنيه وProfessional هو 49,000 جنيه وElite هو 60,000 جنيه. هذه أسعار الباقات لمرة واحدة.'],
   ['elite','باقة Elite بسعر 60,000 جنيه وتضيف ترقية الذكاء الاصطناعي المميزة، بما يشمل دعم التعلم ومساعد المعلم والتحليلات المتقدمة.']
  ]
 }
};
const fallbackPrices={starter:39000,professional:49000,elite:60000};
const money=n=>'EGP '+Number(n).toLocaleString('en-US');
const plansFallback=[
 {key:'starter',name:'Starter',price:'39,000',desc:'A polished foundation for independent SAT tutors.',items:['Professional website','Teacher and student dashboards','SAT English & Math course areas','Lessons, assignments and quizzes','Student enquiry forms','Responsive design']},
 {key:'professional',name:'Professional',price:'49,000',desc:'The complete teaching platform for growing tutors and academies.',hot:true,items:['Everything in Starter','Course and class management','Mock exams and question banks','Student progress analytics','Teacher and student management','Parent access and reports','Scheduling and attendance','Personal AI Study Coach','AI Presentation Generator','Automated enquiry workflows']},
 {key:'elite',name:'Elite',price:'60,000',desc:'The premium AI upgrade for ambitious SAT educators.',items:['Everything in Professional','Advanced AI Student Assistant','AI Teacher Agent','AI quiz and practice generation','AI assignment feedback','Advanced learning insights','Personalized recommendations']}
];

export default function SatProposalExperience({plans=plansFallback,prices={},onChoosePackage,lang='en'}){
 const t=copy[lang==='ar'?'ar':'en'];
 const [view,setView]=useState('student'),[device,setDevice]=useState('desktop'),[question,setQuestion]=useState(''),[history,setHistory]=useState([]),[expanded,setExpanded]=useState('professional'),[quizChoice,setQuizChoice]=useState(''),[quizChecked,setQuizChecked]=useState(false);
 const localizedPlans=useMemo(()=>plans.map(p=>({...p,amount:Number(prices[p.key]?.amount??fallbackPrices[p.key]??Number(String(p.price).replace(/,/g,'')))})),[plans,prices]);
 const reply=(raw)=>{
  const q=raw.toLowerCase();
  const aliases={
   professional:/professional|49|احترافية|الاحترافية/.test(q),
   student:/student|dashboard|طالب|الطالب|لوحة/.test(q),
   time:/time|duration|how long|مدة|يستغرق|الوقت/.test(q),
   price:/price|cost|39|49|60|سعر|الأسعار|تكلفة/.test(q),
   elite:/elite|60|النخبة/.test(q)
  };
  const found=t.answers.find(([key])=>q.includes(key)||aliases[key]);return found?.[1]||t.fallback;
 };
 const ask=(raw)=>{const clean=raw.trim();if(!clean)return;setHistory(v=>[...v,{role:'user',text:clean},{role:'assistant',text:reply(clean)}]);setQuestion('')};
 return <div className={'vx-sat-experience '+(lang==='ar'?'is-arabic':'')} dir={lang==='ar'?'rtl':'ltr'}>
  <section className="vx-sat-preview" id="sat-platform-preview">
   <div className="vx-sat-section-intro"><span className="vx-kicker">01 / {t.eyebrow}</span><div><h2>{t.preview}<br/><em>{lang==='ar'?'تجربة قبل التنفيذ':'before it is built.'}</em></h2><p>{t.intro}</p></div></div>
   <div className="vx-sat-preview-shell">
    <div className="vx-sat-preview-top"><div><span className="vx-sat-live-dot"/><b>{t.live}</b><small>{t.demo}</small></div><div className="vx-sat-device-icons"><button type="button" className={device==='desktop'?'active':''} onClick={()=>setDevice('desktop')} aria-label="Desktop preview"><Monitor size={16}/></button><button type="button" className={device==='mobile'?'active':''} onClick={()=>setDevice('mobile')} aria-label="Mobile preview"><Smartphone size={16}/></button></div></div>
    <div className="vx-sat-preview-tabs">{[['student',t.student],['teacher',t.teacher],['parent',t.parent]].map(([id,label])=><button key={id} type="button" className={view===id?'active':''} onClick={()=>setView(id)}>{label}</button>)}</div>
    <div className={'vx-sat-app-preview '+(device==='mobile'?'is-mobile':'')}>
     <aside className="vx-sat-preview-sidebar"><div className="vx-sat-preview-brand"><span>V.</span><b>SAT ACADEMY</b></div><div className="vx-sat-preview-user"><span>{view==='student'?'MA':view==='teacher'?'TH':'FH'}</span><div><b>{view==='student'?'Mariam Ahmed':view==='teacher'?'Teacher workspace':'Family account'}</b><small>{view==='student'?'Student dashboard':view==='teacher'?'Teacher dashboard':'Parent dashboard'}</small></div></div><div className="vx-sat-preview-menu"><span className="active"><BookOpen size={14}/> {t.lessons}</span><span><BarChart3 size={14}/> {t.progress}</span><span><CalendarDays size={14}/> {t.tasks}</span></div></aside>
     <div className="vx-sat-preview-main"><div className="vx-sat-preview-greeting"><div><small>{t.week}</small><h3>{view==='teacher'?t.teacherTitle:view==='parent'?t.parentTitle:'Good morning, Mariam'}</h3><p>{t.course}</p></div><span className="vx-sat-avatar">{view==='teacher'?'T':view==='parent'?'F':'M'}</span></div>
      <div className="vx-sat-metrics"><article><small>{view==='teacher'?t.classes:t.progress}</small><b>{view==='teacher'?'08':'78%'}</b><span>{view==='teacher'?'+2 this term':'↗ 12% this month'}</span></article><article><small>{view==='teacher'?t.submissions:view==='parent'?t.sessions:t.score}</small><b>{view==='teacher'?'12':view==='parent'?'16':'1420'}</b><span>{view==='teacher'?'Needs attention':view==='parent'?'On track':'Latest practice'}</span></article><article><small>{view==='teacher'?t.attendance:t.tasks}</small><b>{view==='teacher'?'94%':view==='parent'?'4':'03'}</b><span>{view==='teacher'?'This week':view==='parent'?'This month':'Due soon'}</span></article></div>
      <div className="vx-sat-preview-lower"><article className="vx-sat-practice-card"><div><small>{t.practice}</small><b>{t.question}</b><p>{t.course}</p></div><button type="button" onClick={()=>setView(view==='student'?'teacher':'student')}>{t.continue} <ChevronRight size={14}/></button></article><article className="vx-sat-week-card"><small>{t.weekly}</small><div className="vx-sat-bars">{[42,68,54,82,63,94,76].map((h,i)=><i key={i} style={{height:h+'%'}}/>)}</div></article></div>
     </div>
    </div>
   </div>
   <div className="vx-sat-quiz-playground">
    <div className="vx-sat-quiz-heading"><span className="vx-kicker">{lang==='ar'?'جرّب بنفسك':'TRY IT YOURSELF'}</span><span>{lang==='ar'?'سؤال SAT تجريبي':'SAMPLE SAT MATH QUESTION'}</span></div>
    <h3>{lang==='ar'?'إذا كان x² − 5x + 6 = 0، فما جذرا المعادلة؟':'If x² − 5x + 6 = 0, what are the two roots?'}</h3>
    <div className="vx-sat-quiz-options">{[['A','1 and 6','١ و٦'],['B','2 and 3','٢ و٣'],['C','−2 and −3','−٢ و−٣'],['D','3 and 5','٣ و٥']].map(([id,en,ar])=><button key={id} type="button" className={quizChoice===id?'selected':''} onClick={()=>{setQuizChoice(id);setQuizChecked(false)}}><b>{id}</b><span>{lang==='ar'?ar:en}</span></button>)}</div>
    <div className="vx-sat-quiz-footer"><span>{lang==='ar'?'اختر إجابة ثم تحقق منها.':'Select an answer, then check it.'}</span><button type="button" disabled={!quizChoice} onClick={()=>{if(quizChecked){setQuizChoice('');setQuizChecked(false)}else setQuizChecked(true)}}>{quizChecked?(lang==='ar'?'حاول مرة أخرى':'Try again'):(lang==='ar'?'تحقق من الإجابة':'Check answer')} <ArrowRight size={14}/></button></div>
    {quizChecked&&<div className={'vx-sat-quiz-feedback '+(quizChoice==='B'?'correct':'incorrect')} role="status"><b>{quizChoice==='B'?(lang==='ar'?'إجابة صحيحة!':'Correct!'):(lang==='ar'?'ليست هذه الإجابة.':'Not quite.')}</b><span>{lang==='ar'?'نحلل المعادلة إلى (x − 2)(x − 3) = 0، إذن الجذران هما ٢ و٣.':'Factor the equation: (x − 2)(x − 3) = 0. The roots are 2 and 3.'}</span></div>}
   </div>
   <div className="vx-sat-preview-foot"><span><Check size={14}/> {lang==='ar'?'نموذج تفاعلي لتوضيح الإمكانيات':'Switch between student, teacher and parent views.'}</span><span>{lang==='ar'?'التصميم النهائي يعتمد بعد تحديد النطاق':'Final screens are agreed during discovery.'}</span></div>
  </section>
  <section className="vx-sat-packages" id="sat-package-comparison">
   <div className="vx-sat-section-intro"><span className="vx-kicker">02 / {t.compare}</span><div><h2>{t.compareTitle}<br/><em>{t.compareAccent}</em></h2><p>{t.compareText}</p></div></div>
   <div className="vx-sat-plan-grid">{localizedPlans.map(p=><article key={p.key} className={'vx-sat-plan '+(p.hot?'is-featured':'')}><div className="vx-sat-plan-top"><span>{p.name}</span>{p.hot&&<b>{t.popular}</b>}</div><h3>{money(p.amount)}</h3><small>{t.oneTime}</small><p>{p.desc}</p><button type="button" className={p.hot?'primary':''} onClick={()=>onChoosePackage?.(p)}>{t.choose}<ArrowRight size={15}/></button><button type="button" className="vx-sat-plan-expand" onClick={()=>setExpanded(expanded===p.key?'':p.key)}>{expanded===p.key?(lang==='ar'?'إخفاء المميزات':'Hide features'):t.included}<ChevronRight size={15}/></button>{expanded===p.key&&<ul>{p.items.map((item,i)=><li key={i}><Check size={14}/>{item}</li>)}</ul>}</article>)}</div>
   <p className="vx-sat-price-note">{lang==='ar'?'الأسعار بالجنيه المصري. أسعار الباقات المعتمدة لا تشمل خدمات الرعاية الشهرية.':'Prices are in EGP. Monthly care plans are optional and separate from the one-time package fees.'}</p>
  </section>
  <section className="vx-sat-journey" id="sat-project-journey">
   <div className="vx-sat-section-intro"><span className="vx-kicker">03 / {t.journey}</span><div><h2>{t.journeyTitle}<br/><em>{t.journeyAccent}</em></h2><p>{t.journeyText}</p></div></div>
   <div className="vx-sat-journey-grid">{t.steps.map(([n,title,desc],i)=><article key={n} style={{'--step-index':i}}><span className="vx-sat-step-number">{n}</span><div className="vx-sat-step-line"><i style={{'--step-index':i}}/></div><small>{['01 — ALIGN','02 — DESIGN','03 — BUILD','04 — LAUNCH'][i]}</small><h3>{title}</h3><p>{desc}</p></article>)}</div>
  </section>
  <section className="vx-sat-assistant" id="sat-proposal-assistant">
   <div className="vx-sat-assistant-copy"><span className="vx-kicker">04 / {lang==='ar'?'معاينة المساعد الذكي':'AI ASSISTANT PREVIEW'}</span><h2>{t.assistant}</h2><p>{t.assistantText}</p><div className="vx-sat-assistant-disclaimer"><Sparkles size={15}/><span>{t.disclaimer}</span></div></div>
   <div className="vx-sat-assistant-box"><div className="vx-sat-assistant-head"><span><Sparkles size={16}/><b>{lang==='ar'?'مساعد Veltrix':'Veltrix assistant'}</b></span><small>{lang==='ar'?'نسخة تجريبية':'DEMO MODE'}</small></div><div className="vx-sat-assistant-messages" aria-live="polite">{history.length===0?<div className="vx-sat-assistant-welcome"><span><MessageCircle size={17}/></span><p>{lang==='ar'?'مرحباً! اسألني عن باقات SAT أو خصائص المنصة.':'Hi! Ask me about the SAT packages or platform features.'}</p></div>:history.map((m,i)=><div key={i} className={'vx-sat-assistant-message '+m.role}>{m.text}</div>)}</div><div className="vx-sat-assistant-suggestions">{t.suggestions.map(q=><button type="button" key={q} onClick={()=>ask(q)}>{q}</button>)}</div><form onSubmit={e=>{e.preventDefault();ask(question)}}><input value={question} onChange={e=>setQuestion(e.target.value)} placeholder={t.placeholder} aria-label={t.placeholder}/><button type="submit" disabled={!question.trim()}>{t.send}<ArrowRight size={14}/></button></form></div>
  </section>
 </div>
}
