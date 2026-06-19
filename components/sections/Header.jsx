export default function Header() {
  return (
    <header className="siteHeader">
      <a className="brand" href="#top"><img src="/logo.png" alt="Sonoran Stone & Turf logo" /></a>
      <nav>
        <a href="#services">Services</a>
        <a href="#projects">Projects</a>
        <a href="#studio">AI Design Studio</a>
        <a href="#financing">Financing</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
        <a className="navCta" href="#contact">Get a Quote</a>
      </nav>
    </header>
  );
}
