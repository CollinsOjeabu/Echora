"use client";
import { useEffect, useRef } from "react";

const C = { ember:"#FF6B35", cream:"#EDE8E0", creamMuted:"rgba(237,232,224,0.45)", void:"#070E09", surface:"#0D1610", border:"#1E2E22", success:"#1D9E75" };

function Reveal({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) el.classList.add("visible"); }, { threshold: 0.05 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return <div ref={ref} className="reveal" style={style}>{children}</div>;
}

const testimonials1 = [
  { text:"The canvas is the thing. I've been saving research for years — Echora is the first tool that actually makes me use it.", name:"Sarah R.", role:"Founder, B2B SaaS", av:"SR", match:"94% voice" },
  { text:"I used to read 20 articles a week and publish nothing. Now my research actually becomes content. The synthesis step is what was missing.", name:"Marcus T.", role:"Growth Consultant", av:"MT", match:"91% voice" },
  { text:"The voice match is real. First time I've seen 94% and actually agreed. It's not just my writing style — it pulled from specific things I've saved.", name:"Amara O.", role:"LinkedIn Creator, 40K", av:"AO", match:"91% voice" },
  { text:"The scheduling and analytics closed the loop for me. I can see exactly which research sources drove engagement.", name:"James K.", role:"CEO, Tech Startup", av:"JK", match:"89% voice" },
];
const testimonials2 = [
  { text:"Stopped using Taplio after one week. Their tool writes from nothing. Echora writes from everything I've already researched.", name:"David L.", role:"Founder, Agency", av:"DL", match:"96% voice" },
  { text:"The future content ideas feature is wild. It looks at my saved library and tells me what I should write about next.", name:"Rahul K.", role:"Investor & Writer", av:"RK", match:"93% voice" },
  { text:"I was skeptical until I saw the synthesis canvas. Pulling 5 pieces of research together and watching connections emerge — truly new.", name:"Priya N.", role:"Product Manager", av:"PN", match:"92% voice" },
  { text:"Analytics finally tied to source material. I know which articles drove my best performing posts. Worth the subscription alone.", name:"Lisa M.", role:"CMO, Series B", av:"LM", match:"88% voice" },
];

function TCard({ t }: { t: typeof testimonials1[0] }) {
  return (
    <div style={{background:C.void,border:`0.5px solid ${C.border}`,borderRadius:14,padding:"20px 22px",width:340,flexShrink:0}}>
      <span style={{fontFamily:"'DM Serif Display',serif",fontSize:44,color:"rgba(255,107,53,0.2)",lineHeight:0.5,marginBottom:12,display:"block"}}>&ldquo;</span>
      <p style={{fontFamily:"'DM Serif Display',serif",fontStyle:"italic",fontSize:14,color:C.cream,lineHeight:1.65,marginBottom:16}}>
        {t.text}
      </p>
      <hr style={{border:"none",borderTop:`0.5px solid ${C.border}`,marginBottom:12}}/>
      <div style={{display:"flex",alignItems:"center",gap:9}}>
        <div style={{width:30,height:30,borderRadius:"50%",background:"#152219",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:600,color:C.cream,flexShrink:0}}>{t.av}</div>
        <div>
          <div style={{fontSize:12,fontWeight:500,color:C.cream}}>{t.name}</div>
          <div style={{fontSize:11,color:C.creamMuted}}>{t.role}</div>
        </div>
        <span style={{marginLeft:"auto",fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.ember,background:"rgba(255,107,53,0.1)",padding:"2px 7px",borderRadius:20,flexShrink:0}}>{t.match}</span>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="testimonials" style={{background:C.surface,overflow:"hidden",padding:"120px 0"}}>
      <Reveal style={{textAlign:"center",marginBottom:56,padding:"0 24px"}}>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"rgba(237,232,224,0.18)",marginBottom:12}}>(06) — Social proof</div>
        <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:"clamp(34px,5vw,50px)",fontWeight:400,letterSpacing:"-0.025em",color:C.cream}}>Used by the void&apos;s brightest.</h2>
      </Reveal>

      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {/* Row 1 — forward */}
        <div style={{display:"flex",gap:14,overflow:"hidden"}}>
          <div className="animate-marquee" style={{display:"flex",gap:14,flexShrink:0}}>
            {[...testimonials1,...testimonials1].map((t,i) => <TCard key={i} t={t}/>)}
          </div>
        </div>
        {/* Row 2 — reverse */}
        <div style={{display:"flex",gap:14,overflow:"hidden"}}>
          <div className="animate-marquee-reverse" style={{display:"flex",gap:14,flexShrink:0}}>
            {[...testimonials2,...testimonials2].map((t,i) => <TCard key={i} t={t}/>)}
          </div>
        </div>
      </div>
    </section>
  );
}
