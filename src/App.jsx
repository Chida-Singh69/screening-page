import React, { useState } from 'react';
import './App.css';


const App = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    phone: '',
    language: 'English',
    answers: {}
  });

  const nextStep = () => {
    if (currentStep === 1) {
      // Validate required fields
      if (!formData.name || !formData.age || !formData.email || !formData.phone) {
        alert('Please fill in all required fields');
        return;
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateAnswer = (questionIndex, value) => {
    setFormData(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionIndex]: value
      }
    }));
  };

  return (
    <div className="app-container">
      <div className="app-content">
        {/* Colorful Header */}
        <div className="header">
          <div className="header-content">
            <div className="logo-section">
              <div className="logo-icon">Logo</div>
              <div>
                <h1>Giftolexia</h1>
                <p className="tagline"></p>
              </div>
            </div>
            <div className="step-indicator">
              <span className="step-text">Step {currentStep} of 3</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: `${(currentStep / 3) * 100}%`}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {currentStep === 1 && (
            <ContactForm 
              formData={formData} 
              updateFormData={updateFormData}
              onNext={nextStep}
            />
          )}
          
          {currentStep === 2 && (
            <QuestionnairePage 
              formData={formData} 
              updateAnswer={updateAnswer}
              onNext={nextStep}
              onPrev={prevStep}
            />
          )}
          
          {currentStep === 3 && (
            <ResultsPage 
              formData={formData}
              onPrev={prevStep}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const ContactForm = ({ formData, updateFormData, onNext }) => {
  return (
    <div className="form-container">
      <div className="welcome-section">
        <h2>Early Screening Checklist</h2>
        <p className="welcome-text">Answer the questions as best as you can. This will help you understand the likelihood of risk and if further support is warranted.</p>
      </div>

      <div className="form-layout">
        {/* Left side - Contact form (matching wireframe) */}
        <div className="contact-form-section">
          <div className="form-card">
            <h3>Contact Information</h3>
            
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="age">Child's Age *</label>
              <input
                type="number"
                id="age"
                value={formData.age}
                onChange={(e) => updateFormData('age', e.target.value)}
                placeholder="Age in years"
                min="2"
                max="12"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="language">Preferred Language</label>
              <select
                id="language"
                value={formData.language}
                onChange={(e) => updateFormData('language', e.target.value)}
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <button className="btn btn-primary btn-large" onClick={onNext}>
              Start Assessment 🚀
            </button>
          </div>
        </div>

        {/* Right side - Visual/info section */}
        <div className="info-section">
          <div className="info-card">
            <div className="info-icon">🌟</div>
            <h3>What to Expect</h3>
            <ul className="info-list">
              <li>✅ Quick 5-minute assessment</li>
              <li>✅ Child-friendly questions</li>
              <li>✅ Immediate results</li>
              <li>✅ Professional recommendations</li>
              <li>✅ Completely confidential</li>
            </ul>
            
            <div className="trust-badges">
              <div className="badge">🔒 Secure</div>
              <div className="badge">👨‍⚕️ Expert Designed</div>
              <div className="badge">📊 Evidence Based</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const QuestionnairePage = ({ formData, updateAnswer, onNext, onPrev }) => {
  const questions = [
    "Does your child follow simple instructions?",
    "Can your child identify basic colors?",
    "Does your child play well with others?",
    "Can your child count to 10?",
    "Does your child show interest in books?",
    "Can your child draw simple shapes?",
    "Does your child express needs clearly?",
    "Can your child focus on tasks for 5+ minutes?"
  ];

  const options = ['Never', 'Sometimes', 'Often', 'Always'];

  return (
    <div className="questionnaire-container">
      <div className="questionnaire-header">
        <h2>📝 Assessment Questions</h2>
        <p className="questionnaire-subtitle">Please answer the following questions about <strong>{formData.name}'s child</strong>. Choose the option that best describes your child's typical behavior.</p>
      </div>

      <div className="questions-grid">
        {questions.map((question, index) => (
          <div key={index} className="question-row">
            <div className="question-text">
              <span className="question-number">{index + 1}.</span>
              {question}
            </div>
            <div className="options-group">
              {options.map((option, optionIndex) => (
                <label key={optionIndex} className="radio-option">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={optionIndex}
                    checked={formData.answers[index] === optionIndex}
                    onChange={() => updateAnswer(index, optionIndex)}
                  />
                  <span className="radio-text">{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="navigation-buttons">
        <button className="btn btn-secondary" onClick={onPrev}>
          ← Back to Contact
        </button>
        <button className="btn btn-primary btn-large" onClick={onNext}>
          View Results 📊
        </button>
      </div>
    </div>
  );
};

const ResultsPage = ({ formData, onPrev }) => {
  const calculateScore = () => {
    const answers = Object.values(formData.answers);
    const totalScore = answers.reduce((sum, score) => sum + score, 0);
    const maxScore = answers.length * 3;
    return Math.round((totalScore / maxScore) * 100);
  };

  const score = calculateScore();
  const getScoreCategory = (score) => {
    if (score >= 80) return { label: 'Excellent', color: '#10B981', emoji: '🌟' };
    if (score >= 60) return { label: 'Good', color: '#3B82F6', emoji: '👍' };
    if (score >= 40) return { label: 'Fair', color: '#F59E0B', emoji: '⚠️' };
    return { label: 'Needs Attention', color: '#EF4444', emoji: '🔍' };
  };

  const category = getScoreCategory(score);

  const strengths = [
    "Strong verbal communication skills",
    "Good social interaction abilities", 
    "Excellent focus and attention span",
    "Creative problem-solving approach",
    "Positive emotional regulation",
    "Good fine motor skills development"
  ];

  return (
    <div className="results-container">
      <div className="results-header">
        <h2>🎉 Assessment Complete!</h2>
        <p className="results-subtitle">Here are the results for <strong>{formData.name}'s child</strong></p>
      </div>

      <div className="results-layout">
        {/* Score Section */}
        <div className="score-section">
          <div className="score-card">
            <div className="score-display">
              <div className="score-circle" style={{borderColor: category.color}}>
                <span className="score-number" style={{color: category.color}}>{score}%</span>
                <span className="score-emoji">{category.emoji}</span>
              </div>
              <div className="score-label" style={{color: category.color}}>
                {category.label}
              </div>
            </div>
            
            <div className="score-description">
              <p>Your child shows {category.label.toLowerCase()} developmental progress across the assessed areas.</p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="contact-section">
          <div className="contact-card">
            <h3>📞 Contact Us</h3>
            <p>Want to discuss these results with our specialists?</p>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <span>support@screening.com</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📱</span>
                <span>(555) 123-4567</span>
              </div>
            </div>
            <button className="btn btn-secondary">
              Schedule Consultation
            </button>
          </div>
        </div>

        {/* Strengths Section */}
        <div className="strengths-section">
          <div className="strengths-card">
            <h3>✨ Some Noticeable Strengths</h3>
            <div className="strengths-grid">
              {strengths.slice(0, 6).map((strength, index) => (
                <div key={index} className="strength-item">
                  <span className="strength-icon">⭐</span>
                  <span className="strength-text">{strength}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="results-footer">
        <button className="btn btn-secondary" onClick={onPrev}>
          ← Back to Questions
        </button>
        <div className="action-buttons">
          <button className="btn btn-primary">
            📄 Download Report
          </button>
          <button className="btn btn-success">
            📧 Email Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;