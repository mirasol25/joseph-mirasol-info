import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { FaGithub, FaExternalLinkAlt, FaDownload } from 'react-icons/fa';
import './Projects.css';

// This interface matches the exact columns we built in your Supabase database
interface Project {
  id: number;
  title: string;
  tech_stack: string[];
  description: string;
  github_link: string;
  live_link: string;
  app_link: string;
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true }); // Keeps your best projects at the top

    if (error) {
      console.error("Error fetching projects:", error);
    } else if (data) {
      setProjects(data);
    }
    setLoading(false);
  }

  return (
    <section id="projects" className="projects-section">
      <div className="projects-container">
        <h2 className="section-title">Featured Projects</h2>
        
        {loading ? (
          <p className="loading-text">Loading projects...</p>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => (
              <div className="project-card" key={project.id}>
                <div className="project-content">
                  <h3 className="project-title">{project.title}</h3>
                  
                  {/* Dynamically generates the technology badges */}
                  <div className="tech-stack">
                    {project.tech_stack.map((tech, index) => (
                      <span key={index} className="tech-badge">{tech}</span>
                    ))}
                  </div>
                  
                  <p className="project-description">{project.description}</p>
                  
                  {/* Only shows the buttons if a link actually exists in the database */}
                  <div className="project-links">
                    {project.github_link && (
                      <a href={project.github_link} target="_blank" rel="noopener noreferrer" className="project-link">
                        <FaGithub /> Code
                      </a>
                    )}
                    {project.live_link && (
                      <a href={project.live_link} target="_blank" rel="noopener noreferrer" className="project-link">
                        <FaExternalLinkAlt /> Live Demo
                      </a>
                    )}
                    {project.app_link && (
                      <a href={project.app_link} download className="project-link">
                        <FaDownload /> Download App
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;