import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import './Hero.css';

function isDarkMode(): boolean {
  const root = document.documentElement;
  if (root.dataset.theme) return root.dataset.theme !== 'light';
  if (root.classList.contains('light')) return false;
  if (root.classList.contains('dark'))  return true;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}
function getThemeColors() {
  const dark = isDarkMode();
  return {
    geomBright: dark ? '#00ff77' : '#008833',
    geomMid:    dark ? '#00dd55' : '#006622',
    geomDim:    dark ? '#009933' : '#004d1a',
    canvasCode: dark ? '#00bb44' : '#006622',
    canvasDim:  dark ? '#2d6e40' : '#4a9e60',
    bannerCol:  dark ? '#007733' : '#005522',
    katexCol:   dark ? '#00cc55' : '#006622',
  };
}

function ProfilePic() {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const cardRef   = useRef<HTMLDivElement>(null);
  const layer1Ref = useRef<HTMLDivElement>(null); // floats closest
  const layer2Ref = useRef<HTMLDivElement>(null); // floats mid
  const layer3Ref = useRef<HTMLDivElement>(null); // floats furthest
  const rafRef    = useRef<number>(0);
  const cur       = useRef({ rx: 0, ry: 0 });
  const tgt       = useRef({ rx: 0, ry: 0 });
  const [isGlitching, setIsGlitching] = useState(false);
  const glitchTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const wrap = wrapRef.current;
    const card = cardRef.current;
    if (!wrap || !card) return;

    function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

    function tick() {
      cur.current.rx = lerp(cur.current.rx, tgt.current.rx, 0.1);
      cur.current.ry = lerp(cur.current.ry, tgt.current.ry, 0.1);
      const { rx, ry } = cur.current;

      // Main card tilt
      card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;

      // Shine moves with tilt
      const shine = card.querySelector('.pfp-shine') as HTMLElement;
      if (shine) {
        const nx = (ry / 20 + 1) / 2;
        const ny = (rx / 20 + 1) / 2;
        shine.style.background = `radial-gradient(circle at ${nx*100}% ${ny*100}%, rgba(255,255,255,0.2) 0%, transparent 60%)`;
      }

      const t1 = layer1Ref.current;
      const t2 = layer2Ref.current;
      const t3 = layer3Ref.current;
      if (t1) t1.style.transform = `translate(${ry * 1.8}px, ${-rx * 1.8}px) translateZ(30px)`;
      if (t2) t2.style.transform = `translate(${ry * 1.1}px, ${-rx * 1.1}px) translateZ(18px)`;
      if (t3) t3.style.transform = `translate(${ry * 0.5}px, ${-rx * 0.5}px) translateZ(8px)`;

      // Dynamic shadow depth based on tilt
      const shadowX = ry * 0.8;
      const shadowY = -rx * 0.8;
      const shadowBlur = 20 + Math.abs(rx) * 0.8 + Math.abs(ry) * 0.8;
      card.style.filter = `drop-shadow(${shadowX}px ${shadowY + 8}px ${shadowBlur}px rgba(0,200,60,0.35))`;

      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);

    function onMouseMove(e: MouseEvent) {
      const rect = wrap.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      tgt.current.rx = -((e.clientY - cy) / (rect.height / 2)) * 18;
      tgt.current.ry =  ((e.clientX - cx) / (rect.width  / 2)) * 18;
    }
    function onMouseLeave() { tgt.current.rx = 0; tgt.current.ry = 0; }

    wrap.addEventListener('mousemove', onMouseMove);
    wrap.addEventListener('mouseleave', onMouseLeave);
    return () => {
      cancelAnimationFrame(rafRef.current);
      wrap.removeEventListener('mousemove', onMouseMove);
      wrap.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  function triggerGlitch() {
    if (isGlitching) return;
    setIsGlitching(true);
    clearTimeout(glitchTimer.current);
    glitchTimer.current = setTimeout(() => setIsGlitching(false), 700);
  }

  const SRC = 'https://yt3.ggpht.com/rNAeF1dwJbnf8L6B1SS_iwQJkeKLfGY7OfZxaGsOzoiIhdHoHmLXgMJQ5N9rauTgMrkdU3Emuw=s600-c-k-c0x00ffffff-no-rj-rp-mo';

  return (
    <div ref={wrapRef} className="pfp-wrapper" onMouseEnter={triggerGlitch}>

      <div ref={layer3Ref} className="pfp-depth-layer pfp-depth-layer--3">
        <div className="pfp-orbit-ring pfp-orbit-ring--outer" />
      </div>

      <div ref={layer2Ref} className="pfp-depth-layer pfp-depth-layer--2">
        <div className="pfp-orbit-ring pfp-orbit-ring--inner" />
        <div className="pfp-dot pfp-dot--1" />
        <div className="pfp-dot pfp-dot--2" />
        <div className="pfp-dot pfp-dot--3" />
      </div>

      <div ref={cardRef} className="pfp-card">
        <div className="profile-ring">
          <img src={SRC} alt="emielsterdev" className="profile-image" />
          <div className="pfp-shine" />
        </div>

        {isGlitching && (
          <div className="pfp-glitch-wrap">
            <img src={SRC} alt="" className="pfp-glitch pfp-glitch--r" aria-hidden />
            <img src={SRC} alt="" className="pfp-glitch pfp-glitch--g" aria-hidden />
            <img src={SRC} alt="" className="pfp-glitch pfp-glitch--b" aria-hidden />
            <div className="pfp-scanlines" />
          </div>
        )}
      </div>

      <div ref={layer1Ref} className="pfp-depth-layer pfp-depth-layer--1">
        <div className="pfp-particle pfp-particle--1" />
        <div className="pfp-particle pfp-particle--2" />
        <div className="pfp-particle pfp-particle--3" />
        <div className="pfp-particle pfp-particle--4" />
      </div>

      <div className={`pfp-glow ${isGlitching ? 'pfp-glow--glitch' : ''}`} />
    </div>
  );
}

const NAME = 'emielsterdev';
function BouncyName({ triggerKey }: { triggerKey: number }) {
  return (
    <span className="bouncy-name" aria-label={NAME}>
      {NAME.split('').map((char, i) => (
        <span key={`${triggerKey}-${i}`} className="bouncy-char" style={{ animationDelay: `${i * 55}ms` }}>
          {char}
        </span>
      ))}
    </span>
  );
}

// ─── Content pools ────────────────────────────────────────────────────────────
const KATEX_EQUATIONS = [
  String.raw`L_o(p,\omega_o) = \int_\Omega f(p,\omega_i,\omega_o) L_i(p,\omega_i)(n \cdot \omega_i) d\omega_i`,
  String.raw`D(h) = \frac{\alpha^2}{\pi((n \cdot h)^2(\alpha^2 - 1)+1)^2}`,
  String.raw`F(v,h) = F_0 + (1-F_0)(1-(v \cdot h))^5`,
  String.raw`\text{gl\_Position} = P \cdot V \cdot M \cdot \vec{v}`,
  String.raw`\vec{R} = \vec{I} - 2(\vec{N} \cdot \vec{I})\vec{N}`,
  String.raw`I = k_a I_a + k_d (L \cdot N) I_d + k_s (R \cdot V)^n I_s`,
  String.raw`\frac{\sin\theta_1}{\sin\theta_2} = \frac{n_2}{n_1}`,
  String.raw`\text{lerp}(a,b,t) = a + t(b-a)`,
  String.raw`\gamma = \text{pow}(\vec{c},\, \tfrac{1}{2.2})`,
  String.raw`F_0 = \text{mix}(0.04,\, \text{albedo},\, \text{metallic})`,
  String.raw`\text{atten} = \frac{1}{k_c + k_l d + k_q d^2}`,
  String.raw`\vec{H} = \text{normalize}(\vec{V} + \vec{L})`,
  String.raw`\text{NDC} = \frac{\vec{clip}.xyz}{\vec{clip}.w}`,
  String.raw`rot(\theta) = \begin{pmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{pmatrix}`,
];
const SHADER_SNIPPETS = [
  'vec3 N = getNormalFromMap();\nvec3 V = normalize(camPos - fragPos);\nvec3 F0 = mix(vec3(0.04), albedo, metallic);',
  'float NDF = DistributionGGX(N, H, roughness);\nfloat G   = GeometrySmith(N, V, L, roughness);\nvec3  F   = fresnelSchlick(dot(H,V), F0);',
  'layout(location=0) in vec3 inPosition;\nlayout(location=1) in vec3 inNormal;\nlayout(set=0,binding=0) uniform UBO { mat4 mvp; };',
  'cmdBuf.beginRenderPass(rpInfo, {});\ncmdBuf.bindPipeline(vk::PipelineBindPoint::eGraphics, pipe);\ncmdBuf.drawIndexed(indexCount, 1, 0, 0, 0);',
  'vk::raii::Instance m_instance{ nullptr };\nvk::InstanceCreateInfo createInfo{\n  .pApplicationInfo = &appInfo,\n};',
  'outColor = vec4(color / (color + vec3(1.0)), 1.0);\n// Reinhard tone mapping',
];
const BANNERS = [
  'Vertex Shader → Rasterizer → Fragment Shader → Output Merger → Framebuffer',
  'VK_KHR_swapchain  •  VK_KHR_surface  •  VK_EXT_debug_utils  •  VK_KHR_win32_surface',
  'PBR  •  IBL  •  SSAO  •  TAA  •  FXAA  •  Bloom  •  Tone Mapping  •  HDR  •  Gamma',
  '#include <vulkan/vulkan_raii.hpp>    //  C++20   //   SPIR-V   //   GLSL 4.50',
];
const PIPELINE_STAGES = ['Vertex Input','Vertex Shader','Tessellation','Geometry Shader','Rasterization','Fragment Shader','Depth/Stencil','Color Blend','Framebuffer'];

// ─── Three.js ─────────────────────────────────────────────────────────────────
function useThreeScene(mountRef: React.RefObject<HTMLDivElement>) {
  useEffect(() => {
    if (!mountRef.current) return;
    const el = mountRef.current;
    const W = el.offsetWidth, H = el.offsetHeight;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(W, H); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W/H, 0.1, 1000);
    camera.position.z = 6;
    function wireMat() {
      const c = getThemeColors();
      return new THREE.LineBasicMaterial({ color: new THREE.Color([c.geomBright,c.geomMid,c.geomDim][Math.floor(Math.random()*3)]), transparent: true, opacity: 0.7 });
    }
    interface GeomObj { mesh:THREE.LineSegments; rx:number; ry:number; rz:number; fadeIn:number; holdTimer:number; fadeOut:number; state:'in'|'hold'|'out'; holdDuration:number; }
    const objects: GeomObj[] = [];
    function spawnGeom() {
      const type = Math.floor(Math.random()*5);
      let geo: THREE.BufferGeometry;
      if      (type===0) geo=new THREE.EdgesGeometry(new THREE.BoxGeometry(1,1,1));
      else if (type===1) geo=new THREE.EdgesGeometry(new THREE.OctahedronGeometry(0.7));
      else if (type===2) geo=new THREE.EdgesGeometry(new THREE.TetrahedronGeometry(0.8));
      else if (type===3) geo=new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.7,0));
      else               geo=new THREE.EdgesGeometry(new THREE.ConeGeometry(0.6,1.2,4));
      const mesh = new THREE.LineSegments(geo, wireMat());
      mesh.scale.setScalar(0.5+Math.random()*1.2);
      mesh.position.set((Math.random()-0.5)*10,(Math.random()-0.5)*5,(Math.random()-0.5)*2-1);
      mesh.rotation.set(Math.random()*Math.PI*2,Math.random()*Math.PI*2,Math.random()*Math.PI*2);
      scene.add(mesh);
      objects.push({ mesh, rx:(Math.random()-0.5)*0.009, ry:(Math.random()-0.5)*0.013, rz:(Math.random()-0.5)*0.004, fadeIn:0, holdTimer:0, fadeOut:0, state:'in', holdDuration:4000+Math.random()*6000 });
    }
    for (let i=0;i<12;i++) spawnGeom();
    let spawnTimer=0, animId:number, last=0;
    const obs=new MutationObserver(()=>{ const c=getThemeColors(); for(const o of objects){ (o.mesh.material as THREE.LineBasicMaterial).color.set([c.geomBright,c.geomMid,c.geomDim][Math.floor(Math.random()*3)]); } });
    obs.observe(document.documentElement,{attributes:true,attributeFilter:['class','data-theme']});
    function animate(ts:number) {
      const dt=Math.min(ts-last,50); last=ts; spawnTimer+=dt;
      if(spawnTimer>1200&&objects.length<16){spawnGeom();spawnTimer=0;}
      for(let i=objects.length-1;i>=0;i--){
        const o=objects[i];
        o.mesh.rotation.x+=o.rx; o.mesh.rotation.y+=o.ry; o.mesh.rotation.z+=o.rz;
        const mat=o.mesh.material as THREE.LineBasicMaterial;
        if(o.state==='in'){o.fadeIn+=dt*0.0015;mat.opacity=Math.min(0.65,o.fadeIn);if(o.fadeIn>=0.65)o.state='hold';}
        else if(o.state==='hold'){o.holdTimer+=dt;if(o.holdTimer>o.holdDuration)o.state='out';}
        else{o.fadeOut+=dt*0.0008;mat.opacity=Math.max(0,0.65-o.fadeOut);if(mat.opacity<=0){scene.remove(o.mesh);o.mesh.geometry.dispose();objects.splice(i,1);}}
      }
      renderer.render(scene,camera); animId=requestAnimationFrame(animate);
    }
    animId=requestAnimationFrame(ts=>{last=ts;animate(ts);});
    const ro=new ResizeObserver(()=>{ const W2=el.offsetWidth,H2=el.offsetHeight; renderer.setSize(W2,H2);camera.aspect=W2/H2;camera.updateProjectionMatrix(); });
    ro.observe(el);
    return ()=>{cancelAnimationFrame(animId);ro.disconnect();obs.disconnect();renderer.dispose();el.removeChild(renderer.domElement);};
  },[]);
}

// ─── 2D canvas ────────────────────────────────────────────────────────────────
function use2DCanvas(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const mouseRef=useRef({x:0.5,y:0.5});
  useEffect(()=>{
    const canvas=canvasRef.current; if(!canvas)return;
    const ctx=canvas.getContext('2d'); if(!ctx)return;
    let animId:number,W=0,H=0,lastTime=0,spawnTimer=0;
    const MAX_EL=18,SPAWN_MS=500;
    type Kind2D='shader'|'pipeline'|'vector'|'banner'|'sinwave'|'comment';
    interface El2D{id:number;kind:Kind2D;x:number;y:number;vx:number;opacity:number;phase:'in'|'hold'|'out';phaseTimer:number;holdDuration:number;fontSize:number;color:string;lines?:string[];lineProgress?:number;currentLine?:number;stages?:string[];stageProgress?:number;angle?:number;length?:number;label?:string;bannerText?:string;bannerDir?:1|-1;waveT?:number;}
    let uid=0;
    const rand=(a:number,b:number)=>a+Math.random()*(b-a);
    const pick=<T,>(a:T[]):T=>a[Math.floor(Math.random()*a.length)];
    const clamp=(v:number,lo:number,hi:number)=>Math.max(lo,Math.min(hi,v));
    function make():El2D{
      const c=getThemeColors();
      const kinds:Kind2D[]=['shader','shader','pipeline','vector','vector','banner','sinwave','comment'];
      const kind=pick(kinds),m=50;
      const base:El2D={id:uid++,kind,x:rand(m,W-m),y:rand(m,H-m),vx:0,opacity:0,phase:'in',phaseTimer:0,holdDuration:rand(2500,6000),fontSize:12,color:c.canvasCode};
      if(kind==='comment')return{...base,fontSize:rand(10,13),color:c.canvasDim,lines:[pick(['// cook-torrance BRDF','// GGX normal distribution','// tone map HDR → LDR','// acquire next swap image','// bind descriptor sets','// begin render pass'])],lineProgress:0,currentLine:0};
      if(kind==='shader')return{...base,fontSize:rand(9,12),color:c.canvasCode,lines:pick(SHADER_SNIPPETS).split('\n'),lineProgress:0,currentLine:0};
      if(kind==='pipeline')return{...base,x:rand(60,W-200),y:rand(m,H-280),fontSize:9.5,color:c.canvasCode,stages:PIPELINE_STAGES,stageProgress:0,holdDuration:rand(4000,7000)};
      if(kind==='vector')return{...base,fontSize:11,color:c.canvasCode,angle:rand(0,Math.PI*2),length:rand(35,95),label:pick(['N','L','V','H','R','T','ωᵢ','ωₒ'])};
      if(kind==='banner'){const dir:1|-1=Math.random()>0.5?1:-1;return{...base,x:dir===1?-700:W+700,y:rand(30,H-30),vx:dir*rand(0.25,0.65),fontSize:rand(11,14),color:c.bannerCol,bannerText:pick(BANNERS),bannerDir:dir,holdDuration:99999,opacity:0.4};}
      return{...base,x:rand(0,W*0.3),y:rand(H*0.2,H*0.8),fontSize:10,color:c.canvasCode,waveT:0,holdDuration:rand(3500,7000)};
    }
    function resize(){W=canvas.offsetWidth;H=canvas.offsetHeight;canvas.width=W;canvas.height=H;}
    let elements:El2D[]=[];
    function drawEl(el:El2D,dt:number){
      const FADE=0.002*dt;
      if(el.kind!=='banner'){
        if(el.phase==='in'){el.opacity=Math.min(1,el.opacity+FADE);if(el.opacity>=0.9){el.phase='hold';el.phaseTimer=0;}}
        else if(el.phase==='hold'){el.phaseTimer+=dt;if(el.phaseTimer>el.holdDuration)el.phase='out';}
        else el.opacity=Math.max(0,el.opacity-FADE*0.5);
      }
      ctx.globalAlpha=clamp(el.opacity,0,1);
      if(['shader','comment'].includes(el.kind)){
        if(!el.lines?.length)return;
        ctx.font=`${el.fontSize}px monospace`;el.lineProgress=(el.lineProgress??0)+0.16*dt;
        let cl=Math.floor(el.lineProgress),li=el.currentLine??0;
        while(li<el.lines.length-1&&cl>=el.lines[li].length){cl-=el.lines[li].length;li++;el.currentLine=li;el.lineProgress=cl;}
        const lh=el.fontSize+5;
        for(let i=0;i<=li&&i<el.lines.length;i++){const line=el.lines[i];if(!line)continue;const txt=i<li?line:line.slice(0,Math.floor(el.lineProgress??0));ctx.fillStyle=el.color;ctx.fillText(txt,el.x,el.y+i*lh);}
        if(el.phase!=='out'&&Math.floor(Date.now()/420)%2===0){const cl2=el.lines[Math.min(li,el.lines.length-1)];if(cl2){const s=li<el.lines.length-1?cl2:cl2.slice(0,Math.floor(el.lineProgress??0));ctx.fillStyle=el.color;ctx.fillRect(el.x+ctx.measureText(s).width+2,el.y+li*lh-el.fontSize,1.5,el.fontSize+2);}}
      } else if(el.kind==='pipeline'){
        if(!el.stages)return;
        el.stageProgress=Math.min(el.stages.length,(el.stageProgress??0)+0.003*dt);
        const vis=Math.floor(el.stageProgress),BW=140,BH=20,GAP=6,fill=isDarkMode()?'rgba(0,180,60,0.07)':'rgba(0,120,40,0.06)';
        for(let i=0;i<vis;i++){const bx=el.x,by=el.y+i*(BH+GAP);ctx.strokeStyle=el.color;ctx.lineWidth=0.7;ctx.strokeRect(bx,by,BW,BH);ctx.fillStyle=fill;ctx.fillRect(bx,by,BW,BH);ctx.fillStyle=el.color;ctx.font=`${el.fontSize}px monospace`;ctx.fillText(el.stages[i],bx+7,by+BH-5);if(i<vis-1){const ax=bx+BW/2,ay=by+BH;ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(ax,ay+GAP-1);ctx.strokeStyle=el.color;ctx.lineWidth=0.7;ctx.stroke();ctx.beginPath();ctx.moveTo(ax-3,ay+GAP-5);ctx.lineTo(ax,ay+GAP);ctx.lineTo(ax+3,ay+GAP-5);ctx.stroke();}}
      } else if(el.kind==='vector'){
        const ox=el.x,oy=el.y,ex=ox+Math.cos(el.angle!)*el.length!,ey=oy+Math.sin(el.angle!)*el.length!;
        ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(ex,ey);ctx.strokeStyle=el.color;ctx.lineWidth=1.3;ctx.stroke();
        const ha=Math.atan2(ey-oy,ex-ox);ctx.beginPath();ctx.moveTo(ex,ey);ctx.lineTo(ex-9*Math.cos(ha-0.38),ey-9*Math.sin(ha-0.38));ctx.lineTo(ex-9*Math.cos(ha+0.38),ey-9*Math.sin(ha+0.38));ctx.closePath();ctx.fillStyle=el.color;ctx.fill();
        ctx.fillStyle=el.color;ctx.font=`italic ${el.fontSize!+3}px serif`;ctx.fillText(el.label!,ex+6,ey-4);
        ctx.beginPath();ctx.arc(ox,oy,2.5,0,Math.PI*2);ctx.fillStyle=el.color;ctx.fill();
      } else if(el.kind==='banner'){
        if(!el.bannerText)return;el.x+=el.vx!*dt*0.05;
        ctx.font=`${el.fontSize}px monospace`;ctx.fillStyle=el.color;ctx.fillText(el.bannerText,el.x,el.y);
        const tw=ctx.measureText(el.bannerText).width;
        if(el.bannerDir===1&&el.x>W+50)el.opacity=0;if(el.bannerDir===-1&&el.x+tw<-50)el.opacity=0;
      } else if(el.kind==='sinwave'){
        el.waveT=(el.waveT??0)+dt*0.0015;const mx=mouseRef.current.x,my=mouseRef.current.y;
        const freq=0.03+mx*0.05,amp=15+my*40,wW=Math.min(W*0.5,400);
        ctx.beginPath();for(let px=0;px<=wW;px+=2){const py=el.y+Math.sin(px*freq+el.waveT)*amp;px===0?ctx.moveTo(el.x+px,py):ctx.lineTo(el.x+px,py);}
        ctx.strokeStyle=el.color;ctx.lineWidth=1.2;ctx.stroke();ctx.fillStyle=el.color;ctx.font=`9px monospace`;ctx.fillText(`sin(x·${freq.toFixed(2)}) · ${amp.toFixed(0)}`,el.x,el.y-8);
      }
      ctx.globalAlpha=1;
    }
    function tick(ts:number){
      const dt=Math.min(ts-lastTime,50);lastTime=ts;ctx.clearRect(0,0,W,H);spawnTimer+=dt;
      if(spawnTimer>SPAWN_MS&&elements.length<MAX_EL){elements.push(make());spawnTimer=0;}
      elements=elements.filter(el=>{drawEl(el,dt);return !(el.phase==='out'&&el.opacity<=0);});
      animId=requestAnimationFrame(tick);
    }
    resize();
    for(let i=0;i<10;i++){const el=make();el.opacity=Math.random()*0.55+0.05;el.phase='hold';el.phaseTimer=Math.random()*2500;elements.push(el);}
    animId=requestAnimationFrame(ts=>{lastTime=ts;tick(ts);});
    window.addEventListener('resize',resize);
    canvas.addEventListener('mousemove',(e)=>{const r=canvas.getBoundingClientRect();mouseRef.current.x=(e.clientX-r.left)/W;mouseRef.current.y=(e.clientY-r.top)/H;});
    return()=>{cancelAnimationFrame(animId);window.removeEventListener('resize',resize);};
  },[]);
}

// ─── KaTeX ────────────────────────────────────────────────────────────────────
interface KatexItem{id:number;eq:string;x:number;y:number;opacity:number;phase:'in'|'hold'|'out';phaseTimer:number;holdDuration:number;fontSize:number;}
function useKatexElements(containerRef:React.RefObject<HTMLDivElement>){
  useEffect(()=>{
    const container=containerRef.current;if(!container)return;
    let uid=0;const items:KatexItem[]=[];const MAX=6;
    const rand=(a:number,b:number)=>a+Math.random()*(b-a);
    let spawnTimer=0,lastTime=0,animId:number;
    const divMap=new Map<number,HTMLDivElement>();
    function spawn(){
      const W=container.offsetWidth,H=container.offsetHeight,c=getThemeColors();
      const item:KatexItem={id:uid++,eq:KATEX_EQUATIONS[Math.floor(Math.random()*KATEX_EQUATIONS.length)],x:rand(20,W-320),y:rand(40,H-80),opacity:0,phase:'in',phaseTimer:0,holdDuration:rand(3000,7000),fontSize:rand(10,14)};
      items.push(item);
      const div=document.createElement('div');div.className='katex-float';
      div.style.cssText=`position:absolute;left:${item.x}px;top:${item.y}px;font-size:${item.fontSize}px;opacity:0;pointer-events:none;color:${c.katexCol};`;
      try{katex.render(item.eq,div,{throwOnError:false,displayMode:false});}catch{div.textContent=item.eq;}
      container.appendChild(div);divMap.set(item.id,div);
    }
    function recolor(){const c=getThemeColors();divMap.forEach(div=>{div.style.color=c.katexCol;});}
    const obs=new MutationObserver(recolor);
    obs.observe(document.documentElement,{attributes:true,attributeFilter:['class','data-theme']});
    function tick(ts:number){
      const dt=Math.min(ts-lastTime,50);lastTime=ts;spawnTimer+=dt;
      if(spawnTimer>1400&&items.length<MAX){spawn();spawnTimer=0;}
      const FADE=0.0015*dt;
      for(let i=items.length-1;i>=0;i--){
        const item=items[i];
        if(item.phase==='in'){item.opacity=Math.min(1,item.opacity+FADE);if(item.opacity>=0.85){item.phase='hold';item.phaseTimer=0;}}
        else if(item.phase==='hold'){item.phaseTimer+=dt;if(item.phaseTimer>item.holdDuration)item.phase='out';}
        else{item.opacity=Math.max(0,item.opacity-FADE*0.4);if(item.opacity<=0){const div=divMap.get(item.id);if(div){container.removeChild(div);divMap.delete(item.id);}items.splice(i,1);continue;}}
        const div=divMap.get(item.id);if(div)div.style.opacity=String(item.opacity*0.8);
      }
      animId=requestAnimationFrame(tick);
    }
    for(let i=0;i<3;i++)spawn();
    animId=requestAnimationFrame(ts=>{lastTime=ts;tick(ts);});
    return()=>{cancelAnimationFrame(animId);obs.disconnect();divMap.forEach(div=>{if(container.contains(div))container.removeChild(div);});};
  },[]);
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
export function Hero() {
  const threeRef  = useRef<HTMLDivElement>(null!);
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const katexRef  = useRef<HTMLDivElement>(null!);
  const titleRef  = useRef<HTMLHeadingElement>(null!);
  const [triggerKey, setTriggerKey] = useState(0);

  useEffect(() => {
    const el = titleRef.current; if (!el) return;
    setTriggerKey(k => k + 1);
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTriggerKey(k => k + 1); },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useThreeScene(threeRef);
  use2DCanvas(canvasRef);
  useKatexElements(katexRef);

  const scrollToProjects = () => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  const scrollToContact  = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="hero" id="hero">
      <div ref={threeRef}    className="hero-three"  />
      <canvas ref={canvasRef} className="hero-canvas" />
      <div ref={katexRef}    className="hero-katex"  />
      <div className="hero-vignette" />
      <div className="hero-content">
        <div className="hero-profile">
          <ProfilePic />
        </div>
        <h1 className="hero-title" ref={titleRef}>
          <span className="title-small">Hey, I'm</span>
          <span className="title-large">
            <BouncyName triggerKey={triggerKey} />
          </span>
        </h1>
        <p className="hero-description">
          A developer focused on creating beginner-friendly yet powerful tools for Roblox.
          I build projects that balance simplicity with advanced capabilities.
          Any questions? Don't hesitate to reach out :)
        </p>
        <div className="hero-tags">
          {['C++', 'Vulkan', 'Luau', 'React'].map((tag, i) => (
            <span key={tag} className="hero-tag" style={{ animationDelay: `${0.8 + i * 0.08}s` }}>{tag}</span>
          ))}
        </div>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={scrollToProjects}>
            View My Work
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
          </button>
          <button className="btn btn-outline" onClick={scrollToContact}>Get in Touch</button>
        </div>
      </div>
    </section>
  );
}