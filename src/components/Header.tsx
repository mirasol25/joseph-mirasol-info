import { useState, useEffect } from 'react';
import { 
  FaGithub, FaLinkedin, FaEnvelope, FaFacebook, 
  FaTwitter, FaInstagram, FaYoutube, FaTiktok, 
  FaDiscord, FaDribbble 
} from 'react-icons/fa';
import { Typewriter } from 'react-simple-typewriter';
import { supabase } from '../supabaseClient';
import './Header.css';

interface HeroData {
  name: string;
  typing_text: string[];
  github_link?: string;
  linkedin_link?: string;
  facebook_link?: string;
  email_link?: string;
  twitter_link?: string;
  instagram_link?: string;
  youtube_link?: string;
  tiktok_link?: string;
  discord_link?: string;
  dribbble_link?: string;
}

const Header = () => {
  const [heroData, setHeroData] = useState<HeroData | null>(null);

  useEffect(() => {
    const fetchHeroData = async () => {
      const { data, error } = await supabase
        .from('hero_section')
        .select('*')
        .eq('id', 1)
        .single();
        
      if (data && !error) {
        setHeroData(data);
      }
    };

    fetchHeroData();
  }, []);

  if (!heroData) {
    return <header className="hero-section"></header>;
  }

  return (
    <header className="hero-section">
      <h1 className="hero-name">{heroData.name}</h1>
      
      <h2 className="hero-subtitle">
        <span>I am a&nbsp;</span>
        <span className="typewriter-text">
          {heroData.typing_text && heroData.typing_text.length > 0 && (
            <Typewriter
              words={heroData.typing_text}
              loop={0}
              cursor
              cursorStyle='|'
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={1500}
            />
          )}
        </span>
      </h2>

      <div className="social-container">
        {heroData.github_link && (
          <a href={heroData.github_link} target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaGithub size={22} />
          </a>
        )}
        
        {heroData.linkedin_link && (
          <a href={heroData.linkedin_link} target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaLinkedin size={22} />
          </a>
        )}
        
        {heroData.facebook_link && (
          <a href={heroData.facebook_link} target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaFacebook size={22} />
          </a>
        )}

        {heroData.twitter_link && (
          <a href={heroData.twitter_link} target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaTwitter size={22} />
          </a>
        )}

        {heroData.instagram_link && (
          <a href={heroData.instagram_link} target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaInstagram size={22} />
          </a>
        )}

        {heroData.youtube_link && (
          <a href={heroData.youtube_link} target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaYoutube size={22} />
          </a>
        )}

        {heroData.tiktok_link && (
          <a href={heroData.tiktok_link} target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaTiktok size={22} />
          </a>
        )}

        {heroData.discord_link && (
          <a href={heroData.discord_link} target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaDiscord size={22} />
          </a>
        )}

        {heroData.dribbble_link && (
          <a href={heroData.dribbble_link} target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaDribbble size={22} />
          </a>
        )}
        
        {heroData.email_link && (
          <a href={heroData.email_link} className="social-icon">
            <FaEnvelope size={22} />
          </a>
        )}
      </div>

      <a href="#projects" className="cta-button">
        View My Work
      </a>
    </header>
  )
}

export default Header;