import './Footer.css'

function Footer() {
  return (
    <footer className="Footer">
      <div className="footer-inner">
        <div>
          <p style={{fontWeight:700}}>Group</p>
          <p>Members: Dylan Phan, Vincent Nguyen, Matthew Lim, Helen Ngo</p>
        </div>
        <div className="footer-right">
          <p>© {new Date().getFullYear()} TaskFast</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer