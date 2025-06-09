// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files from public directory

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Complete Fuzzy Inference System
class FuzzyInferenceSystem {
  constructor() {
    this.courseNames = [
      "Gaming", 
      "Web Development", 
      "Fuzzy Logic", 
      "Database Design", 
      "Software Validation & Verification"
    ];
  }

  // Triangular membership function
  trimf(x, params) {
    const [a, b, c] = params;
    if (x <= a || x >= c) return 0;
    if (x === b) return 1;
    if (x < b) return (x - a) / (b - a);
    return (c - x) / (c - b);
  }

  // Convert CGPA input (1-5 scale) to actual GPA range for display
  convertCGPAToActual(cgpaInput) {
    const cgpaMap = {
      5: 3.75, // 3.5-4.0 range
      4: 3.25, // 3.0-3.4 range  
      3: 2.75, // 2.5-2.9 range
      2: 2.25, // 2.0-2.4 range
      1: 1.5   // 1.0-1.9 range
    };
    return cgpaMap[cgpaInput] || cgpaInput;
  }

  // Get membership values for CGPA (1-5 input scale)
  getCGPAMembership(cgpa) {
    // CGPA input is already 1-5 scale, no conversion needed for membership
    return {
      low: this.trimf(cgpa, [1, 1, 3]),
      medium: this.trimf(cgpa, [2, 3, 4]),
      high: this.trimf(cgpa, [3, 5, 5])
    };
  }

  // Get membership values for subject grades (0-5 input scale, same as CGPA)
  getSubjectMembership(grade) {
    // Subject grades now use same 1-5 scale as CGPA, no conversion needed
    return {
      low: this.trimf(grade, [0, 0, 2]),
      medium: this.trimf(grade, [1, 2.5, 4]),
      high: this.trimf(grade, [3, 5, 5])
    };
  }

  // Get membership values for interest levels (1-5 scale)
  getInterestMembership(interest) {
    return {
      low: this.trimf(interest, [1, 1, 3]),
      medium: this.trimf(interest, [2, 3, 4]),
      high: this.trimf(interest, [3, 5, 5])
    };
  }

  // Get membership values for difficulty (1-3 scale)
  getDifficultyMembership(difficulty) {
    return {
      easy: this.trimf(difficulty, [0.5, 1, 1.5]),
      moderate: this.trimf(difficulty, [1.5, 2, 2.5]),
      difficult: this.trimf(difficulty, [2.5, 3, 3.5])
    };
  }

  // Get membership values for learning style (1-4 scale)
  getLearningStyleMembership(style) {
    return {
      visual: this.trimf(style, [0.5, 1, 1.5]),
      kinesthetic: this.trimf(style, [1.5, 2, 2.5]),
      readingWriting: this.trimf(style, [2.5, 3, 3.5]),
      auditory: this.trimf(style, [3.5, 4, 4.5])
    };
  }

  // Subject scoring based on your MATLAB implementation
  subjectScoring(inputs) {
    let scores = [0, 0, 0, 0, 0]; // Gaming, WebDev, FuzzyLogic, DatabaseDesign, SoftwareValidation
    const threshold = 1.5;

    console.log('Subject scoring inputs:', inputs);

    // Programming subject mapping (using 1-5 scale)
    if (inputs.programming >= threshold) {
      const normalized = inputs.programming / 5.0; // Normalize from 5.0 scale
      scores[0] += normalized * 0.7; // Gaming
      scores[1] += normalized * 1.0; // Web Development (stronger weight)
      scores[2] += normalized * 0.6; // Fuzzy Logic
      scores[3] += normalized * 0.8; // Database Design
      scores[4] += normalized * 0.9; // Software Validation (strong weight)
      console.log('Programming contribution:', scores);
    }

    // Multimedia subject mapping (using 1-5 scale)
    if (inputs.multimedia >= threshold) {
      const normalized = inputs.multimedia / 5.0;
      scores[0] += normalized * 1.0; // Gaming (strong for multimedia)
      scores[1] += normalized * 0.8; // Web Development
      console.log('Multimedia contribution:', scores);
    }

    // Machine Learning subject mapping (using 1-5 scale)
    if (inputs.machineLearning >= threshold) {
      const normalized = inputs.machineLearning / 5.0;
      scores[2] += normalized * 1.0; // Fuzzy Logic
      console.log('ML contribution:', scores);
    }

    // Database subject mapping (using 1-5 scale)
    if (inputs.database >= threshold) {
      const normalized = inputs.database / 5.0;
      scores[3] += normalized * 1.0; // Database Design (strong)
      console.log('Database contribution:', scores);
    }

    // Software Engineering subject mapping (using 1-5 scale)
    if (inputs.softwareEngineering >= threshold) {
      const normalized = inputs.softwareEngineering / 5.0;
      scores[1] += normalized * 0.8; // Web Development
      scores[4] += normalized * 1.0; // Software Validation (strongest)
      console.log('Software Eng contribution:', scores);
    }

    console.log('Final subject scores:', scores);
    return scores;
  }

  // Interest scoring based on your MATLAB implementation
  interestScoring(inputs) {
    let scores = [0, 0, 0, 0, 0];
    const threshold = 1.5;

    console.log('Interest scoring inputs:', inputs);

    // Enhanced interest mapping to match MATLAB more closely
    const interestMap = [
      // Gaming interests
      {indices: ['dataScience', 'webDevelopment', 'mobileAppDevelopment'], course: 0, weights: [1.0, 0.8, 0.9]},
      // Web Development interests  
      {indices: ['webDevelopment', 'cybersecurity', 'uiuxDesign'], course: 1, weights: [0.9, 1.0, 0.8]},
      // Fuzzy Logic interests
      {indices: ['artificialIntelligence', 'uiuxDesign', 'iot'], course: 2, weights: [1.0, 0.8, 0.9]},
      // Database Design interests
      {indices: ['cybersecurity', 'databaseDesign'], course: 3, weights: [0.8, 1.0]},
      // Software Validation interests
      {indices: ['artificialIntelligence', 'softwareValidationTesting'], course: 4, weights: [0.7, 1.0]}
    ];

    interestMap.forEach((entry, idx) => {
      let total = 0, count = 0;
      entry.indices.forEach((field, fieldIdx) => {
        const val = inputs[field];
        if (val && val >= threshold) {
          total += val * entry.weights[fieldIdx];
          count++;
        }
      });
      if (count > 0) {
        const contribution = (total / count / 5.0);
        scores[entry.course] += contribution;
        console.log(`Interest map ${idx} (course ${entry.course}): +${contribution}`);
      }
    });

    console.log('Final interest scores:', scores);
    return scores;
  }

  // Simplified fuzzy rule evaluation
  evaluateFuzzyRules(inputs) {
    const cgpaMem = this.getCGPAMembership(inputs.cgpa);
    const progMem = this.getSubjectMembership(inputs.programming);
    const diffMem = this.getDifficultyMembership(inputs.difficulty);
    const styleMem = this.getLearningStyleMembership(inputs.learningStyle);
    
    const dataSciMem = this.getInterestMembership(inputs.dataScience);
    const webDevMem = this.getInterestMembership(inputs.webDevelopment);
    const cyberMem = this.getInterestMembership(inputs.cybersecurity);
    const aiMem = this.getInterestMembership(inputs.artificialIntelligence);
    const gameMem = this.getInterestMembership(inputs.gameDevelopment);
    const iotMem = this.getInterestMembership(inputs.iot);
    const testingMem = this.getInterestMembership(inputs.softwareValidationTesting);

    let output = [0, 0, 0, 0, 0];

    // Database Design Rules
    const dbRule1 = Math.min(cgpaMem.high, progMem.high, dataSciMem.high, diffMem.easy, styleMem.visual);
    const dbRule2 = Math.min(cgpaMem.medium, progMem.medium, dataSciMem.medium, diffMem.easy, styleMem.kinesthetic);
    output[3] = Math.max(output[3], dbRule1, dbRule2);

    // Web Development Rules
    const webRule1 = Math.min(cgpaMem.high, progMem.high, webDevMem.high, diffMem.easy, styleMem.readingWriting);
    const webRule2 = Math.min(cgpaMem.medium, progMem.medium, webDevMem.medium, diffMem.easy, styleMem.kinesthetic);
    output[1] = Math.max(output[1], webRule1, webRule2);

    // Software Validation Rules
    const softRule1 = Math.min(cgpaMem.high, progMem.high, cyberMem.high, diffMem.moderate, styleMem.auditory);
    const softRule2 = Math.min(cgpaMem.medium, progMem.medium, testingMem.high, diffMem.moderate, styleMem.readingWriting);
    output[4] = Math.max(output[4], softRule1, softRule2);

    // Fuzzy Logic Rules
    const fuzzyRule1 = Math.min(cgpaMem.high, progMem.high, aiMem.high, diffMem.difficult, styleMem.visual);
    const fuzzyRule2 = Math.min(cgpaMem.medium, progMem.medium, iotMem.medium, diffMem.difficult, styleMem.auditory);
    output[2] = Math.max(output[2], fuzzyRule1, fuzzyRule2);

    // Gaming Rules
    const gameRule1 = Math.min(cgpaMem.high, progMem.high, gameMem.high, diffMem.moderate, styleMem.visual);
    const gameRule2 = Math.min(cgpaMem.medium, progMem.medium, gameMem.medium, diffMem.moderate, styleMem.kinesthetic);
    output[0] = Math.max(output[0], gameRule1, gameRule2);

    return output;
  }

  // Adjust scores based on learning preferences
  adjustByLearningPreferences(scores, difficulty, style) {
    let adjusted = [...scores];

    // Difficulty adjustments
    switch (difficulty) {
      case 1: // Easy
        adjusted[1] *= 1.2; // Web Development
        adjusted[3] *= 1.2; // Database Design
        break;
      case 2: // Moderate
        adjusted[0] *= 1.1; // Gaming
        adjusted[4] *= 1.1; // Software Validation
        break;
      case 3: // Difficult
        adjusted[2] *= 1.2; // Fuzzy Logic
        break;
    }

    // Learning Style adjustments
    switch (style) {
      case 1: // Visual
        adjusted[0] *= 1.1; // Gaming
        adjusted[2] *= 1.1; // Fuzzy Logic
        adjusted[3] *= 1.1; // Database Design
        break;
      case 2: // Kinesthetic
        adjusted[0] *= 1.15; // Gaming
        adjusted[1] *= 1.15; // Web Development
        adjusted[3] *= 1.15; // Database Design
        break;
      case 3: // Reading/Writing
        adjusted[1] *= 1.1; // Web Development
        adjusted[4] *= 1.1; // Software Validation
        break;
      case 4: // Auditory
        adjusted[2] *= 1.05; // Fuzzy Logic
        adjusted[4] *= 1.05; // Software Validation
        break;
    }

    return adjusted;
  }

  // Main recommendation function
  recommend(inputs) {
    console.log('=== FIS RECOMMENDATION START ===');
    console.log('FIS Input:', inputs);

    // Calculate scores using different methods
    let scores = this.subjectScoring(inputs);
    console.log('After subject scoring:', scores);

    const interestScores = this.interestScoring(inputs);
    console.log('Interest scores:', interestScores);

    // Combine subject and interest scores
    scores = scores.map((score, idx) => score + interestScores[idx]);
    console.log('After combining subject + interest:', scores);

    // Apply fuzzy rules
    const fuzzyScores = this.evaluateFuzzyRules(inputs);
    console.log('Fuzzy scores:', fuzzyScores);

    // Enhance with fuzzy rules (add 30% bonus)
    scores = scores.map((score, idx) => score + (fuzzyScores[idx] * 0.3));
    console.log('After fuzzy enhancement:', scores);

    // Apply learning preferences
    scores = this.adjustByLearningPreferences(scores, inputs.difficulty, inputs.learningStyle);
    console.log('After learning adjustments:', scores);

    // Ensure minimum scores
    scores = scores.map(score => Math.max(score, 0.1));
    console.log('Final scores:', scores);

    // Create course scores with names and sort them
    const courseScores = scores.map((score, index) => ({
      course: this.courseNames[index],
      score: score,
      confidence: score,
      index: index
    }));

    // Sort by scores (descending - highest first)
    courseScores.sort((a, b) => b.score - a.score);
    console.log('Sorted course scores:', courseScores);

    const result = {
      firstRecommendedCourse: courseScores[0].course,
      alternativeRecommendedCourse: courseScores[1].course,
      firstConfidence: courseScores[0].confidence,
      secondConfidence: courseScores[1].confidence,
      probability_Gaming: scores[0],
      probability_WebDevelopment: scores[1],
      probability_FuzzyLogic: scores[2],
      probability_DatabaseDesign: scores[3],
      probability_SoftwareValidation_Verification: scores[4],
      allScores: courseScores
    };

    console.log('=== FINAL RESULT ===');
    console.log('Primary:', result.firstRecommendedCourse, '(', result.firstConfidence, ')');
    console.log('Secondary:', result.alternativeRecommendedCourse, '(', result.secondConfidence, ')');
    console.log('All probabilities:', [
      `Gaming: ${scores[0]}`,
      `WebDev: ${scores[1]}`,
      `Fuzzy: ${scores[2]}`,
      `Database: ${scores[3]}`,
      `Software: ${scores[4]}`
    ]);
    console.log('=== FIS RECOMMENDATION END ===');

    return result;
  }
}

// Create FIS instance
const fuzzySystem = new FuzzyInferenceSystem();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Course Recommendation API is running'
  });
});

// Test endpoint with corrected sample data
app.post('/api/test-sample', (req, res) => {
  try {
    console.log('=== TESTING WITH CORRECTED SAMPLE DATA ===');
    
    // Your sample data with correct understanding:
    // CGPA: 5 means excellent (3.5-4.0 range)
    // Subject grades: 4 means good (3.0-3.4 GPA equivalent)
    const sampleInput = {
      cgpa: 5,  // 5 = Excellent (3.5-4.0 GPA range)
      programming: 4,  // 4 = Good (3.0-3.4 GPA equivalent)
      multimedia: 5,   // 5 = Excellent (3.5-4.0 GPA equivalent)  
      machineLearning: 4, // 4 = Good
      database: 4,     // 4 = Good
      softwareEngineering: 4, // 4 = Good
      dataScience: 5,    // Interest level 5
      webDevelopment: 4, // Interest level 4
      cybersecurity: 5,  // Interest level 5
      artificialIntelligence: 4, // Interest level 4
      mobileAppDevelopment: 5,   // Interest level 5
      gameDevelopment: 4,        // Interest level 4
      uiuxDesign: 4,            // Interest level 4
      iot: 5,                   // Interest level 5
      databaseDesign: 3,        // Interest level 3
      softwareValidationTesting: 5, // Interest level 5
      difficulty: 2,     // Moderate
      learningStyle: 3   // Reading/Writing
    };

    console.log('Corrected sample input (all 1-5 scale):', sampleInput);
    console.log('CGPA 5 represents:', fuzzySystem.convertCGPAToActual(5), 'actual GPA equivalent');

    // Get recommendation from FIS
    const recommendation = fuzzySystem.recommend(sampleInput);
    
    // Expected results from your MATLAB output
    const expectedResults = {
      firstRecommendedCourse: 'Web Development',
      secondRecommendedCourse: 'Software Validation & Verification',
      expectedScores: {
        'Web Development': 3.329333333,
        'Software Validation & Verification': 3.146,
        'Gaming': 2.647333333,
        'Database Design': 2.14,
        'Fuzzy Logic': 2.06
      }
    };

    const actualScores = {
      'Gaming': recommendation.probability_Gaming,
      'Web Development': recommendation.probability_WebDevelopment,
      'Fuzzy Logic': recommendation.probability_FuzzyLogic,
      'Database Design': recommendation.probability_DatabaseDesign,
      'Software Validation & Verification': recommendation.probability_SoftwareValidation_Verification
    };

    console.log('=== COMPARISON ===');
    console.log('Expected Primary:', expectedResults.firstRecommendedCourse);
    console.log('Actual Primary:', recommendation.firstRecommendedCourse);
    console.log('Expected Secondary:', expectedResults.secondRecommendedCourse);
    console.log('Actual Secondary:', recommendation.alternativeRecommendedCourse);
    console.log('Expected Scores:', expectedResults.expectedScores);
    console.log('Actual Scores:', actualScores);

    res.json({
      success: true,
      data: recommendation,
      expected: expectedResults,
      actual: {
        primary: recommendation.firstRecommendedCourse,
        secondary: recommendation.alternativeRecommendedCourse,
        scores: actualScores
      },
      comparison: {
        primaryMatch: recommendation.firstRecommendedCourse === expectedResults.firstRecommendedCourse,
        secondaryMatch: recommendation.alternativeRecommendedCourse === expectedResults.secondRecommendedCourse,
        scoreDifferences: Object.keys(expectedResults.expectedScores).map(course => ({
          course,
          expected: expectedResults.expectedScores[course],
          actual: actualScores[course],
          difference: Math.abs(expectedResults.expectedScores[course] - actualScores[course]).toFixed(3)
        }))
      }
    });

  } catch (error) {
    console.error('Error in test sample:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      error: 'Test sample error'
    });
  }
});


app.post('/api/recommend', (req, res) => {
  try {
    console.log('Received request:', req.body);

    const input = req.body;
    
    // Map form inputs to FIS inputs with proper validation and consistent 1-5 scaling
    const fisInput = {
      cgpa: parseInt(input.cgpa) || 3, // 1-5 scale input
      programming: parseInt(input.programming) || 0, // 0,1-5 scale (0 = not taken)
      multimedia: parseInt(input.multimedia) || 0, // 0,1-5 scale
      machineLearning: parseInt(input.machineLearning) || 0, // 0,1-5 scale
      database: parseInt(input.database) || 0, // 0,1-5 scale
      softwareEngineering: parseInt(input.softwareEngineering) || 0, // 0,1-5 scale
      dataScience: parseInt(input.dataScience) || 1, // 1-5 interest scale
      webDevelopment: parseInt(input.webDevelopment) || 1,
      cybersecurity: parseInt(input.cybersecurity) || 1,
      artificialIntelligence: parseInt(input.artificialIntelligence) || 1,
      mobileAppDevelopment: parseInt(input.mobileAppDevelopment) || 1,
      gameDevelopment: parseInt(input.gameDevelopment) || 1,
      uiuxDesign: parseInt(input.uiuxDesign) || 1,
      iot: parseInt(input.iot) || 1,
      databaseDesign: parseInt(input.databaseDesign) || 1,
      softwareValidationTesting: parseInt(input.softwareValidationTesting) || 1,
      difficulty: parseInt(input.difficulty) || 2, // 1-3 scale
      learningStyle: parseInt(input.learningStyle) || 1 // 1-4 scale
    };

    console.log('Mapped FIS input:', fisInput);

    // Get recommendation from FIS
    const recommendation = fuzzySystem.recommend(fisInput);
    
    console.log('FIS recommendation:', recommendation);

    res.json({
      success: true,
      data: recommendation
    });

  } catch (error) {
    console.error('Error processing recommendation:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      error: 'Internal server error'
    });
  }
});

// Serve the HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/input', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'input.html'));
});

app.get('/result', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'result.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 FIS system loaded with ${fuzzySystem.courseNames.length} courses`);
});

module.exports = app;