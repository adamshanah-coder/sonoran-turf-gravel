import './globals.css';

export const metadata = {
  title: 'Sonoran Stone & Turf | Luxury Outdoor Living',
  description: 'Premium artificial turf, natural stone, travertine, pavers, putting greens, outdoor kitchens, fire features, and complete landscape transformations across Greater Phoenix.'
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
