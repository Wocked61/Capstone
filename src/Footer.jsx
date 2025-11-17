import './Footer.css'

function Footer() {
  return (
    <footer className="Footer">
      <div className="footer-inner">
        <div>
          <p style={{fontWeight:700}}>Group</p>
          <p>Members: Dylan Phan, Vincent Nguyen, Matt Lim, Helen Ngo</p>
        </div>
        <div className="footer-right">
          <p>© {new Date().getFullYear()} Procuratio</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer