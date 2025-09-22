// Test script to verify career analysis is working
const testCareerAnalysis = async () => {
  try {
    const response = await fetch('http://localhost:8000/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        skills: 'python, data analysis, machine learning',
        expertise: 'Intermediate'
      })
    });
    
    const data = await response.json();
    console.log('Career analysis response:', data);
    
    if (response.ok) {
      console.log('✅ Career analysis is working correctly');
      console.log('Selected path:', data.selected_path?.title);
    } else {
      console.log('❌ Career analysis failed:', data);
    }
  } catch (error) {
    console.log('❌ Error during career analysis:', error.message);
  }
};

// Run the test
testCareerAnalysis();