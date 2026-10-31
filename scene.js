
import * as THREE from 'three';

const state=window.Bloom;
const TAU=Math.PI*2,rad=Math.PI/180;
let renderer,scene,camera,flightGroup,productRoot,orbit,labels=[],particleMesh,condensation;
const canvas=document.querySelector('#product3d');
const mobile=()=>innerWidth<900;
const clamp=THREE.MathUtils.clamp,lerp=THREE.MathUtils.lerp;
const ease=x=>x*x*(3-2*x);
let seed=42019;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
let frame=0,renderCount=0,elapsed=0,lastTime=0,raf=0,paused=false;
let width=innerWidth,height=innerHeight,viewH=0,viewW=0;
let pointerX=0,pointerY=0,mouseX=0,mouseY=0;
let currentX=0,currentY=0,currentYaw=0,currentPitch=0,currentRoll=0,currentScale=1,progress=0,currentFlavour=0;
let velocities=0,previousX=0,burst=0;
const palettes=[new THREE.Color('#b599ee'),new THREE.Color('#f9c94d'),new THREE.Color('#ed82a8')];
const colour=new THREE.Color(),helper=new THREE.Object3D();
let runningDrops,dropPhases=[];
let particles=[],ribbons=[],particleCount=0;
let ribbonShader;
let physicalMaterial,ribbonMaterial,aluminium,keyLight,rimLight;
let weights=[1,0,0],targetWeights=[1,0,0];
const desktopKeys=[
 {x:.24,y:-.025,s:1.28,ya:-8,pi:.12,ro:-7,f:0,ex:.08,int:.12},
 {x:-.24,y:-.025,s:1.22,ya:12,pi:.10,ro:7,f:0,ex:.22,int:.25},
 {x:.24,y:-.025,s:1.25,ya:-10,pi:.12,ro:-8,f:1,ex:.3,int:.6},
 {x:-.24,y:-.025,s:1.22,ya:10,pi:.10,ro:6,f:2,ex:.22,int:.35},
 {x:.24,y:-.025,s:1.22,ya:-5,pi:.12,ro:-5,f:0,ex:.1,int:.12}
];
const mobileKeys=[
 {x:0,y:-.22,s:.75,ya:-8,pi:.12,ro:-6,f:0,ex:.06,int:.1},
 {x:0,y:-.22,s:.75,ya:10,pi:.1,ro:6,f:0,ex:.12,int:.2},
 {x:0,y:-.22,s:.75,ya:-10,pi:.12,ro:-6,f:1,ex:.18,int:.45},
 {x:0,y:-.22,s:.75,ya:10,pi:.1,ro:5,f:2,ex:.12,int:.3},
 {x:0,y:-.22,s:.75,ya:-5,pi:.12,ro:-5,f:0,ex:.06,int:.1}
];
function buildLabel(index){
 const names=['LAVENDER HAZE','CITRUS CURRENT','BERRY BLOOM'];
 const notes=['BLUEBERRY + LAVENDER','YUZU + PASSIONFRUIT','RASPBERRY + HIBISCUS'];
 const inks=['#3b294c','#523427','#612a3d'];
 const colours=[['#9477b4','#bdc8de','#e3e2de'],['#e4a66c','#f2d0a0','#f4e9d6'],['#d77691','#eba9b5','#f5d9d2']][index];
 const c=document.createElement('canvas');c.width=mobile()?2048:4096;c.height=c.width;const ctx=c.getContext('2d');ctx.scale(c.width/2048,c.height/2048);
 const g=ctx.createLinearGradient(0,0,0,2048);g.addColorStop(0,colours[0]);g.addColorStop(.52,colours[1]);g.addColorStop(1,colours[2]);ctx.fillStyle=g;ctx.fillRect(0,0,2048,2048);
 // Intentionally restrained wraparound packaging; all front print stays in the readable arc.
 ctx.fillStyle=inks[index];ctx.textAlign='center';
 ctx.font='600 36px Sans, sans-serif';ctx.fillText(names[index],1024,330);
 ctx.font='400 26px Sans, sans-serif';ctx.fillText(notes[index],1024,390);
 ctx.font='400 198px Instrument, Georgia, serif';ctx.fillText('bloomshift',1024,905);
 ctx.font='italic 50px Instrument, Georgia, serif';ctx.fillText('a little botanical wonder.',1024,1000);
 ctx.save();ctx.translate(1024,1240);ctx.strokeStyle=inks[index];ctx.globalAlpha=.65;ctx.lineWidth=2;
 for(let i=0;i<6;i++){ctx.rotate(TAU/6);ctx.beginPath();ctx.ellipse(0,-24,9,23,0,0,TAU);ctx.stroke()}ctx.restore();
 ctx.font='400 27px Sans, sans-serif';ctx.fillText('BOTANICAL SPARKLING SODA',1024,1570);
 ctx.font='400 28px Sans, sans-serif';ctx.fillText('0.0% ALC.  /  330 ML',1024,1740);
 ctx.save();ctx.translate(245,1550);ctx.rotate(-Math.PI/2);ctx.textAlign='left';ctx.font='400 22px Sans, sans-serif';ctx.fillText('NATURE, WITH A TWIST.  /  BLOOMSHIFT',0,0);ctx.restore();
 const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(renderer.capabilities.getMaxAnisotropy(),16);return texture;
}
function addMesh(geometry,material,parent=productRoot){const mesh=new THREE.Mesh(geometry,material);parent.add(mesh);return mesh}
function makeCan(){
  aluminium=new THREE.MeshStandardMaterial({color:'#cdd0d8',metalness:1,roughness:.22,envMapIntensity:1.3});
  const darkMetal=new THREE.MeshStandardMaterial({color:'#767786',metalness:1,roughness:.3});
  const profile=[new THREE.Vector2(0,-1.22),new THREE.Vector2(.45,-1.22),new THREE.Vector2(.49,-1.19),new THREE.Vector2(.51,-1.12),new THREE.Vector2(.565,-1.06),new THREE.Vector2(.575,-.99),new THREE.Vector2(.575,.94),new THREE.Vector2(.573,.975),new THREE.Vector2(.566,1.005),new THREE.Vector2(.55,1.04),new THREE.Vector2(.532,1.075),new THREE.Vector2(.52,1.11),new THREE.Vector2(.49,1.15),new THREE.Vector2(.49,1.20),new THREE.Vector2(0,1.20)];
  const body=addMesh(new THREE.LatheGeometry(profile,128),aluminium);body.name='canBody';
  const labelGeo=new THREE.CylinderGeometry(.577,.577,1.99,128,1,true);
  for(let i=0;i<3;i++){
    const material=new THREE.MeshStandardMaterial({map:buildLabel(i),metalness:.12,roughness:.43,transparent:i!==0,opacity:i===0?1:0,depthWrite:i===0,polygonOffset:true,polygonOffsetFactor:-1-i,polygonOffsetUnits:-1-i});
    const mesh=addMesh(labelGeo,material);mesh.rotation.y=Math.PI;mesh.position.y=-.015;mesh.renderOrder=2+i;mesh.name=`label-${i}`;labels.push(mesh);
  }
  for(const y of [-1.19,1.20]){const rim=addMesh(new THREE.TorusGeometry(.496,.027,12,96),aluminium);rim.rotation.x=Math.PI/2;rim.position.y=y;rim.name='aluminiumRim'}
  const lid=addMesh(new THREE.CylinderGeometry(.49,.49,.019,96),aluminium);lid.position.y=1.19;lid.name='lid';
  for(const radius of [.368,.448]){const stamp=addMesh(new THREE.TorusGeometry(radius,.0035,6,80),darkMetal);stamp.rotation.x=Math.PI/2;stamp.position.y=1.202}
  const inner=addMesh(new THREE.TorusGeometry(.419,.008,8,80),darkMetal);inner.rotation.x=Math.PI/2;inner.position.y=1.204;
  const opening=addMesh(new THREE.SphereGeometry(1,24,12),new THREE.MeshStandardMaterial({color:'#27232e',metalness:.65,roughness:.35}));opening.scale.set(.125,.004,.18);opening.position.set(0,1.205,.19);
  const tabShape=new THREE.Shape();tabShape.absellipse(0,0,.11,.185,0,TAU,false,0);const hole=new THREE.Path();hole.absellipse(0,-.035,.058,.092,0,TAU,true,0);tabShape.holes.push(hole);
  const tab=addMesh(new THREE.ExtrudeGeometry(tabShape,{depth:.018,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.009,bevelThickness:.006}),aluminium);tab.rotation.x=-Math.PI/2;tab.position.set(0,1.213,-.035);tab.name='ringPull';
  const rivet=addMesh(new THREE.SphereGeometry(.027,16,8),aluminium);rivet.position.set(0,1.237,-.14);rivet.scale.y=.3;
  const dropGeo=new THREE.SphereGeometry(1,mobile()?10:16,mobile()?8:12);
  const dropMat=new THREE.MeshPhysicalMaterial({color:'#dfe6ee',metalness:.05,roughness:.06,clearcoat:1,transmission:0,thickness:.04,transparent:true,opacity:.46,envMapIntensity:1.25});
  condensation=new THREE.InstancedMesh(dropGeo,dropMat,mobile()?80:155);condensation.name='condensationDroplets';
  for(let i=0;i<condensation.count;i++){const a=random()*TAU,y=(random()-.5)*1.94,size=.004+random()*.009;helper.position.set(Math.sin(a)*.584,y,Math.cos(a)*.584);helper.scale.set(size,size*(1.05+random()*.6),size*.65);helper.rotation.set(0,a,0);helper.updateMatrix();condensation.setMatrixAt(i,helper.matrix)}
  productRoot.add(condensation);
  runningDrops=new THREE.InstancedMesh(dropGeo,dropMat,7);runningDrops.name='slidingCondensation';
  for(let i=0;i<7;i++)dropPhases.push({angle:(random()-.5)*2.3,phase:random()*1.8,speed:.025+random()*.02,size:.008+random()*.005});
  productRoot.add(runningDrops);
}
function makeOrbit(){
  orbit=new THREE.Group();orbit.name='liquidOrbit';flightGroup.add(orbit);
  const dropletGeo=new THREE.SphereGeometry(1,12,8);
  physicalMaterial=new THREE.MeshPhysicalMaterial({color:palettes[0],metalness:.02,roughness:.06,clearcoat:1,clearcoatRoughness:.05,transparent:true,opacity:.38,envMapIntensity:1.1});
  particleCount=mobile()?18:30;particleMesh=new THREE.InstancedMesh(dropletGeo,physicalMaterial,particleCount);particleMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);orbit.add(particleMesh);particleMesh.name='orbitDroplets';
  for(let i=0;i<particleCount;i++)particles.push({angle:random()*TAU,radius:.85+random()*.6,y:(random()-.5)*2.7,size:.007+random()*.014,speed:.17+random()*.3,phase:random()*TAU});
  ribbonMaterial=new THREE.MeshPhysicalMaterial({color:palettes[0],metalness:.2,roughness:.075,clearcoat:1,transparent:true,opacity:.48,transmission:0,thickness:.2,side:THREE.DoubleSide,depthWrite:false,envMapIntensity:1.7});
  ribbonMaterial.onBeforeCompile=shader=>{
    shader.uniforms.uFlowTime={value:0};shader.uniforms.uMotion={value:1};
    shader.vertexShader='uniform float uFlowTime; uniform float uMotion;\n'+shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\ntransformed.x += sin(position.y * 4.0 + uFlowTime * .8) * .055 * uMotion; transformed.z += cos(position.y * 3.1 + uFlowTime) * .055 * uMotion;');
    ribbonShader=shader;
  };
  for(let r=0;r<(mobile()?1:2);r++){
    const points=[];for(let j=0;j<=100;j++){const t=j/100,a=t*TAU*1.05+r*Math.PI;points.push(new THREE.Vector3(Math.sin(a)*1.10,(t-.5)*2.2,Math.cos(a)*1.10))}
    const geo=new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),140,r===0?.012:.008,8,false);
    // Taper the ends once; animation transforms this reusable geometry.
    const pos=geo.attributes.position,normal=geo.attributes.normal;
    for(let i=0;i<pos.count;i++){const u=Math.floor(i/9)/140,taper=Math.pow(Math.sin(u*Math.PI),.65),shrink=(1-taper)*(r===0?.012:.008);pos.setXYZ(i,pos.getX(i)-normal.getX(i)*shrink,pos.getY(i)-normal.getY(i)*shrink,pos.getZ(i)-normal.getZ(i)*shrink)}
    geo.computeVertexNormals();const mesh=new THREE.Mesh(geo,ribbonMaterial);mesh.name='liquidRibbon';mesh.rotation.z=.22+r*.3;orbit.add(mesh);ribbons.push(mesh);
  }

}
function resize(){
 width=innerWidth;height=innerHeight;camera.aspect=width/height;camera.updateProjectionMatrix();renderer.setSize(width,height);renderer.setPixelRatio(Math.min(devicePixelRatio,mobile()?1.5:1.75));viewH=2*Math.tan(15*rad)*camera.position.z;viewW=viewH*camera.aspect;
}
function fallback(error){
 console.warn('BLOOMSHIFT product preview fallback:',error?.message||error);document.body.classList.remove('webgl-ready');document.body.classList.add('no-webgl');window.revealPage();cancelAnimationFrame(raf);renderer?.dispose();
}
function animate(now){
 if(paused)return;
 const dt=Math.min((now-lastTime)/1000||.016,.05);lastTime=now;elapsed+=dt;frame++;
 const reduced=state.reduced,flow=reduced?.035:1,k=1-Math.exp(-dt*(reduced?7:3.2));
 const offsets=state.offsets;
 let idx=0;for(let i=1;i<5;i++)if(scrollY>=offsets[i])idx=i;
 const raw=idx===4?0:clamp((scrollY-offsets[idx])/(offsets[idx+1]-offsets[idx]),0,1);
 const t=ease(raw),travel=Math.sin(raw*Math.PI),keys=mobile()?mobileKeys:desktopKeys,a=keys[idx],b=keys[Math.min(idx+1,4)];
 progress=idx+raw;
 const tx=lerp(a.x,b.x,t)*viewW,ty=lerp(a.y,b.y,t)*viewH-travel*.16*flow;
 previousX=currentX;currentX=lerp(currentX,tx,k);currentY=lerp(currentY,ty,k);
 velocities=lerp(velocities,(currentX-previousX)/Math.max(dt,.001),1-Math.exp(-dt*4));
 mouseX=lerp(mouseX,pointerX,1-Math.exp(-dt*4));mouseY=lerp(mouseY,pointerY,1-Math.exp(-dt*4));
 let spin=0;
 // A full, continuous turn returns to a readable face. It reverses cleanly on upward scroll.
 if(idx===1||idx===2)spin=TAU*ease(raw);
 if(idx>=2)spin+=TAU;if(idx>=3)spin+=TAU;
 currentYaw=lerp(currentYaw,lerp(a.ya,b.ya,t)*rad+spin*flow,k);
 currentPitch=lerp(currentPitch,lerp(a.pi,b.pi,t)+velocities*.025*flow,k);
 currentRoll=lerp(currentRoll,lerp(a.ro,b.ro,t)*rad-velocities*.075*flow,k);
 currentScale=lerp(currentScale,lerp(a.s,b.s,t),k);
 flightGroup.position.set(currentX,currentY+Math.sin(elapsed*1.12)*.035*flow,0);
 const responsiveScale=mobile()?Math.min(viewH/6.4,viewW/2.35):Math.min(viewH/6.2,viewW/6,1.25);
 flightGroup.scale.setScalar(currentScale*responsiveScale);
 const manual=state.manual;
 const celebration=manual?Math.sin(clamp((now-manual.at)/1100,0,1)*Math.PI)*.16*flow:0;
 productRoot.rotation.set(currentPitch+mouseY*.09*flow,currentYaw+Math.sin(elapsed*.43)*.045*flow+mouseX*.15*flow,currentRoll+Math.sin(elapsed*.7)*.017*flow+celebration);
 targetWeights.fill(0);
 if(manual){targetWeights[manual.flavour]=1}
 else{targetWeights[a.f]+=1-t;targetWeights[b.f]+=t}
 const fadeK=1-Math.exp(-dt*4);
 for(let i=0;i<3;i++){weights[i]=lerp(weights[i],targetWeights[i],fadeK)}
 // Opaque base + two composited layers produces exact weighted crossfades without depth flicker.
 labels[0].material.opacity=1;
 labels[1].material.opacity=weights[1]/Math.max(.0001,weights[0]+weights[1]);
 labels[2].material.opacity=weights[2];
 colour.setRGB(0,0,0);for(let i=0;i<3;i++){colour.r+=palettes[i].r*weights[i];colour.g+=palettes[i].g*weights[i];colour.b+=palettes[i].b*weights[i]}
 physicalMaterial.color.copy(colour);ribbonMaterial.color.copy(colour);
 const expansion=lerp(a.ex,b.ex,t)+travel*.35, intensity=lerp(a.int,b.int,t)+travel;
 orbit.position.x=lerp(orbit.position.x,-clamp(velocities,-3,3)*.075*flow,k);orbit.position.y=lerp(orbit.position.y,travel*.14*flow,k);
 orbit.rotation.y=Math.sin(elapsed*.16)*.12*flow;orbit.rotation.z=lerp(a.ro,b.ro,t)*rad*.4;
 for(let i=0;i<particleCount;i++){
   const p=particles[i],ang=p.angle+elapsed*p.speed*flow,ring=p.radius+expansion*(.25+.24*Math.sin(p.phase));
   const bloom=idx===2?travel*.28:0;
   helper.position.set(Math.cos(ang)*(ring+bloom),p.y+Math.sin(elapsed*.85*flow+p.phase)*(.1+intensity*.1),Math.sin(ang)*ring);
   const size=p.size*(1+.12*Math.sin(elapsed*2*flow+p.phase));helper.scale.set(size,size*(1.15+intensity*.6),size);helper.rotation.set(0,0,ang);helper.updateMatrix();particleMesh.setMatrixAt(i,helper.matrix);
   if(idx===4&&raw===0){particleMesh.setColorAt(i,palettes[i%3])}else{particleMesh.setColorAt(i,colour)}
 }
 particleMesh.instanceMatrix.needsUpdate=true;if(particleMesh.instanceColor)particleMesh.instanceColor.needsUpdate=true;
 // Instance colour multiplies material; keep footer's three colours luminous and let them gather.
 if(idx===4){physicalMaterial.color.set('#ffffff');const gather=clamp((elapsed-(state.footerEntered??elapsed))/4,0,1);for(let i=0;i<particleCount;i++){colour.copy(palettes[i%3]).lerp(palettes[0],gather);particleMesh.setColorAt(i,colour)}}
 if(idx===4&&state.footerEntered===undefined)state.footerEntered=elapsed;if(idx!==4)state.footerEntered=undefined;

 ribbons.forEach((r,i)=>{r.rotation.y=elapsed*(i?-.10:.12)*flow;r.rotation.x=Math.sin(elapsed*.4)*.12*flow;r.scale.set(1+expansion*.32,1+Math.sin(elapsed*.7)*.05*flow,1+expansion*.32)});
 if(ribbonShader){ribbonShader.uniforms.uFlowTime.value=elapsed*flow;ribbonShader.uniforms.uMotion.value=flow}
 ribbonMaterial.opacity=reduced?0:travel*.2;

 keyLight.position.x=3+Math.sin(elapsed*.3)*.5*flow;rimLight.intensity=idx===2?3.8:2.4;
 if(runningDrops){
   for(let i=0;i<dropPhases.length;i++){
     const d=dropPhases[i],y=.88-((d.phase+elapsed*d.speed*flow)%1.8);
     helper.position.set(Math.sin(d.angle)*.586,y,Math.cos(d.angle)*.586);
     helper.rotation.set(0,d.angle,0);helper.scale.set(d.size,d.size*2.6,d.size*.48);helper.updateMatrix();runningDrops.setMatrixAt(i,helper.matrix);
   }
   runningDrops.instanceMatrix.needsUpdate=true;
 }
 state.updateStage(currentX/viewW,weights);
 renderer.render(scene,camera);renderCount++;
 if(renderCount===1){document.body.classList.remove('no-webgl');document.body.classList.add('webgl-ready');window.revealPage()}
 // Small read-only diagnostics make real geometry, motion and allocation checks reproducible.
 if(frame%12===0)canvas.dataset.frame=String(frame);
 raf=requestAnimationFrame(animate);
}
async function init(){
 try{
   renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
   scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(30,innerWidth/innerHeight,.1,50);camera.position.set(0,0,11);
   const studio=new THREE.Scene();studio.background=new THREE.Color('#79727c');
   const panels=[[5,1.2,-3,2,4],[-4,1,2,1.8,5],[0,5,0,4,3],[0,-4,1,3,2]];
   for(const [x,y,z,w,h] of panels){const panel=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:'#fff8f0',side:THREE.DoubleSide}));panel.position.set(x,y,z);panel.lookAt(0,0,0);studio.add(panel)}
   const pmrem=new THREE.PMREMGenerator(renderer);scene.environment=pmrem.fromScene(studio,.025).texture;studio.traverse(o=>{o.geometry?.dispose();o.material?.dispose()});pmrem.dispose();
   scene.add(new THREE.HemisphereLight('#fff8f0','#8a6e91',1.8));
   keyLight=new THREE.DirectionalLight('#fff3df',2.5);keyLight.position.set(3,5,5);scene.add(keyLight);
   rimLight=new THREE.DirectionalLight('#cbb4f0',2.4);rimLight.position.set(-3,2,-3);scene.add(rimLight);
   const strip=new THREE.DirectionalLight('#ffffff',2);strip.position.set(-4,1,5);scene.add(strip);
   flightGroup=new THREE.Group();flightGroup.name='flightGroup';scene.add(flightGroup);productRoot=new THREE.Group();productRoot.name='productRoot';productRoot.scale.set(.9,1.09,.9);flightGroup.add(productRoot);
   // Fonts cannot hold the product hostage. Refresh the procedural labels when fonts arrive.
   makeCan();makeOrbit();resize();
   const initial=(mobile()?mobileKeys:desktopKeys)[0];currentX=initial.x*viewW;currentY=initial.y*viewH;currentScale=initial.s;currentYaw=initial.ya*rad;currentRoll=initial.ro*rad;currentPitch=initial.pi;
   const refreshLabels=()=>labels.forEach((mesh,i)=>{const old=mesh.material.map;mesh.material.map=buildLabel(i);old.dispose();mesh.material.needsUpdate=true});
   document.fonts.ready.then(refreshLabels);
   addEventListener('pointermove',e=>{pointerX=(e.clientX/width-.5)*2;pointerY=(e.clientY/height-.5)*2},{passive:true});
   addEventListener('pointerleave',()=>{pointerX=pointerY=0});
   addEventListener('resize',resize,{passive:true});
   document.addEventListener('visibilitychange',()=>{if(!document.body.classList.contains('webgl-ready'))return;paused=document.hidden;if(paused)cancelAnimationFrame(raf);else{lastTime=performance.now();raf=requestAnimationFrame(animate)}});
   canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();fallback(new Error('WebGL context lost'))});
   window.__bloom={snapshot:()=>({frame,renderCount,position:flightGroup.position.toArray(),rotation:productRoot.rotation.toArray().slice(0,3),scale:flightGroup.scale.x,weights:[...weights],colour:physicalMaterial.color.getHexString(),particleMatrix:Array.from(particleMesh.instanceMatrix.array.slice(0,16)),geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures,drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,particles:particleCount,three:THREE.REVISION,chapter:state.chapter,reduced:state.reduced}),scene,camera};
   lastTime=performance.now();raf=requestAnimationFrame(animate);
 }catch(error){fallback(error)}
}
init();
