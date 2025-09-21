// pages/Landing.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { careerAPI } from '../services/api';

const Landing = () => {
  const [skills, setSkills] = useState('');
  const [expertise, setExpertise] = useState('Beginner');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const { setAnalysisResult, setLoading, updateUserSkills, setCurrentSkills, setCurrentExpertise } = useAppContext();

  // Enhanced skill suggestions covering ALL programming languages and technologies
  const skillSuggestions = {
    'Programming Languages': [
      'Python', 'JavaScript', 'Java', 'C++', 'C#', 'TypeScript', 'PHP', 'Ruby', 'Go', 'Rust',
      'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB', 'Perl', 'Dart', 'Lua', 'Haskell', 'Clojure',
      'F#', 'Erlang', 'Elixir', 'Julia', 'Nim', 'Crystal', 'Zig', 'Assembly', 'Fortran', 'COBOL'
    ],
    'Frontend Technologies': [
      'React', 'Vue.js', 'Angular', 'Svelte', 'HTML5', 'CSS3', 'Sass', 'Less', 'Bootstrap',
      'Tailwind CSS', 'Material-UI', 'Chakra UI', 'Ant Design', 'jQuery', 'Alpine.js',
      'Stimulus', 'Lit', 'Web Components', 'Progressive Web Apps'
    ],
    'Backend Technologies': [
      'Node.js', 'Express.js', 'Django', 'Flask', 'FastAPI', 'Spring Boot', 'Laravel',
      'Ruby on Rails', 'ASP.NET Core', 'Gin', 'Echo', 'Actix Web', 'Rocket', 'Vapor'
    ],
    'Mobile Development': [
      'React Native', 'Flutter', 'Swift', 'Kotlin', 'Ionic', 'Xamarin', 'Cordova',
      'Android Development', 'iOS Development', 'SwiftUI', 'Jetpack Compose'
    ],
    'Databases': [
      'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'SQL Server',
      'Cassandra', 'DynamoDB', 'Firebase', 'Elasticsearch', 'Neo4j', 'InfluxDB'
    ],
    'Cloud & DevOps': [
      'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform', 'Ansible',
      'Jenkins', 'GitLab CI', 'GitHub Actions', 'CircleCI', 'Helm', 'Vagrant'
    ],
    'Data Science & AI': [
      'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy',
      'Scikit-learn', 'OpenCV', 'Natural Language Processing', 'Computer Vision',
      'Tableau', 'Power BI', 'Apache Spark', 'Hadoop', 'Kafka'
    ],
    'Game Development': [
      'Unity', 'Unreal Engine', 'Godot', 'Blender', 'GameMaker Studio', 'C++ for Games',
      'C# for Games', 'Lua Scripting', '3D Modeling', 'Shader Programming'
    ],
    'Design & Creative': [
      'UI/UX Design', 'Figma', 'Sketch', 'Adobe XD', 'Photoshop', 'Illustrator',
      'After Effects', 'Premiere Pro', 'InVision', 'Principle', 'Framer'
    ],
    'Testing & QA': [
      'Jest', 'Mocha', 'Pytest', 'JUnit', 'Selenium', 'Cypress', 'Playwright',
      'TestNG', 'Postman', 'LoadRunner', 'JMeter'
    ],
    'Security': [
      'Cybersecurity', 'Penetration Testing', 'Ethical Hacking', 'Network Security',
      'Cryptography', 'OWASP', 'Security Auditing', 'Vulnerability Assessment'
    ],
    'Blockchain & Web3': [
      'Blockchain', 'Ethereum', 'Solidity', 'Smart Contracts', 'DeFi', 'NFT Development',
      'Web3.js', 'Truffle', 'Hardhat', 'Metamask Integration'
    ],
    'Emerging Technologies': [
      'IoT', 'Augmented Reality', 'Virtual Reality', 'Edge Computing', 'Quantum Computing',
      '5G Technology', 'Robotics', 'Computer Vision', 'Voice Recognition'
    ]
  };

  // Enhanced skill search with intelligent suggestions
  const handleSkillsChange = (e) => {
    const value = e.target.value;
    setSkills(value);
    setCurrentSkills(value); // Track current skills globally
    
    if (value.length > 1) {
      const allSkills = Object.values(skillSuggestions).flat();
      const filtered = allSkills.filter(skill => 
        skill.toLowerCase().includes(value.toLowerCase()) &&
        !skills.toLowerCase().includes(skill.toLowerCase())
      ).slice(0, 8);
      
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  // Add suggested skill to the input
  const addSkill = (skill) => {
    const currentSkills = skills.split(',').map(s => s.trim()).filter(s => s);
    if (!currentSkills.includes(skill)) {
      const newSkills = [...currentSkills, skill].join(', ');
      setSkills(newSkills);
    }
    setShowSuggestions(false);
  };

  // Enhanced form submission with real API integration
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!skills.trim()) {
      setError('Please enter your skills');
      return;
    }
    
    setIsLoading(true);
    setLoading(true);
    setError('');
    
    try {
      // Store user skills in context first
      updateUserSkills(skills);
      
      // Call the backend API directly for career analysis
      const response = await careerAPI.analyzeCareer(skills, expertise);
      
      if (response) {
        // Store the analysis result in context for dashboard
        const enrichedResponse = {
          ...response,
          skills: skills, // Ensure skills are included in analysis result
          expertise: expertise
        };
        setAnalysisResult(enrichedResponse);
        navigate('/dashboard');
      } else {
        throw new Error('No response received from analysis');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setError(`Analysis failed: ${error.message}. Please try again.`);
      
      // Still navigate to dashboard with fallback data
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  // Enhanced expertise levels with descriptions
  const expertiseLevels = [
    { level: 'Beginner', description: 'Just starting out or learning basics' },
    { level: 'Intermediate', description: 'Some experience, can work independently' },
    { level: 'Advanced', description: 'Experienced, can lead projects' },
    { level: 'Expert', description: 'Deep expertise, can mentor others' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 pt-20 wavy-background">
      {/* Floating Elements */}
      <div className="floating-elements">
        <div className="float-1"></div>
        <div className="float-2"></div>
        <div className="float-3"></div>
      </div>
      {/* Enhanced Hero Section */}
      <section className="text-center py-12 md:py-20">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
          Discover Your Perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Career Path</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          AI-powered career analysis supporting <span className="font-semibold text-indigo-600">ALL programming languages</span> and technologies. Get personalized guidance for any skill level.
        </p>
        
        {/* Simple Feature Highlights */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="flex items-center bg-white rounded-lg shadow-sm p-3 border border-gray-100">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Smart AI Analysis</p>
              <p className="text-sm text-gray-500">Intelligent skill assessment</p>
            </div>
          </div>
          
          <div className="flex items-center bg-white rounded-lg shadow-sm p-3 border border-gray-100">
            <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Universal Support</p>
              <p className="text-sm text-gray-500">200+ technologies</p>
            </div>
          </div>
          
          <div className="flex items-center bg-white rounded-lg shadow-sm p-3 border border-gray-100">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Personalized Paths</p>
              <p className="text-sm text-gray-500">Tailored roadmaps</p>
            </div>
          </div>
        </div>
      </section>

      {/* Analysis Form with AI Integration */}
      <section className="enhanced-card rounded-xl shadow-lg p-6 md:p-8 mb-12 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Analyze Your Skills</h2>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              {error}
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6 relative">
            <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
              Your Skills <span className="text-indigo-600">*</span>
            </label>
            <div className="relative">
              <textarea
                id="skills"
                value={skills}
                onChange={handleSkillsChange}
                placeholder="Enter your skills (e.g., Unity, C#, Game Development, 3D Modeling, Animation...)" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 enhanced-card text-gray-900 placeholder-gray-500"
                rows="4"
                required
              />
              
              {/* Enhanced Skill Suggestions Dropdown */}
              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 mt-1">
                  <div className="p-2 text-xs text-gray-500 border-b">💡 Suggested skills:</div>
                  <div className="max-h-48 overflow-y-auto">
                    {suggestions.map((skill, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => addSkill(skill)}
                        className="w-full text-left px-3 py-2 hover:bg-indigo-50 text-gray-700 text-sm border-b border-gray-100 last:border-b-0"
                      >
                        <i className="fas fa-plus text-indigo-500 mr-2 text-xs"></i>
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Skill Categories for Quick Selection */}
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">💡 Quick suggestions by category:</p>
              <div className="flex flex-wrap gap-2">
                {Object.keys(skillSuggestions).slice(0, 6).map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => {
                      const randomSkills = skillSuggestions[category].slice(0, 3);
                      const newSkills = skills ? `${skills}, ${randomSkills.join(', ')}` : randomSkills.join(', ');
                      setSkills(newSkills);
                    }}
                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-indigo-100 text-gray-700 hover:text-indigo-700 rounded-full transition-colors duration-200"
                  >
                    + {category}
                  </button>
                ))}
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mt-2">
              ✨ Supports ALL programming languages, frameworks, and technologies. Our AI will analyze any skill!
            </p>
          </div>
          
          <div className="mb-8">
            <label htmlFor="expertise" className="block text-sm font-medium text-gray-700 mb-3">
              Expertise Level <span className="text-indigo-600">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {expertiseLevels.map(({ level, description }) => (
                <div key={level} className="relative">
                  <input
                    type="radio"
                    id={level}
                    name="expertise"
                    value={level}
                    checked={expertise === level}
                    onClick={() => {
                      setExpertise(level);
                      setCurrentExpertise(level); // Track current expertise globally
                    }}
                    className="hidden peer"
                  />
                  <label
                    htmlFor={level}
                    className="block p-4 border border-gray-300 rounded-lg text-center cursor-pointer transition-all duration-200 peer-checked:border-indigo-500 peer-checked:bg-indigo-50 peer-checked:text-indigo-700 peer-checked:font-medium hover:bg-gray-50 bg-white text-gray-900"
                  >
                    <div className="font-medium">{level}</div>
                    <div className="text-xs text-gray-500 mt-1">{description}</div>
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-4 px-6 rounded-lg shadow-md transition-all duration-300 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing with AI...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Discover My Career Path
              </>
            )}
          </button>
        </form>
      </section>
    </div>
  );
};

export default Landing;