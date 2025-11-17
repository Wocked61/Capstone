import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <h1>Capstone Project : Procuratio</h1>
        <nav className="header-nav">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </header>
  )
}

export default Header
