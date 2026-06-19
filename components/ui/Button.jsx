export default function Button({ href = '#contact', children, variant = 'gold' }) {
  return <a className={`button ${variant}`} href={href}><span>{children}</span><span>→</span></a>;
}
