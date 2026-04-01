"use client";
import { useEffect, useRef } from "react";

const C = { ember:"#FF6B35", cream:"#EDE8E0", creamMuted:"rgba(237,232,224,0.45)", void:"#070E09" };

function useReveal(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) el.classList.add("visible"); }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
}

function RevealDiv({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref);
  return <div ref={ref} className="reveal" style={style}>{children}</div>;
}

export default function Problem() {
  return (
    <section id="problem" style={{ padding:"140px 24px", background:C.void }}>
      <div style={{ maxWidth:740, margin:"0 auto" }}>
        <RevealDiv>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"rgba(237,232,224,0.18)",marginBottom:48}}>
            (01) — The real problem
          </div>
        </RevealDiv>
        <RevealDiv>
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:"clamp(36px,5vw,52px)",fontWeight:400,
            color:C.cream,lineHeight:1.1,letterSpacing:"-0.025em",marginBottom:32}}>
            You&apos;ve read 50 articles this week.<br/>None of that thinking made it into your content.
          </h2>
        </RevealDiv>
        <RevealDiv>
          <p style={{fontSize:17,color:C.creamMuted,lineHeight:1.8,marginBottom:22}}>
            Every creator knows the feeling. You bookmark the research, save the articles, collect the insights — but when it&apos;s time to post, you open a blank prompt and ask a generic AI to write something &quot;interesting.&quot;
          </p>
        </RevealDiv>
        <RevealDiv>
          <p style={{fontSize:17,color:C.creamMuted,lineHeight:1.8,marginBottom:22}}>
            The result sounds like everyone else. Because it was written from everyone else&apos;s training data — not from the specific body of research only you have curated.
          </p>
        </RevealDiv>
        <RevealDiv>
          <div style={{background:"rgba(255,107,53,0.06)",borderLeft:`2px solid ${C.ember}`,
            borderRadius:"0 8px 8px 0",padding:"16px 20px",margin:"28px 0",
            fontSize:16,color:C.creamMuted,lineHeight:1.75}}>
            <strong style={{color:C.cream,fontWeight:500}}>The gap nobody has solved:</strong>{" "}
            your curated knowledge and your published content live in completely separate worlds. You read and save in one place. You write in another. The connection between what you know and what you publish — that synthesis — is the work that gets skipped.
          </div>
        </RevealDiv>
        <RevealDiv>
          <p style={{fontFamily:"'DM Serif Display',serif",fontStyle:"italic",
            fontSize:"clamp(26px,3.5vw,36px)",color:C.ember,letterSpacing:"-0.02em",lineHeight:1.25,marginTop:48}}>
            Echora closes that gap. Your research becomes your content.
          </p>
        </RevealDiv>
      </div>
    </section>
  );
}
