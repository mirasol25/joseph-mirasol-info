import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { FaAward, FaExternalLinkAlt } from 'react-icons/fa';
import './Certifications.css';

interface Certification {
  id: number;
  title: string;
  issuer: string;
  file_link: string;
}

const Certifications = () => {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertifications();
  }, []);

  async function fetchCertifications() {
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error("Error fetching certifications:", error);
    } else if (data) {
      setCerts(data);
    }
    setLoading(false);
  }

  return (
    <section id="certifications" className="cert-section">
      <div className="cert-container">
        <h2 className="section-title">Certifications</h2>
        
        {loading ? (
          <p className="loading-text">Loading certifications...</p>
        ) : (
          <div className="cert-grid">
            {certs.map((cert) => (
              <a 
                key={cert.id} 
                href={cert.file_link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="cert-card"
              >
                <div className="cert-icon">
                  <FaAward size={20} />
                </div>
                <div className="cert-info">
                  <h3 className="cert-title">{cert.title}</h3>
                  <span className="cert-issuer">{cert.issuer}</span>
                </div>
                <div className="cert-link-icon">
                  <FaExternalLinkAlt size={14} />
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Certifications;