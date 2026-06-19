import Header from '../components/sections/Header';
import Hero from '../components/sections/Hero';
import Services from '../components/sections/Services';
import Projects from '../components/sections/Projects';
import BeforeAfter from '../components/sections/BeforeAfter';
import Studio from '../components/sections/Studio';
import Financing from '../components/sections/Financing';
import About from '../components/sections/About';
import Contact from '../components/sections/Contact';

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Services />
      <Projects />
      <BeforeAfter />
      <Studio />
      <Financing />
      <About />
      <Contact />
      <footer>
        <img src="/logo.png" alt="Sonoran Stone & Turf logo" />
        <p>Luxury outdoor living across the Greater Phoenix area.</p>
      </footer>
    </main>
  );
}
