import React, { useState, useEffect } from "react";
import "./App.css";

// Configuration
const API_BASE_URL = ""; // Use relative path for same-origin requests

const App = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
    language: "eng", // Default language code
    answers: {},
  });

  // Language mapping based on your directory structure
  const languageMap = {
    eng: "English",
    hindi: "Hindi",
    lng_kannada: "Kannada",
    lng_malayalam: "Malayalam",
    lng_marathi: "Marathi",
    lng_punjabi: "Punjabi",
    lng_Tamil: "Tamil",
    lng_telugu: "Telugu",
  };

  // Age group mapping based on your backend structure
  const getAgeGroup = (age) => {
    const ageNum = parseInt(age);
    if (ageNum <= 5) return "age1"; // 3-5 years
    if (ageNum <= 8) return "age2"; // 5-8 years
    return "age3"; // 8-12 years
  };

  const nextStep = async () => {
    if (currentStep === 1) {
      // Validate required fields
      if (
        !formData.name ||
        !formData.age ||
        !formData.email ||
        !formData.phone
      ) {
        alert("Please fill in all required fields");
        return;
      }

      // Age is already validated by the select options
      // Fetch questions from backend
      await fetchQuestions();
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const updateFormData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateAnswer = (questionIndex, value) => {
    setFormData((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionIndex]: value,
      },
    }));
  };

  const fetchQuestions = async () => {
    setLoading(true);
    setError("");

    try {
      const ageGroup = getAgeGroup(formData.age);
      const langCode = formData.language;

      console.log(
        `Fetching questions for age group: ${ageGroup}, language: ${langCode}`
      );

      const response = await fetch(
        `${API_BASE_URL}/survey/${langCode}/${ageGroup}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch questions: ${response.status}`);
      }

      const questionsData = await response.json();
      console.log("Questions received:", questionsData);

      setQuestions(questionsData.questions || questionsData);
    } catch (err) {
      console.error("Error fetching questions:", err);
      setError("Failed to load questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const submitSurvey = async () => {
    setLoading(true);
    setError("");

    try {
      const ageGroup = getAgeGroup(formData.age);

      // Prepare survey data in the format expected by your backend
      const surveyData = {
        language_code: formData.language,
        age_group: ageGroup,
        user_info: {
          name: formData.name,
          age: formData.age,
          email: formData.email,
          phone: formData.phone,
        },
        survey: Object.entries(formData.answers).map(
          ([questionIndex, optionId]) => ({
            question_id: parseInt(questionIndex),
            option_id: optionId + 1, // Your backend expects 1-based indexing
          })
        ),
      };

      console.log("Submitting survey data:", surveyData);

      const response = await fetch(`${API_BASE_URL}/survey`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(surveyData),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit survey: ${response.status}`);
      }

      const result = await response.json();
      console.log("Survey result:", result);

      // Store the result for display
      setFormData((prev) => ({
        ...prev,
        result: result,
      }));
    } catch (err) {
      console.error("Error submitting survey:", err);
      setError("Failed to submit survey. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="app-content">
        {/* Header */}
        <div className="header">
          <div className="header-content">
            <div className="logo-section">
              <img src="assets/img/giftolexia_logo.png" alt="Giftolexia Logo" className="logo-image" />
              <div>
                <h1>Giftolexia</h1>
                <p className="tagline">Early Screening Assessment</p>
              </div>
            </div>

            <div className="header-right">
              <div className="social-links">
                <a
                  href="https://www.linkedin.com/company/giftolexia/posts/?feedView=all"
                  className="social-link linkedin"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/giftolexia"
                  className="social-link facebook"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </div>

              <div className="grant-info">
                <div className="grant-logo">
                  <div className="grant-image-placeholder">
                    {/* Replace with actual image */}
                    <img src="/assets/img/hdfclogo.png" alt="Grant Logo" />
                  </div>
                </div>
                <div className="grant-text">
                  <p>Supported by</p>
                  <p>
                    <strong>HDFC SmartUP Grant</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {error && (
            <div
              className="error-message"
              style={{
                backgroundColor: "#fee2e2",
                color: "#dc2626",
                padding: "1rem",
                borderRadius: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              {error}
            </div>
          )}

          {currentStep === 1 && (
            <ContactForm
              formData={formData}
              updateFormData={updateFormData}
              onNext={nextStep}
              languageMap={languageMap}
            />
          )}

          {currentStep === 2 && (
            <QuestionnairePage
              formData={formData}
              updateAnswer={updateAnswer}
              onNext={nextStep}
              questions={questions}
              loading={loading}
              onSubmit={submitSurvey}
            />
          )}

          {currentStep === 3 && <ResultsPage formData={formData} />}
        </div>
      </div>
    </div>
  );
};

const ContactForm = ({ formData, updateFormData, onNext, languageMap }) => {
  return (
    <div className="form-container">
      <div className="welcome-section">
        <h2>Early Screening Checklist</h2>
        <p className="welcome-text">
          Answer the questions as best as you can. This will help you understand
          the likelihood of risk and if further support is warranted.
        </p>
      </div>

      <div className="form-layout">
        {/* Left side - Contact form */}
        <div className="contact-form-section">
          <div className="form-card">
            <h3>Contact Information</h3>

            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => updateFormData("name", e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="age">Child's Age Group *</label>
              <select
                id="age"
                value={formData.age}
                onChange={(e) => updateFormData("age", e.target.value)}
                required
              >
                <option value="">Select age group</option>
                <option value="4">3-5 years</option>
                <option value="6">5-8 years</option>
                <option value="10">8-12 years</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
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
                onChange={(e) => updateFormData("phone", e.target.value)}
                placeholder="+91 7406722955"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="language">Preferred Language</label>
              <select
                id="language"
                value={formData.language}
                onChange={(e) => updateFormData("language", e.target.value)}
              >
                {Object.entries(languageMap).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <button className="btn btn-primary btn-large" onClick={onNext}>
              Start Assessment
            </button>
          </div>
        </div>

        {/* Right side - Visual/info section */}
        <div className="info-section">
          <div className="info-card">
            <div className="info-icon">*</div>
            <h3>What to Expect</h3>
            <ul className="info-list">
              <li>Quick 5-minute assessment</li>
              <li>Child-friendly questions</li>
              <li>Immediate results</li>
              <li>Professional recommendations</li>
              <li>Completely confidential</li>
            </ul>

            <div className="trust-badges">
              <div className="badge">Secure</div>
              <div className="badge">Expert Designed</div>
              <div className="badge">Evidence Based</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuestionnairePage = ({
  formData,
  updateAnswer,
  onNext,
  questions,
  loading,
  onSubmit,
}) => {
  const options = ["Never", "Sometimes", "Often", "Always"];
  const questionRefs = React.useRef([]);

  const handleSubmit = async () => {
    // Check if all questions are answered
    const unansweredIndex = questions.findIndex(
      (_, index) => formData.answers[index] === undefined
    );

    if (unansweredIndex !== -1) {
      alert("Please answer all questions before proceeding.");
      // Scroll to the first unanswered question
      if (questionRefs.current[unansweredIndex]) {
        questionRefs.current[unansweredIndex].scrollIntoView({ behavior: "smooth", block: "center" });
        questionRefs.current[unansweredIndex].focus?.();
      }
      return;
    }

    await onSubmit();
    onNext();
  };

  if (loading) {
    return (
      <div className="questionnaire-container">
        <div
          className="loading-message"
          style={{
            textAlign: "center",
            padding: "2rem",
          }}
        >
          <div>Loading questions...</div>
          <div style={{ marginTop: "1rem" }}>Please wait...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="questionnaire-container">
      <div className="questionnaire-header">
        <h2>Assessment Questions</h2>
        <p className="questionnaire-subtitle">
          Please answer the following questions about{" "}
          <strong>{formData.name}'s child</strong>. Choose the option that best
          describes your child's typical behavior.
        </p>
      </div>

      <div className="questions-grid">
        {questions.map((question, index) => (
          <div
            key={index}
            className="question-row"
            ref={el => (questionRefs.current[index] = el)}
            tabIndex={-1}
          >
            <div className="question-text">
              <span className="question-number">{index + 1}.</span>
              {typeof question === "string"
                ? question
                : question.text || question.question}
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
        <button
          className="btn btn-primary btn-large"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Submitting..." : "View Results"}
        </button>
      </div>
    </div>
  );
};

const ResultsPage = ({ formData }) => {
  const result = formData.result || {};

  const getScoreCategory = (score, action) => {
    if (action === "ok") {
      return {
        label: "No Risk Detected",
        color: "#10B981",
        description: "Your child shows healthy development patterns.",
      };
    } else {
      return {
        label: "Needs Attention",
        color: "#EF4444",
        description: "We recommend seeking professional guidance.",
      };
    }
  };

  const category = getScoreCategory(result.score, result.action);

  return (
    <div className="results-container">
      <div className="results-header">
        <h2>Assessment Complete</h2>
        <p className="results-subtitle">
          Here are the results for <strong>{formData.name}'s child</strong>
        </p>
      </div>

      <div className="results-layout">
        {/* Score Section */}
        <div className="score-section">
          <div className="score-card">
            <div className="score-display">
              <div
                className="score-circle"
                style={{ borderColor: category.color }}
              >
                <span
                  className="score-number"
                  style={{ color: category.color }}
                >
                  {result.score || 0}
                </span>
              </div>
              <div className="score-label" style={{ color: category.color }}>
                {category.label}
              </div>
            </div>

            <div className="score-description">
              <p>{category.description}</p>
              {result.msg && (
                <div
                  className="result-message"
                  style={{
                    marginTop: "1rem",
                    padding: "1rem",
                    backgroundColor:
                      result.action === "ok" ? "#f0f9ff" : "#fef2f2",
                    borderRadius: "0.5rem",
                    border: `1px solid ${
                      result.action === "ok" ? "#3b82f6" : "#ef4444"
                    }`,
                  }}
                >
                  {result.msg}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="contact-section">
          <div className="contact-card">
            <h3>Contact Us</h3>
            <p>Want to discuss these results with our specialists?</p>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">Email:</span>
                <span>info@giftolexia.com</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">Phone:</span>
                <span>91 7406722955</span>
              </div>
            </div>
            {/* <button className="btn btn-secondary">Schedule Consultation</button> */}
          </div>
        </div>

        {/* Additional Information */}
        <div className="info-section">
          <div className="info-card">
            <h3>Next Steps</h3>
            <div className="next-steps">
              {result.action === "ok" ? (
                <div>
                  <p>Continue monitoring your child's development</p>
                  <p>Maintain regular check-ups with your pediatrician</p>
                  <p>Encourage reading and learning activities</p>
                </div>
              ) : (
                <div>
                  <p>Consider consulting with a developmental specialist</p>
                  <p>Discuss results with your child's pediatrician</p>
                  <p>Keep track of your child's progress</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="results-footer">
        <div className="action-buttons">
          {/* <button className="btn btn-primary">Download Report</button> */}
          {/* <button className="btn btn-success">Email Results</button> */}
        </div>
      </div>
    </div>
  );
};

export default App;
