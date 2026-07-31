import { useState, useEffect } from "react";

const links = [
  { label: "About", href: "#about" },
  { label: "Member", href: "#member" },
  { label: "Project", href: "#project" },
  { label: "Communication", href: "#communication" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scroll = (href: string) => {
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled ? "rgba(0,0,0,0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
        transition: "all 0.3s",
      }}
    >
      <nav style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <a
          href="/"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 22, letterSpacing: "0.08em", color: "#ffffff", textDecoration: "none" }}
        >
          MOVING
        </a>

        <ul className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: 28, listStyle: "none", margin: 0, padding: 0 }}>
          {links.map((l) => (
            <li key={l.label}>
              <button
                onClick={() => scroll(l.href)}
                style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Noto Sans KR', 'DM Sans', sans-serif", fontSize: 14, color: "#ffffff", opacity: 0.88, padding: 0, whiteSpace: "nowrap" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.88")}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        <button
          className="nav-desktop"
          onClick={() => scroll("#join")}
          style={{ fontFamily: "'Noto Sans KR', 'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: "#000", background: "#00e676", border: "none", padding: "10px 20px", borderRadius: 999, cursor: "pointer" }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          가입하러 가기
        </button>

        <button className="nav-mobile" aria-label="메뉴" onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ffffff", padding: 8 }}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div style={{ background: "#0a0a0a", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
          {links.map((l) => (
            <button key={l.label} onClick={() => scroll(l.href)} style={{ background: "none", border: "none", color: "#fff", textAlign: "left", fontSize: 15, padding: 0, cursor: "pointer", fontFamily: "'Noto Sans KR', sans-serif" }}>
              {l.label}
            </button>
          ))}
          <button onClick={() => scroll("#join")} style={{ background: "#00e676", color: "#000", border: "none", borderRadius: 999, padding: "10px 16px", fontFamily: "'Noto Sans KR', sans-serif", cursor: "pointer" }}>
            가입하러 가기
          </button>
        </div>
      )}
    </header>
  );
}
