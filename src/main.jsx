import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Footer from './Footer.jsx'
import Header from './Header.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>

    <Header />
    <main>
      <App />
    </main>
    <Footer />
  </StrictMode>,
)
