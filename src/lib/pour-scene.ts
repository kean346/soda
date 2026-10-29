import * as THREE from 'three';

const clamp = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => { const t = clamp(x); return t * t * (3 - 2 * t); };

// Every moving object is a deterministic function of scroll progress.
// No video, photo crossfade, time-dependent simulation or external model assets.
export function createPourScene(host: HTMLElement) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#f2d66b');
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = .95;
  host.appendChild(renderer.domElement);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  const camera = new THREE.PerspectiveCamera(35, 1, .1, 50);
  camera.position.set(0, 1, 10);
  camera.lookAt(0, .3, 0);
  scene.add(new THREE.HemisphereLight(0xfff9e7, 0xa08a43, 1.8));
  const key = new THREE.DirectionalLight(0xffffff, 3); key.position.set(-3, 6, 5); scene.add(key);
  const rim = new THREE.DirectionalLight(0xfff0bd, 1.5); rim.position.set(3, 2, -3); scene.add(rim);

  const can = new THREE.Group(); scene.add(can);
  const yellow = new THREE.MeshStandardMaterial({ color: '#eaca59', roughness: .37, metalness: .38 });
  const silver = new THREE.MeshStandardMaterial({ color: '#d1d0bf', roughness: .25, metalness: .85 });
  const dark = new THREE.MeshStandardMaterial({ color: '#28271d', roughness: .4 });
  const profile = [[.45,-1.32],[.49,-1.3],[.53,-1.22],[.56,-1.12],[.56,1.08],[.53,1.2],[.49,1.27]];
  const body = new THREE.Mesh(new THREE.LatheGeometry(profile.map(([x,y]) => new THREE.Vector2(x,y)), 80), yellow); can.add(body);
  for (const y of [-1.3,1.28]) {
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(.49,.49,.035,64),silver);cap.position.y=y;can.add(cap);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(.49,.032,10,64),silver);ring.rotation.x=Math.PI/2;ring.position.y=y;can.add(ring);
  }

  // Original canvas-drawn packaging: serif-free lettering, botanical lemon artwork.
  const label = document.createElement('canvas'); label.width=1024;label.height=1024;
  const ctx = label.getContext('2d')!;
  ctx.fillStyle='#eee4c7';ctx.fillRect(0,0,1024,1024);
  ctx.fillStyle='#292c21';ctx.textAlign='center';ctx.font='120px sans-serif';ctx.fillText('CITRUS',512,185);
  ctx.font='135px serif';ctx.fillText('01',512,330);
  ctx.font='32px sans-serif';ctx.fillText('S P A R K L I N G',512,410);ctx.fillText('C I T R U S',512,455);
  ctx.strokeStyle='#5b6531';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(500,840);ctx.bezierCurveTo(490,650,700,600,620,430);ctx.stroke();
  for (const [x,y,r] of [[490,560,-.5],[625,505,.7],[560,720,-.7]]) {
    ctx.save();ctx.translate(x,y);ctx.rotate(r);ctx.fillStyle='#546b32';ctx.beginPath();ctx.ellipse(0,0,25,83,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#8b9a54';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-72);ctx.lineTo(0,72);ctx.stroke();ctx.restore();
  }
  ctx.save();ctx.translate(630,735);ctx.rotate(-.38);ctx.fillStyle='#dfbd48';ctx.beginPath();ctx.ellipse(0,0,82,120,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#f8e49a';ctx.lineWidth=3;
  for(let i=0;i<8;i++){ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(i*Math.PI/4)*73,Math.sin(i*Math.PI/4)*109);ctx.stroke();}ctx.restore();
  ctx.fillStyle='#292c21';ctx.font='35px sans-serif';ctx.fillText('250 mL',512,935);
  const wrapped=document.createElement('canvas');wrapped.width=1024;wrapped.height=1024;
  const wc=wrapped.getContext('2d')!;wc.fillStyle='#eaca59';wc.fillRect(0,0,1024,1024);wc.drawImage(label,320,0,384,1024);
  const texture = new THREE.CanvasTexture(wrapped);texture.colorSpace=THREE.SRGBColorSpace;
  const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(.563,.563,1.96,80,1,true),new THREE.MeshStandardMaterial({map:texture,roughness:.75}));
  sleeve.rotation.y=Math.PI;can.add(sleeve);
  const dewGeometry=new THREE.SphereGeometry(.014,6,6);
  const dewMaterial=new THREE.MeshPhysicalMaterial({color:'#fffbe4',roughness:.05,metalness:.1,transparent:true,opacity:.5});
  for(let i=0;i<85;i++){
    const a=i*2.39996;const y=-1.05+((i*.618)%1)*2.1;
    const dew=new THREE.Mesh(dewGeometry,dewMaterial);
    dew.position.set(Math.sin(a)*.569,y,Math.cos(a)*.569);dew.scale.set(1,1.5+(i%3)*.3,1);can.add(dew);
  }

  const opening = new THREE.Mesh(new THREE.CircleGeometry(.12,32),dark);opening.rotation.x=-Math.PI/2;opening.scale.y=1.45;opening.position.set(.25,1.301,0);can.add(opening);
  const seal=new THREE.Group();seal.position.set(.1,1.306,0);can.add(seal);
  const sealFace=new THREE.Mesh(new THREE.CircleGeometry(.119,32),silver);sealFace.rotation.x=-Math.PI/2;sealFace.scale.y=1.45;sealFace.position.x=.15;seal.add(sealFace);
  const tab = new THREE.Group();tab.position.set(-.05,1.32,0);can.add(tab);
  const tabRing = new THREE.Mesh(new THREE.TorusGeometry(.115,.035,8,32),silver);tabRing.rotation.x=Math.PI/2;tabRing.scale.x=1.55;tabRing.position.x=.12;tab.add(tabRing);
  const tabBridge = new THREE.Mesh(new THREE.BoxGeometry(.1,.025,.16),silver);tabBridge.position.x=-.025;tab.add(tabBridge);

  const glass = new THREE.Group();glass.position.set(1.05,-2.05,0);scene.add(glass);
  const glassMaterial=new THREE.MeshPhysicalMaterial({color:'#fff9df',roughness:.12,metalness:0,transparent:true,opacity:.25,side:THREE.DoubleSide,depthWrite:false});
  const glassProfile=[[0,0],[.55,0],[.58,.08],[.66,1.94],[.63,1.97],[.55,.13],[0,.13]];
  glass.add(new THREE.Mesh(new THREE.LatheGeometry(glassProfile.map(([x,y])=>new THREE.Vector2(x,y)),64),glassMaterial));
  const glassRim=new THREE.Mesh(new THREE.TorusGeometry(.645,.022,8,64),new THREE.MeshStandardMaterial({color:'#fff9de',transparent:true,opacity:.65,roughness:.2}));glassRim.rotation.x=Math.PI/2;glassRim.position.y=1.95;glass.add(glassRim);
  const ribMaterial=new THREE.MeshStandardMaterial({color:'#fff8dc',roughness:.2,transparent:true,opacity:.32});
  for(let i=0;i<32;i++){
    const a=i/32*Math.PI*2;
    const rib=new THREE.Mesh(new THREE.CylinderGeometry(.013,.013,1.83,5),ribMaterial);
    rib.position.set(Math.cos(a)*.6,1.02,Math.sin(a)*.6);glass.add(rib);
  }
  const liquidMaterial = new THREE.MeshPhysicalMaterial({color:'#dba92e',roughness:.14,metalness:.1,transparent:true,opacity:.85});
  const liquid=new THREE.Mesh(new THREE.CylinderGeometry(.583,.51,1,64),liquidMaterial);glass.add(liquid);
  const surface = new THREE.Mesh(new THREE.CircleGeometry(.586,64),new THREE.MeshStandardMaterial({color:'#f6d56a',roughness:.2,metalness:.15}));surface.rotation.x=-Math.PI/2;glass.add(surface);
  const streamMaterial = new THREE.MeshPhysicalMaterial({color:'#f8d76f',roughness:.12,metalness:.15,transparent:true,opacity:.88});
  const stream = new THREE.Mesh(new THREE.BufferGeometry(),streamMaterial);scene.add(stream);
  const dropletGeo=new THREE.SphereGeometry(.035,8,8);
  const droplets=Array.from({length:24},()=>{const d=new THREE.Mesh(dropletGeo,streamMaterial);scene.add(d);return d;});
  const bubbleGeo=new THREE.SphereGeometry(.023,8,8);
  const bubbles=Array.from({length:30},()=>{const d=new THREE.Mesh(bubbleGeo,new THREE.MeshStandardMaterial({color:'#fff3bd',transparent:true,opacity:.75}));glass.add(d);return d;});
  const ripple=new THREE.Mesh(new THREE.TorusGeometry(.25,.009,6,48),streamMaterial);ripple.rotation.x=Math.PI/2;glass.add(ripple);

  // Contact shadows, rendered once into a tiny texture instead of a costly shadow map.
  const shadowCanvas=document.createElement('canvas');shadowCanvas.width=128;shadowCanvas.height=128;
  const sc=shadowCanvas.getContext('2d')!;const grad=sc.createRadialGradient(64,64,1,64,64,64);grad.addColorStop(0,'rgba(76,55,12,.25)');grad.addColorStop(1,'rgba(76,55,12,0)');sc.fillStyle=grad;sc.fillRect(0,0,128,128);
  const shadowTex=new THREE.CanvasTexture(shadowCanvas);
  const shadow=new THREE.Mesh(new THREE.PlaneGeometry(6,2),new THREE.MeshBasicMaterial({map:shadowTex,transparent:true,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.set(.3,-2.09,0);scene.add(shadow);
  let lastProgress=0;
  function draw(p:number){
    lastProgress=clamp(p);
    const turn=ease(p/.25);const tilt=ease((p-.2)/.24);const fill=ease((p-.43)/.46);const finish=ease((p-.88)/.12);
    can.position.set(-.85-tilt*.3,1.25+tilt*.4,0);
    can.rotation.set(.07,turn*Math.PI*2, -.12-tilt*1.73+finish*.18);
    tab.rotation.z=ease((p-.14)/.1)*1.1;seal.rotation.z=-ease((p-.14)/.1)*1.5;
    const height=.02+fill*1.65;liquid.scale.y=height;liquid.position.y=.13+height/2;surface.position.y=.13+height;
    liquid.visible=surface.visible=fill>.001;
    const pouring=p>.435&&p<.94;
    stream.visible=pouring;ripple.visible=pouring;
    if(pouring){
      can.updateMatrixWorld(true);
      const start=can.localToWorld(new THREE.Vector3(.38,1.3,0));
      const end=new THREE.Vector3(1.05,-2.05+.13+height,0);
      const curve=new THREE.CubicBezierCurve3(start,start.clone().add(new THREE.Vector3(.35,-.1,0)),new THREE.Vector3(1.05,end.y+.5,0),end);
      stream.geometry.dispose();
      const taper=Math.min(1,(p-.435)*40,(.94-p)*40);
      stream.geometry=new THREE.TubeGeometry(curve,28,.053*Math.max(.04,taper),8,false);
      ripple.position.set(0,.14+height,0);ripple.scale.setScalar(.7+Math.sin(p*160)*.15);
    }
    droplets.forEach((d,i)=>{
      d.visible=pouring;
      const t=(p*7+i*.137)%1;const a=i*2.4;
      d.position.set(1.05+Math.cos(a)*(.14+t*.4),-2.05+.15+height+Math.sin(t*Math.PI)*.42,Math.sin(a)*(.14+t*.4));
      d.scale.setScalar(.5+Math.sin(i*9)**2);
    });
    bubbles.forEach((b,i)=>{
      const t=(p*3+i*.173)%1;const a=i*2.4;const radius=.1+(i%5)*.075;
      b.visible=fill>.01;b.position.set(Math.cos(a)*radius,.16+t*height,Math.sin(a)*radius);
    });
    renderer.render(scene,camera);
    host.dataset.progress=p.toFixed(3);
    host.dataset.fill=fill.toFixed(3);
    host.dataset.pouring=String(pouring);
  }
  const resize=()=>{
    const w=host.clientWidth,h=host.clientHeight;
    renderer.setSize(w,h);camera.aspect=w/h;
    camera.position.z=Math.max(10,5.8/(2*Math.tan(THREE.MathUtils.degToRad(17.5))*camera.aspect));camera.updateProjectionMatrix();draw(lastProgress);
  };
  const observer=new ResizeObserver(resize);observer.observe(host);resize();
  return {draw, dispose(){
    observer.disconnect();
    const geometries=new Set<THREE.BufferGeometry>();const materials=new Set<THREE.Material>();
    scene.traverse(obj=>{if(obj instanceof THREE.Mesh){geometries.add(obj.geometry);(Array.isArray(obj.material)?obj.material:[obj.material]).forEach(m=>materials.add(m));}});
    geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());texture.dispose();shadowTex.dispose();renderer.dispose();renderer.domElement.remove();
  }};
}
