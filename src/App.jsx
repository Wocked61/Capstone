import './App.css'
import { Link } from 'react-router-dom'

function App() {
  return (
    <div className="App">
      {/* SECTION 1 */}
      <section className="hero">
        {/* Video Background */}
        <div className="hero-video-container">
          <video autoPlay muted loop playsInline className="hero-video">
            <source src="/CalendarVideo.mp4" type="video/mp4" />
          </video>
          <div className="hero-overlay"></div>
        </div>

        <div className="hero-content">
          <h1>Smarter Scheduling. Better Living.</h1>
          <p className="hero-subtitle">
            Meet <strong>Procuratio</strong> — an intelligent, AI-driven scheduling assistant 
            that helps you balance academics, work, health, and personal life without the stress.
          </p>
          <ul className="hero-features">
            <h1>Features</h1>
            <li>Personalized recommendations</li>
            <li>Smart reminders</li>
            <li>Integrated commute time</li>
            <li>Wellness-focused planning</li>
          </ul>
          <div className="hero-buttons">
            <Link to="/login" className="btn btn-primary">Get Started</Link>
            <a href="#features" className="btn btn-secondary">Learn More</a>
          </div>
        </div>
      </section>

      <section id="features" className="features">
        <h2 className="section-title">What Our Platform Does</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Plan With Intelligence</h3>
            <p>Automatically generate optimized schedules using AI-driven insights and user preferences.</p>
          </div>
          <div className="feature-card">
            <h3>Understand Your Time</h3>
            <p>View analytics and trends that show where your time goes and how to improve habits.</p>
          </div>
          <div className="feature-card">
            <h3>Never Miss What Matters</h3>
            <p>Get smart reminders based on deadlines, commute time, and daily routines.</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-grid">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Input Your Tasks</h3>
            <p>Add classes, work shifts, errands, wellness goals, and deadlines.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>AI + Commute Optimization</h3>
            <p>Our engine calculates ideal task order using traffic data and personal preferences.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Receive Your Schedule</h3>
            <p>Get a smart, adaptive plan designed to reduce stress and increase productivity.</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Learn & Improve</h3>
            <p>The system adapts to your routines and provides helpful recommendations.</p>
          </div>
        </div>
      </section>

      <section className="why-choose">
        <div className="why-content">
          <h2 className="section-title">Why Choose Procuratio?</h2>
          <p className="why-intro">
            Students, professionals, and busy individuals often struggle with managing schedules.
            <strong> Procuratio</strong> bridges the gap between time management and personal well-being.
          </p>
          <div className="why-grid">
            <div className="why-item">
              <span>AI-assisted planning</span>
            </div>
            <div className="why-item">
              <span>Traffic-based commute optimization</span>
            </div>
            <div className="why-item">
              <span>Healthy routine tracking</span>
            </div>
            <div className="why-item">
              <span>Secure web-based access</span>
            </div>
          </div>
          <p className="why-closing">Spend less time organizing — and more time living.</p>
        </div>
      </section>

      <section className="screenshots">
        <h2 className="section-title">See It In Action</h2>
        <div className="screenshots-grid">
          <div className="screenshot-card">
            <div className="screenshot-video-container">
              <video autoPlay muted loop playsInline className="screenshot-video">
                <source src="/DashboardView.mp4" type="video/mp4" />
              </video>
            </div>
            <p>Dashboard View</p>
          </div>
          <div className="screenshot-card">
            <div className="screenshot-video-container">
              <video autoPlay muted loop playsInline className="screenshot-video">
                <source src="/CalendarIntegration.mp4" type="video/mp4" />
              </video>
            </div>
            <p>Calendar Integration</p>
          </div>
          <div className="screenshot-card">
            <div className="screenshot-video-container">
              <video autoPlay muted loop playsInline className="screenshot-video">
                <source src="/TaskManagement.mp4" type="video/mp4" />
              </video>
            </div>
            <p>Task Management</p>
          </div>
        </div>
      </section>

      <section className="cta">
        <h2>Start planning smarter today.</h2>
        <p>Join us as we build a better approach to time management and personal productivity.</p>
        <div className="cta-buttons">
          <Link to="/login" className="btn btn-primary">Try Demo</Link>
          <a href="#features" className="btn btn-secondary">Learn More</a>
        </div>
      </section>
    </div>
  )
}

export default App
