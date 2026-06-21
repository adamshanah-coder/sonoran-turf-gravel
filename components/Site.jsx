'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import YardDesigner from './YardDesigner';

const services = [
  ['01', 'Artificial Turf', 'Heat-ready turf systems with precise seams, natural transitions, and pet-friendly options.'],
  ['02', 'Natural Stone', 'Architectural stonework, retaining details, veneer, borders, and timeless desert texture.'],
  ['03', 'Travertine', 'Cool-underfoot patios and pool decks laid with disciplined lines and refined transitions.'],
  ['04', 'Pavers', 'Driveways, walkways, patios, and courtyards engineered for lasting performance.'],
  ['05', 'Putting Greens', 'Tour-inspired backyard greens shaped around the way you practice and entertain.'],
  ['06', 'Outdoor Kitchens', 'Purpose-built cooking and gathering spaces designed as an extension of the home.'],
  ['07', 'Fire Features', 'Clean-lined fire pits and fireplaces that make Arizona evenings feel complete.'],
  ['08', 'Pool Remodels', 'Updated decking, coping, waterline tile, lighting, and surrounding landscape.'],
  ['09', 'Landscape Lighting', 'Layered, low-voltage illumination for architecture, safety, and atmosphere.'],
  ['10', 'Decorative Gravel', 'Thoughtful color, grading, edging, and native planting—not a blanket of rock.'],
  ['11', 'Drainage', 'Subtle drainage solutions designed into the landscape before monsoon season tests it.'],
];

const projects = [
  {
    title: 'Desert Modern Retreat',
    location: 'Scottsdale',
    category: 'Complete Builds',
    image: '/hero-arizona.png',
    detail: 'Travertine · Pool environment · Fire lounge · Native planting',
  },
  {
    title: 'Stone & Water',
    location: 'Paradise Valley',
    category: 'Stone & Pools',
    image: '/project-travertine.png',
    detail: 'Ivory travertine · Natural stone · Architectural lighting',
  },
  {
    title: 'The Nineteenth Hole',
    location: 'North Scottsdale',
    category: 'Putting Greens',
    image: '/project-putting-green.png',
    detail: 'Custom green · Outdoor kitchen · Low-voltage lighting',
  },
];

const cities = ['Scottsdale', 'Paradise Valley', 'Phoenix', 'Arcadia', 'Cave Creek', 'Fountain Hills', 'Mesa', 'Gilbert', 'Chandler', 'Queen Creek', 'Peoria', 'Glendale'];

function Arrow() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => setOpen(false);

  return (
    <header className={`siteHeader ${scrolled ? 'isScrolled' : ''}`}>
      <a className="brand" href="#home" onClick={close} aria-label="Sonoran Stone and Turf home">
        <img src="/logo.png" alt="Sonoran Stone & Turf" />
      </a>
      <button className="menuToggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle navigation">
        <span /><span />
      </button>
      <nav className={open ? 'open' : ''} aria-label="Main navigation">
        <a href="#services" onClick={close}>Services</a>
        <a href="#projects" onClick={close}>Projects</a>
        <a href="#studio" onClick={close}>Yard Design Studio</a>
        <a href="#about" onClick={close}>About</a>
        <a href="#contact" onClick={close}>Contact</a>
        <a className="navCta" href="#contact" onClick={close}>Request a consultation</a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section id="home" className="hero">
      <img className="heroImage" src="/hero-arizona.png" alt="Luxury Sonoran Desert backyard with pool, travertine and fire lounge" />
      <div className="heroOverlay" />
      <div className="heroContent">
        <p className="kicker">Luxury outdoor living · Greater Phoenix</p>
        <h1>Built for Arizona.<br /><em>Designed for you.</em></h1>
        <p className="heroLead">Complete outdoor environments shaped by thoughtful design, enduring materials, and uncompromising craftsmanship.</p>
        <div className="heroActions">
          <a className="button gold" href="#contact">Get my free quote <Arrow /></a>
          <a className="textLink light" href="#projects">Explore our work <Arrow /></a>
        </div>
      </div>
      <div className="trustBar" aria-label="Company credentials">
        <div><strong>Licensed</strong><span>Arizona contractor</span></div>
        <div><strong>Insured</strong><span>Built with confidence</span></div>
        <div><strong>Premium</strong><span>Materials & execution</span></div>
        <div><strong>Local</strong><span>Greater Phoenix</span></div>
      </div>
      <a className="scrollCue" href="#intro" aria-label="Scroll to introduction"><span />Scroll</a>
    </section>
  );
}

function Intro() {
  return (
    <section id="intro" className="intro sectionPad">
      <p className="kicker">Sonoran Stone & Turf</p>
      <div className="introGrid">
        <h2>Your backyard should feel like it was always meant to be there.</h2>
        <div>
          <p>We create refined outdoor spaces that belong to the architecture, the landscape, and the way you live. From one decisive upgrade to a complete transformation, every detail is considered as part of the whole.</p>
          <a className="textLink" href="#about">Our approach <Arrow /></a>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="services sectionPad">
      <div className="sectionHeading">
        <div><p className="kicker">Capabilities</p><h2>One vision.<br />Every detail.</h2></div>
        <p>Design and construction coordinated as one experience—so materials, grades, planting, lighting, and gathering spaces work beautifully together.</p>
      </div>
      <div className="serviceList">
        {services.map(([number, title, copy]) => (
          <a className="serviceRow" href="#contact" key={title}>
            <span className="serviceNumber">{number}</span>
            <h3>{title}</h3>
            <p>{copy}</p>
            <span className="roundArrow"><Arrow /></span>
          </a>
        ))}
      </div>
    </section>
  );
}

function Projects() {
  const [active, setActive] = useState('All');
  const categories = ['All', ...new Set(projects.map(project => project.category))];
  const visible = useMemo(() => active === 'All' ? projects : projects.filter(project => project.category === active), [active]);

  return (
    <section id="projects" className="projects sectionPad">
      <div className="sectionHeading lightHeading">
        <div><p className="kicker">Selected work</p><h2>Made for life<br />under open skies.</h2></div>
        <p>Modern desert environments grounded in natural materials, quiet geometry, and the unmistakable character of Arizona.</p>
      </div>
      <div className="filters" aria-label="Project filters">
        {categories.map(category => <button className={active === category ? 'active' : ''} onClick={() => setActive(category)} key={category}>{category}</button>)}
      </div>
      <div className="projectGrid">
        {visible.map((project, index) => (
          <article className={`projectCard project${index + 1}`} key={project.title}>
            <img src={project.image} alt={`${project.title}, ${project.location}`} />
            <div className="projectShade" />
            <div className="projectInfo">
              <p>{project.location}</p>
              <h3>{project.title}</h3>
              <span>{project.detail}</span>
            </div>
          </article>
        ))}
      </div>
      <a className="button outline" href="#contact">Plan a project like this <Arrow /></a>
    </section>
  );
}

function Process() {
  const steps = [
    ['01', 'Listen', 'We learn how you want the space to feel, function, and fit your investment.'],
    ['02', 'Design', 'Materials, layout, lighting, drainage, and details become one clear direction.'],
    ['03', 'Build', 'A coordinated team executes the plan with disciplined communication and care.'],
    ['04', 'Live', 'You step into an outdoor space made for Arizona mornings, evenings, and everything between.'],
  ];
  return (
    <section className="process sectionPad">
      <div className="processTitle"><p className="kicker">How we work</p><h2>Clarity from first conversation to final walkthrough.</h2></div>
      <div className="processSteps">
        {steps.map(([number, title, copy]) => <div className="processStep" key={title}><span>{number}</span><h3>{title}</h3><p>{copy}</p></div>)}
      </div>
    </section>
  );
}

function Studio() {
  const features = ['Turf', 'Travertine', 'Pool', 'Fire', 'Kitchen', 'Lighting'];
  const [fileName, setFileName] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const choosePhoto = event => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const toggleFeature = feature => {
    setSelectedFeatures(current =>
      current.includes(feature)
        ? current.filter(item => item !== feature)
        : [...current, feature]
    );
  };

  return (
    <section id="studio" className="studio sectionPad">
      <div className="studioImage">
        <img
          src={previewUrl || '/project-travertine.png'}
          alt={previewUrl ? 'Selected yard photo preview' : 'Modern Arizona backyard design concept'}
        />
        <span>{previewUrl ? 'Your yard photo' : 'Concept visualization'}</span>
      </div>
      <div className="studioCopy">
        <p className="kicker">AI Design Studio</p>
        <h2>See the possibility before construction begins.</h2>
        <p>Upload a current photo of your yard and tell us what you are imagining. We’ll use it to begin a focused conversation around layout, materials, features, and investment.</p>
        <fieldset className="studioFeaturePicker">
          <legend>Choose all the features you are considering</legend>
          <div className="studioChoices">
            {features.map(feature => (
              <button
                type="button"
                className={selectedFeatures.includes(feature) ? 'selected' : ''}
                aria-pressed={selectedFeatures.includes(feature)}
                onClick={() => toggleFeature(feature)}
                key={feature}
              >
                {feature}
              </button>
            ))}
          </div>
        </fieldset>
        <p className="featureSummary" aria-live="polite">
          {selectedFeatures.length
            ? `Selected: ${selectedFeatures.join(', ')}`
            : 'Select one or more features for your concept.'}
        </p>
        <label className="uploadButton">
          <input type="file" accept="image/*" onChange={choosePhoto} />
          {fileName ? 'Choose a different photo' : 'Choose a yard photo'} <Arrow />
        </label>
        {fileName && <p className="selectedFile">{fileName}</p>}
        <p className="finePrint">Concept images are for inspiration and planning, not final construction documents.</p>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="about sectionPad">
      <div className="aboutImage"><img src="/project-putting-green.png" alt="Scottsdale putting green and outdoor kitchen at sunset" /></div>
      <div className="aboutCopy">
        <p className="kicker">Rooted in Arizona</p>
        <h2>Local knowledge changes the outcome.</h2>
        <p>Desert landscapes reward restraint and punish shortcuts. We design around heat, monsoon drainage, sun exposure, material performance, water use, and the architecture of the home—not trends imported from somewhere else.</p>
        <div className="aboutFacts">
          <div><strong>11</strong><span>Integrated outdoor services</span></div>
          <div><strong>100%</strong><span>Arizona-focused design</span></div>
        </div>
      </div>
    </section>
  );
}

function Areas() {
  return (
    <section className="areas sectionPad">
      <p className="kicker">Service area</p>
      <h2>Across Greater Phoenix</h2>
      <div className="cityList">{cities.map(city => <span key={city}>{city}</span>)}</div>
    </section>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);
  const submit = event => {
    event.preventDefault();
    if (event.currentTarget.checkValidity()) setSent(true);
  };
  return (
    <section id="contact" className="contact sectionPad">
      <div className="contactCopy">
        <p className="kicker">Start a conversation</p>
        <h2>Let’s make home feel more like a destination.</h2>
        <p>Share a few details and we’ll follow up to talk through your goals, property, timeline, and the right next step.</p>
        <div className="contactLinks">
          <a href="tel:+14809150477">(480) 915-0477</a>
          <a href="mailto:estimates@sonoranstoneandturf.com">estimates@sonoranstoneandturf.com</a>
        </div>
      </div>
      {sent ? (
        <div className="successMessage"><span>Thank you</span><h3>Your project is ready for a conversation.</h3><p>This preview validates the form experience. Connect the production form endpoint before launch to deliver submissions to your team.</p><button onClick={() => setSent(false)}>Send another inquiry</button></div>
      ) : (
        <form className="contactForm" onSubmit={submit}>
          <label>Full name<input name="name" autoComplete="name" required /></label>
          <div className="formRow">
            <label>Phone<input name="phone" type="tel" autoComplete="tel" required /></label>
            <label>Email<input name="email" type="email" autoComplete="email" required /></label>
          </div>
          <label>Project type<select name="project" defaultValue=""><option value="" disabled>Select a service</option>{services.map(([, title]) => <option key={title}>{title}</option>)}<option>Complete Transformation</option></select></label>
          <label>Tell us about your space<textarea name="details" rows="4" placeholder="Location, goals, ideal timeline, and approximate investment..." required /></label>
          <button className="button gold" type="submit">Request my consultation <Arrow /></button>
          <p className="formNote">By submitting, you agree to be contacted about your project. No spam—ever.</p>
        </form>
      )}
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <div className="footerTop">
        <a className="brand" href="#home"><img src="/logo.png" alt="Sonoran Stone & Turf" /></a>
        <p>Luxury outdoor living,<br />built for Arizona.</p>
        <a className="footerPhone" href="tel:+14809150477">(480) 915-0477</a>
      </div>
      <div className="footerBottom">
        <span>© {new Date().getFullYear()} Sonoran Stone & Turf</span>
        <div><a href="#services">Services</a><a href="#projects">Projects</a><a href="#about">About</a><a href="#contact">Contact</a></div>
        <span>Licensed · Insured · Greater Phoenix</span>
      </div>
    </footer>
  );
}

export default function Site() {
  return <main><Header /><Hero /><Intro /><Services /><Projects /><Process /><YardDesigner /><About /><Areas /><Contact /><Footer /></main>;
}
