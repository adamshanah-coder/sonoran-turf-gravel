export default function Studio() {
  return (
    <section id="studio" className="studio">
      <div>
        <p className="eyebrow">AI Design Studio</p>
        <h2>See Your Yard Before You Build It</h2>
        <p>Upload photos, choose a style direction, and request a premium concept path before committing to a full project consultation.</p>
        <div className="studioSteps">
          <span>Upload photos</span><span>Choose a style</span><span>Review concepts</span><span>Schedule quote</span>
        </div>
      </div>
      <form className="studioForm">
        <input placeholder="Name" />
        <input placeholder="Phone" />
        <select><option>Luxury Resort</option><option>Modern Desert</option><option>Family Backyard</option><option>Putting Green</option><option>Outdoor Entertainment</option></select>
        <input type="file" accept="image/*" />
        <button type="button">Start My Concept →</button>
      </form>
    </section>
  );
}
