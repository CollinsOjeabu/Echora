"use client";
import Link from "next/link";

export default function Nav() {
  return (
    <nav style={{
      position:"fixed", top:20, left:"50%", transform:"translateX(-50%)",
      zIndex:100, width:"calc(100% - 48px)", maxWidth:960,
      background:"rgba(7,14,9,0.85)", backdropFilter:"blur(16px)",
      border:"0.5px solid rgba(237,232,224,0.1)", borderRadius:100,
      padding:"10px 20px", display:"flex", alignItems:"center", justifyContent:"space-between",
    }}>
      <Link href="/" style={{display:"flex",alignItems:"center",gap:8,textDecoration:"none"}}>
        <div style={{width:26,height:26,borderRadius:"50%",background:"#FF6B35",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <svg viewBox="0 0 12 12" fill="none" width={12} height={12}>
            <path d="M4 10 C4 6 6 3 10 2" stroke="#FF6B35" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.5"/>
            <path d="M6 10 C6 7 7.5 5 10 4" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" fill="none"/>
            <line x1="5" y1="1.5" x2="7.5" y2="11" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>
        <span style={{fontSize:12,fontWeight:700,color:"#EDE8E0",letterSpacing:"0.07em"}}>ECHORA</span>
      </Link>
      <div style={{display:"flex",gap:24}}>
        {["How it works","Features","Pricing"].map(l => (
          <a key={l} href={`#${l.toLowerCase().replace(/ /g,"-")}`}
            style={{fontSize:13,color:"rgba(237,232,224,0.45)",textDecoration:"none"}}>
            {l}
          </a>
        ))}
      </div>
      <Link href="/sign-up" style={{
        fontSize:12, fontWeight:600, background:"#FF6B35", color:"#fff",
        padding:"7px 18px", borderRadius:100, textDecoration:"none",
      }}>
        Start for free
      </Link>
    </nav>
  );
}
