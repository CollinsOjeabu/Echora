"use client";
import { useEffect, useRef } from "react";

const C = { ember:"#FF6B35", cream:"#EDE8E0", creamMuted:"rgba(237,232,224,0.45)", void:"#070E09", surface:"#0D1610", border:"#1E2E22", success:"#1D9E75" };

function Reveal({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) el.classList.add("visible"); }, { threshold: 0.1 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return <div ref={ref} className="reveal" style={style}>{children}</div>;
}

const tiles = [
  {
    col:1, icon:<svg fill="none" viewBox="0 0 16 16" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round" width={16} height={16}><circle cx="8" cy="8" r="5"/><circle cx="8" cy="8" r="2" fill="#FF6B35" stroke="none"/></svg>,
    bigNum:<><span style={{color:"#FF6B35"}}>94</span>%</>, title:"Voice match score",
    desc:"Average fidelity across all generated posts. Trained from your writing, not a style template.",
  },
  {
    col:1, icon:<svg fill="none" viewBox="0 0 16 16" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round" width={16} height={16}><rect x="2" y="2" width="12" height="12" rx="2"/><path d="M5 8h6M8 5v6"/></svg>,
    title:"Save from anywhere",
    desc:"Browser extension, mobile share sheet, or paste a URL. Articles, PDFs, videos, tweets, voice notes — all ingested.",
  },
  {
    col:1, icon:<svg fill="none" viewBox="0 0 16 16" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round" width={16} height={16}><path d="M2 12 C2 8 5 4 10 3"/><path d="M5 12 C5 9 7 6 10 5"/><line x1="3.5" y1="1.5" x2="5.5" y2="12.5" stroke="#EDE8E0" strokeWidth="1.2"/></svg>,
    title:"LinkedIn + X agents",
    desc:"The Authority (LinkedIn) and The Catalyst (X) generate platform-native content from your synthesis.",
  },
  {
    col:2, badge:"Core feature",
    icon: null,
    title:"Synthesis canvas — the differentiator",
    desc:"Drag 3–6 saved sources onto the canvas. Echora maps the connections and surfaces insights you'd never have made alone. Every post is built from that synthesis — not from a blank prompt.",
    bars:true,
  },
  {
    col:1, icon:<svg fill="none" viewBox="0 0 16 16" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round" width={16} height={16}><rect x="2" y="3" width="12" height="11" rx="2"/><line x1="5" y1="1" x2="5" y2="5"/><line x1="11" y1="1" x2="11" y2="5"/><line x1="2" y1="7" x2="14" y2="7"/></svg>,
    title:"Content calendar",
    desc:"Schedule posts to LinkedIn and X from one view. Queue approved drafts, see your publishing rhythm.",
    calendar:true,
  },
  {
    col:1, icon:<svg fill="none" viewBox="0 0 16 16" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round" width={16} height={16}><polyline points="2,12 6,7 10,9 14,3"/></svg>,
    title:"Source analytics",
    desc:"See which saved sources drive the most engagement. Analytics feed back into your knowledge graph.",
    miniChart:true,
  },
  {
    col:1, icon:<svg fill="none" viewBox="0 0 16 16" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round" width={16} height={16}><circle cx="6.5" cy="6.5" r="4"/><line x1="10" y1="10" x2="13.5" y2="13.5"/></svg>,
    title:"Research discovery",
    desc:"Need more sources? Research mode surfaces relevant articles and papers based on your knowledge graph.",
  },
  {
    col:1, icon:<svg fill="none" viewBox="0 0 16 16" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round" width={16} height={16}><path d="M8 2a5 5 0 100 10 5 5 0 000-10z"/><path d="M6 12v2M10 12v2M6 14h4"/><line x1="8" y1="5" x2="8" y2="9"/></svg>,
    title:"Future content ideas",
    desc:"Echora proactively surfaces post ideas in your voice — based on what you've saved, what's performed, and what's trending in your niche.",
  },
  {
    col:1, icon:null, avatars:true,
    bigNum:<><span style={{color:"#FF6B35"}}>847</span></>,
    title:"Creators this week",
    desc:"Already synthesising research into original content.",
  },
];

const calDays = [
  {d:"M"},{d:"T"},{d:"W"},{d:"T"},{d:"F"},{d:"S"},{d:"S"},
  {d:"1"},{d:"2",post:true},{d:"3"},{d:"4",post:true},{d:"5"},{d:"6"},{d:"7"},
  {d:"8",post:true},{d:"9"},{d:"10",today:true},{d:"11"},{d:"12",post:true},{d:"13"},{d:"14"},
];
const chartHeights = [30,55,40,85,65,70,90,60,75,50];

export default function FeaturesBento() {
  return (
    <section id="features" style={{padding:"140px 24px",background:C.surface}}>
      <div style={{maxWidth:1100,margin:"0 auto"}}>
        <Reveal style={{textAlign:"center",marginBottom:60}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:C.ember,letterSpacing:"0.1em",marginBottom:12}}>(04) — Everything you need</div>
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:"clamp(34px,5vw,50px)",fontWeight:400,letterSpacing:"-0.025em",color:C.cream}}>The full synthesis platform</h2>
        </Reveal>

        <Reveal>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
            {tiles.map((t, i) => (
              <div key={i} style={{
                background:C.void, border:`0.5px solid ${C.border}`, borderRadius:14, padding:24,
                position:"relative", overflow:"hidden", gridColumn: t.col===2?"span 2":"span 1",
                transition:"border-color 0.2s, transform 0.2s",
              }}
                onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.borderColor="rgba(255,107,53,0.25)";(e.currentTarget as HTMLDivElement).style.transform="translateY(-2px)"}}
                onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.borderColor=C.border;(e.currentTarget as HTMLDivElement).style.transform=""}}>
                {t.badge && <span style={{position:"absolute",top:18,right:18,fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:C.ember,background:"rgba(255,107,53,0.1)",padding:"2px 8px",borderRadius:20}}>{t.badge}</span>}
                {t.avatars && (
                  <div style={{display:"flex",marginBottom:12}}>
                    {["SR","MT","AO","+"].map((av,j)=><div key={j} style={{width:28,height:28,borderRadius:"50%",background:j===3?C.ember:"#152219",border:`2px solid ${C.void}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:600,color:j===3?"#fff":C.cream,marginLeft:j===0?0:-6}}>{av}</div>)}
                  </div>
                )}
                {t.icon && <div style={{width:36,height:36,borderRadius:9,background:"rgba(255,107,53,0.10)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16}}>{t.icon}</div>}
                {t.bigNum && <div style={{fontFamily:"'DM Serif Display',serif",fontSize:t.avatars?34:50,fontWeight:400,color:C.cream,lineHeight:1,marginBottom:8}}>{t.bigNum}</div>}
                <h3 style={{fontSize:15,fontWeight:600,color:C.cream,marginBottom:8}}>{t.title}</h3>
                <p style={{fontSize:13,color:C.creamMuted,lineHeight:1.6}}>{t.desc}</p>
                {t.bars && (
                  <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:14}}>
                    {[{l:"Sources connected",p:100,v:"5/5"},{l:"Insights surfaced",p:60,v:"3 found"},{l:"Voice match",p:94,v:"94%"}].map(b=>(
                      <div key={b.l} style={{display:"flex",alignItems:"center",gap:10}}>
                        <span style={{fontSize:11,color:C.creamMuted,width:90,flexShrink:0}}>{b.l}</span>
                        <div style={{flex:1,height:3,background:"rgba(237,232,224,0.06)",borderRadius:100}}>
                          <div style={{height:"100%",borderRadius:100,background:C.ember,width:`${b.p}%`}}/>
                        </div>
                        <span style={{fontSize:10,color:C.ember,fontFamily:"'JetBrains Mono',monospace",width:30,textAlign:"right"}}>{b.v}</span>
                      </div>
                    ))}
                  </div>
                )}
                {t.calendar && (
                  <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginTop:12}}>
                    {calDays.map((d,j)=>(
                      <div key={j} style={{height:20,borderRadius:3,display:"flex",alignItems:"center",justifyContent:"center",
                        fontSize: j<7?8:9, fontFamily:"'JetBrains Mono',monospace",
                        background: d.today?C.ember: d.post?"rgba(255,107,53,0.1)":"transparent",
                        color: d.today?"#fff": d.post?C.ember: j<7?"rgba(237,232,224,0.2)":"rgba(237,232,224,0.3)"}}>{d.d}</div>
                    ))}
                  </div>
                )}
                {t.miniChart && (
                  <div style={{display:"flex",alignItems:"flex-end",gap:3,height:48,marginTop:12}}>
                    {chartHeights.map((h,j)=>(
                      <div key={j} style={{flex:1,background:h>=85?"#FF6B35":"rgba(255,107,53,0.15)",borderRadius:"2px 2px 0 0",height:`${h}%`}}/>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
