import React, { useMemo, useState, useEffect } from 'react';
import { ArrowRight, ArrowUpRight, BookOpen, Calculator, Check, ChevronLeft, ChevronRight, Clock3, GraduationCap, Monitor, Smartphone, Tablet, Sparkles, Users, ChartNoAxesCombined, Play, RotateCcw } from 'lucide-react';
import './SatExperienceLab.css';

const packages = [
  { name: 'Starter', price: 39000, summary: 'A polished foundation', features: ['Professional website', 'Student and teacher dashboards', 'SAT English and Math areas', 'Lessons, assignments and quizzes', 'Responsive design'] },
  { name: 'Professional', price: 49000, summary: 'The complete teaching platform', featured: true, features: ['Everything in Starter', 'Course and class management', 'Mock exams and question banks', 'Student progress analytics', 'Parent access and reports', 'Personal AI Study Coach', 'AI Presentation Generator'] },
  { name: 'Elite', price: 60000, summary: 'The premium AI upgrade', features: ['Everything in Professional', 'Advanced AI Student Assistant', 'AI Teacher Agent', 'AI quiz and practice generation', 'AI assignment feedback', 'Advanced learning insights'] }
];

const questions = [
  { section: 'Reading & Writing', prompt: 'Which choice most logically completes the text?\n\nThe researcher repeated the experiment several times. ___, the results remained consistent across each trial.', options: ['For example', 'Nevertheless', 'As a result', 'Similarly'], answer: 3, explanation: 'Similarly connects the repeated trials and their consistent results.' },
  { section: 'Math', prompt: 'If 3x + 7 = 22, what is the value of x?', options: ['3', '5', '7', '9'], answer: 1, explanation: 'Subtract 7 from both sides: 3x = 15. Divide by 3: x = 5.' },
  { section: 'Math', prompt: 'A line has a slope of 2 and passes through (1, 4). Which equation represents the line?', options: ['y = 2x + 2', 'y = 2x + 4', 'y = x + 3', 'y = 4x - 2'], answer: 0, explanation: 'Using y = mx + b, 4 = 2(1) + b, so b = 2.' }
];

const stories = [
  { title: 'A clearer student journey', type: 'Student experience', text: 'A focused home for lessons, practice, goals and progress—so students always know what to do next.', tag: 'LEARN' },
  { title: 'A calmer teaching workspace', type: 'Teacher experience', text: 'Bring classes, assignments, student insights and teaching resources into one organized workspace.', tag: 'TEACH' },
  { title: 'A more confident academy', type: 'Academy management', text: 'Give growing teams a clearer view of people, learning activity and the work happening across the platform.', tag: 'GROW' }
];

export default function SatExperienceLab({ onBack, onContact }) {
  const [device, setDevice] = useState('desktop');
  const [activePackage, setActivePackage] = useState('Professional');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [seconds, setSeconds] = useState(900);
  const [examStarted, setExamStarted] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [pages, setPages] = useState(5);
  const [selectedFeatures, setSelectedFeatures] = useState(['Mock exams', 'Student analytics']);
  const [slider, setSlider] = useState(52);
  const [caseFilter, setCaseFilter] = useState('All');

  useEffect(() => {
    if (!examStarted || examFinished || seconds <= 0) return;
    const timer = window.setInterval(() => setSeconds(value => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [examStarted, examFinished, seconds]);

  useEffect(() => {
    if (seconds === 0 && examStarted) setExamFinished(true);
  }, [seconds, examStarted]);

  const currentQuestion = questions[questionIndex];
  const score = questions.reduce((total, question, index) => total + (answers[index] === question.answer ? 1 : 0), 0);
  const estimate = useMemo(() => {
    const featurePrices = { 'Mock exams': 4500, 'Student analytics': 3500, 'AI study coach': 6500, 'Parent portal': 4000, 'Online payments': 3000, 'Class scheduling': 2500 };
    return 39000 + Math.max(0, pages - 5) * 1200 + selectedFeatures.reduce((sum, feature) => sum + featurePrices[feature], 0);
  }, [pages, selectedFeatures]);

  const toggleFeature = feature => setSelectedFeatures(current => current.includes(feature) ? current.filter(item => item !== feature) : [...current, feature]);
  const formatTime = value => `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`;
  const resetExam = () => { setQuestionIndex(0); setAnswers({}); setShowExplanation(false); setSeconds(900); setExamStarted(false); setExamFinished(false); };

  return <main className="sat-lab">
    <div className="sat-lab-top"><button className="sat-lab-back" onClick={onBack}><ChevronLeft size={16}/> Back to Veltrix</button><span><i/> INTERACTIVE PLATFORM PREVIEW</span><a href="#sat-lab-contact">LET'S BUILD <ArrowUpRight size={14}/></a></div>
    <section className="sat-lab-hero">
      <div className="sat-lab-kicker">A CLOSER LOOK AT WHAT'S POSSIBLE</div>
      <h1>Not just a website.<br/><em>A better way to teach.</em></h1>
      <p>Explore a hands-on preview of the SAT learning experience—from student dashboards to teaching tools and a smarter academy workflow.</p>
      <div className="sat-lab-hero-meta"><span><Sparkles size={15}/> DESIGNED AROUND LEARNING</span><span><Users size={15}/> FOR TUTORS & ACADEMIES</span><span><ChartNoAxesCombined size={15}/> BUILT TO GROW</span></div>
      <div className="sat-lab-orb"><div className="sat-orb-ring one"/><div className="sat-orb-ring two"/><div className="sat-orb-core">SAT<span>+</span></div><small>LEARN / PRACTICE / GROW</small></div>
    </section>

    <section className="sat-lab-section sat-device-section" id="sat-device">
      <div className="sat-lab-heading"><div><span>01 / LIVE DEVICE PREVIEW</span><h2>One platform.<br/><em>Every screen.</em></h2></div><p>Switch devices to see how a thoughtful learning interface adapts to the screen in front of you.</p></div>
      <div className="sat-device-toolbar"><div><b>STUDENT DASHBOARD</b><small>Preview mode · Sample student</small></div><div className="sat-device-switch">{[['desktop',Monitor],['tablet',Tablet],['mobile',Smartphone]].map(([key,Icon])=><button key={key} className={device===key?'active':''} onClick={()=>setDevice(key)} aria-label={key}><Icon size={17}/><span>{key}</span></button>)}</div></div>
      <div className={`sat-device-stage ${device}`}><div className="sat-device-frame"><div className="sat-dash-top"><span className="sat-dash-brand">v. <b>VELTRIX</b></span><span>MY LEARNING SPACE</span><span className="sat-avatar">MK</span></div><div className="sat-dash-content"><aside className="sat-dash-side"><b>MY SPACE</b><span className="selected">Overview</span><span>My courses</span><span>Practice</span><span>My progress</span></aside><div className="sat-dash-main"><div className="sat-dash-welcome"><div><small>MONDAY, 25 NOVEMBER</small><h3>Good morning, Mariam ✦</h3><p>You're making steady progress. Keep it going.</p></div><span className="sat-streak">✦ 7 day streak</span></div><div className="sat-dash-stats"><div><small>STUDY TIME</small><b>12.5h</b><i>↗ 2.4h this week</i></div><div><small>PRACTICE SCORE</small><b>84%</b><i>↗ 6% improvement</i></div><div><small>LESSONS DONE</small><b>18/24</b><i>6 to go</i></div></div><div className="sat-dash-lower"><div className="sat-progress-card"><div><b>Your weekly progress</b><small>THIS WEEK</small></div><div className="sat-chart">{[32,55,44,70,58,85,66].map((height,index)=><i key={index} style={{height:`${height}%`}}/>)}</div><small>MON　 TUE　 WED　 THU　 FRI　 SAT　 SUN</small></div><div className="sat-next-card"><small>UP NEXT</small><BookOpen/><b>Reading: Craft & Structure</b><span>15 min · Lesson 04</span><button>Continue <ArrowRight size={13}/></button></div></div></div></div></div></div>
      <p className="sat-demo-caption">Illustrative interface concept. Student data shown is sample content.</p>
    </section>

    <section className="sat-lab-section sat-dashboard-section">
      <div className="sat-lab-heading"><div><span>02 / ROLE-BASED EXPERIENCES</span><h2>Built for everyone<br/><em>who makes learning happen.</em></h2></div><p>Give each person a workspace that makes their next step clear, without overwhelming them with tools they don't need.</p></div>
      <div className="sat-role-grid"><article className="sat-role-student"><div className="sat-role-icon"><GraduationCap/></div><small>01 / STUDENT</small><h3>Stay focused<br/>on your goals.</h3><p>See courses, upcoming work, practice results and personal progress in one place.</p><div className="sat-role-metric"><b>84%</b><span>Practice accuracy <i>↗ 6%</i></span></div></article><article className="sat-role-teacher"><div className="sat-role-icon"><BookOpen/></div><small>02 / TEACHER</small><h3>Spend more time<br/>teaching well.</h3><p>Manage classes, review submissions, create quizzes and understand student performance.</p><div className="sat-teacher-list"><span><Check/> 3 assignments to review</span><span><Check/> 2 classes today</span><span><Check/> Weekly report ready</span></div></article><article className="sat-role-admin"><div className="sat-role-icon"><ChartNoAxesCombined/></div><small>03 / ACADEMY</small><h3>See the bigger<br/>picture clearly.</h3><p>Understand activity across students, teachers, courses and the academy.</p><div className="sat-role-bars"><i/><i/><i/><i/><i/><i/><i/></div></article></div>
    </section>

    <section className="sat-lab-section sat-exam-section">
      <div className="sat-lab-heading"><div><span>03 / TRY A MINI MOCK EXAM</span><h2>Put your skills<br/><em>to the test.</em></h2></div><p>Answer a few sample SAT-style questions. This mini demo shows how timed practice and instant feedback could work inside the platform.</p></div>
      <div className="sat-exam-card"><div className="sat-exam-head"><div><span>VELTRIX / PRACTICE LAB</span><b>{examFinished?'SESSION COMPLETE':'SAT MINI PRACTICE'}</b></div><div className="sat-exam-timer"><Clock3 size={16}/>{formatTime(seconds)}</div></div>{examFinished?<div className="sat-exam-result"><Sparkles/><small>YOUR SAMPLE RESULT</small><strong>{score} / {questions.length}</strong><p>You answered {score} of {questions.length} questions correctly. This is a short product demonstration, not an official SAT score.</p><button onClick={resetExam}><RotateCcw size={15}/> Try again</button></div>:<><div className="sat-exam-progress"><span style={{width:`${((questionIndex+1)/questions.length)*100}%`}}/></div><div className="sat-exam-body"><div className="sat-exam-qmeta"><span>QUESTION 0{questionIndex+1} / 0{questions.length}</span><span>{currentQuestion.section.toUpperCase()}</span></div><h3>{currentQuestion.prompt}</h3><div className="sat-answer-list">{currentQuestion.options.map((option,index)=><button key={option} disabled={showExplanation} className={answers[questionIndex]===index?(index===currentQuestion.answer?'correct':'incorrect'):''} onClick={()=>setAnswers(value=>({...value,[questionIndex]:index}))}><i>{String.fromCharCode(65+index)}</i>{option}{answers[questionIndex]===index&&<Check size={16}/>}</button>)}</div>{showExplanation&&<div className="sat-explanation"><b>{answers[questionIndex]===currentQuestion.answer?'Correct answer':"Let's review this one"}</b><p>{currentQuestion.explanation}</p></div>}<div className="sat-exam-actions">{!examStarted?<button className="sat-primary" onClick={()=>setExamStarted(true)}><Play size={14}/> Start timed practice</button>:<button className="sat-secondary" onClick={()=>setShowExplanation(true)} disabled={answers[questionIndex]===undefined}>Check answer</button>}<button className="sat-next" onClick={()=>{if(questionIndex===questions.length-1){setExamFinished(true)}else{setQuestionIndex(value=>value+1);setShowExplanation(false)}}} disabled={answers[questionIndex]===undefined}> {questionIndex===questions.length-1?'Finish':'Next question'} <ArrowRight size={15}/></button></div></div></>}</div>
    </section>

    <section className="sat-lab-section sat-packages-section">
      <div className="sat-lab-heading"><div><span>04 / INTERACTIVE PACKAGE COMPARISON</span><h2>Choose the right<br/><em>level of possibility.</em></h2></div><p>Compare what each package is designed to deliver. Professional is the recommended balance; Elite adds the premium AI layer.</p></div>
      <div className="sat-package-tabs">{packages.map(item=><button key={item.name} className={activePackage===item.name?'active':''} onClick={()=>setActivePackage(item.name)}>{item.name}{item.featured&&<i>BEST VALUE</i>}</button>)}</div>
      <div className="sat-package-detail">{packages.filter(item=>item.name===activePackage).map(item=><article key={item.name}><div><small>{item.featured?'RECOMMENDED PACKAGE':'PACKAGE OVERVIEW'}</small><h3>{item.name}</h3><p>{item.summary}</p><strong>EGP {item.price.toLocaleString('en-US')} <span>one-time</span></strong></div><ul>{item.features.map(feature=><li key={feature}><Check size={15}/>{feature}</li>)}</ul></article>)}</div>
      <div className="sat-compare-table"><div className="sat-compare-row head"><b>FEATURE</b>{packages.map(item=><b key={item.name}>{item.name}</b>)}</div>{['Professional website','Student & teacher dashboards','Course and class management','Mock exams & question banks','Student progress analytics','Personal AI Study Coach','AI Presentation Generator','Advanced AI Teacher Agent'].map((feature,index)=><div className="sat-compare-row" key={feature}><span>{feature}</span>{packages.map((item,i)=><span key={item.name}>{index<5||i>0&&index<7||i===2&&index===7?<Check size={16}/>:<i>—</i>}</span>)}</div>)}</div>
    </section>

    <section className="sat-lab-section sat-calculator-section">
      <div className="sat-lab-heading"><div><span>05 / PROJECT SCOPE CALCULATOR</span><h2>Shape your platform.<br/><em>Explore the scope.</em></h2></div><p>Choose a few options to see how additional pages and capabilities can change an illustrative project estimate.</p></div>
      <div className="sat-calculator"><div className="sat-calculator-controls"><label>Website pages <b>{pages} pages</b></label><input type="range" min="5" max="15" value={pages} onChange={event=>setPages(Number(event.target.value))}/><div className="sat-range-labels"><span>5 pages</span><span>15 pages</span></div><h3>Choose extra capabilities</h3>{['Mock exams','Student analytics','AI study coach','Parent portal','Online payments','Class scheduling'].map(feature=><label className="sat-calc-check" key={feature}><input type="checkbox" checked={selectedFeatures.includes(feature)} onChange={()=>toggleFeature(feature)}/><span>{feature}</span><i>+</i></label>)}</div><div className="sat-calculator-result"><small>ILLUSTRATIVE ESTIMATE</small><span>Starting from</span><strong>EGP {estimate.toLocaleString('en-US')}</strong><p>Based on the selections shown. Final pricing depends on discovery, integrations, content and technical requirements.</p><div className="sat-calc-breakdown"><span>Base platform <b>EGP 39,000</b></span><span>Additional pages <b>EGP {((pages-5)*1200).toLocaleString('en-US')}</b></span><span>Selected capabilities <b>EGP {selectedFeatures.reduce((sum,feature)=>sum+({'Mock exams':4500,'Student analytics':3500,'AI study coach':6500,'Parent portal':4000,'Online payments':3000,'Class scheduling':2500}[feature]||0),0).toLocaleString('en-US')}</b></span></div><a href="#sat-lab-contact">Discuss this scope <ArrowUpRight size={15}/></a></div></div>
    </section>

    <section className="sat-lab-section sat-case-section">
      <div className="sat-lab-heading"><div><span>06 / INTERACTIVE CASE STUDIES</span><h2>One ecosystem.<br/><em>Different journeys.</em></h2></div><p>Explore how the same platform can support different people and priorities across an SAT teaching business.</p></div>
      <div className="sat-case-filters">{['All','Student experience','Teacher experience','Academy management'].map(filter=><button key={filter} className={caseFilter===filter?'active':''} onClick={()=>setCaseFilter(filter)}>{filter}</button>)}</div>
      <div className="sat-case-grid">{stories.filter(story=>caseFilter==='All'||story.type===caseFilter).map((story,index)=><article key={story.title}><div className="sat-case-art"><span>{story.tag}</span><div className="sat-case-shape shape-one"/><div className="sat-case-shape shape-two"/><b>0{index+1}</b></div><small>{story.type}</small><h3>{story.title}</h3><p>{story.text}</p><a href="#sat-device">Explore the interface <ArrowRight size={14}/></a></article>)}</div>
    </section>

    <section className="sat-lab-section sat-before-section">
      <div className="sat-lab-heading"><div><span>07 / BEFORE & AFTER</span><h2>From scattered tools<br/><em>to one clear experience.</em></h2></div><p>Move the slider to compare a fragmented learning workflow with a more connected, organized platform experience.</p></div>
      <div className="sat-before-demo"><div className="sat-before-images"><div className="sat-before-old"><small>BEFORE / DISCONNECTED</small><h3>Too many places<br/>to keep track.</h3><div className="sat-old-windows"><i>Assignments.xlsx</i><i>Class notes.doc</i><i>Scores-final-2.pdf</i><i>Messages</i></div></div><div className="sat-before-new" style={{clipPath:`inset(0 0 0 ${slider}%)`}}><small>AFTER / CONNECTED</small><h3>One space.<br/>A clearer path.</h3><div className="sat-new-dashboard"><span>v. VELTRIX LEARNING</span><b>Good morning, Mariam</b><i>My courses　　Progress　　Practice</i><div><em/><em/><em/></div></div></div><div className="sat-before-divider" style={{left:`${slider}%`}}><span>↔</span></div></div><label className="sat-before-range"><span>BEFORE</span><input aria-label="Before and after comparison" type="range" min="0" max="100" value={slider} onChange={event=>setSlider(Number(event.target.value))}/><span>AFTER</span></label></div>
    </section>

    <section className="sat-lab-contact" id="sat-lab-contact"><div><span>READY TO MAKE IT REAL?</span><h2>Your teaching deserves<br/><em>a platform built around it.</em></h2><p>Let's turn this concept into a platform shaped around your students, teaching style and goals.</p></div><button className="sat-lab-contact-action" onClick={onContact}>Start a conversation <ArrowUpRight size={16}/></button></section>
    <footer className="sat-lab-footer"><span>VELTRIX / IDEAS INTO IMPACT</span><span>Concept demonstration · Final scope agreed during discovery</span></footer>
  </main>;
}
