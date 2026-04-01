"use client";
import { useEffect, useRef, useState } from "react";

const C = {
  ember: "#FF6B35", cream: "#EDE8E0", creamMuted: "rgba(237,232,224,0.45)",
  void: "#070E09", elevated: "#152219", success: "#1D9E75",
};

const cards = [
  {
    badge:"Synthesis · 4 sources connected", match:"94% voice match",
    post:'"73% of creators saw engagement drop after switching to generic AI. The algorithm didn\'t change. Their connection to real research did..."',
    bars:[{label:"Sources used",pct:100,display:"4/4"},{label:"Voice match",pct:94,display:"94%"},{label:"Insights found",pct:75,display:"3"}],
    sources:["AI Authenticity Study","LinkedIn Algo 2026","Creator Economy","+1 more"],
  },
  {
    badge:"Canvas · 5 sources · 7 connections", match:"Synthesising...",
    post:'"The gap nobody solved: your curated research and your published content live in completely separate worlds. Echora closes that gap."',
    bars:[{label:"Connections",pct:100,display:"7 found"},{label:"Insights",pct:60,display:"3"},{label:"Voice match",pct:91,display:"91%"}],
    sources:["5 sources on canvas","Auto-connected","Ready to generate"],
  },
  {
    badge:"Post draft · LinkedIn · approved", match:"91% voice match",
    post:'"I read 50 articles a week. For years, none of that thinking made it into my content. That changes today. Here\'s the system..."',
    bars:[{label:"Sources cited",pct:100,display:"4 cited"},{label:"Voice match",pct:91,display:"91%"},{label:"Engagement est.",pct:80,display:"High"}],
    sources:["4 sources cited","Approved","Scheduled 9am"],
  },
];

export default function Hero() {
  const [cardIdx, setCardIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setFade(false);
      setTimeout(() => { setCardIdx(i => (i+1)%cards.length); setFade(true); }, 400);
    }, 3800);
    return () => clearInterval(id);
  }, []);

  const c = cards[cardIdx];

  return (
    <section id="hero" style={{
      minHeight:"100vh", display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      padding:"120px 24px 80px", position:"relative", overflow:"hidden",
      background: C.void,
    }}>
      {/* Ambient glow */}
      <div style={{
        position:"absolute", top:-100, left:"50%", transform:"translateX(-50%)",
        width:800, height:500,
        background:"radial-gradient(ellipse, rgba(255,107,53,0.06) 0%, transparent 65%)",
        pointerEvents:"none",
      }}/>

      {/* Badge */}
      <div style={{
        display:"inline-flex", alignItems:"center", gap:7,
        background:"rgba(255,107,53,0.08)", border:"0.5px solid rgba(255,107,53,0.2)",
        borderRadius:100, padding:"5px 16px", fontSize:12, color:C.ember, marginBottom:28,
        animation:"fadeUp 0.8s ease both",
      }}>
        <div style={{width:6,height:6,borderRadius:"50%",background:C.success}}/>
        Now in early access
      </div>

      {/* Headline */}
      <h1 style={{
        fontFamily:"'DM Serif Display', serif", fontSize:"clamp(48px, 7.5vw, 84px)",
        fontWeight:400, color:C.cream, textAlign:"center",
        lineHeight:1.03, letterSpacing:"-0.03em", marginBottom:20,
        animation:"fadeUp 0.8s 0.1s ease both",
      }}>
        Save. Connect.<br/>
        <em style={{color:C.ember, fontStyle:"italic"}}>Publish original.</em>
      </h1>

      {/* Sub */}
      <p style={{
        fontSize:17, color:C.creamMuted, textAlign:"center", maxWidth:540,
        lineHeight:1.7, marginBottom:36, animation:"fadeUp 0.8s 0.2s ease both",
      }}>
        Echora turns the content you already consume into original thought leadership — by synthesising your saved research into posts that sound exactly like you.
      </p>

      {/* Buttons */}
      <div style={{display:"flex",gap:12,marginBottom:16,animation:"fadeUp 0.8s 0.3s ease both"}}>
        <button style={{
          fontSize:14, fontWeight:600, background:C.ember, color:"#fff",
          padding:"13px 28px", borderRadius:100, border:"none", cursor:"pointer",
        }}>
          Start synthesising for free →
        </button>
        <button style={{
          fontSize:14, background:"transparent", color:C.creamMuted,
          padding:"13px 24px", borderRadius:100,
          border:"1px solid rgba(237,232,224,0.12)", cursor:"pointer",
        }}>
          See how it works
        </button>
      </div>
      <p style={{fontSize:12,color:"rgba(237,232,224,0.2)",marginBottom:52,animation:"fadeUp 0.8s 0.35s ease both"}}>
        Joined by 847 creators already turning research into content
      </p>

      {/* Card Stack */}
      <div style={{position:"relative",width:"min(520px, 90vw)",height:220,animation:"fadeUp 0.8s 0.45s ease both"}}>
        <div style={{position:"absolute",left:"50%",width:"min(520px,90vw)",borderRadius:14,padding:"20px 22px",
          border:"0.5px solid rgba(237,232,224,0.04)",background:"rgba(9,15,10,0.45)",
          top:26,transform:"translateX(-50%) rotate(-4deg)",zIndex:1,height:170}}/>
        <div style={{position:"absolute",left:"50%",width:"min(520px,90vw)",borderRadius:14,padding:"20px 22px",
          border:"0.5px solid rgba(237,232,224,0.05)",background:"rgba(12,20,14,0.6)",
          top:13,transform:"translateX(-50%) rotate(-2deg)",zIndex:2,height:178}}/>
        <div style={{position:"absolute",left:"50%",width:"min(520px,90vw)",borderRadius:14,padding:"20px 22px",
          border:"0.5px solid rgba(255,107,53,0.15)",background:C.elevated,
          top:0,transform:"translateX(-50%)",zIndex:3}}>
          <div style={{opacity:fade?1:0,transition:"opacity 0.4s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <span style={{fontSize:10,fontWeight:500,background:"rgba(255,107,53,0.1)",color:C.ember,
                padding:"3px 10px",borderRadius:20,fontFamily:"'JetBrains Mono',monospace"}}>
                {c.badge}
              </span>
              <span style={{fontSize:11,color:C.ember,fontFamily:"'JetBrains Mono',monospace"}}>{c.match}</span>
            </div>
            <p style={{fontFamily:"'DM Serif Display',serif",fontStyle:"italic",fontSize:13,
              color:"rgba(237,232,224,0.8)",lineHeight:1.6,marginBottom:14}}>{c.post}</p>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {c.bars.map(b => (
                <div key={b.label} style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:10,color:"rgba(237,232,224,0.3)",width:80,flexShrink:0}}>{b.label}</span>
                  <div style={{flex:1,height:2,background:"rgba(237,232,224,0.05)",borderRadius:100,overflow:"hidden"}}>
                    <div style={{height:"100%",borderRadius:100,background:C.ember,width:`${b.pct}%`}}/>
                  </div>
                  <span style={{fontSize:10,color:"rgba(255,107,53,0.7)",fontFamily:"'JetBrains Mono',monospace",width:28,textAlign:"right"}}>{b.display}</span>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:10}}>
              {c.sources.map(s => (
                <span key={s} style={{fontSize:9,fontFamily:"'JetBrains Mono',monospace",color:"rgba(237,232,224,0.4)",
                  background:"rgba(237,232,224,0.04)",border:"0.5px solid rgba(237,232,224,0.1)",
                  borderRadius:4,padding:"2px 7px"}}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
