import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { FaAward, FaExternalLinkAlt } from 'react-icons/fa';
import PreviewModal from './PreviewModal';
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

  // Modal State
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentFileUrl, setCurrentFileUrl] = useState("");
  const [currentTitle, setCurrentTitle] = useState("");

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

  // Opens the modal instead of a new tab
  const handleOpenCertificate = (fileUrl: string, title: string) => {
    if (fileUrl) {
      setCurrentFileUrl(fileUrl);
      setCurrentTitle(title);
      setIsPreviewOpen(true);
    } else {
      alert("No file has been uploaded for this certification yet.");
    }
  };

  return (
    <section id="certifications" className="cert-section">
      <div className="cert-container">
        <h2 className="section-title">Certifications</h2>
        
        {loading ? (
          <p className="loading-text">Loading certifications...</p>
        ) : (
          <div className="cert-grid">
            {certs.map((cert) => (
              /* Changed from <a> to <button> to prevent navigation */
              <button 
                key={cert.id} 
                onClick={() => handleOpenCertificate(cert.file_link, cert.title)}
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
              </button>
            ))}
          </div>
        )}
      </div>

      {/* The Unified Preview Modal */}
      <PreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        fileUrl={currentFileUrl}
        title={currentTitle}
      />
    </section>
  );
};

export default Certifications;