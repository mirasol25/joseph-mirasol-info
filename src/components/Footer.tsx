import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import './Footer.css';

interface ContactSettings {
  title: string;
  description: string;
  email: string;
  phone: string;
}

const Footer = () => {
  const [settings, setSettings] = useState<ContactSettings>({
    title: "Let's Connect",
    description: "I am currently looking for new opportunities in software engineering and IT support. Whether you have a question or just want to say hi, I will try my best to get back to you!",
    email: "josephmirasol25@gmail.com",
    phone: "+63 000 000 0000"
  });
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<null | 'success' | 'error'>(null);

  useEffect(() => {
    fetchContactSettings();
  }, []);

  async function fetchContactSettings() {
    const { data, error } = await supabase
      .from('contact_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (!error && data) {
      setSettings(data);
    }
    setLoading(false);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // 1. Save to Supabase (keeps a backup in your Admin Inbox)
    const { error } = await supabase
      .from('messages')
      .insert([formData]);

    if (error) {
      console.error("Error submitting message to database:", error);
      setSubmitStatus('error');
      setIsSubmitting(false);
      return;
    }

    // 2. Send directly to your Email via Web3Forms
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          // PASTE YOUR WEB3FORMS ACCESS KEY HERE:
          access_key: "b204b0c0-181d-42a7-9ff5-3f6775f7d390", 
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: `New Portfolio Message from ${formData.name}`,
          from_name: "My Portfolio",
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' }); // Clear form
      } else {
        setSubmitStatus('error');
      }
    } catch (err) {
      console.error("Email send failed:", err);
      setSubmitStatus('error');
    }

    setIsSubmitting(false);
  };

  return (
    <footer id="contact" className="footer-section">
      <div className="contact-container">
        
        {/* Left Side: Contact Info */}
        <div className="contact-info-panel">
          <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '1rem' }}>
            {settings.title}
          </h2>
          <p className="contact-description">
            {loading ? "Loading..." : settings.description}
          </p>

          <div className="contact-cards">
            {/* Email Card */}
            <a href={`mailto:${settings.email}`} className="contact-glass-card">
              <div className="contact-icon">
                <FaEnvelope size={20} />
              </div>
              <div className="contact-details">
                <span className="contact-label">EMAIL</span>
                <span className="contact-value">{settings.email}</span>
              </div>
            </a>

            {/* Phone Card */}
            {settings.phone && (
              <a href={`tel:${settings.phone}`} className="contact-glass-card">
                <div className="contact-icon">
                  <FaPhoneAlt size={20} />
                </div>
                <div className="contact-details">
                  <span className="contact-label">PHONE</span>
                  <span className="contact-value">{settings.phone}</span>
                </div>
              </a>
            )}
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div className="contact-form-panel">
          <form className="glass-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">NAME</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                placeholder="Your name" 
                value={formData.name}
                onChange={handleInputChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">EMAIL</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="you@example.com" 
                value={formData.email}
                onChange={handleInputChange}
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">MESSAGE</label>
              <textarea 
                id="message" 
                name="message" 
                placeholder="Tell me about your project or just say hello..." 
                rows={4}
                value={formData.message}
                onChange={handleInputChange}
                required 
              ></textarea>
            </div>

            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>

            {submitStatus === 'success' && <p className="status-msg success">Message sent successfully!</p>}
            {submitStatus === 'error' && <p className="status-msg error">Failed to send message. Please try again.</p>}
          </form>
        </div>

      </div>

      <div className="footer-copyright">
        © {new Date().getFullYear()} Joseph Edrick E. Mirasol. Built with React & Supabase.
      </div>
    </footer>
  );
};

export default Footer;