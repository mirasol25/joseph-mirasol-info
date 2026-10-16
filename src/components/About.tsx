import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import PreviewModal from './PreviewModal';
import './About.css';

const About = () => {
  const [aboutText, setAboutText] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    fetchAboutContent();
  }, []);

  async function fetchAboutContent() {
    // Fetches both the content and the resume_link from your about_section table
    const { data, error } = await supabase
      .from('about_section')
      .select('content, resume_link')
      .eq('id', 1)
      .single();

    if (error) {
      console.error("Error fetching About content:", error);
    } else if (data) {
      setAboutText(data.content || "");
      setResumeUrl(data.resume_link || "");
    }
    setLoading(false);
  }

  const handleOpenResume = () => {
    if (resumeUrl) {
      setIsPreviewOpen(true);
    } else {
      alert("No resume has been uploaded to the database yet.");
    }
  };

  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <h2 className="section-title">About Me</h2>
        
        <div className="about-content">
          {loading ? (
            <p className="loading-text">Loading...</p>
          ) : (
            /* Splits the single block of database text into proper paragraphs */
            aboutText.split('\n').map((paragraph, index) => (
              paragraph.trim() !== "" && (
                <p 
                  key={index} 
                  dangerouslySetInnerHTML={{ __html: paragraph }} 
                />
              )
            ))
          )}
          
          {/* Resume Button Container */}
          <div className="about-actions">
            {/* Swapped the <a> tag for a <button> so it doesn't open a new tab! */}
            <button 
              onClick={handleOpenResume} 
              className="resume-btn"
            >
              View My Resume
            </button>
          </div>

        </div>
      </div>

      {/* The Unified Preview Modal */}
      <PreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        fileUrl={resumeUrl}
        title="My Resume"
      />
    </section>
  );
};

export default About;