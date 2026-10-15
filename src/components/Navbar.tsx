import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-links">
        <a href="#about" className="nav-link">About</a>
        <a href="#experience" className="nav-link">Experience</a>
        <a href="#projects" className="nav-link">Projects</a>
        <a href="#certifications" className="nav-link">Certifications</a>
      </div>
    </nav>
  );
};

export default Navbar;