"use client";
import { useEffect, useRef } from "react";

const C = { ember:"#FF6B35", cream:"#EDE8E0", creamMuted:"rgba(237,232,224,0.45)", void:"#070E09", surface:"#0D1610" };

function useReveal(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) el.classList.add("visible"); }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
}
function Reveal({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref);
  return <div ref={ref} className="reveal" style={style}>{children}</div>;
}

const steps = [
  {
    num:"01", featured:false,
    icon:<svg fill="none" viewBox="0 0 16 16" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round" width={16} height={16}><circle cx="8" cy="8" r="5"/><line x1="8" y1="5" x2="8" y2="11"/><line x1="5" y1="8" x2="11" y2="8"/></svg>,
    title:"Save anything",
    desc:"See something online that sparks an idea? Save it in one click — articles, videos, PDFs, tweets, voice notes.",
  },
  {
    num:"02 ← the magic", featured:true,
    icon:<svg fill="none" viewBox="0 0 16 16" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round" width={16} height={16}><circle cx="4" cy="4" r="2"/><circle cx="12" cy="4" r="2"/><circle cx="8" cy="12" r="2"/><line x1="6" y1="4" x2="10" y2="4"/><line x1="5" y1="6" x2="7.5" y2="10"/><line x1="11" y1="6" x2="8.5" y2="10"/></svg>,
    title:"Bring sources to the canvas",
    desc:"Select 3–6 saved pieces, bring them to the canvas. Echora maps the connections between them — ideas you'd never have joined alone surface instantly.",
  },
  {
    num:"03", featured:false,
    icon:<svg fill="none" viewBox="0 0 16 16" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round" width={16} height={16}><path d="M2 12 C2 8 5 4 10 3"/><path d="M5 12 C5 9 7 6 10 5"/><line x1="3.5" y1="1.5" x2="5.5" y2="12.5" stroke="#EDE8E0" strokeWidth="1.2"/></svg>,
    title:"Generate original content",
    desc:"The agent synthesises the connections into a post that reflects your unique perspective — not generic AI output. Every insight is sourced and cited.",
  },
  {
    num:"04", featured:false,
    icon:<svg fill="none" viewBox="0 0 16 16" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round" width={16} height={16}><rect x="2" y="3" width="12" height="10" rx="2"/><path d="M5 7h6M5 10h4"/></svg>,
    title:"Approve and schedule",
    desc:"Review the draft with every source cited. Edit, refine, or publish directly. Schedule across LinkedIn and X from one calendar.",
  },
  {
    num:"05", featured:false,
    icon:<svg fill="none" viewBox="0 0 16 16" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round" width={16} height={16}><polyline points="2,10 6,6 10,9 14,4"/><circle cx="14" cy="4" r="1.5" fill="#FF6B35" stroke="none"/></svg>,
    title:"Track and improve",
    desc:"See which sources drove the most engagement. Analytics feed back into your knowledge graph — future content ideas surface in your voice automatically.",
  },
];

const Arrow = () => (
  <div style={{position:"absolute",top:"50%",right:-1,transform:"translateY(-50%)",width:22,height:22,
    background:C.ember,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2}}>
    <svg fill="none" viewBox="0 0 10 10" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" width={9} height={9}><path d="M3 5h4M5 3l2 2-2 2"/></svg>
  </div>
);

export default function HowItWorks() {
  return (
    <section id="how-it-works" style={{padding:"140px 24px",background:C.surface}}>
      <div style={{maxWidth:1100,margin:"0 auto"}}>
        <Reveal style={{textAlign:"center",marginBottom:80}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"rgba(237,232,224,0.18)",marginBottom:48}}>
            (02) — The synthesis loop
          </div>
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:"clamp(34px,5vw,50px)",fontWeight:400,letterSpacing:"-0.025em",marginBottom:12,color:C.cream}}>
            From saved to published.<br/>Five steps. Your thinking.
          </h2>
          <p style={{fontSize:16,color:C.creamMuted}}>Not AI writing for you. AI amplifying what you already know.</p>
        </Reveal>

        <Reveal>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:2}}>
            {steps.map((s,i) => (
              <div key={s.num} style={{
                padding:"28px 20px",
                background: s.featured ? "rgba(255,107,53,0.04)" : C.void,
                border: s.featured ? "0.5px solid rgba(255,107,53,0.2)" : "0.5px solid #1E2E22",
                position:"relative",
                borderRadius: i===0?"12px 0 0 12px": i===steps.length-1?"0 12px 12px 0":0,
              }}>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"rgba(237,232,224,0.2)",marginBottom:16}}>{s.num}</div>
                <div style={{width:36,height:36,borderRadius:9,
                  background: s.featured?"rgba(255,107,53,0.18)":"rgba(255,107,53,0.10)",
                  display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14}}>
                  {s.icon}
                </div>
                <h3 style={{fontSize:14,fontWeight:600,color:C.cream,marginBottom:8}}>{s.title}</h3>
                <p style={{fontSize:12,color:C.creamMuted,lineHeight:1.65}}>{s.desc}</p>
                {i < steps.length-1 && <Arrow/>}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <p style={{textAlign:"center",marginTop:56,fontFamily:"'DM Serif Display',serif",fontStyle:"italic",fontSize:26,color:C.ember}}>
            The more you save, the sharper your synthesis gets.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
