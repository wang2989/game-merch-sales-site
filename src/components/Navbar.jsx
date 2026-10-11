import { Link } from 'react-router-dom'

const navItems = [
  { label: 'Purchase', path: '/purchase' },
  { label: 'Shopping Cart', path: '/shoppingCart' },
]

export default function Navbar() {
  return (
    <nav>
      {navItems.map((item, index) => (
        <span key={item.path}>
          {index > 0 && ' | '}
          <Link to={item.path}>{item.label}</Link>
        </span>
      ))}
    </nav>
  )
}

