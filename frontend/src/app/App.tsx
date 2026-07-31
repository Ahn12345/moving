import "../styles/fonts.css";
import "../styles/site.css";
import { useEffect, useState } from "react";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { MemberSection } from "./components/Member";
import { Projects } from "./components/Projects";
import { Communication, AdBanner } from "./components/Communication";
import { Join, Footer } from "./components/Join";
import { api, type Banner } from "./api";

export default function App() {
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    api.getBanners().then(setBanners).catch(() => setBanners([]));
  }, []);

  return (
    <main style={{ background: "#000000", color: "#ffffff", fontFamily: "'DM Sans', sans-serif", overflowX: "hidden" }}>
      <Nav />
      <Hero />
      <About />
      <MemberSection />
      <Projects />
      <Communication />
      <Join />
      <AdBanner banners={banners} />
      <Footer />
    </main>
  );
}
