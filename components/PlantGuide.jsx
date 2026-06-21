'use client';

import { useState } from 'react';

const plants = [
  { name: 'Desert Willow', botanical: 'Chilopsis linearis', category: 'Trees', sun: 'Full sun', water: 'Low', size: '20–30 ft.', bloom: 'Pink · Spring–fall', atlas: 'plants', position: '0% 0%', note: 'An airy native tree with summer color and a light canopy suited to patios and natural desert compositions.' },
  { name: 'Hybrid Palo Verde', botanical: 'Parkinsonia hybrid', category: 'Trees', sun: 'Full sun', water: 'Low', size: '20–30 ft.', bloom: 'Yellow · Spring', atlas: 'plants', position: '33.333% 0%', note: 'Signature green bark, filtered shade, and a dramatic spring bloom make this a strong desert focal tree.' },
  { name: 'Brittlebush', botanical: 'Encelia farinosa', category: 'Shrubs', sun: 'Full sun', water: 'Very low', size: '2–3 ft.', bloom: 'Yellow · Winter–spring', atlas: 'plants', position: '66.666% 0%', note: 'Silver foliage and cheerful yellow flowers bring native desert texture to slopes, gravel gardens, and open sunny areas.' },
  { name: 'Pink Fairy Duster', botanical: 'Calliandra eriophylla', category: 'Shrubs', sun: 'Sun or light shade', water: 'Low', size: '3–5 ft.', bloom: 'Pink · Winter–spring', atlas: 'plants', position: '100% 0%', note: 'Fine foliage and powder-puff blooms soften stonework while supporting hummingbirds and pollinators.' },
  { name: 'Red Yucca', botanical: 'Hesperaloe parviflora', category: 'Accents', sun: 'Full sun', water: 'Low', size: '3–4 ft.', bloom: 'Coral · Spring–summer', atlas: 'plants', position: '0% 100%', note: 'A clean architectural accent with long flower spikes that performs well near entries, walls, and contemporary hardscape.' },
  { name: 'Desert Spoon', botanical: 'Dasylirion wheeleri', category: 'Accents', sun: 'Full sun', water: 'Very low', size: '4–6 ft.', bloom: 'Structural evergreen', atlas: 'plants', position: '33.333% 100%', note: 'A bold native rosette for modern desert designs. Give its finely toothed leaves comfortable clearance from paths.' },
  { name: 'Pink Muhly', botanical: 'Muhlenbergia capillaris', category: 'Grasses', sun: 'Full sun', water: 'Low', size: '3–4 ft.', bloom: 'Pink plumes · Fall', atlas: 'plants', position: '66.666% 100%', note: 'Soft, luminous fall plumes add movement and contrast against stone, gravel, and dark architectural backgrounds.' },
  { name: 'Texas Sage', botanical: 'Leucophyllum frutescens', category: 'Shrubs', sun: 'Full sun', water: 'Low', size: '5–8 ft.', bloom: 'Purple · Summer', atlas: 'plants', position: '100% 100%', note: 'Heat-tough silver foliage and bursts of purple flowers make a reliable screen or informal flowering hedge.' },
  { name: 'Indian Laurel Fig', botanical: 'Ficus microcarpa', category: 'Trees', badge: 'Popular · Higher maintenance', sun: 'Full sun', water: 'Moderate', size: '30–50 ft.', bloom: 'Dense evergreen shade', atlas: 'cactus', position: '0% 0%', warning: 'Large roots · Frost-sensitive when young', note: 'A popular Phoenix shade and privacy tree with a dense canopy. Allow generous space and keep well away from pools, foundations, plumbing, and narrow side yards.' },
  { name: 'Mexican Fence Post', botanical: 'Pachycereus marginatus', category: 'Cacti', sun: 'Full sun', water: 'Very low', size: '10–20 ft.', bloom: 'Columnar evergreen', atlas: 'cactus', position: '33.333% 0%', warning: 'Spines · Keep clear of paths', note: 'A refined vertical cactus for modern walls, entries, and architectural groupings. Its strong lines work especially well with contemporary homes.' },
  { name: 'Golden Barrel', botanical: 'Echinocactus grusonii', category: 'Cacti', sun: 'Sun or light shade', water: 'Very low', size: '2–3 ft.', bloom: 'Golden structural form', atlas: 'cactus', position: '66.666% 0%', warning: 'Sharp spines', note: 'Best used in repeated groups for a sculptural, high-end desert effect. Give it clearance from children, pets, paths, and pool traffic.' },
  { name: 'Totem Pole Cactus', botanical: 'Pachycereus schottii monstrosus', category: 'Cacti', sun: 'Full sun', water: 'Very low', size: '10–12 ft.', bloom: 'Smooth columnar form', atlas: 'cactus', position: '100% 0%', note: 'A nearly spineless sculptural cactus with a distinctive irregular surface, ideal for protected focal points and minimalist desert gardens.' },
  { name: 'Santa Rita Prickly Pear', botanical: 'Opuntia santa-rita', category: 'Cacti', sun: 'Full sun', water: 'Very low', size: '4–6 ft.', bloom: 'Purple pads · Yellow flowers', atlas: 'cactus', position: '0% 100%', warning: 'Spines and glochids', note: 'Purple-toned pads deliver dramatic color in dry landscapes. Place well away from circulation areas because the tiny glochids are difficult to remove.' },
  { name: 'Argentine Giant', botanical: 'Echinopsis candicans', category: 'Cacti', sun: 'Full sun', water: 'Very low', size: '2–3 ft.', bloom: 'Large white flowers', atlas: 'cactus', position: '33.333% 100%', warning: 'Spines · Spreading clump', note: 'Low-growing columns produce spectacular fragrant white flowers. Use where the broad clump has room to expand without crowding walkways.' },
  { name: 'Fishhook Barrel', botanical: 'Ferocactus wislizeni', category: 'Cacti', sun: 'Full sun', water: 'Very low', size: '3–5 ft.', bloom: 'Orange · Summer', atlas: 'cactus', position: '66.666% 100%', warning: 'Strong hooked spines', note: 'A classic Sonoran barrel cactus with strong regional character. It makes a natural focal point when given safe distance from people and pets.' },
];

export default function PlantGuide() {
  const categories = ['All', 'Trees', 'Shrubs', 'Cacti', 'Accents', 'Grasses'];
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState([]);
  const visible = category === 'All' ? plants : plants.filter(plant => plant.category === category);

  const togglePlant = plant => {
    const next = selected.includes(plant.name)
      ? selected.filter(name => name !== plant.name)
      : [...selected, plant.name];
    setSelected(next);
    window.dispatchEvent(new CustomEvent('plant-plan-update', { detail: next }));
  };

  return (
    <section id="plants" className="plantGuide sectionPad">
      <div className="plantGuideHeading">
        <div>
          <p className="kicker">Arizona Plant Guide</p>
          <h2>Plants that belong<br />in the desert.</h2>
        </div>
        <div>
          <p>Explore heat-ready plants that pair beautifully with stone, turf, outdoor living, and low-water landscapes across Greater Phoenix.</p>
          <p className="plantDisclaimer">Mature size and water needs vary by site, irrigation, and pruning. Verify placement around pools, pets, utilities, and walkways before planting.</p>
        </div>
      </div>
      <div className="plantFilters" aria-label="Plant categories">
        {categories.map(item => <button type="button" className={category === item ? 'active' : ''} onClick={() => setCategory(item)} key={item}>{item}</button>)}
      </div>
      <div className="plantGrid">
        {visible.map(plant => (
          <article className="plantCard" key={plant.name}>
            <div className={`plantPhoto ${plant.atlas === 'cactus' ? 'cactusAtlas' : ''}`} style={{ backgroundPosition: plant.position }} role="img" aria-label={plant.name} />
            <div className="plantCardBody">
              <div className="plantTitle">
                <div><span>{plant.badge || plant.category}</span><h3>{plant.name}</h3><em>{plant.botanical}</em></div>
                <button type="button" className={selected.includes(plant.name) ? 'selected' : ''} onClick={() => togglePlant(plant)}>
                  {selected.includes(plant.name) ? 'Added' : 'Add to plan'}
                </button>
              </div>
              <p>{plant.note}</p>
              {plant.warning && <p className="plantWarning">{plant.warning}</p>}
              <dl>
                <div><dt>Sun</dt><dd>{plant.sun}</dd></div>
                <div><dt>Water</dt><dd>{plant.water}</dd></div>
                <div><dt>Size</dt><dd>{plant.size}</dd></div>
                <div><dt>Season</dt><dd>{plant.bloom}</dd></div>
              </dl>
            </div>
          </article>
        ))}
      </div>
      <div className="plantPlan">
        <span>Your plant plan</span>
        <p>{selected.length ? selected.join(' · ') : 'Choose plants to carry them into your Yard Design Studio summary.'}</p>
        <a href="#studio">Return to the design studio</a>
      </div>
      <p className="plantSource">Plant guidance references the Arizona Municipal Water Users Association’s low-water landscape resources.</p>
    </section>
  );
}
