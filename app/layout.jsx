import './globals.css';
export const metadata = {
  title: 'Sonoran Stone & Turf | Luxury Outdoor Living in Arizona',
  description: 'Premium artificial turf, travertine, pavers, putting greens, outdoor kitchens, fire features, pool remodels, and complete outdoor transformations across Greater Phoenix.',
  keywords: ['Artificial Turf Phoenix', 'Scottsdale Landscaping', 'Luxury Outdoor Living Arizona', 'Travertine Patio Phoenix', 'Pavers Scottsdale', 'Putting Greens Scottsdale'],
  openGraph: {
    title: 'Sonoran Stone & Turf',
    description: 'Luxury outdoor living, built for Arizona.',
    type: 'website',
  },
};
export default function RootLayout({ children }) { return <html lang="en"><body>{children}</body></html>; }
