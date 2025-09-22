// pages/Landing.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Landing = () => {
  const [selectedCategory, setSelectedCategory] = useState(''); // 'engineering' or 'medical'
  const [selectedField, setSelectedField] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const navigate = useNavigate();
  const { setAnalysisResult, setCurrentSkills, setCurrentExpertise } = useAppContext();

  // Categories
  const categories = [
    { id: 'engineering', name: 'Engineering', icon: '⚙️' },
    { id: 'medical', name: 'Medical', icon: '⚕️' }
  ];

  // Engineering fields
  const engineeringFields = [
    'Software Engineering',
    'Mechanical Engineering',
    'Electrical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'Aerospace Engineering',
    'Biomedical Engineering',
    'Environmental Engineering',
    'Industrial Engineering',
    'Materials Engineering',
    'Nuclear Engineering',
    'Petroleum Engineering'
  ];

  // Medical fields
  const medicalFields = [
    'General Medicine',
    'Surgery',
    'Pediatrics',
    'Psychiatry',
    'Dermatology',
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Ophthalmology',
    'Gynecology',
    'Radiology',
    'Anesthesiology'
  ];

  // Domains for each engineering field
  const engineeringDomains = {
    'Software Engineering': [
      'Web Development',
      'Mobile Development',
      'Data Science',
      'Artificial Intelligence',
      'Cybersecurity',
      'DevOps',
      'Game Development',
      'Cloud Computing',
      'Blockchain',
      'IoT Development'
    ],
    'Mechanical Engineering': [
      'Thermodynamics',
      'Fluid Mechanics',
      'Robotics',
      'Automotive',
      'Aerospace',
      'Manufacturing',
      'HVAC',
      'CAD Design',
      'Automation',
      'Energy Systems'
    ],
    'Electrical Engineering': [
      'Power Systems',
      'Electronics',
      'Control Systems',
      'Signal Processing',
      'Telecommunications',
      'Embedded Systems',
      'Renewable Energy',
      'VLSI Design',
      'Instrumentation',
      'Smart Grids'
    ],
    'Civil Engineering': [
      'Structural Engineering',
      'Geotechnical Engineering',
      'Transportation',
      'Water Resources',
      'Construction Management',
      'Environmental Engineering',
      'Urban Planning',
      'Coastal Engineering',
      'Earthquake Engineering',
      'Surveying'
    ],
    'Chemical Engineering': [
      'Process Design',
      'Reaction Engineering',
      'Separation Processes',
      'Process Control',
      'Biochemical Engineering',
      'Petroleum Engineering',
      'Materials Science',
      'Pharmaceutical Engineering',
      'Food Processing',
      'Environmental Chemistry'
    ],
    'Aerospace Engineering': [
      'Aerodynamics',
      'Propulsion',
      'Structural Analysis',
      'Flight Mechanics',
      'Avionics',
      'Space Systems',
      'Composite Materials',
      'Aircraft Design',
      'Missile Technology',
      'Satellite Systems'
    ],
    'Biomedical Engineering': [
      'Medical Devices',
      'Biomaterials',
      'Biomechanics',
      'Medical Imaging',
      'Rehabilitation Engineering',
      'Tissue Engineering',
      'Biomedical Signal Processing',
      'Prosthetics',
      'Biomedical Instrumentation',
      'Clinical Engineering'
    ],
    'Environmental Engineering': [
      'Water Treatment',
      'Air Pollution Control',
      'Waste Management',
      'Environmental Impact Assessment',
      'Sustainable Design',
      'Climate Change',
      'Renewable Energy Systems',
      'Soil Remediation',
      'Environmental Monitoring',
      'Green Building'
    ],
    'Industrial Engineering': [
      'Operations Research',
      'Supply Chain Management',
      'Quality Control',
      'Lean Manufacturing',
      'Human Factors',
      'Production Planning',
      'Facilities Design',
      'Work Systems',
      'Simulation',
      'Decision Analysis'
    ],
    'Materials Engineering': [
      'Metallurgy',
      'Ceramics',
      'Polymers',
      'Nanomaterials',
      'Composite Materials',
      'Electronic Materials',
      'Biomaterials',
      'Corrosion',
      'Materials Characterization',
      'Sustainable Materials'
    ],
    'Nuclear Engineering': [
      'Nuclear Reactor Design',
      'Radiation Protection',
      'Nuclear Fuel Cycle',
      'Nuclear Safety',
      'Medical Physics',
      'Nuclear Waste Management',
      'Plasma Physics',
      'Nuclear Instrumentation',
      'Isotope Applications',
      'Fusion Technology'
    ],
    'Petroleum Engineering': [
      'Reservoir Engineering',
      'Drilling Engineering',
      'Production Engineering',
      'Petrophysics',
      'Enhanced Oil Recovery',
      'Natural Gas Engineering',
      'Offshore Engineering',
      'Well Logging',
      'Hydraulic Fracturing',
      'Petroleum Geology'
    ]
  };

  // Domains for each medical field
  const medicalDomains = {
    'General Medicine': [
      'Internal Medicine',
      'Family Medicine',
      'Preventive Medicine',
      'Emergency Medicine',
      'Geriatrics',
      'Sports Medicine',
      'Occupational Medicine',
      'Travel Medicine',
      'Palliative Care',
      'Integrative Medicine'
    ],
    'Surgery': [
      'General Surgery',
      'Cardiothoracic Surgery',
      'Neurosurgery',
      'Orthopedic Surgery',
      'Plastic Surgery',
      'Vascular Surgery',
      'Pediatric Surgery',
      'Transplant Surgery',
      'Minimally Invasive Surgery',
      'Robotic Surgery'
    ],
    'Pediatrics': [
      'Neonatology',
      'Pediatric Cardiology',
      'Pediatric Neurology',
      'Pediatric Endocrinology',
      'Pediatric Gastroenterology',
      'Pediatric Hematology',
      'Pediatric Oncology',
      'Pediatric Pulmonology',
      'Pediatric Nephrology',
      'Developmental Pediatrics'
    ],
    'Psychiatry': [
      'General Psychiatry',
      'Child Psychiatry',
      'Addiction Psychiatry',
      'Forensic Psychiatry',
      'Geriatric Psychiatry',
      'Consultation Psychiatry',
      'Psychosomatic Medicine',
      'Emergency Psychiatry',
      'Community Psychiatry',
      'Military Psychiatry'
    ],
    'Dermatology': [
      'Medical Dermatology',
      'Surgical Dermatology',
      'Cosmetic Dermatology',
      'Dermatopathology',
      'Pediatric Dermatology',
      'Dermatologic Surgery',
      'Mohs Surgery',
      'Teledermatology',
      'Dermatoepidemiology',
      'Immunodermatology'
    ],
    'Cardiology': [
      'Interventional Cardiology',
      'Electrophysiology',
      'Heart Failure',
      'Preventive Cardiology',
      'Pediatric Cardiology',
      'Nuclear Cardiology',
      'Echocardiography',
      'Cardiac MRI',
      'Congenital Heart Disease',
      'Cardiac Rehabilitation'
    ],
    'Neurology': [
      'Stroke Medicine',
      'Epilepsy',
      'Movement Disorders',
      'Neuromuscular Disorders',
      'Multiple Sclerosis',
      'Headache Medicine',
      'Sleep Medicine',
      'Neurocritical Care',
      'Behavioral Neurology',
      'Autonomic Disorders'
    ],
    'Orthopedics': [
      'Joint Replacement',
      'Sports Medicine',
      'Spine Surgery',
      'Trauma Surgery',
      'Pediatric Orthopedics',
      'Hand Surgery',
      'Foot and Ankle',
      'Oncology Orthopedics',
      'Reconstructive Surgery',
      'Musculoskeletal Oncology'
    ],
    'Ophthalmology': [
      'Cataract Surgery',
      'Glaucoma',
      'Retina',
      'Cornea',
      'Pediatric Ophthalmology',
      'Oculoplastics',
      'Neuro-Ophthalmology',
      'Uveitis',
      'Refractive Surgery',
      'Ocular Oncology'
    ],
    'Gynecology': [
      'Gynecologic Oncology',
      'Reproductive Endocrinology',
      'Urogynecology',
      'Maternal-Fetal Medicine',
      'Family Planning',
      'Minimally Invasive Surgery',
      'Adolescent Gynecology',
      'Menopause',
      'Gynecologic Pathology',
      'Reproductive Genetics'
    ],
    'Radiology': [
      'Diagnostic Radiology',
      'Interventional Radiology',
      'Nuclear Medicine',
      'Neuroradiology',
      'Musculoskeletal Radiology',
      'Cardiothoracic Radiology',
      'Pediatric Radiology',
      'Breast Imaging',
      'Emergency Radiology',
      'Abdominal Radiology'
    ],
    'Anesthesiology': [
      'General Anesthesia',
      'Regional Anesthesia',
      'Pain Management',
      'Critical Care Medicine',
      'Obstetric Anesthesia',
      'Pediatric Anesthesia',
      'Cardiac Anesthesia',
      'Neurosurgical Anesthesia',
      'Ambulatory Anesthesia',
      'Transplant Anesthesia'
    ]
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedField('');
    setSelectedDomain('');
  };

  const handleFieldSelect = (field) => {
    setSelectedField(field);
    setSelectedDomain('');
  };

  const handleDomainSelect = (domain) => {
    setSelectedDomain(domain);
    // Set the skills and expertise based on selection
    setCurrentSkills(domain);
    setCurrentExpertise('Beginner');
    
    // Add a small delay to ensure context is properly set before navigation
    setTimeout(() => {
      // Navigate to roadmap page
      navigate('/roadmap');
    }, 100);
  };

  const getFieldsForCategory = () => {
    if (selectedCategory === 'engineering') {
      return engineeringFields;
    } else if (selectedCategory === 'medical') {
      return medicalFields;
    }
    return [];
  };

  const getDomainsForField = () => {
    if (selectedCategory === 'engineering') {
      return engineeringDomains[selectedField] || [];
    } else if (selectedCategory === 'medical') {
      return medicalDomains[selectedField] || [];
    }
    return [];
  };

  const getCategoryTitle = () => {
    if (selectedCategory === 'engineering') {
      return 'Engineering';
    } else if (selectedCategory === 'medical') {
      return 'Medical';
    }
    return '';
  };

  const getFieldIcon = (field) => {
    // Engineering icons
    if (selectedCategory === 'engineering') {
      switch(field) {
        case 'Software Engineering':
          return '💻';
        case 'Mechanical Engineering':
          return '⚙️';
        case 'Electrical Engineering':
          return '⚡';
        case 'Civil Engineering':
          return '🏗️';
        case 'Chemical Engineering':
          return '⚗️';
        case 'Aerospace Engineering':
          return '🚀';
        case 'Biomedical Engineering':
          return '🔬';
        case 'Environmental Engineering':
          return '🌍';
        case 'Industrial Engineering':
          return '🏭';
        case 'Materials Engineering':
          return '🔬';
        case 'Nuclear Engineering':
          return '⚛️';
        case 'Petroleum Engineering':
          return '⛽';
        default:
          return '🔧';
      }
    }
    // Medical icons
    else if (selectedCategory === 'medical') {
      switch(field) {
        case 'General Medicine':
          return '🩺';
        case 'Surgery':
          return '🔪';
        case 'Pediatrics':
          return '👶';
        case 'Psychiatry':
          return '🧠';
        case 'Dermatology':
          return '皮肤病';
        case 'Cardiology':
          return '❤️';
        case 'Neurology':
          return '🧠';
        case 'Orthopedics':
          return '🦴';
        case 'Ophthalmology':
          return '👁️';
        case 'Gynecology':
          return '🚺';
        case 'Radiology':
          return '📷';
        case 'Anesthesiology':
          return '💤';
        default:
          return '⚕️';
      }
    }
    return '📁';
  };

  return (
    // Updated to light mode with professional styling
    <div className="max-w-6xl mx-auto px-4 pt-16 professional-background">
      {/* Floating Elements */}
      <div className="floating-elements">
        <div className="float-1"></div>
        <div className="float-2"></div>
        <div className="float-3"></div>
      </div>
      
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20">
        <div className="professional-card max-w-4xl mx-auto mb-12">
          <div className="professional-card-header">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 professional-heading">
              Your Career Guide
            </h1>
            <p className="text-xl text-gray-600 professional-text">
              Hey there! I'm your friendly career guide. Let's explore your future together! 🌟
            </p>
            <p className="text-lg text-gray-500 mt-4">
              Choose your field and specialization to get a personalized roadmap
            </p>
          </div>
        </div>
      </section>

      {/* Category Selection */}
      {!selectedCategory ? (
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 professional-heading">Select Your Career Category</h2>
            <p className="text-gray-600 professional-text">I'm here to help you find the perfect path! 🎯</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {categories.map((category, index) => (
              <div 
                key={index}
                onClick={() => handleCategorySelect(category.id)}
                className="professional-card bg-white rounded-lg shadow-lg p-8 cursor-pointer hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-indigo-300 flex flex-col items-center"
              >
                <div className="text-6xl mb-6">
                  {category.icon}
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3 professional-subheading">{category.name}</h3>
                <p className="text-gray-600 professional-text text-center">
                  {category.id === 'engineering' 
                    ? 'Build amazing things and solve complex problems' 
                    : 'Heal and help people with your medical expertise'}
                </p>
                <div className="mt-6 text-indigo-600 font-medium">Let's explore →</div>
              </div>
            ))}
          </div>
        </section>
      ) : !selectedField ? (
        /* Field Selection */
        <section className="mb-16">
          <div className="text-center mb-8">
            <button 
              onClick={() => setSelectedCategory('')}
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-4"
            >
              <i className="fas fa-arrow-left mr-2"></i> Back to Categories
            </button>
            <h2 className="text-3xl font-bold text-gray-900 mb-2 professional-heading">Select Your {getCategoryTitle()} Field</h2>
            <p className="text-gray-600 professional-text">I'll help you find the perfect specialization! 🌈</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFieldsForCategory().map((field, index) => (
              <div 
                key={index}
                onClick={() => handleFieldSelect(field)}
                className="professional-card bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-indigo-300"
              >
                <div className="text-4xl mb-4">
                  {getFieldIcon(field)}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 professional-subheading">{field}</h3>
                <p className="text-gray-600 professional-text">
                  {selectedCategory === 'engineering' 
                    ? 'Explore engineering specializations' 
                    : 'Discover medical specializations'}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : !selectedDomain ? (
        /* Domain Selection */
        <section className="mb-16">
          <div className="text-center mb-8">
            <button 
              onClick={() => setSelectedField('')}
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-4"
            >
              <i className="fas fa-arrow-left mr-2"></i> Back to Fields
            </button>
            <h2 className="text-3xl font-bold text-gray-900 mb-2 professional-heading">Select Specialization in {selectedField}</h2>
            <p className="text-gray-600 professional-text">Let's dive deep into your area of interest! 🚀</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getDomainsForField().map((domain, index) => (
              <div 
                key={index}
                onClick={() => handleDomainSelect(domain)}
                className="professional-card bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-indigo-300"
              >
                <div className="text-3xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 professional-subheading">{domain}</h3>
                <p className="text-gray-600 professional-text">Get your personalized learning path</p>
                <div className="mt-4 text-indigo-600 font-medium">Let's get started! →</div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default Landing;