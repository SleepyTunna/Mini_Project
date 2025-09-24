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
    { id: 'medical', name: 'Medical', icon: '⚕️' },
    { id: 'commerce', name: 'Commerce, Business & Management', icon: '💼' },
    { id: 'design', name: 'Design, Creative & Applied Arts', icon: '🎨' },
    { id: 'law', name: 'Law & Public Service', icon: '⚖️' },
    { id: 'science', name: 'Core Sciences & Research', icon: '🔬' },
    { id: 'emerging', name: 'Emerging & Interdisciplinary Fields', icon: '🚀' }
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

  // Commerce, Business & Management fields
  const commerceFields = [
    'Business Administration',
    'Finance',
    'Marketing',
    'Human Resources',
    'Operations Management',
    'Entrepreneurship',
    'Economics',
    'Accounting',
    'Supply Chain Management',
    'International Business',
    'Business Analytics',
    'Strategic Management'
  ];

  // Design, Creative & Applied Arts fields
  const designFields = [
    'Graphic Design',
    'Industrial Design',
    'Fashion Design',
    'Interior Design',
    'Animation',
    'Photography',
    'Film & Video Production',
    'Architecture',
    'Digital Media Arts',
    'Game Design',
    'UI/UX Design',
    'Creative Writing'
  ];

  // Law & Public Service fields
  const lawFields = [
    'Law',
    'Public Administration',
    'Political Science',
    'International Relations',
    'Criminal Justice',
    'Social Work',
    'Public Policy',
    'Diplomacy',
    'Non-Profit Management',
    'Urban Planning',
    'Public Health',
    'Emergency Management'
  ];

  // Core Sciences & Research fields
  const scienceFields = [
    'Physics',
    'Chemistry',
    'Biology',
    'Mathematics',
    'Statistics',
    'Geology',
    'Astronomy',
    'Environmental Science',
    'Biotechnology',
    'Materials Science',
    'Nanotechnology',
    'Marine Science'
  ];

  // Emerging & Interdisciplinary Fields
  const emergingFields = [
    'Artificial Intelligence',
    'Data Science',
    'Cybersecurity',
    'Renewable Energy',
    'Biotechnology',
    'Neuroscience',
    'Robotics',
    'Blockchain Technology',
    'Quantum Computing',
    'Bioinformatics',
    'Computational Biology',
    'Digital Humanities'
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

  // Domains for each commerce field
  const commerceDomains = {
    'Business Administration': [
      'Strategic Planning',
      'Organizational Behavior',
      'Business Ethics',
      'Project Management',
      'Leadership Development',
      'Change Management',
      'Business Process Improvement',
      'Corporate Governance',
      'Risk Management',
      'Business Innovation'
    ],
    'Finance': [
      'Corporate Finance',
      'Investment Banking',
      'Financial Planning',
      'Risk Management',
      'Financial Analysis',
      'Portfolio Management',
      'Derivatives',
      'Financial Modeling',
      'International Finance',
      'Behavioral Finance'
    ],
    'Marketing': [
      'Digital Marketing',
      'Brand Management',
      'Market Research',
      'Consumer Behavior',
      'Social Media Marketing',
      'Content Marketing',
      'Product Marketing',
      'Marketing Analytics',
      'Customer Relationship Management',
      'Global Marketing'
    ],
    'Human Resources': [
      'Talent Acquisition',
      'Employee Relations',
      'Performance Management',
      'Compensation & Benefits',
      'Training & Development',
      'HR Analytics',
      'Organizational Development',
      'Labor Relations',
      'Diversity & Inclusion',
      'HR Technology'
    ],
    'Operations Management': [
      'Supply Chain Optimization',
      'Quality Management',
      'Process Improvement',
      'Inventory Management',
      'Logistics Management',
      'Lean Manufacturing',
      'Six Sigma',
      'Production Planning',
      'Facility Management',
      'Operations Analytics'
    ],
    'Entrepreneurship': [
      'Startup Development',
      'Venture Capital',
      'Business Model Innovation',
      'Product Development',
      'Market Validation',
      'Pitch Development',
      'Business Incubation',
      'Franchise Development',
      'Social Entrepreneurship',
      'Innovation Management'
    ],
    'Economics': [
      'Microeconomics',
      'Macroeconomics',
      'Econometrics',
      'Development Economics',
      'Behavioral Economics',
      'International Economics',
      'Labor Economics',
      'Environmental Economics',
      'Health Economics',
      'Financial Economics'
    ],
    'Accounting': [
      'Financial Accounting',
      'Managerial Accounting',
      'Taxation',
      'Auditing',
      'Cost Accounting',
      'Forensic Accounting',
      'Government Accounting',
      'International Accounting',
      'Accounting Information Systems',
      'Ethics in Accounting'
    ],
    'Supply Chain Management': [
      'Procurement Management',
      'Distribution Management',
      'Warehouse Management',
      'Transportation Management',
      'Demand Planning',
      'Supplier Relationship Management',
      'Supply Chain Analytics',
      'Global Supply Chain',
      'Supply Chain Risk Management',
      'Sustainable Supply Chain'
    ],
    'International Business': [
      'Global Strategy',
      'Cross-Cultural Management',
      'International Trade',
      'Foreign Exchange Management',
      'Global Marketing',
      'International Finance',
      'Export-Import Management',
      'Global Operations',
      'International Business Law',
      'Multinational Corporation Management'
    ],
    'Business Analytics': [
      'Data Visualization',
      'Predictive Analytics',
      'Statistical Analysis',
      'Business Intelligence',
      'Data Mining',
      'Machine Learning for Business',
      'Customer Analytics',
      'Financial Analytics',
      'Operations Analytics',
      'Marketing Analytics'
    ],
    'Strategic Management': [
      'Corporate Strategy',
      'Competitive Analysis',
      'Strategic Planning',
      'Business Model Innovation',
      'Mergers & Acquisitions',
      'Strategic Alliances',
      'Innovation Strategy',
      'Digital Transformation Strategy',
      'Sustainability Strategy',
      'Global Strategy'
    ]
  };

  // Domains for each design field
  const designDomains = {
    'Graphic Design': [
      'Typography',
      'Branding & Identity',
      'Print Design',
      'Digital Design',
      'Illustration',
      'Packaging Design',
      'Editorial Design',
      'Motion Graphics',
      'Infographic Design',
      'Visual Communication'
    ],
    'Industrial Design': [
      'Product Design',
      'User Experience Design',
      'Ergonomics',
      'Materials & Manufacturing',
      'Prototyping',
      'Design Research',
      'Sustainable Design',
      'Furniture Design',
      'Automotive Design',
      'Consumer Electronics Design'
    ],
    'Fashion Design': [
      'Textile Design',
      'Garment Construction',
      'Fashion Illustration',
      'Pattern Making',
      'Fashion Marketing',
      'Sustainable Fashion',
      'Haute Couture',
      'Ready-to-Wear',
      'Fashion Merchandising',
      'Fashion Technology'
    ],
    'Interior Design': [
      'Space Planning',
      'Color Theory',
      'Lighting Design',
      'Furniture Design',
      'Sustainable Interior Design',
      'Commercial Interior Design',
      'Residential Interior Design',
      'Kitchen & Bath Design',
      'Hospitality Design',
      'Healthcare Interior Design'
    ],
    'Animation': [
      '2D Animation',
      '3D Animation',
      'Character Design',
      'Storyboarding',
      'Visual Effects',
      'Motion Graphics',
      'Stop Motion',
      'Game Animation',
      'CGI Animation',
      'Animation Production Pipeline'
    ],
    'Photography': [
      'Portrait Photography',
      'Landscape Photography',
      'Fashion Photography',
      'Photojournalism',
      'Commercial Photography',
      'Fine Art Photography',
      'Digital Photography',
      'Studio Photography',
      'Wedding Photography',
      'Architectural Photography'
    ],
    'Film & Video Production': [
      'Cinematography',
      'Screenwriting',
      'Directing',
      'Editing',
      'Sound Design',
      'Documentary Production',
      'Commercial Production',
      'Post-Production',
      'Visual Effects',
      'Film Distribution'
    ],
    'Architecture': [
      'Architectural Design',
      'Urban Planning',
      'Sustainable Architecture',
      'Building Information Modeling',
      'Construction Documentation',
      'Historic Preservation',
      'Landscape Architecture',
      'Interior Architecture',
      'Parametric Design',
      'Smart Building Design'
    ],
    'Digital Media Arts': [
      'Interactive Media',
      'Web Design',
      'Digital Illustration',
      'Multimedia Production',
      'Virtual Reality',
      'Augmented Reality',
      'Game Design',
      'Digital Storytelling',
      'Social Media Content',
      'Mobile Media Design'
    ],
    'Game Design': [
      'Game Mechanics',
      'Level Design',
      'Character Design',
      'Narrative Design',
      'Game Programming',
      'User Experience in Games',
      'Mobile Game Design',
      'Serious Games',
      'Game Testing',
      'Game Production Management'
    ],
    'UI/UX Design': [
      'User Research',
      'Information Architecture',
      'Wireframing',
      'Prototyping',
      'User Testing',
      'Interaction Design',
      'Visual Design',
      'Accessibility Design',
      'Service Design',
      'Design Systems'
    ],
    'Creative Writing': [
      'Fiction Writing',
      'Poetry',
      'Screenwriting',
      'Technical Writing',
      'Copywriting',
      'Content Writing',
      'Journalism',
      'Scriptwriting',
      'Playwriting',
      'Narrative Design'
    ]
  };

  // Domains for each law field
  const lawDomains = {
    'Law': [
      'Constitutional Law',
      'Corporate Law',
      'Criminal Law',
      'Civil Law',
      'Contract Law',
      'Property Law',
      'Family Law',
      'International Law',
      'Environmental Law',
      'Intellectual Property Law'
    ],
    'Public Administration': [
      'Public Policy Analysis',
      'Administrative Law',
      'Budgeting & Finance',
      'Human Resource Management',
      'Public Sector Ethics',
      'Local Government Management',
      'Public Program Evaluation',
      'Intergovernmental Relations',
      'Public Financial Management',
      'Strategic Planning in Public Sector'
    ],
    'Political Science': [
      'Comparative Politics',
      'International Relations',
      'Political Theory',
      'American Politics',
      'Public Policy',
      'Political Economy',
      'Electoral Systems',
      'Political Behavior',
      'Legislative Processes',
      'Judicial Politics'
    ],
    'International Relations': [
      'Diplomacy',
      'International Security',
      'Global Governance',
      'International Political Economy',
      'Conflict Resolution',
      'International Organizations',
      'Foreign Policy Analysis',
      'Global Environmental Politics',
      'Human Rights',
      'International Development'
    ],
    'Criminal Justice': [
      'Criminology',
      'Law Enforcement',
      'Corrections',
      'Juvenile Justice',
      'Criminal Investigation',
      'Forensic Science',
      'Victim Services',
      'Crime Prevention',
      'Criminal Law & Procedure',
      'Cyber Crime'
    ],
    'Social Work': [
      'Clinical Social Work',
      'Child Welfare',
      'Mental Health',
      'Substance Abuse',
      'Gerontology',
      'Medical Social Work',
      'School Social Work',
      'Community Organizing',
      'Policy Practice',
      'Trauma-Informed Care'
    ],
    'Public Policy': [
      'Policy Analysis',
      'Program Evaluation',
      'Policy Implementation',
      'Regulatory Policy',
      'Social Policy',
      'Economic Policy',
      'Health Policy',
      'Education Policy',
      'Environmental Policy',
      'Urban Policy'
    ],
    'Diplomacy': [
      'International Negotiation',
      'Cultural Diplomacy',
      'Economic Diplomacy',
      'Public Diplomacy',
      'Diplomatic History',
      'Consular Affairs',
      'Trade Diplomacy',
      'Multilateral Diplomacy',
      'Diplomatic Protocol',
      'Conflict Diplomacy'
    ],
    'Non-Profit Management': [
      'Fundraising & Development',
      'Grant Writing',
      'Board Governance',
      'Volunteer Management',
      'Program Management',
      'Non-Profit Marketing',
      'Financial Management',
      'Strategic Planning',
      'Advocacy & Lobbying',
      'Social Entrepreneurship'
    ],
    'Urban Planning': [
      'Land Use Planning',
      'Transportation Planning',
      'Housing Policy',
      'Environmental Planning',
      'Urban Design',
      'Regional Planning',
      'Community Development',
      'Planning Law',
      'GIS & Spatial Analysis',
      'Sustainable Urban Development'
    ],
    'Public Health': [
      'Epidemiology',
      'Biostatistics',
      'Health Policy',
      'Environmental Health',
      'Global Health',
      'Health Promotion',
      'Health Informatics',
      'Occupational Health',
      'Maternal & Child Health',
      'Health Services Management'
    ],
    'Emergency Management': [
      'Disaster Preparedness',
      'Emergency Response',
      'Disaster Recovery',
      'Risk Assessment',
      'Business Continuity',
      'Crisis Management',
      'Emergency Communications',
      'Hazard Mitigation',
      'Floodplain Management',
      'Terrorism & Security'
    ]
  };

  // Domains for each science field
  const scienceDomains = {
    'Physics': [
      'Classical Mechanics',
      'Electromagnetism',
      'Quantum Mechanics',
      'Thermodynamics',
      'Optics',
      'Nuclear Physics',
      'Particle Physics',
      'Astrophysics',
      'Condensed Matter Physics',
      'Biophysics'
    ],
    'Chemistry': [
      'Organic Chemistry',
      'Inorganic Chemistry',
      'Physical Chemistry',
      'Analytical Chemistry',
      'Biochemistry',
      'Environmental Chemistry',
      'Medicinal Chemistry',
      'Materials Chemistry',
      'Computational Chemistry',
      'Green Chemistry'
    ],
    'Biology': [
      'Molecular Biology',
      'Cell Biology',
      'Genetics',
      'Evolution',
      'Ecology',
      'Microbiology',
      'Immunology',
      'Neuroscience',
      'Developmental Biology',
      'Bioinformatics'
    ],
    'Mathematics': [
      'Calculus',
      'Linear Algebra',
      'Abstract Algebra',
      'Real Analysis',
      'Complex Analysis',
      'Differential Equations',
      'Topology',
      'Number Theory',
      'Probability Theory',
      'Mathematical Logic'
    ],
    'Statistics': [
      'Descriptive Statistics',
      'Inferential Statistics',
      'Regression Analysis',
      'Time Series Analysis',
      'Bayesian Statistics',
      'Multivariate Analysis',
      'Statistical Computing',
      'Experimental Design',
      'Survey Sampling',
      'Statistical Learning'
    ],
    'Geology': [
      'Mineralogy',
      'Petrology',
      'Structural Geology',
      'Sedimentology',
      'Paleontology',
      'Geochemistry',
      'Geophysics',
      'Hydrogeology',
      'Environmental Geology',
      'Planetary Geology'
    ],
    'Astronomy': [
      'Stellar Astronomy',
      'Galactic Astronomy',
      'Cosmology',
      'Planetary Science',
      'Astrophysics',
      'Observational Astronomy',
      'Radio Astronomy',
      'Solar Physics',
      'Exoplanet Science',
      'Astrobiology'
    ],
    'Environmental Science': [
      'Ecology',
      'Environmental Chemistry',
      'Climate Science',
      'Conservation Biology',
      'Environmental Policy',
      'Sustainability Science',
      'Remote Sensing',
      'Environmental Monitoring',
      'Pollution Control',
      'Renewable Energy'
    ],
    'Biotechnology': [
      'Genetic Engineering',
      'Bioprocessing',
      'Pharmaceutical Biotechnology',
      'Agricultural Biotechnology',
      'Industrial Biotechnology',
      'Bioinformatics',
      'Proteomics',
      'Genomics',
      'Tissue Engineering',
      'Synthetic Biology'
    ],
    'Materials Science': [
      'Metallurgy',
      'Ceramics',
      'Polymers',
      'Nanomaterials',
      'Composite Materials',
      'Electronic Materials',
      'Biomaterials',
      'Corrosion Science',
      'Materials Characterization',
      'Sustainable Materials'
    ],
    'Nanotechnology': [
      'Nanomaterials',
      'Nanoelectronics',
      'Nanomedicine',
      'Molecular Nanotechnology',
      'Nanosensors',
      'Nanochemistry',
      'Nanophysics',
      'Nanofabrication',
      'Nanorobotics',
      'Environmental Nanotechnology'
    ],
    'Marine Science': [
      'Oceanography',
      'Marine Biology',
      'Marine Chemistry',
      'Marine Geology',
      'Marine Ecology',
      'Fisheries Science',
      'Marine Conservation',
      'Coastal Management',
      'Marine Policy',
      'Underwater Technology'
    ]
  };

  // Domains for each emerging field
  const emergingDomains = {
    'Artificial Intelligence': [
      'Machine Learning',
      'Deep Learning',
      'Natural Language Processing',
      'Computer Vision',
      'Reinforcement Learning',
      'AI Ethics',
      'Robotics & AI',
      'Expert Systems',
      'Neural Networks',
      'AI in Healthcare'
    ],
    'Data Science': [
      'Big Data Analytics',
      'Data Mining',
      'Predictive Analytics',
      'Data Visualization',
      'Statistical Modeling',
      'Data Engineering',
      'Business Intelligence',
      'Data Warehousing',
      'Cloud Computing for Data',
      'Real-time Data Processing'
    ],
    'Cybersecurity': [
      'Network Security',
      'Information Security',
      'Ethical Hacking',
      'Digital Forensics',
      'Cryptography',
      'Cloud Security',
      'Mobile Security',
      'IoT Security',
      'Risk Management',
      'Security Architecture'
    ],
    'Renewable Energy': [
      'Solar Energy',
      'Wind Energy',
      'Hydroelectric Power',
      'Geothermal Energy',
      'Bioenergy',
      'Energy Storage',
      'Smart Grids',
      'Energy Efficiency',
      'Green Building Technologies',
      'Sustainable Energy Policy'
    ],
    'Biotechnology': [
      'Genetic Engineering',
      'Biopharmaceuticals',
      'Agricultural Biotech',
      'Industrial Biotech',
      'Synthetic Biology',
      'CRISPR Technology',
      'Stem Cell Technology',
      'Bioprocessing',
      'Bioinformatics',
      'Personalized Medicine'
    ],
    'Neuroscience': [
      'Cognitive Neuroscience',
      'Computational Neuroscience',
      'Molecular Neuroscience',
      'Behavioral Neuroscience',
      'Clinical Neuroscience',
      'Developmental Neuroscience',
      'Social Neuroscience',
      'Neuroimaging',
      'Neuroengineering',
      'Neuroethics'
    ],
    'Robotics': [
      'Industrial Robotics',
      'Service Robotics',
      'Autonomous Vehicles',
      'Human-Robot Interaction',
      'Robot Control Systems',
      'Robot Perception',
      'Swarm Robotics',
      'Medical Robotics',
      'Soft Robotics',
      'Robotics in Manufacturing'
    ],
    'Blockchain Technology': [
      'Cryptocurrencies',
      'Smart Contracts',
      'Decentralized Finance',
      'Supply Chain Blockchain',
      'Blockchain Security',
      'Distributed Ledger Technology',
      'Tokenomics',
      'Blockchain in Healthcare',
      'NFT Technology',
      'Enterprise Blockchain'
    ],
    'Quantum Computing': [
      'Quantum Algorithms',
      'Quantum Cryptography',
      'Quantum Information Theory',
      'Quantum Hardware',
      'Quantum Software Development',
      'Quantum Machine Learning',
      'Quantum Error Correction',
      'Topological Quantum Computing',
      'Quantum Simulation',
      'Quantum Communication'
    ],
    'Bioinformatics': [
      'Genomic Data Analysis',
      'Proteomics',
      'Computational Biology',
      'Sequence Analysis',
      'Phylogenetics',
      'Structural Bioinformatics',
      'Systems Biology',
      'Metabolomics',
      'Biostatistics',
      'Personalized Medicine Informatics'
    ],
    'Computational Biology': [
      'Systems Biology',
      'Molecular Modeling',
      'Population Genetics',
      'Evolutionary Computation',
      'Biological Network Analysis',
      'Drug Discovery Informatics',
      'Biomedical Image Analysis',
      'Ecological Modeling',
      'Biomechanics Simulation',
      'Synthetic Biology Design'
    ],
    'Digital Humanities': [
      'Digital Archiving',
      'Text Mining',
      'Cultural Analytics',
      'Digital Storytelling',
      'Virtual Museums',
      'Digital Preservation',
      'Human-Computer Interaction',
      'Digital Art History',
      'Computational Linguistics',
      'Digital Archaeology'
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
    } else if (selectedCategory === 'commerce') {
      return commerceFields;
    } else if (selectedCategory === 'design') {
      return designFields;
    } else if (selectedCategory === 'law') {
      return lawFields;
    } else if (selectedCategory === 'science') {
      return scienceFields;
    } else if (selectedCategory === 'emerging') {
      return emergingFields;
    }
    return [];
  };

  const getDomainsForField = () => {
    if (selectedCategory === 'engineering') {
      return engineeringDomains[selectedField] || [];
    } else if (selectedCategory === 'medical') {
      return medicalDomains[selectedField] || [];
    } else if (selectedCategory === 'commerce') {
      return commerceDomains[selectedField] || [];
    } else if (selectedCategory === 'design') {
      return designDomains[selectedField] || [];
    } else if (selectedCategory === 'law') {
      return lawDomains[selectedField] || [];
    } else if (selectedCategory === 'science') {
      return scienceDomains[selectedField] || [];
    } else if (selectedCategory === 'emerging') {
      return emergingDomains[selectedField] || [];
    }
    return [];
  };

  const getCategoryTitle = () => {
    if (selectedCategory === 'engineering') {
      return 'Engineering';
    } else if (selectedCategory === 'medical') {
      return 'Medical';
    } else if (selectedCategory === 'commerce') {
      return 'Commerce, Business & Management';
    } else if (selectedCategory === 'design') {
      return 'Design, Creative & Applied Arts';
    } else if (selectedCategory === 'law') {
      return 'Law & Public Service';
    } else if (selectedCategory === 'science') {
      return 'Core Sciences & Research';
    } else if (selectedCategory === 'emerging') {
      return 'Emerging & Interdisciplinary Fields';
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
    // Commerce icons
    else if (selectedCategory === 'commerce') {
      switch(field) {
        case 'Business Administration':
          return '🏢';
        case 'Finance':
          return '💰';
        case 'Marketing':
          return '📢';
        case 'Human Resources':
          return '👥';
        case 'Operations Management':
          return '📊';
        case 'Entrepreneurship':
          return '🚀';
        case 'Economics':
          return '📈';
        case 'Accounting':
          return '🧾';
        case 'Supply Chain Management':
          return '🚚';
        case 'International Business':
          return '🌐';
        case 'Business Analytics':
          return '🔍';
        case 'Strategic Management':
          return '🎯';
        default:
          return '💼';
      }
    }
    // Design icons
    else if (selectedCategory === 'design') {
      switch(field) {
        case 'Graphic Design':
          return '🎨';
        case 'Industrial Design':
          return '🔧';
        case 'Fashion Design':
          return '👗';
        case 'Interior Design':
          return '🏠';
        case 'Animation':
          return '🎬';
        case 'Photography':
          return '📷';
        case 'Film & Video Production':
          return '🎥';
        case 'Architecture':
          return '🏛️';
        case 'Digital Media Arts':
          return '💻';
        case 'Game Design':
          return '🎮';
        case 'UI/UX Design':
          return '🖥️';
        case 'Creative Writing':
          return '✍️';
        default:
          return '🎨';
      }
    }
    // Law icons
    else if (selectedCategory === 'law') {
      switch(field) {
        case 'Law':
          return '⚖️';
        case 'Public Administration':
          return '🏛️';
        case 'Political Science':
          return '🗳️';
        case 'International Relations':
          return '🌍';
        case 'Criminal Justice':
          return '👮';
        case 'Social Work':
          return '🤝';
        case 'Public Policy':
          return '📜';
        case 'Diplomacy':
          return '🤝';
        case 'Non-Profit Management':
          return '🧓';
        case 'Urban Planning':
          return '🏙️';
        case 'Public Health':
          return '🏥';
        case 'Emergency Management':
          return '🚨';
        default:
          return '⚖️';
      }
    }
    // Science icons
    else if (selectedCategory === 'science') {
      switch(field) {
        case 'Physics':
          return '⚛️';
        case 'Chemistry':
          return '⚗️';
        case 'Biology':
          return '🧬';
        case 'Mathematics':
          return '🔢';
        case 'Statistics':
          return '📊';
        case 'Geology':
          return '🌋';
        case 'Astronomy':
          return '🌌';
        case 'Environmental Science':
          return '🌱';
        case 'Biotechnology':
          return '🧫';
        case 'Materials Science':
          return '🔬';
        case 'Nanotechnology':
          return '🔬';
        case 'Marine Science':
          return '🌊';
        default:
          return '🔬';
      }
    }
    // Emerging fields icons
    else if (selectedCategory === 'emerging') {
      switch(field) {
        case 'Artificial Intelligence':
          return '🤖';
        case 'Data Science':
          return '📊';
        case 'Cybersecurity':
          return '🔒';
        case 'Renewable Energy':
          return '⚡';
        case 'Biotechnology':
          return '🧬';
        case 'Neuroscience':
          return '🧠';
        case 'Robotics':
          return '🦾';
        case 'Blockchain Technology':
          return '🔗';
        case 'Quantum Computing':
          return '⚛️';
        case 'Bioinformatics':
          return '🧬';
        case 'Computational Biology':
          return '🧬';
        case 'Digital Humanities':
          return '📚';
        default:
          return '🚀';
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                    : category.id === 'medical'
                    ? 'Heal and help people with your medical expertise'
                    : category.id === 'commerce'
                    ? 'Master the world of business and finance'
                    : category.id === 'design'
                    ? 'Create beautiful and functional designs'
                    : category.id === 'law'
                    ? 'Serve justice and public service'
                    : category.id === 'science'
                    ? 'Explore the wonders of science and research'
                    : category.id === 'emerging'
                    ? 'Dive into cutting-edge interdisciplinary fields'
                    : 'Discover your perfect career path'}
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