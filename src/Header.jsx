import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import './Header.css'


function Header({ loggedInUser, setLoggedInUser }) {
  const navigate = useNavigate()

  const handleSignOut = () => {
    localStorage.removeItem('loggedInUser')
    setLoggedInUser(null)
    navigate('/')
  }

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="header-logo">
          <h1>TaskFast</h1>
        </Link>
        <nav className="header-nav">
          <Link to="/">Home</Link>
          <Link to="/Plan">Plan</Link>
          <Link to="/Map">Map</Link>
          <Link to="/gemini" className="gemini-link">Gemini</Link>
          {loggedInUser ? (<><span className="user-name">Hello {loggedInUser.username}!</span>
            <button type="button" className="signout-btn" onClick={handleSignOut}>Sign Out</button></>) : (
            <>
              <Link to="/login" className="login-link">Login</Link>
              <Link to="/signup" className="signup-link">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
