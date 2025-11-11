import React, { useState, useEffect } from 'react';
import { User, Plus, Download, Eye, Lock, Unlock, FileText, Award, Calendar, Image, Video, BookOpen, Briefcase, Mail, Share2, Trash2 } from 'lucide-react';

export default function ProfessionalLadder() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login');
  const [profileData, setProfileData] = useState({
    personalInfo: { name: '', email: '', phone: '', title: '', summary: '', linkedin: '', website: '' },
    conferences: [],
    events: [],
    workshops: [],
    certificates: [],
    courses: [],
    media: [],
    experience: [],
    education: [],
    skills: []
  });

  useEffect(() => {
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    
    try {
      const result = await window.storage.get(`user_${user.email}`);
      if (result) {
        setProfileData(JSON.parse(result.value));
      }
    } catch (error) {
      console.log('Starting fresh profile');
    }
  };

  const saveUserData = async () => {
    if (!user) return;
    
    try {
      await window.storage.set(`user_${user.email}`, JSON.stringify(profileData));
      alert('✅ Profile saved successfully!');
    } catch (error) {
      console.error('Failed to save:', error);
      alert('❌ Failed to save profile');
    }
  };

  const handleLogin = (email, password) => {
    setUser({ email });
    setView('dashboard');
  };

  const handleSignup = (email, password, name) => {
    setUser({ email });
    setProfileData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, email, name }
    }));
    setView('dashboard');
  };

  const addItem = (category, item) => {
    setProfileData(prev => ({
      ...prev,
      [category]: [...prev[category], { ...item, id: Date.now(), visibility: 'public' }]
    }));
  };

  const toggleVisibility = (category, id) => {
    setProfileData(prev => ({
      ...prev,
      [category]: prev[category].map(item =>
        item.id === id ? { ...item, visibility: item.visibility === 'public' ? 'private' : 'public' } : item
      )
    }));
  };

  const deleteItem = (category, id) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setProfileData(prev => ({
        ...prev,
        [category]: prev[category].filter(item => item.id !== id)
      }));
    }
  };

  const generateResume = () => {
    const resume = `
═══════════════════════════════════════════════════════
${profileData.personalInfo.name.toUpperCase()}
${profileData.personalInfo.title}
═══════════════════════════════════════════════════════

📧 ${profileData.personalInfo.email} | 📱 ${profileData.personalInfo.phone}
${profileData.personalInfo.linkedin ? '🔗 LinkedIn: ' + profileData.personalInfo.linkedin : ''}
${profileData.personalInfo.website ? '🌐 Website: ' + profileData.personalInfo.website : ''}

───────────────────────────────────────────────────────
PROFESSIONAL SUMMARY
───────────────────────────────────────────────────────
${profileData.personalInfo.summary}

${profileData.experience.length > 0 ? `───────────────────────────────────────────────────────
PROFESSIONAL EXPERIENCE
───────────────────────────────────────────────────────
${profileData.experience.map(exp => `
▪ ${exp.title} | ${exp.company}
  ${exp.startDate} - ${exp.endDate || 'Present'}
  ${exp.description}
`).join('\n')}` : ''}

${profileData.education.length > 0 ? `───────────────────────────────────────────────────────
EDUCATION
───────────────────────────────────────────────────────
${profileData.education.map(edu => `
▪ ${edu.degree} in ${edu.field}
  ${edu.institution} | ${edu.year}
`).join('\n')}` : ''}

${profileData.skills.length > 0 ? `───────────────────────────────────────────────────────
SKILLS
───────────────────────────────────────────────────────
${profileData.skills.map(skill => `▪ ${skill.name}`).join('\n')}` : ''}

${profileData.certificates.length > 0 ? `───────────────────────────────────────────────────────
CERTIFICATIONS
───────────────────────────────────────────────────────
${profileData.certificates.map(cert => `▪ ${cert.name} | ${cert.issuer} (${cert.date})`).join('\n')}` : ''}

${profileData.courses.length > 0 ? `───────────────────────────────────────────────────────
COURSES & TRAINING
───────────────────────────────────────────────────────
${profileData.courses.map(course => `▪ ${course.name} | ${course.provider}`).join('\n')}` : ''}

${profileData.conferences.length > 0 || profileData.workshops.length > 0 ? `───────────────────────────────────────────────────────
PROFESSIONAL DEVELOPMENT
───────────────────────────────────────────────────────` : ''}
${profileData.conferences.length > 0 ? `\nConferences:\n${profileData.conferences.map(c => `▪ ${c.name} (${c.location}, ${c.date})`).join('\n')}` : ''}
${profileData.workshops.length > 0 ? `\n\nWorkshops:\n${profileData.workshops.map(w => `▪ ${w.name} - ${w.instructor}`).join('\n')}` : ''}
    `.trim();

    const blob = new Blob([resume], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profileData.personalInfo.name.replace(/\s+/g, '_')}_Resume.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateCoverLetter = (jobTitle, company) => {
    const topSkills = profileData.skills.slice(0, 3).map(s => s.name).join(', ');
    const recentExp = profileData.experience[0];
    const letter = `
${profileData.personalInfo.name}
${profileData.personalInfo.email} | ${profileData.personalInfo.phone}
${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

Hiring Manager
${company}

Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position at ${company}. ${profileData.personalInfo.summary}

${recentExp ? `In my recent role as ${recentExp.title} at ${recentExp.company}, ${recentExp.description}` : 'Throughout my career, I have developed expertise in delivering exceptional results.'}

${topSkills ? `My core competencies include ${topSkills}, ` : ''}which I believe align perfectly with the requirements for this position. ${profileData.certificates.length > 0 ? `I have further strengthened my qualifications through professional certifications including ${profileData.certificates.slice(0, 2).map(c => c.name).join(' and ')}.` : ''}

${profileData.conferences.length > 0 || profileData.workshops.length > 0 ? `I am committed to continuous professional development, regularly attending industry conferences and workshops to stay current with best practices and emerging trends.` : ''}

I am excited about the opportunity to contribute to ${company} and would welcome the chance to discuss how my background, skills, and enthusiasm can benefit your team. Thank you for considering my application.

Sincerely,
${profileData.personalInfo.name}
    `.trim();

    const blob = new Blob([letter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cover_Letter_${company.replace(/\s+/g, '_')}_${jobTitle.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (view === 'login') {
    return <LoginView onLogin={handleLogin} onSignup={handleSignup} />;
  }

  if (view === 'public' && user) {
    return <PublicProfileView profileData={profileData} onBack={() => setView('dashboard')} userEmail={user.email} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
            <Briefcase className="w-7 h-7" />
            Professional Ladder
          </h1>
          <div className="flex gap-3 items-center">
            <button onClick={() => setView('dashboard')} className="px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium">
              Dashboard
            </button>
            <button onClick={() => setView('public')} className="px-4 py-2 text-gray-700 hover:text-indigo-600 flex items-center gap-2 font-medium">
              <Eye className="w-4 h-4" /> Preview Profile
            </button>
            <button onClick={saveUserData} className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-md">
              💾 Save Progress
            </button>
            <button onClick={() => { 
              setUser(null); 
              setView('login'); 
              setProfileData({
                personalInfo: { name: '', email: '', phone: '', title: '', summary: '', linkedin: '', website: '' },
                conferences: [], events: [], workshops: [], certificates: [], courses: [], media: [], experience: [], education: [], skills: []
              }); 
            }} className="px-4 py-2 text-red-600 hover:text-red-700 font-medium">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <DashboardView 
          profileData={profileData}
          setProfileData={setProfileData}
          addItem={addItem}
          toggleVisibility={toggleVisibility}
          deleteItem={deleteItem}
          generateResume={generateResume}
          generateCoverLetter={generateCoverLetter}
        />
      </div>
    </div>
  );
}

function LoginView({ onLogin, onSignup }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (isSignup) {
      onSignup(email, password, name);
    } else {
      onLogin(email, password);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-indigo-100 p-4 rounded-full">
            <Briefcase className="w-12 h-12 text-indigo-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
          {isSignup ? 'Create Your Account' : 'Welcome Back'}
        </h2>
        <p className="text-center text-gray-600 mb-6">
          {isSignup ? 'Start building your professional profile' : 'Continue your career journey'}
        </p>
        <div className="space-y-4">
          {isSignup && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          )}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-semibold transition shadow-md"
          >
            {isSignup ? 'Sign Up' : 'Login'}
          </button>
        </div>
        <p className="text-center mt-6 text-gray-600">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button onClick={() => setIsSignup(!isSignup)} className="text-indigo-600 font-semibold hover:underline">
            {isSignup ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
}

function DashboardView({ profileData, setProfileData, addItem, toggleVisibility, deleteItem, generateResume, generateCoverLetter }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [showAddForm, setShowAddForm] = useState(null);
  const [coverLetterModal, setCoverLetterModal] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: BookOpen },
    { id: 'skills', label: 'Skills', icon: Award },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'conferences', label: 'Conferences', icon: Calendar },
    { id: 'workshops', label: 'Workshops', icon: Calendar },
    { id: 'media', label: 'Media', icon: Image }
  ];

  const stats = [
    { label: 'Experience', count: profileData.experience.length, color: 'bg-blue-500' },
    { label: 'Certificates', count: profileData.certificates.length, color: 'bg-green-500' },
    { label: 'Conferences', count: profileData.conferences.length, color: 'bg-purple-500' },
    { label: 'Skills', count: profileData.skills.length, color: 'bg-orange-500' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4">
            <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl`}>
              {stat.count}
            </div>
            <div>
              <p className="text-gray-600 text-sm">{stat.label}</p>
              <p className="text-gray-800 font-semibold">Total Items</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Build Your Professional Profile</h2>
          <div className="flex gap-3">
            <button onClick={generateResume} className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-md">
              <Download className="w-4 h-4" /> Resume
            </button>
            <button onClick={() => setCoverLetterModal(true)} className="flex items-center gap-2 px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium shadow-md">
              <Mail className="w-4 h-4" /> Cover Letter
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setShowAddForm(null); }}
                className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition ${
                  activeTab === tab.id 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'profile' && (
          <ProfileForm profileData={profileData} setProfileData={setProfileData} />
        )}

        {activeTab === 'experience' && (
          <SectionView
            title="Work Experience"
            items={profileData.experience}
            onAdd={() => setShowAddForm('experience')}
            onToggle={(id) => toggleVisibility('experience', id)}
            onDelete={(id) => deleteItem('experience', id)}
            showAddForm={showAddForm === 'experience'}
            onCloseForm={() => setShowAddForm(null)}
            onSubmit={(item) => { addItem('experience', item); setShowAddForm(null); }}
            fields={[
              { name: 'title', label: 'Job Title', type: 'text' },
              { name: 'company', label: 'Company', type: 'text' },
              { name: 'startDate', label: 'Start Date', type: 'text', placeholder: 'e.g., Jan 2020' },
              { name: 'endDate', label: 'End Date (leave blank if current)', type: 'text', placeholder: 'e.g., Dec 2022' },
              { name: 'description', label: 'Description', type: 'textarea' }
            ]}
          />
        )}

        {activeTab === 'education' && (
          <SectionView
            title="Education"
            items={profileData.education}
            onAdd={() => setShowAddForm('education')}
            onToggle={(id) => toggleVisibility('education', id)}
            onDelete={(id) => deleteItem('education', id)}
            showAddForm={showAddForm === 'education'}
            onCloseForm={() => setShowAddForm(null)}
            onSubmit={(item) => { addItem('education', item); setShowAddForm(null); }}
            fields={[
              { name: 'degree', label: 'Degree', type: 'text' },
              { name: 'field', label: 'Field of Study', type: 'text' },
              { name: 'institution', label: 'Institution', type: 'text' },
              { name: 'year', label: 'Graduation Year', type: 'text' }
            ]}
          />
        )}

        {activeTab === 'skills' && (
          <SectionView
            title="Skills & Expertise"
            items={profileData.skills}
            onAdd={() => setShowAddForm('skills')}
            onToggle={(id) => toggleVisibility('skills', id)}
            onDelete={(id) => deleteItem('skills', id)}
            showAddForm={showAddForm === 'skills'}
            onCloseForm={() => setShowAddForm(null)}
            onSubmit={(item) => { addItem('skills', item); setShowAddForm(null); }}
            fields={[
              { name: 'name', label: 'Skill Name', type: 'text' },
              { name: 'level', label: 'Proficiency Level', type: 'select', options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'] },
              { name: 'category', label: 'Category', type: 'text', placeholder: 'e.g., Technical, Soft Skills, Languages' }
            ]}
          />
        )}

        {activeTab === 'conferences' && (
          <SectionView
            title="Conferences Attended"
            items={profileData.conferences}
            onAdd={() => setShowAddForm('conferences')}
            onToggle={(id) => toggleVisibility('conferences', id)}
            onDelete={(id) => deleteItem('conferences', id)}
            showAddForm={showAddForm === 'conferences'}
            onCloseForm={() => setShowAddForm(null)}
            onSubmit={(item) => { addItem('conferences', item); setShowAddForm(null); }}
            fields={[
              { name: 'name', label: 'Conference Name', type: 'text' },
              { name: 'date', label: 'Date', type: 'text' },
              { name: 'location', label: 'Location', type: 'text' },
              { name: 'description', label: 'Key Takeaways', type: 'textarea' }
            ]}
          />
        )}

        {activeTab === 'workshops' && (
          <SectionView
            title="Workshops & Training"
            items={profileData.workshops}
            onAdd={() => setShowAddForm('workshops')}
            onToggle={(id) => toggleVisibility('workshops', id)}
            onDelete={(id) => deleteItem('workshops', id)}
            showAddForm={showAddForm === 'workshops'}
            onCloseForm={() => setShowAddForm(null)}
            onSubmit={(item) => { addItem('workshops', item); setShowAddForm(null); }}
            fields={[
              { name: 'name', label: 'Workshop Name', type: 'text' },
              { name: 'date', label: 'Date', type: 'text' },
              { name: 'instructor', label: 'Instructor/Organization', type: 'text' },
              { name: 'skills', label: 'Skills Learned', type: 'textarea' }
            ]}
          />
        )}

        {activeTab === 'certificates' && (
          <SectionView
            title="Certifications"
            items={profileData.certificates}
            onAdd={() => setShowAddForm('certificates')}
            onToggle={(id) => toggleVisibility('certificates', id)}
            onDelete={(id) => deleteItem('certificates', id)}
            showAddForm={showAddForm === 'certificates'}
            onCloseForm={() => setShowAddForm(null)}
            onSubmit={(item) => { addItem('certificates', item); setShowAddForm(null); }}
            fields={[
              { name: 'name', label: 'Certificate Name', type: 'text' },
              { name: 'issuer', label: 'Issuing Organization', type: 'text' },
              { name: 'date', label: 'Date Issued', type: 'text' },
              { name: 'credentialId', label: 'Credential ID (optional)', type: 'text' }
            ]}
          />
        )}

        {activeTab === 'courses' && (
          <SectionView
            title="Online Courses"
            items={profileData.courses}
            onAdd={() => setShowAddForm('courses')}
            onToggle={(id) => toggleVisibility('courses', id)}
            onDelete={(id) => deleteItem('courses', id)}
            showAddForm={showAddForm === 'courses'}
            onCloseForm={() => setShowAddForm(null)}
            onSubmit={(item) => { addItem('courses', item); setShowAddForm(null); }}
            fields={[
              { name: 'name', label: 'Course Name', type: 'text' },
              { name: 'provider', label: 'Provider (Coursera, Udemy, etc.)', type: 'text' },
              { name: 'completionDate', label: 'Completion Date', type: 'text' },
              { name: 'description', label: 'Description', type: 'textarea' }
            ]}
          />
        )}

        {activeTab === 'media' && (
          <SectionView
            title="Photos & Videos"
            items={profileData.media}
            onAdd={() => setShowAddForm('media')}
            onToggle={(id) => toggleVisibility('media', id)}
            onDelete={(id) => deleteItem('media', id)}
            showAddForm={showAddForm === 'media'}
            onCloseForm={() => setShowAddForm(null)}
            onSubmit={(item) => { addItem('media', item); setShowAddForm(null); }}
            fields={[
              { name: 'title', label: 'Title', type: 'text' },
              { name: 'type', label: 'Type', type: 'select', options: ['Photo', 'Video'] },
              { name: 'url', label: 'URL', type: 'text' },
              { name: 'description', label: 'Description', type: 'textarea' }
            ]}
          />
        )}
      </div>

      {coverLetterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Generate Cover Letter</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Job Title"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                placeholder="Company Name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (jobTitle && company) {
                      generateCoverLetter(jobTitle, company);
                      setCoverLetterModal(false);
                      setJobTitle('');
                      setCompany('');
                    } else {
                      alert('Please fill in all fields');
                    }
                  }}
                  className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 font-semibold"
                >
                  Generate
                </button>
                <button
                  onClick={() => {
                    setCoverLetterModal(false);
                    setJobTitle('');
                    setCompany('');
                  }}
                  className="flex-1 bg-gray-400 text-white py-3 rounded-lg hover:bg-gray-500 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileForm({ profileData, setProfileData }) {
  const updatePersonalInfo = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <User className="w-6 h-6 text-indigo-600" />
        Personal Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Full Name *"
          value={profileData.personalInfo.name}
          onChange={(e) => updatePersonalInfo('name', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="email"
          placeholder="Email Address *"
          value={profileData.personalInfo.email}
          onChange={(e) => updatePersonalInfo('email', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={profileData.personalInfo.phone}
          onChange={(e) => updatePersonalInfo('phone', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="text"
          placeholder="Professional Title *"
          value={profileData.personalInfo.title}
          onChange={(e) => updatePersonalInfo('title', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="text"
          placeholder="LinkedIn Profile URL"
          value={profileData.personalInfo.linkedin}
          onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="text"
          placeholder="Personal Website"
          value={profileData.personalInfo.website}
          onChange={(e) => updatePersonalInfo('website', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <textarea
        placeholder="Professional Summary - Brief overview of your career highlights and goals *"
        value={profileData.personalInfo.summary}
        onChange={(e) => updatePersonalInfo('summary', e.target.value)}
        rows="5"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
      />
      <p className="text-sm text-gray-500">* Required fields</p>
    </div>
  );
}

function SectionView({ title, items, onAdd, onToggle, onDelete, showAddForm, onCloseForm, onSubmit, fields }) {
  const [formData, setFormData] = useState({});

  const handleSubmit = () => {
    onSubmit(formData);
    setFormData({});
  };

  const handleInputChange = (fieldName, value) => {
    setFormData({ ...formData, [fieldName]: value });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-md">
          <Plus className="w-4 h-4" /> Add New
        </button>
      </div>

      {showAddForm && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border-2 border-indigo-200 space-y-3 mb-4">
          <h4 className="font-semibold text-gray-800 mb-3">Add New Item</h4>
          {fields.map(field => (
            <div key={field.name}>
              {field.type === 'textarea' ? (
                <textarea
                  placeholder={field.label}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              ) : field.type === 'select' ? (
                <select
                  value={formData[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">{field.label}</option>
                  {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              ) : (
                <input
                  type={field.type}
                  placeholder={field.placeholder || field.label}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              )}
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <button 
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-md"
            >
              ✓ Save
            </button>
            <button 
              onClick={onCloseForm}
              className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">No items added yet</p>
            <p className="text-gray-400 text-sm mt-2">Click "Add New" to get started!</p>
          </div>
        ) : (
          items.map(item => (
            <div key={item.id} className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm hover:shadow-md transition flex justify-between items-start">
              <div className="flex-1">
                {Object.entries(item).filter(([key]) => key !== 'id' && key !== 'visibility').map(([key, value]) => (
                  <p key={key} className="text-gray-700 mb-1">
                    <span className="font-semibold text-gray-800 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>{' '}
                    {value || 'N/A'}
                  </p>
                ))}
              </div>
              <div className="flex gap-2 ml-4">
                <button 
                  onClick={() => onToggle(item.id)} 
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                  title={item.visibility === 'public' ? 'Public - Click to make private' : 'Private - Click to make public'}
                >
                  {item.visibility === 'public' ? 
                    <Unlock className="w-5 h-5 text-green-600" /> : 
                    <Lock className="w-5 h-5 text-red-600" />
                  }
                </button>
                <button 
                  onClick={() => onDelete(item.id)} 
                  className="p-2 hover:bg-red-50 rounded-lg transition"
                  title="Delete item"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function PublicProfileView({ profileData, onBack, userEmail }) {
  const filterPublic = (items) => items.filter(item => item.visibility === 'public');
  const publicUrl = `https://professionalladder.com/profile/${userEmail}`;

  const copyProfileLink = () => {
    navigator.clipboard.writeText(publicUrl);
    alert('Profile link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
            <Eye className="w-7 h-7" />
            Public Profile Preview
          </h1>
          <div className="flex gap-3">
            <button 
              onClick={copyProfileLink}
              className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-md"
            >
              <Share2 className="w-4 h-4" /> Share Profile
            </button>
            <button 
              onClick={onBack} 
              className="px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8">
            <div className="flex items-center gap-6">
              <div className="bg-white rounded-full p-6">
                <User className="w-20 h-20 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-4xl font-bold">{profileData.personalInfo.name || 'Your Name'}</h2>
                <p className="text-2xl mt-2 text-indigo-100">{profileData.personalInfo.title || 'Professional Title'}</p>
                <div className="flex gap-4 mt-3 text-indigo-100">
                  {profileData.personalInfo.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" /> {profileData.personalInfo.email}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {profileData.personalInfo.summary && (
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <User className="w-6 h-6 text-indigo-600" /> About
                </h3>
                <p className="text-gray-700 leading-relaxed">{profileData.personalInfo.summary}</p>
              </div>
            )}

            {(profileData.personalInfo.linkedin || profileData.personalInfo.website) && (
              <div className="flex gap-4">
                {profileData.personalInfo.linkedin && (
                  <a href={profileData.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                    🔗 LinkedIn
                  </a>
                )}
                {profileData.personalInfo.website && (
                  <a href={profileData.personalInfo.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                    🌐 Website
                  </a>
                )}
              </div>
            )}

            {filterPublic(profileData.experience).length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-indigo-600" /> Professional Experience
                </h3>
                <div className="space-y-4">
                  {filterPublic(profileData.experience).map(exp => (
                    <div key={exp.id} className="border-l-4 border-indigo-600 pl-4 py-2">
                      <h4 className="font-semibold text-lg text-gray-800">{exp.title}</h4>
                      <p className="text-indigo-600 font-medium">{exp.company}</p>
                      <p className="text-gray-600 text-sm">{exp.startDate} - {exp.endDate || 'Present'}</p>
                      <p className="text-gray-700 mt-2">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filterPublic(profileData.education).length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-indigo-600" /> Education
                </h3>
                <div className="space-y-3">
                  {filterPublic(profileData.education).map(edu => (
                    <div key={edu.id} className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-semibold text-gray-800">{edu.degree} in {edu.field}</p>
                      <p className="text-gray-600">{edu.institution} • {edu.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filterPublic(profileData.skills).length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6 text-indigo-600" /> Skills & Expertise
                </h3>
                <div className="flex flex-wrap gap-2">
                  {filterPublic(profileData.skills).map(skill => (
                    <span key={skill.id} className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full font-medium">
                      {skill.name} {skill.level && `• ${skill.level}`}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {filterPublic(profileData.certificates).length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6 text-indigo-600" /> Certifications
                </h3>
                <div className="space-y-3">
                  {filterPublic(profileData.certificates).map(cert => (
                    <div key={cert.id} className="bg-green-50 p-4 rounded-lg border-l-4 border-green-600">
                      <p className="font-semibold text-gray-800">{cert.name}</p>
                      <p className="text-gray-600">{cert.issuer} • {cert.date}</p>
                      {cert.credentialId && <p className="text-sm text-gray-500">ID: {cert.credentialId}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filterPublic(profileData.courses).length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-indigo-600" /> Courses & Training
                </h3>
                <div className="space-y-3">
                  {filterPublic(profileData.courses).map(course => (
                    <div key={course.id} className="bg-blue-50 p-4 rounded-lg">
                      <p className="font-semibold text-gray-800">{course.name}</p>
                      <p className="text-gray-600">{course.provider} • {course.completionDate}</p>
                      {course.description && <p className="text-gray-700 text-sm mt-1">{course.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filterPublic(profileData.conferences).length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-indigo-600" /> Conferences & Events
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filterPublic(profileData.conferences).map(conf => (
                    <div key={conf.id} className="bg-purple-50 p-4 rounded-lg">
                      <p className="font-semibold text-gray-800">{conf.name}</p>
                      <p className="text-gray-600 text-sm">{conf.location} • {conf.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filterPublic(profileData.workshops).length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-indigo-600" /> Workshops
                </h3>
                <div className="space-y-3">
                  {filterPublic(profileData.workshops).map(workshop => (
                    <div key={workshop.id} className="bg-orange-50 p-4 rounded-lg">
                      <p className="font-semibold text-gray-800">{workshop.name}</p>
                      <p className="text-gray-600 text-sm">{workshop.instructor} • {workshop.date}</p>
                      {workshop.skills && <p className="text-gray-700 text-sm mt-1">{workshop.skills}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filterPublic(profileData.media).length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Image className="w-6 h-6 text-indigo-600" /> Media Gallery
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filterPublic(profileData.media).map(media => (
                    <div key={media.id} className="bg-gray-100 p-4 rounded-lg">
                      <p className="font-semibold text-gray-800 mb-2">{media.title}</p>
                      <p className="text-sm text-gray-600 mb-2">{media.type}</p>
                      {media.url && (
                        <a href={media.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline text-sm">
                          View {media.type}
                        </a>
                      )}
                      {media.description && <p className="text-gray-700 text-sm mt-2">{media.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filterPublic(profileData.experience).length === 0 && 
             filterPublic(profileData.certificates).length === 0 && 
             filterPublic(profileData.conferences).length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No public information available yet</p>
                <p className="text-gray-400 text-sm mt-2">Add items to your profile and mark them as public to display them here</p>
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-6 text-center border-t">
            <p className="text-gray-600 text-sm">Powered by Professional Ladder</p>
            <p className="text-gray-500 text-xs mt-1">Track your career journey • Build your professional brand</p>
          </div>
        </div>
      </div>
    </div>
  );
}
