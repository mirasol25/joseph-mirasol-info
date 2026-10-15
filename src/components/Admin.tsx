import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Admin.css';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('hero');
  
  const [projects, setProjects] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [certs, setCerts] = useState<any[]>([]);
  const [aboutData, setAboutData] = useState<any>({ content: '', resume_link: '' });
  
  // UPGRADED: Hero State with all social links
  const [heroData, setHeroData] = useState<any>({
    name: '', typing_text: '', github_link: '', linkedin_link: '', facebook_link: '', email_link: '',
    twitter_link: '', instagram_link: '', youtube_link: '', tiktok_link: '', discord_link: '', dribbble_link: ''
  });
  
  const [editingId, setEditingId] = useState<number | null>(null);

  const [projTitle, setProjTitle] = useState(''); const [projDesc, setProjDesc] = useState(''); const [projTech, setProjTech] = useState(''); const [projGithub, setProjGithub] = useState(''); const [projLive, setProjLive] = useState('');
  const [expRole, setExpRole] = useState(''); const [expCompany, setExpCompany] = useState(''); const [expDuration, setExpDuration] = useState(''); const [expDesc, setExpDesc] = useState('');
  const [certTitle, setCertTitle] = useState(''); const [certIssuer, setCertIssuer] = useState(''); const [certLink, setCertLink] = useState('');

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [certFile, setCertFile] = useState<File | null>(null);
  const [isCertUploading, setIsCertUploading] = useState(false);

  useEffect(() => {
    fetchHero(); fetchProjects(); fetchExperiences(); fetchCerts(); fetchAbout();
  }, []);

  const fetchHero = async () => { 
    const { data } = await supabase.from('hero_section').select('*').eq('id', 1).single(); 
    if (data) setHeroData({ ...data, typing_text: data.typing_text ? data.typing_text.join(', ') : '' }); 
  };
  const fetchProjects = async () => { const { data } = await supabase.from('projects').select('*').order('sort_order'); if (data) setProjects(data); };
  const fetchExperiences = async () => { const { data } = await supabase.from('experience').select('*').order('sort_order'); if (data) setExperiences(data); };
  const fetchCerts = async () => { const { data } = await supabase.from('certifications').select('*').order('sort_order'); if (data) setCerts(data); };
  const fetchAbout = async () => { const { data } = await supabase.from('about_section').select('*').eq('id', 1).single(); if (data) setAboutData(data); };

  // UPGRADED: Save all social links
  const saveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    const typingArray = heroData.typing_text.split(',').map((t: string) => t.trim());
    await supabase.from('hero_section').update({
      name: heroData.name,
      typing_text: typingArray,
      github_link: heroData.github_link,
      linkedin_link: heroData.linkedin_link,
      facebook_link: heroData.facebook_link,
      email_link: heroData.email_link,
      twitter_link: heroData.twitter_link,
      instagram_link: heroData.instagram_link,
      youtube_link: heroData.youtube_link,
      tiktok_link: heroData.tiktok_link,
      discord_link: heroData.discord_link,
      dribbble_link: heroData.dribbble_link
    }).eq('id', 1);
    alert("Hero section updated!");
  };

  const saveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { title: projTitle, description: projDesc, tech_stack: projTech.split(',').map(t => t.trim()), github_link: projGithub, live_link: projLive };
    if (editingId) await supabase.from('projects').update(payload).eq('id', editingId);
    else await supabase.from('projects').insert([{ ...payload, sort_order: 99 }]);
    resetForms(); fetchProjects();
  };

  const saveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { role_title: expRole, company: expCompany, duration: expDuration, description: expDesc };
    if (editingId) await supabase.from('experience').update(payload).eq('id', editingId);
    else await supabase.from('experience').insert([{ ...payload, sort_order: 99 }]);
    resetForms(); fetchExperiences();
  };

  const saveCert = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalCertLink = certLink;
    if (certFile) {
      setIsCertUploading(true);
      const fileExt = certFile.name.split('.').pop();
      const fileName = `cert-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('certificates').upload(fileName, certFile);
      if (uploadError) { alert("Upload error: " + uploadError.message); setIsCertUploading(false); return; }
      const { data: publicUrlData } = supabase.storage.from('certificates').getPublicUrl(fileName);
      finalCertLink = publicUrlData.publicUrl;
    }
    const payload = { title: certTitle, issuer: certIssuer, file_link: finalCertLink };
    if (editingId) await supabase.from('certifications').update(payload).eq('id', editingId);
    else await supabase.from('certifications').insert([{ ...payload, sort_order: 99 }]);
    setCertFile(null); setIsCertUploading(false); resetForms(); fetchCerts();
  };

  const saveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalResumeLink = aboutData.resume_link;
    if (resumeFile) {
      setIsUploading(true);
      const fileExt = resumeFile.name.split('.').pop();
      const fileName = `resume-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('resumes').upload(fileName, resumeFile);
      if (uploadError) { alert("Upload error: " + uploadError.message); setIsUploading(false); return; }
      const { data: publicUrlData } = supabase.storage.from('resumes').getPublicUrl(fileName);
      finalResumeLink = publicUrlData.publicUrl;
    }
    await supabase.from('about_section').update({ content: aboutData.content, resume_link: finalResumeLink }).eq('id', 1);
    setAboutData({ ...aboutData, resume_link: finalResumeLink });
    setResumeFile(null); setIsUploading(false); alert("About updated!");
  };

  const deleteRecord = async (table: string, id: number, refreshFn: () => void) => {
    if (!window.confirm(`Delete this from ${table}?`)) return;
    await supabase.from(table).delete().eq('id', id); refreshFn();
  };

  const resetForms = () => {
    setEditingId(null);
    setProjTitle(''); setProjDesc(''); setProjTech(''); setProjGithub(''); setProjLive('');
    setExpRole(''); setExpCompany(''); setExpDuration(''); setExpDesc('');
    setCertTitle(''); setCertIssuer(''); setCertLink(''); setCertFile(null);
  };

  return (
    <div className="admin-container">
      <div className="admin-dashboard">
        <div className="admin-header">
          <h2>Local CMS Dashboard</h2>
        </div>

        <div className="admin-tabs">
          <button className={activeTab === 'hero' ? 'active' : ''} onClick={() => {setActiveTab('hero'); resetForms();}}>Hero</button>
          <button className={activeTab === 'projects' ? 'active' : ''} onClick={() => {setActiveTab('projects'); resetForms();}}>Projects</button>
          <button className={activeTab === 'experience' ? 'active' : ''} onClick={() => {setActiveTab('experience'); resetForms();}}>Experience</button>
          <button className={activeTab === 'certs' ? 'active' : ''} onClick={() => {setActiveTab('certs'); resetForms();}}>Certs</button>
          <button className={activeTab === 'about' ? 'active' : ''} onClick={() => {setActiveTab('about'); resetForms();}}>About</button>
        </div>

        {/* UPGRADED HERO TAB */}
        {activeTab === 'hero' && (
          <form className="admin-box" onSubmit={saveHero}>
            <h3>Update Hero Section</h3>
            <label style={{color: '#fff', fontSize: '0.9rem'}}>Main Name:</label>
            <input type="text" value={heroData.name || ''} onChange={e => setHeroData({...heroData, name: e.target.value})} required />
            
            <label style={{color: '#fff', fontSize: '0.9rem', marginTop: '0.5rem'}}>Typewriter Text (Comma Separated):</label>
            <input type="text" placeholder="Full-Stack Developer, Mobile App Developer" value={heroData.typing_text || ''} onChange={e => setHeroData({...heroData, typing_text: e.target.value})} required />
            
            <label style={{color: '#fff', fontSize: '0.9rem', marginTop: '1rem', borderBottom: '1px solid #27272a', paddingBottom: '0.5rem'}}>Social Links (Leave blank to hide icon):</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <input type="text" placeholder="GitHub URL" value={heroData.github_link || ''} onChange={e => setHeroData({...heroData, github_link: e.target.value})} />
              <input type="text" placeholder="LinkedIn URL" value={heroData.linkedin_link || ''} onChange={e => setHeroData({...heroData, linkedin_link: e.target.value})} />
              <input type="text" placeholder="Facebook URL" value={heroData.facebook_link || ''} onChange={e => setHeroData({...heroData, facebook_link: e.target.value})} />
              <input type="text" placeholder="Email (mailto:...)" value={heroData.email_link || ''} onChange={e => setHeroData({...heroData, email_link: e.target.value})} />
              <input type="text" placeholder="Twitter/X URL" value={heroData.twitter_link || ''} onChange={e => setHeroData({...heroData, twitter_link: e.target.value})} />
              <input type="text" placeholder="Instagram URL" value={heroData.instagram_link || ''} onChange={e => setHeroData({...heroData, instagram_link: e.target.value})} />
              <input type="text" placeholder="YouTube URL" value={heroData.youtube_link || ''} onChange={e => setHeroData({...heroData, youtube_link: e.target.value})} />
              <input type="text" placeholder="TikTok URL" value={heroData.tiktok_link || ''} onChange={e => setHeroData({...heroData, tiktok_link: e.target.value})} />
              <input type="text" placeholder="Discord URL" value={heroData.discord_link || ''} onChange={e => setHeroData({...heroData, discord_link: e.target.value})} />
              <input type="text" placeholder="Dribbble URL" value={heroData.dribbble_link || ''} onChange={e => setHeroData({...heroData, dribbble_link: e.target.value})} />
            </div>
            
            <button type="submit" className="admin-btn" style={{ marginTop: '1.5rem' }}>Save Hero Data</button>
          </form>
        )}

        {/* PROJECTS */}
        {activeTab === 'projects' && (
           <>
           <form className="admin-box" onSubmit={saveProject}>
             <h3>{editingId ? 'Edit Project' : 'Add Project'}</h3>
             <input type="text" placeholder="Title" value={projTitle} onChange={e => setProjTitle(e.target.value)} required />
             <textarea placeholder="Description" value={projDesc} onChange={e => setProjDesc(e.target.value)} required />
             <input type="text" placeholder="Tech Stack (comma separated)" value={projTech} onChange={e => setProjTech(e.target.value)} required />
             <input type="text" placeholder="GitHub URL" value={projGithub} onChange={e => setProjGithub(e.target.value)} />
             <input type="text" placeholder="Live URL" value={projLive} onChange={e => setProjLive(e.target.value)} />
             <div className="admin-form-actions">
               <button type="submit" className="admin-btn">{editingId ? 'Update' : 'Add'}</button>
               {editingId && <button type="button" onClick={resetForms} className="cancel-btn">Cancel</button>}
             </div>
           </form>
           <div className="admin-list">
             {projects.map(p => (
               <div key={p.id} className="admin-list-item">
                 <div><h4>{p.title}</h4></div>
                 <div className="admin-actions">
                   <button className="edit-btn" onClick={() => {
                     setEditingId(p.id); setProjTitle(p.title); setProjDesc(p.description);
                     setProjTech(p.tech_stack.join(', ')); setProjGithub(p.github_link); setProjLive(p.live_link);
                   }}>Edit</button>
                   <button className="delete-btn" onClick={() => deleteRecord('projects', p.id, fetchProjects)}>Delete</button>
                 </div>
               </div>
             ))}
           </div>
         </>
        )}

        {/* EXPERIENCE */}
        {activeTab === 'experience' && (
           <>
           <form className="admin-box" onSubmit={saveExperience}>
             <h3>{editingId ? 'Edit Job' : 'Add Job'}</h3>
             <input type="text" placeholder="Role Title" value={expRole} onChange={e => setExpRole(e.target.value)} required />
             <input type="text" placeholder="Company" value={expCompany} onChange={e => setExpCompany(e.target.value)} required />
             <input type="text" placeholder="Duration (e.g. 2022 - 2026)" value={expDuration} onChange={e => setExpDuration(e.target.value)} required />
             <textarea placeholder="Description" value={expDesc} onChange={e => setExpDesc(e.target.value)} required />
             <div className="admin-form-actions">
               <button type="submit" className="admin-btn">{editingId ? 'Update' : 'Add'}</button>
               {editingId && <button type="button" onClick={resetForms} className="cancel-btn">Cancel</button>}
             </div>
           </form>
           <div className="admin-list">
             {experiences.map(e => (
               <div key={e.id} className="admin-list-item">
                 <div><h4>{e.role_title}</h4><p>{e.company}</p></div>
                 <div className="admin-actions">
                   <button className="edit-btn" onClick={() => {
                     setEditingId(e.id); setExpRole(e.role_title); setExpCompany(e.company);
                     setExpDuration(e.duration); setExpDesc(e.description);
                   }}>Edit</button>
                   <button className="delete-btn" onClick={() => deleteRecord('experience', e.id, fetchExperiences)}>Delete</button>
                 </div>
               </div>
             ))}
           </div>
         </>
        )}

        {/* CERTIFICATIONS */}
        {activeTab === 'certs' && (
           <>
           <form className="admin-box" onSubmit={saveCert}>
             <h3>{editingId ? 'Edit Cert' : 'Add Cert'}</h3>
             <input type="text" placeholder="Title" value={certTitle} onChange={e => setCertTitle(e.target.value)} required />
             <input type="text" placeholder="Issuer (e.g. Google)" value={certIssuer} onChange={e => setCertIssuer(e.target.value)} required />
             
             <label style={{color: '#fff', fontSize: '0.9rem'}}>Upload Certificate (PDF/Image):</label>
             <input type="file" accept=".pdf,image/*" style={{ padding: '0.5rem', background: 'transparent', border: '1px dashed rgba(255,255,255,0.2)' }} onChange={e => { if (e.target.files && e.target.files.length > 0) setCertFile(e.target.files[0]); }} />
             {certLink && !certFile && <p style={{color: '#a1a1aa', fontSize: '0.8rem', wordBreak: 'break-all'}}><strong>Current:</strong> {certLink}</p>}
             <div className="admin-form-actions">
               <button type="submit" className="admin-btn" disabled={isCertUploading}>{isCertUploading ? 'Uploading...' : editingId ? 'Update' : 'Add'}</button>
               {editingId && <button type="button" onClick={resetForms} className="cancel-btn">Cancel</button>}
             </div>
           </form>
           <div className="admin-list">
             {certs.map(c => (
               <div key={c.id} className="admin-list-item">
                 <div><h4>{c.title}</h4><p>{c.issuer}</p></div>
                 <div className="admin-actions">
                   <button className="edit-btn" onClick={() => {
                     setEditingId(c.id); setCertTitle(c.title); setCertIssuer(c.issuer); setCertLink(c.file_link); setCertFile(null);
                   }}>Edit</button>
                   <button className="delete-btn" onClick={() => deleteRecord('certifications', c.id, fetchCerts)}>Delete</button>
                 </div>
               </div>
             ))}
           </div>
         </>
        )}

        {/* ABOUT */}
        {activeTab === 'about' && (
          <form className="admin-box" onSubmit={saveAbout}>
            <h3>Update About & Resume</h3>
            <label style={{color: '#fff', fontSize: '0.9rem'}}>Upload New Resume (PDF):</label>
            <input type="file" accept=".pdf" style={{ padding: '0.5rem', background: 'transparent', border: '1px dashed rgba(255,255,255,0.2)' }} onChange={e => { if (e.target.files && e.target.files.length > 0) setResumeFile(e.target.files[0]); }} />
            {aboutData.resume_link && <p style={{color: '#a1a1aa', fontSize: '0.8rem', wordBreak: 'break-all'}}><strong>Current:</strong> {aboutData.resume_link}</p>}
            <label style={{color: '#fff', fontSize: '0.9rem', marginTop: '1rem'}}>About Me Text:</label>
            <textarea style={{minHeight: '200px'}} placeholder="Your bio here..." value={aboutData.content} onChange={e => setAboutData({...aboutData, content: e.target.value})} required />
            <button type="submit" className="admin-btn" disabled={isUploading}>{isUploading ? 'Uploading & Saving...' : 'Save Changes'}</button>
          </form>
        )}

      </div>
    </div>
  );
};

export default Admin;