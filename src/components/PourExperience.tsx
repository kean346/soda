'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { createPourScene } from '@/lib/pour-scene';
import { publicAsset } from '@/lib/public-asset';

export default function PourExperience(){
  const section=useRef<HTMLElement>(null);
  const stage=useRef<HTMLDivElement>(null);
  const control=useRef<HTMLInputElement>(null);
  const progress=useRef(0);
  const draw=useRef<ReturnType<typeof createPourScene> | null>(null);
  const [status,setStatus]=useState<'loading'|'ready'|'fallback'>('loading');
  const [reduced,setReduced]=useState(false);
  useEffect(()=>{
    const root=section.current!,host=stage.current!;
    let disposed=false;
    let cleanup:(()=>void)|undefined;
    const observer=new IntersectionObserver(async entries=>{
      if(!entries.some(e=>e.isIntersecting))return;
      observer.disconnect();
      try{
        const [{createPourScene},{gsap},{ScrollTrigger}]=await Promise.all([import('@/lib/pour-scene'),import('gsap'),import('gsap/ScrollTrigger')]);
        if(disposed)return;
        gsap.registerPlugin(ScrollTrigger);
        draw.current=createPourScene(host);
        draw.current.draw(progress.current);
        setStatus('ready');
        const media=gsap.matchMedia();
        media.add({motion:'(prefers-reduced-motion: no-preference)',reduce:'(prefers-reduced-motion: reduce)'},context=>{
          setReduced(Boolean(context.conditions?.reduce));
          if(context.conditions?.reduce){root.dataset.beat='2';draw.current?.draw(.98);if(control.current)control.current.value='98';return;}
          const trigger=ScrollTrigger.create({trigger:root,start:'top top',end:'bottom bottom',invalidateOnRefresh:true,onUpdate:self=>{
            const p=self.progress;progress.current=p;
            draw.current?.draw(p);if(control.current)control.current.value=String(Math.round(p*100));
            root.dataset.beat=String(p<.24?0:p<.84?1:2);
          }});
          return ()=>trigger.kill();
        });
        ScrollTrigger.refresh();
        cleanup=()=>media.revert();
      }catch(error){console.warn('3D unavailable; showing the supplied still.',error);if(!disposed)setStatus('fallback');}
    },{rootMargin:'500px'});
    observer.observe(root);
    return ()=>{disposed=true;observer.disconnect();cleanup?.();draw.current?.dispose();draw.current=null;};
  },[]);
  function seek(value:number){
    const p=value/100;progress.current=p;draw.current?.draw(p);
    const root=section.current!;root.dataset.beat=String(p<.24?0:p<.84?1:2);
    if(!reduced){const top=root.getBoundingClientRect().top+scrollY;window.scrollTo({top:top+p*(root.offsetHeight-innerHeight),behavior:'instant'});}
  }
  return <section id="experience" className={`experience ${reduced?'reduced':''} ${status==='fallback'?'unavailable':''}`} ref={section} data-beat="0" aria-labelledby="experience-title">
    <div className="experience-sticky">
      <div className="experience-copy"><span className="small-label">A change of pour.</span><h2 id="experience-title">Turn down<br/>the rush.<br/><em>Pour on<br/>the sunshine.</em></h2><p>A small ritual.<br/>An entirely brighter outlook.</p><a href="#the-drink" className="text-link">Meet the drink <span aria-hidden="true">↗</span></a></div>
      <div className="scene-wrap"><div className="scene" ref={stage} role="img" aria-label="Interactive 3D citrus can: rotates, opens its tab and tilts to pour golden liquid into a filling ribbed glass. Scroll or use the slider to move forward and backward."/>
        {status!=='ready'?<div className="scene-fallback"><Image src={publicAsset("/images/02-pouring.webp")} alt="Still concept of a citrus pour" fill sizes="(max-width: 700px) 100vw, 60vw"/><span role="status">{status==='loading'?'Preparing the 3D pour…':'3D isn’t available on this device. Showing the concept still.'}</span></div>:null}
        <div className="scene-caption"><span>Sunshine in motion.</span><span>{status==='ready'?'Interactive 3D study':'Citrus, in detail'}</span></div>
      </div>
      <div className="experience-controls"><div className="pour-steps" aria-label="Pouring stages"><span className="step step-0">01 <b>Crack it open.</b></span><span className="step step-1">02 <b>Let it pour.</b></span><span className="step step-2">03 <b>Stay a little.</b></span></div><div className="scrub-control"><label htmlFor="pour-progress">{reduced?'Explore at your own pace':'Scroll to pour, or drag'}</label><input ref={control} type="range" id="pour-progress" min="0" max="100" defaultValue="0" onChange={e=>seek(Number(e.target.value))} disabled={status!=='ready'}/></div></div>
    </div>
  </section>;
}
