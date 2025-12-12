import { Link } from 'react-router-dom'
import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="header-logo">
          <h1>Procuratio</h1>
        </Link>
        <nav className="header-nav">
          <Link to="/">Home</Link>
          <Link to="/about">Plan</Link>
          <Link to="/login" className="login-link">Login</Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
