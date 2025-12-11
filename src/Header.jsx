import { Link } from 'react-router-dom'
import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="header-logo">
          <h1>Capstone Project : Procuratio</h1>
        </Link>
        <nav className="header-nav">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/login" className="login-link">Login</Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
