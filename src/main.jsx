import { StrictMode } from 'react'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.jsx'
import Login from './Login.jsx'
import Signup from './Signup.jsx'
import Footer from './Footer.jsx'
import Header from './Header.jsx'
import Plan from './Plan.jsx'
import Map from './Map.jsx'
import Gemini from './Gemini.jsx'
import './App.css'

function RootApp() {
  const [loggedInUser, setLoggedInUser] = useState(null)

  return (
    <BrowserRouter>
      <Header loggedInUser={loggedInUser} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login setLoggedInUser={setLoggedInUser} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/map" element={<Map />} />
          <Route path="/gemini" element={<Gemini />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <RootApp />
    </GoogleOAuthProvider>
  </StrictMode>,
)