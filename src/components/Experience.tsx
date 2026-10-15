import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import './Experience.css';

interface ExperienceItem {
  id: number;
  role_title: string;
  company: string;
  duration: string;
  description: string;
}

const Experience = () => {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiences();
  }, []);

  async function fetchExperiences() {
    const { data, error } = await supabase
      .from('experience')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error("Error fetching experience:", error);
    } else if (data) {
      setExperiences(data);
    }
    setLoading(false);
  }

  return (
    <section id="experience" className="experience-section">
      <div className="experience-container">
        <h2 className="section-title">Experience</h2>
        
        {loading ? (
          <p className="loading-text">Loading experience...</p>
        ) : (
          <div className="timeline">
            {experiences.map((exp) => (
              <div className="timeline-item" key={exp.id}>
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h3 className="timeline-role">{exp.role_title}</h3>
                  <h4 className="timeline-company">{exp.company}</h4>
                  {exp.duration && <span className="timeline-duration">{exp.duration}</span>}
                  <p className="timeline-description">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Experience;