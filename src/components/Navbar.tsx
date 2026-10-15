import { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      {/* Hamburger Icon */}
      <div className="hamburger" onClick={toggleMenu}>
        <span className={`bar ${isOpen ? 'open' : ''}`}></span>
        <span className={`bar ${isOpen ? 'open' : ''}`}></span>
        <span className={`bar ${isOpen ? 'open' : ''}`}></span>
      </div>

      {/* Navigation Links */}
      <div className={`nav-links ${isOpen ? 'active' : ''}`}>
        <a href="#about" className="nav-link" onClick={toggleMenu}>About</a>
        <a href="#experience" className="nav-link" onClick={toggleMenu}>Experience</a>
        <a href="#projects" className="nav-link" onClick={toggleMenu}>Projects</a>
        <a href="#certifications" className="nav-link" onClick={toggleMenu}>Certifications</a>
      </div>
    </nav>
  );
};

export default Navbar;