import Navbar from './components/Navbar'
import Header from './components/Header'
import About from './components/About'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Certifications from './components/Certifications'
import Footer from './components/Footer'
import Admin from './components/Admin' // 1. Import your new Admin component
import './App.css'

function App() {
  // 2. The Local Admin Check: Intercepts the render if the URL is /admin locally
  if (window.location.pathname === '/admin' && import.meta.env.DEV) {
    return <Admin />
  }

  // 3. The standard portfolio layout for all other URLs (or if running in production)
  return (
    <div className="portfolio-container">
      <Navbar />
      <Header />
      <main>
        <About />
        <Experience />
        <Projects />
        <Certifications />
      </main>
      <Footer />
    </div>
  )
}

export default App