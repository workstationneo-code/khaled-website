import React,{useEffect,useRef} from 'react';
import './motion.css';
import Lenis from 'lenis';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

// Animate only top-level page sections. Avoid nested targets that can be hidden twice.
const revealTargets = '.vx main > section';

export default function MotionLayer({page}) {
  const frame = useRef(0);
  useEffect(() => {
    const root = document.querySelector('.vx');
    if (!root) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lenis;
    let gsapFrame;
    let motionContext;
    if (!reduced) {
      gsap.registerPlugin(ScrollTrigger);
      lenis = new Lenis({duration:1.05,smoothWheel:true,syncTouch:false});
      lenis.on('scroll',ScrollTrigger.update);
      gsapFrame = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(gsapFrame);
      gsap.ticker.lagSmoothing(0);
      motionContext = gsap.context(() => {
        const heroArt = root.querySelector('.vx-hero-art');
        const hero = root.querySelector('.vx-hero');
        if (heroArt && hero) {
          gsap.to(heroArt,{'--scene-y':'72px','--scene-scale':1.07,ease:'none',scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:1}});
        }
        const studioPoints = root.querySelectorAll('.vx-studio-points > div');
        if (studioPoints.length) {
          gsap.from(studioPoints,{y:22,opacity:0,duration:.7,stagger:.12,ease:'power3.out',scrollTrigger:{trigger:root.querySelector('.vx-studio-points'),start:'top 82%'}});
        }
      },root);
    }
    root.classList.add('motion-enabled');

    const nodes = [...root.querySelectorAll(revealTargets)];
    nodes.forEach((node) => {
      if (!node.hasAttribute('data-motion-static')) node.classList.add('motion-reveal');
    });

    let observer;
    if (!reduced && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      }, {threshold: 0,rootMargin: '0px 0px 120px 0px'});
      nodes.forEach((node) => observer.observe(node));
      // Fail-safe: never leave page content hidden if an observer misses an element.
      window.setTimeout(() => nodes.forEach((node) => node.classList.add('is-revealed')), 1600);
    } else {
      nodes.forEach((node) => node.classList.add('is-revealed'));
    }

    const updateScroll = () => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        root.style.setProperty('--scroll-progress', String(window.scrollY / max));
        root.style.setProperty('--scroll-y', String(window.scrollY));
        const hero = root.querySelector('.vx-hero-art');
        if (hero && !reduced) {
          const rect = hero.getBoundingClientRect();
          const travel = Math.max(-36, Math.min(36, (rect.top - window.innerHeight * .18) * -.055));
          hero.style.setProperty('--parallax-y', travel + 'px');
        }
      });
    };
    updateScroll();
    window.addEventListener('scroll', updateScroll, {passive:true});

    const onPointerMove = (event) => {
      if (event.pointerType === 'touch' || reduced) return;
      root.style.setProperty('--pointer-x', event.clientX + 'px');
      root.style.setProperty('--pointer-y', event.clientY + 'px');
      const target = event.target.closest('.vx-btn-dark,.vx-btn-light,.vx-nav-cta,.vx-concept-bottom');
      root.querySelectorAll('.motion-magnetic.is-active').forEach((el) => {
        if (el !== target) { el.classList.remove('is-active'); el.style.removeProperty('--mag-x'); el.style.removeProperty('--mag-y'); }
      });
      if (target) {
        const rect = target.getBoundingClientRect();
        target.classList.add('motion-magnetic','is-active');
        target.style.setProperty('--mag-x', ((event.clientX - rect.left - rect.width/2) * .09) + 'px');
        target.style.setProperty('--mag-y', ((event.clientY - rect.top - rect.height/2) * .12) + 'px');
      }
    };
    const onPointerLeave = () => {
      root.querySelectorAll('.motion-magnetic').forEach((el) => {
        el.classList.remove('is-active');
        el.style.removeProperty('--mag-x');
        el.style.removeProperty('--mag-y');
      });
    };
    root.addEventListener('pointermove', onPointerMove, {passive:true});
    root.addEventListener('pointerleave', onPointerLeave);

    return () => {
      observer?.disconnect();
      window.removeEventListener('scroll', updateScroll);
      root.removeEventListener('pointermove', onPointerMove);
      root.removeEventListener('pointerleave', onPointerLeave);
      cancelAnimationFrame(frame.current);
      if (lenis) lenis.destroy();
      if (gsapFrame) gsap.ticker.remove(gsapFrame);
      if (motionContext) motionContext.revert();
      root.classList.remove('motion-enabled','route-enter');
    };
  }, []);

  useEffect(() => {
    const root = document.querySelector('.vx');
    if (!root) return;
    root.classList.remove('route-enter');
    void root.offsetWidth;
    root.classList.add('route-enter');
    const timer = window.setTimeout(() => root.classList.remove('route-enter'), 620);
    return () => window.clearTimeout(timer);
  }, [page]);

  return <div className="motion-overlay" aria-hidden="true">
    <div className="motion-scroll-progress"/>
    <div className="motion-spotlight"/>
    <svg className="motion-orbit-svg" viewBox="0 0 240 240" fill="none">
      <path d="M120 18 C176 18 222 64 222 120 C222 176 176 222 120 222 C64 222 18 176 18 120 C18 64 64 18 120 18Z" stroke="currentColor" strokeWidth="1" strokeDasharray="3 8" opacity=".25">
        <animate attributeName="stroke-dashoffset" values="0;44" dur="12s" repeatCount="indefinite"/>
      </path>
      <path d="M120 34 C166 34 206 74 206 120 C206 166 166 206 120 206 C74 206 34 166 34 120 C34 74 74 34 120 34Z" stroke="currentColor" strokeWidth="1" opacity=".12">
        <animate attributeName="d" dur="9s" repeatCount="indefinite" values="M120 34 C166 34 206 74 206 120 C206 166 166 206 120 206 C74 206 34 166 34 120 C34 74 74 34 120 34Z;M120 24 C182 24 216 68 216 120 C216 172 174 216 120 216 C66 216 24 172 24 120 C24 68 58 24 120 24Z;M120 34 C166 34 206 74 206 120 C206 166 166 206 120 206 C74 206 34 166 34 120 C34 74 74 34 120 34Z"/>
      </path>
    </svg>
  </div>;
}
