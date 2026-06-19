const services = [
  ['Artificial Turf', 'Lush, low-maintenance turf built for Arizona heat.', '/images/artificial-turf.jpg'],
  ['Travertine & Pavers', 'Premium patios, walkways, pool decks, and transitions.', '/images/travertine-pavers.jpg'],
  ['Decorative Rock', 'Clean, modern desert texture with polished curb appeal.', '/images/decorative-rock.jpg'],
  ['Putting Greens', 'Backyard greens designed for play, practice, and entertaining.', '/images/putting-greens.jpg'],
  ['Outdoor Kitchens', 'Built-in cooking spaces for premium outdoor hosting.', '/images/outdoor-kitchens.jpg'],
  ['Fire Features', 'Fire pits and fire features made for Arizona evenings.', '/images/fire-features.jpg'],
  ['Landscape Lighting', 'Architectural lighting that elevates beauty and safety.', '/images/lighting.jpg'],
  ['Pergolas & Shade', 'Comfort, structure, and style for outdoor living areas.', '/images/pergolas.jpg']
];

export default function Services() {
  return (
    <section id="services" className="section services">
      <div className="sectionHeader">
        <p className="eyebrow">Services</p>
        <h2>Complete Outdoor Living Solutions</h2>
        <p>From concept to completion, we create refined outdoor spaces designed around Arizona architecture, desert conditions, and long-term value.</p>
      </div>
      <div className="serviceGrid">
        {services.map(([title, copy, image]) => (
          <article className="serviceCard" key={title}>
            <img src={image} alt={title} />
            <div><h3>{title}</h3><p>{copy}</p><span>Explore →</span></div>
          </article>
        ))}
      </div>
    </section>
  );
}
