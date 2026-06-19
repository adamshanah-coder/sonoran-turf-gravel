export default function Contact() {
  return (
    <section id="contact" className="contact">
      <div>
        <p className="eyebrow">Get a Quote</p>
        <h2>Let's Build Your Outdoor Space.</h2>
        <p>Tell us about your project and we'll follow up to discuss your goals, timeline, budget, and next steps.</p>
        <a href="tel:+14809150477">+1 (480) 915-0477</a>
        <a href="mailto:estimates@sonoranstoneandturf.com">estimates@sonoranstoneandturf.com</a>
        <a href="mailto:info@sonoranstoneandturf.com">info@sonoranstoneandturf.com</a>
      </div>
      <form action="mailto:estimates@sonoranstoneandturf.com" method="post" encType="text/plain">
        <input name="name" placeholder="Name" required />
        <input name="phone" placeholder="Phone" required />
        <input name="email" placeholder="Email" />
        <select name="project"><option>Complete Landscape Transformation</option><option>Artificial Turf</option><option>Travertine & Pavers</option><option>Decorative Rock</option><option>Putting Green</option><option>Outdoor Kitchen / Fire Feature</option></select>
        <textarea name="details" placeholder="Tell us about your project" />
        <button>Request My Quote →</button>
      </form>
    </section>
  );
}
