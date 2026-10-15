import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import './About.css';

const About = () => {
  const [aboutText, setAboutText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutContent();
  }, []);

  async function fetchAboutContent() {
    // Fetches the first row from your about_section table
    const { data, error } = await supabase
      .from('about_section')
      .select('content')
      .eq('id', 1)
      .single();

    if (error) {
      console.error("Error fetching About content:", error);
    } else if (data) {
      setAboutText(data.content);
    }
    setLoading(false);
  }

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
            <a 
              href="/resume.pdf" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="resume-btn"
            >
              View My Resume
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;