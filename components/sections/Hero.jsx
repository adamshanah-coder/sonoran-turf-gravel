import Button from '../ui/Button';

export default function Hero() {
  return (
    <section id="top" className="hero">
      <div className="heroMedia" />
      <div className="heroOverlay" />
      <div className="heroContent">
        <p className="eyebrow">Luxury Outdoor Living • Greater Phoenix</p>
        <h1>Outdoor Spaces Worth Coming Home To</h1>
        <p className="lead">Premium turf, natural stone, travertine, pavers, putting greens, outdoor kitchens, fire features, and complete landscape transformations.</p>
        <div className="heroActions">
          <Button href="#contact">Get My Quote</Button>
          <Button href="#projects" variant="ghost">View Our Work</Button>
        </div>
      </div>
      <div className="heroStats">
        <article><strong>500+</strong><span>Project-ready designs</span></article>
        <article><strong>Licensed</strong><span>& insured</span></article>
        <article><strong>Premium</strong><span>materials</span></article>
        <article><strong>Local</strong><span>Arizona experts</span></article>
      </div>
    </section>
  );
}
