import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { careerAPI } from '../services/api';

const Flowchart = () => {
  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [flowchartData, setFlowchartData] = useState(null);
  const [isGeneratingFlowchart, setIsGeneratingFlowchart] = useState(false);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [animatedNodes, setAnimatedNodes] = useState(new Set());
  const [showCelebration, setShowCelebration] = useState(false);
  
  const navigate = useNavigate();
  const { currentSkills, currentExpertise } = useAppContext();

  // Function to generate visual flowchart data from roadmap
  const generateFlowchartData = (roadmap) => {
    if (!roadmap || roadmap.length === 0) return null;
    
    // Create nodes for each step with enhanced visual properties
    const nodes = [
      { 
        id: 'start', 
        label: 'Start Your Journey', 
        type: 'start', 
        x: 400, 
        y: 50,
        color: 'from-green-400 to-emerald-500',
        icon: 'fas fa-play',
        description: 'Welcome! Begin your learning path here.',
        tips: ['Set aside dedicated study time', 'Create a learning schedule']
      },
      ...roadmap.map((step, index) => ({
        id: `step-${index}`,
        label: step.title,
        description: step.description,
        duration: step.duration,
        resources: step.resources,
        type: 'step',
        stepNumber: index + 1,
        totalSteps: roadmap.length,
        x: 400,
        y: 150 + (index * 120),
        color: index % 2 === 0 ? 'from-indigo-500 to-purple-600' : 'from-blue-500 to-cyan-500',
        icon: 'fas fa-book-open',
        tips: [`Step ${index + 1} of ${roadmap.length}`, 'Take notes as you learn']
      })),
      { 
        id: 'end', 
        label: 'Career Success!', 
        type: 'end', 
        x: 400, 
        y: 150 + (roadmap.length * 120),
        color: 'from-purple-500 to-pink-500',
        icon: 'fas fa-trophy',
        description: 'Congratulations! You\'ve completed your learning journey.',
        tips: ['Update your resume', 'Apply for jobs in this field']
      }
    ];
    
    // Create connections between nodes
    const connections = [
      { from: 'start', to: 'step-0' },
      ...roadmap.map((step, index) => ({
        from: `step-${index}`,
        to: index < roadmap.length - 1 ? `step-${index + 1}` : 'end'
      }))
    ];
    
    return { nodes, connections };
  };

  // Fetch roadmap data from your API
  useEffect(() => {
    const fetchRoadmapData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use the proper API service
        console.log('Fetching roadmap data for:', currentSkills, currentExpertise);
        
        // Check if skills and expertise are available
        if (!currentSkills || !currentExpertise) {
          throw new Error('Skills and expertise are required to generate a roadmap');
        }
        
        const data = await careerAPI.analyzeCareer(currentSkills, currentExpertise);
        console.log('Received roadmap data:', data);
        
        // Validate response data
        if (!data || !data.roadmap) {
          throw new Error('Invalid response from server. Please try again.');
        }
        
        setRoadmapData(data);
        
        // Generate flowchart data
        const flowchart = generateFlowchartData(data.roadmap);
        setFlowchartData(flowchart);
      } catch (err) {
        console.error('Error fetching roadmap data:', err);
        // More user-friendly error messages
        if (err.message.includes('Network Error')) {
          setError('Unable to connect to the server. Please check your internet connection and try again.');
        } else if (err.message.includes('Server Error')) {
          setError('Server is currently unavailable. Please try again in a few minutes.');
        } else {
          setError(err.message || 'Failed to fetch roadmap data. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have both skills and expertise
    if (currentSkills && currentExpertise) {
      fetchRoadmapData();
    } else {
      // Set error if skills or expertise are missing
      setError('Please provide your skills and expertise level on the home page to generate a personalized roadmap.');
      setLoading(false);
    }
  }, [currentSkills, currentExpertise]);

  // Animate nodes when they appear
  useEffect(() => {
    if (flowchartData && flowchartData.nodes) {
      const timer = setTimeout(() => {
        const allNodeIds = flowchartData.nodes.map(node => node.id);
        setAnimatedNodes(new Set(allNodeIds));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [flowchartData]);

  // Check for celebration when all steps are completed
  useEffect(() => {
    if (flowchartData && flowchartData.nodes) {
      const stepNodes = flowchartData.nodes.filter(node => node.type === 'step');
      const allStepsCompleted = stepNodes.length > 0 && 
        stepNodes.every(node => completedSteps.has(node.id));
      
      if (allStepsCompleted && !showCelebration) {
        setShowCelebration(true);
        
        // Hide celebration after 5 seconds
        const timer = setTimeout(() => {
          setShowCelebration(false);
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [completedSteps, flowchartData, showCelebration]);

  // Function to regenerate flowchart with Gemini
  const regenerateFlowchartWithGemini = async () => {
    if (!roadmapData || !roadmapData.roadmap) return;
    
    setIsGeneratingFlowchart(true);
    
    try {
      // Create a prompt for Gemini to generate a visual flowchart representation
      const prompt = `
      Create a visual flowchart representation for this learning roadmap in JSON format:
      
      Skills: ${currentSkills}
      Expertise: ${currentExpertise}
      
      Roadmap Steps:
      ${roadmapData.roadmap.map((step, index) => 
        `${index + 1}. ${step.title} (${step.duration}) - ${step.description}`
      ).join('\n')}
      
      Please provide a JSON response with the following structure:
      {
        "nodes": [
          {
            "id": "unique_id",
            "label": "Node title",
            "description": "Detailed description",
            "type": "start|step|end",
            "x": 400,
            "y": 100,
            "duration": "3-6 months",
            "resources": ["resource1", "resource2"]
          }
        ],
        "connections": [
          {
            "from": "node_id",
            "to": "node_id"
          }
        ]
      }
      
      Make the flowchart visually appealing with proper spacing and positioning.
      Include all roadmap steps with their descriptions, durations, and resources.
      Position nodes vertically in a clear flow from start to end.
      `;

      // For now, we'll use our local generation but in the future this could call Gemini directly
      const flowchart = generateFlowchartData(roadmapData.roadmap);
      setFlowchartData(flowchart);
    } catch (err) {
      console.error('Error generating flowchart with Gemini:', err);
      // Fallback to local generation
      const flowchart = generateFlowchartData(roadmapData.roadmap);
      setFlowchartData(flowchart);
    } finally {
      setIsGeneratingFlowchart(false);
    }
  };

  // Toggle step completion
  const toggleStepCompletion = (nodeId) => {
    setCompletedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center mb-8">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"></div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Generating Your Flowchart</h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Creating a personalized learning path flowchart for {currentSkills || 'your selected domain'}...
          </p>
          <div className="mt-6 bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
            </div>
            <p className="mt-4 text-gray-600">Designing your visual learning journey</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Error Loading Flowchart</h1>
            <p className="text-xl text-gray-700 mb-8">{error}</p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8 max-w-2xl mx-auto rounded-r-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <i className="fas fa-exclamation-triangle text-yellow-400 text-2xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-lg text-yellow-700">
                    <strong>Tip:</strong> Make sure you've entered your skills and expertise level on the home page.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg font-semibold"
              >
                <i className="fas fa-home mr-3"></i>
                Go Back Home
              </button>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-indigo-600 text-lg font-semibold"
              >
                <i className="fas fa-sync mr-3"></i>
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Celebration Effect */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 opacity-10 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-50">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-4xl font-bold text-gray-800 bg-white bg-opacity-90 px-8 py-4 rounded-2xl shadow-2xl backdrop-blur-sm">
              Congratulations!
            </h2>
            <p className="text-2xl text-gray-700 mt-4 bg-white bg-opacity-80 px-6 py-3 rounded-xl backdrop-blur-sm">
              You've completed your learning journey!
            </p>
          </div>
          {[...Array(30)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-3 h-3 rounded-full animate-firework"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: ['#fbbf24', '#3b82f6', '#ef4444', '#10b981', '#8b5cf6'][Math.floor(Math.random() * 5)],
                animationDelay: `${i * 0.1}s`,
                transform: `scale(${Math.random() * 1 + 0.5})`
              }}
            ></div>
          ))}
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Your Learning Journey</h1>
          <p className="text-2xl text-gray-700 max-w-4xl mx-auto">
            Visual roadmap for your career in <span className="font-bold text-indigo-600">{currentSkills || 'your selected domain'}</span>
          </p>
          <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-indigo-500 p-5 max-w-3xl mx-auto rounded-r-xl shadow-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <i className="fas fa-info-circle text-indigo-500 text-2xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-lg text-gray-800">
                  <strong>Beginner's Tip:</strong> Follow this path from top to bottom to achieve your career goals! Each step builds upon the previous one.
                </p>
              </div>
            </div>
          </div>
        </div>

        {roadmapData ? (
          <div className="mb-12">
            {/* Learning Path Summary - Removed Career Path section */}
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-gray-100 transform transition-all duration-300 hover:shadow-2xl">
              <div className="flex flex-col lg:flex-row items-center">
                <div className="lg:w-2/3 mb-8 lg:mb-0 lg:pr-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Learning Path Overview</h2>
                  <p className="text-xl text-gray-700 bg-gradient-to-r from-gray-50 to-white p-6 rounded-2xl border border-gray-100">
                    This learning path is designed to help you master {currentSkills || 'your selected domain'} step by step.
                  </p>
                </div>
                <div className="lg:w-1/3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 shadow-md">
                  <h3 className="font-bold text-2xl text-gray-900 mb-4">Path Overview</h3>
                  <div className="space-y-4">
                    <div className="flex items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl flex items-center justify-center mr-4">
                        <i className="fas fa-graduation-cap text-indigo-600 text-xl"></i>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{roadmapData.roadmap?.length || 0} Learning Steps</p>
                        <p className="text-gray-600 text-sm">Structured progression</p>
                      </div>
                    </div>
                    <div className="flex items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mr-4">
                        <i className="fas fa-chart-line text-green-600 text-xl"></i>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">High Growth Potential</p>
                        <p className="text-gray-600 text-sm">Promising career path</p>
                      </div>
                    </div>
                    <div className="flex items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center mr-4">
                        <i className="fas fa-rupee-sign text-amber-600 text-xl"></i>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Competitive Salary</p>
                        <p className="text-gray-600 text-sm">Lucrative opportunities</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Flowchart Visualization */}
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-gray-100 transform transition-all duration-300 hover:shadow-2xl">
              <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Interactive Learning Path</h2>
                <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                  Follow this step-by-step guide to master your chosen career path. 
                  Each step builds on the previous one to take you from beginner to expert.
                </p>
                <button
                  onClick={regenerateFlowchartWithGemini}
                  disabled={isGeneratingFlowchart}
                  className="mt-6 inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                >
                  {isGeneratingFlowchart ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Generating with AI...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sync-alt mr-3"></i>
                      Regenerate with AI
                    </>
                  )}
                </button>
              </div>
              
              {/* Visual Flowchart */}
              {flowchartData ? (
                <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 min-h-[600px] border border-gray-200 overflow-x-auto shadow-inner">
                  <div className="absolute inset-0 overflow-hidden">
                    {/* Connection lines */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      {flowchartData.connections.map((conn, index) => {
                        const fromNode = flowchartData.nodes.find(n => n.id === conn.from);
                        const toNode = flowchartData.nodes.find(n => n.id === conn.to);
                        
                        if (!fromNode || !toNode) return null;
                        
                        return (
                          <line
                            key={index}
                            x1={fromNode.x + 100}
                            y1={fromNode.y + 30}
                            x2={toNode.x + 100}
                            y2={toNode.y + 30}
                            stroke="url(#gradientLine)"
                            strokeWidth="4"
                            markerEnd="url(#arrowhead)"
                            className="transition-all duration-500"
                          />
                        );
                      })}
                      <defs>
                        <linearGradient id="gradientLine" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                        <marker
                          id="arrowhead"
                          markerWidth="12"
                          markerHeight="10"
                          refX="10"
                          refY="5"
                          orient="auto"
                        >
                          <polygon points="0 0, 12 5, 0 10" fill="#8b5cf6" />
                        </marker>
                      </defs>
                    </svg>
                    
                    {/* Nodes */}
                    {flowchartData.nodes.map((node) => (
                      <div
                        key={node.id}
                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 rounded-2xl shadow-lg p-5 min-w-[220px] transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer ${
                          animatedNodes.has(node.id) 
                            ? 'opacity-100 translate-y-0' 
                            : 'opacity-0 translate-y-10'
                        } ${
                          completedSteps.has(node.id) 
                            ? 'ring-4 ring-green-400 ring-opacity-70' 
                            : ''
                        }`}
                        style={{ 
                          left: `${node.x}px`, 
                          top: `${node.y}px`,
                          transitionDelay: `${flowchartData.nodes.indexOf(node) * 100}ms`
                        }}
                        onMouseEnter={() => setHoveredNode(node)}
                        onMouseLeave={() => setHoveredNode(null)}
                        onClick={() => toggleStepCompletion(node.id)}
                      >
                        <div className={`bg-gradient-to-br ${node.color} text-white rounded-xl p-5 shadow-md transform transition-all duration-300 hover:brightness-110`}>
                          <div className="text-center">
                            <div className="flex justify-center mb-3">
                              <div className="w-14 h-14 rounded-xl bg-white bg-opacity-20 flex items-center justify-center shadow-md">
                                <i className={`${node.icon} text-2xl`}></i>
                              </div>
                            </div>
                            <h3 className="font-bold text-lg mb-2">
                              {node.type === 'step' && (
                                <span className="block text-xs opacity-90 mb-1 font-medium">Step {node.stepNumber} of {node.totalSteps}</span>
                              )}
                              {node.label}
                            </h3>
                            {node.type === 'step' && (
                              <>
                                <p className="text-sm text-white text-opacity-90 mb-3 leading-relaxed">{node.description}</p>
                                <div className="bg-white bg-opacity-20 rounded-lg p-3 mb-3">
                                  <p className="text-xs font-semibold text-white mb-1">Duration</p>
                                  <p className="text-xs text-white text-opacity-90">{node.duration}</p>
                                </div>
                                {node.resources && node.resources.length > 0 && (
                                  <div className="bg-black bg-opacity-10 rounded-lg p-3">
                                    <p className="text-xs font-semibold text-white mb-1">Resources</p>
                                    <ul className="text-xs text-white text-opacity-90 space-y-1">
                                      {node.resources.slice(0, 2).map((resource, idx) => (
                                        <li key={idx} className="flex items-start">
                                          <i className="fas fa-circle text-white text-opacity-50 text-[4px] mt-2 mr-2"></i>
                                          <span className="text-left">{resource}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </>
                            )}
                            <div className="mt-3 text-xs text-white text-opacity-80 font-medium">
                              {completedSteps.has(node.id) ? (
                                <span className="flex items-center justify-center">
                                  <i className="fas fa-check-circle mr-1"></i> Completed
                                </span>
                              ) : (
                                <span>Click to mark as complete</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Hover Tooltip */}
                  {hoveredNode && (
                    <div className="absolute bg-white rounded-2xl shadow-2xl p-6 max-w-xs border border-gray-200 z-10"
                         style={{ 
                           left: `${hoveredNode.x + 240}px`, 
                           top: `${hoveredNode.y}px`,
                           transform: 'translateY(-50%)'
                         }}>
                      <div className="flex items-start mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${hoveredNode.color} flex items-center justify-center mr-4 shadow-md`}>
                          <i className={`${hoveredNode.icon} text-white text-xl`}></i>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{hoveredNode.label}</h3>
                          {hoveredNode.type === 'step' && (
                            <span className="text-xs text-gray-500">Step {hoveredNode.stepNumber} of {hoveredNode.totalSteps}</span>
                          )}
                        </div>
                      </div>
                      {hoveredNode.description && (
                        <p className="text-gray-700 mb-4">{hoveredNode.description}</p>
                      )}
                      {hoveredNode.type === 'step' && (
                        <>
                          <div className="bg-gray-50 rounded-lg p-3 mb-3">
                            <p className="text-xs font-semibold text-gray-700 mb-1">Duration</p>
                            <p className="text-sm text-gray-600">{hoveredNode.duration}</p>
                          </div>
                          {hoveredNode.resources && hoveredNode.resources.length > 0 && (
                            <div className="mb-4">
                              <p className="text-xs font-semibold text-gray-700 mb-2">Resources</p>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {hoveredNode.resources.map((resource, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <i className="fas fa-circle text-gray-400 text-[4px] mt-2 mr-2"></i>
                                    <span>{resource}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </>
                      )}
                      {hoveredNode.tips && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
                            <i className="fas fa-lightbulb text-amber-500 mr-2"></i>
                            Beginner Tips
                          </p>
                          <ul className="text-xs text-gray-600 space-y-2">
                            {hoveredNode.tips.map((tip, idx) => (
                              <li key={idx} className="flex items-start">
                                <i className="fas fa-check-circle text-green-500 text-xs mt-0.5 mr-2"></i>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500 text-center">
                          {hoveredNode.type === 'start' 
                            ? 'Click to begin your journey!' 
                            : hoveredNode.type === 'end' 
                            ? 'You\'ve reached the end!' 
                            : 'Click on this step to mark it as completed'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-dashed border-gray-200">
                  <div className="text-5xl mb-4">📊</div>
                  <p className="text-gray-600 text-xl">Unable to generate flowchart. Please try again later.</p>
                </div>
              )}
              
              {/* Completion Message */}
              <div className="mt-12 text-center">
                <div className="inline-flex items-center bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-8 py-5 rounded-2xl shadow-lg">
                  <i className="fas fa-trophy text-green-600 text-2xl mr-4"></i>
                  <span className="font-bold text-xl">Complete all steps to achieve your career goals!</span>
                </div>
                {completedSteps.size > 0 && (
                  <div className="mt-8 max-w-2xl mx-auto">
                    <div className="w-full bg-gradient-to-r from-gray-100 to-gray-200 rounded-full h-5 mb-3 shadow-inner">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-emerald-500 h-5 rounded-full transition-all duration-700 ease-out shadow-md"
                        style={{ width: `${(completedSteps.size / (flowchartData?.nodes.filter(n => n.type === 'step').length || 1)) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-gray-700 font-medium">
                      You've completed {completedSteps.size} of {flowchartData?.nodes.filter(n => n.type === 'step').length || 0} steps!
                      <span className="ml-2 font-bold text-emerald-600">
                        ({Math.round((completedSteps.size / (flowchartData?.nodes.filter(n => n.type === 'step').length || 1)) * 100)}% complete)
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Legend */}
              <div className="mt-10 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <i className="fas fa-key mr-3 text-indigo-600"></i>
                  Flowchart Legend
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 mr-3 flex items-center justify-center">
                      <i className="fas fa-play text-white text-sm"></i>
                    </div>
                    <span className="text-gray-700 font-medium">Start Point</span>
                  </div>
                  <div className="flex items-center p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 mr-3 flex items-center justify-center">
                      <i className="fas fa-book-open text-white text-sm"></i>
                    </div>
                    <span className="text-gray-700 font-medium">Learning Steps</span>
                  </div>
                  <div className="flex items-center p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 mr-3 flex items-center justify-center">
                      <i className="fas fa-trophy text-white text-sm"></i>
                    </div>
                    <span className="text-gray-700 font-medium">Completion</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Key Resources */}
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 transform transition-all duration-300 hover:shadow-2xl">
                <h3 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <i className="fas fa-book text-indigo-600 mr-4"></i>
                  Learning Resources
                </h3>
                <p className="text-gray-700 mb-6 text-lg">
                  Each step in your journey comes with recommended resources to help you learn effectively.
                </p>
                <div className="space-y-4">
                  {(roadmapData.roadmap || []).flatMap((step, stepIndex) => 
                    (step.resources || []).slice(0, 2).map((resource, resIndex) => (
                      <div key={`${stepIndex}-${resIndex}`} className="flex items-start p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 border border-gray-100">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg flex items-center justify-center mr-4">
                          <i className="fas fa-circle text-indigo-500 text-xs"></i>
                        </div>
                        <span className="text-gray-800 font-medium">{resource}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Estimated Timeline */}
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 transform transition-all duration-300 hover:shadow-2xl">
                <h3 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <i className="fas fa-clock text-indigo-600 mr-4"></i>
                  Timeline Overview
                </h3>
                <p className="text-gray-700 mb-6 text-lg">
                  This is an estimated timeline for completing your learning journey. 
                  Adjust based on your pace and availability.
                </p>
                <div className="space-y-5">
                  {(roadmapData.roadmap || []).map((step, index) => (
                    <div key={index} className="flex items-start p-5 border-l-4 border-indigo-400 bg-gradient-to-r from-gray-50 to-white rounded-r-xl shadow-sm">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg flex items-center justify-center mr-5">
                        <span className="text-indigo-800 font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-lg">{step.title}</h4>
                        <p className="text-gray-600 mt-2">{step.description}</p>
                        <div className="flex items-center mt-3">
                          <i className="fas fa-hourglass-half text-indigo-500 mr-2"></i>
                          <span className="text-indigo-700 font-medium">Duration: {step.duration || '~2-4 weeks'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 p-5 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200">
                  <p className="text-amber-800 text-lg">
                    <i className="fas fa-lightbulb text-amber-600 mr-3"></i>
                    <strong>Pro Tip:</strong> Consistency is key! Dedicate 1-2 hours daily to make steady progress.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Celebration Animation Styles */}
      <style jsx>{`
        @keyframes firework {
          0% { transform: translate(0, 0); opacity: 1; }
          100% { transform: translate(var(--x), var(--y)); opacity: 0; }
        }
        .animate-firework {
          animation: firework 1.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Flowchart;