import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-section">
      <h2 className="footer-title">Let's Connect</h2>
      <p className="footer-text">
        I am currently looking for new opportunities in software engineering and IT support. Whether you have a question or just want to say hi, I will try my best to get back to you!
      </p>
      <a href="mailto:josephmirasol25@gmail.com" className="footer-email">
        josephmirasol25@gmail.com
      </a>
      <div className="footer-copyright">
        © {new Date().getFullYear()} Joseph Edrick E. Mirasol. Built with React & Vite.
      </div>
    </footer>
  );
};

export default Footer;