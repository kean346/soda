/* Document interaction remains independent of WebGL and its CDN. */
const chapters=[...document.querySelectorAll('.chapter')];
const names=['Lavender Haze','Citrus Current','Berry Bloom'];
const reducedPreference=matchMedia('(prefers-reduced-motion: reduce)');
window.Bloom={chapter:0,manual:null,reduced:reducedPreference.matches,offsets:[]};
const state=window.Bloom,root=document.documentElement;
window.revealPage=()=>document.querySelector('#loader').classList.add('gone');
setTimeout(window.revealPage,2500);
document.querySelector('#year').textContent=new Date().getFullYear();
reducedPreference.addEventListener('change',e=>{state.reduced=e.matches});
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{
 const section=e.target.closest('.chapter');
 if(innerWidth<900)return;
 if(e.isIntersecting)section.classList.add('is-visible');
 else if(e.boundingClientRect.bottom<0||e.boundingClientRect.top>innerHeight)section.classList.remove('is-visible');
}),{threshold:.15,rootMargin:'0px 0px -10% 0px'});
document.querySelectorAll('.copy').forEach(el=>observer.observe(el));
function measure(){state.offsets=chapters.map(el=>el.offsetTop)}
measure();addEventListener('resize',measure,{passive:true});document.fonts.ready.then(measure);
window.updateFlavourUI=value=>{
 document.querySelectorAll('.flavour-dock button').forEach(b=>b.setAttribute('aria-pressed',Number(b.dataset.preview)===value));
 document.querySelector('#fallback-flavour').textContent=names[value];
 const colours=[['#9987b7','#dad7e2'],['#ddb17f','#f4e5d1'],['#d3859e','#f1d5d3']][value];
 document.querySelector('#fallback').style.background=`linear-gradient(100deg,${colours[0]},${colours[1]} 70%,${colours[0]})`;
 document.querySelector('#product3d').setAttribute('aria-label',`Interactive three-dimensional Bloomshift ${names[value]} soda can`);
};
document.querySelectorAll('[data-preview]').forEach(b=>b.addEventListener('click',()=>{
 const flavour=Number(b.dataset.preview);state.manual={flavour,chapter:state.chapter,at:performance.now()};window.updateFlavourUI(flavour);
}));
let toastTimer;
document.querySelectorAll('[data-social]').forEach(b=>b.addEventListener('click',()=>{
 const t=document.querySelector('#toast');t.textContent=`${b.dataset.social} is still growing. BLOOMSHIFT is an independent brand concept.`;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),3500);
}));
document.querySelectorAll('.stage-images img').forEach(img=>img.addEventListener('error',()=>{img.hidden=true}));
state.updateStage=(x,weights)=>{
 root.style.setProperty('--stage-x',`${innerWidth<900?0:x*100}vw`);
 root.style.setProperty('--stage-lavender',weights[0]);root.style.setProperty('--stage-citrus',weights[1]);root.style.setProperty('--stage-berry',weights[2]);
};
const palettes=[[243,240,233],[239,235,243],[38,31,45],[245,231,230],[243,240,233]];
const flavours=[0,0,1,2,0],poses=[.24,-.24,.24,-.24,.24];
let lastChapter=-1,lastScroll=-1,fallbackX=.24;
function tick(){
 const y=scrollY,vh=innerHeight,offsets=state.offsets;
 let nearest=0;for(let i=1;i<5;i++)if(y+vh*.5>=offsets[i])nearest=i;
 if(nearest!==lastChapter){state.chapter=nearest;if(state.manual&&state.manual.chapter!==nearest)state.manual=null;if(!state.manual)window.updateFlavourUI(flavours[nearest]);lastChapter=nearest}
 if(lastScroll!==y){
  if(innerWidth<900)chapters.forEach((section,i)=>section.classList.toggle('is-visible',y>=offsets[i]-10&&y<offsets[i]+vh*.82));
  let i=0;for(let j=1;j<5;j++)if(y>=offsets[j]-vh*.4)i=j;
  const t=i===0?1:Math.max(0,Math.min(1,(y-(offsets[i]-vh*.4))/(vh*.5))),e=t*t*(3-2*t);
  const a=palettes[Math.max(0,i-1)],b=palettes[i],rgb=a.map((v,j)=>Math.round(v+(b[j]-v)*e));
  root.style.setProperty('--world-base',`rgb(${rgb.join(',')})`);
  const dark=rgb[0]<110;root.style.setProperty('--world-ink',dark?'#f8f1eb':'#302c36');
  lastScroll=y;
 }
 if(!window.__bloom){
  fallbackX+=(poses[nearest]-fallbackX)*.055;
  const weights=[0,0,0];weights[state.manual?.flavour??flavours[nearest]]=1;state.updateStage(fallbackX,weights);
 }
 requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
