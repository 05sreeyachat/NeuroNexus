import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/config';
import './QuizPage.css';

function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await api.get(`/quizzes/${id}`);
        setQuiz(response.data);
        setAnswers(new Array(response.data.questions.length).fill(null));
      } catch (error) {
        setError('Failed to load quiz');
        console.error('Error fetching quiz:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  if (loading) return <div className="text-center text-white">Loading quiz...</div>;
  if (error) return <div className="text-center text-white">{error}</div>;
  if (!quiz) return <div className="text-center text-white">Quiz not found</div>;

  const handleAnswer = (answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    answers.forEach((answer, index) => {
      if (answer === quiz.questions[index].correctAnswer) {
        correctAnswers++;
      }
    });
    return {
      score: correctAnswers,
      total: quiz.questions.length,
      percentage: Math.round((correctAnswers / quiz.questions.length) * 100)
    };
  };

  const handleSubmit = () => {
    const results = calculateScore();
    setScore(results);
    setShowResults(true);
  };

  if (showResults) {
    return (
      <div className="quiz-page-container">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="results-card">
                <h2 className="text-center text-white mb-4">Quiz Results</h2>
                <div className="score-display">
                  <h3 className="text-white">Your Score: {score.score}/{score.total}</h3>
                  <h4 className="text-white">Percentage: {score.percentage}%</h4>
                  <div className="grade-message">
                    {score.percentage >= 90 ? "Excellent! 🎉" :
                     score.percentage >= 70 ? "Good Job! 👏" :
                     score.percentage >= 50 ? "Keep Practicing! 💪" :
                     "Better luck next time! 📚"}
                  </div>
                </div>
                <div className="text-center mt-4">
                  <button 
                    className="back-to-quizzes-btn"
                    onClick={() => navigate('/take')}
                  >
                    Back to Quizzes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="quiz-page-container">
      <button className="back-button" onClick={() => navigate('/take')}>
        ← Back to Quizzes
      </button>
      
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="quiz-content">
              <h2 className="text-center text-white mb-4">{quiz.title}</h2>
              
              <div className="question-card">
                <h4 className="question-text">
                  Question {currentQuestion + 1} of {quiz.questions.length}
                </h4>
                <p className="question">
                  {quiz.questions[currentQuestion].question}
                </p>
                
                <div className="options-container">
                  {quiz.questions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      className={`option-button ${answers[currentQuestion] === index ? 'selected' : ''}`}
                      onClick={() => handleAnswer(index)}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                <div className="navigation-buttons">
                  <button
                    className="nav-button"
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                  >
                    Previous
                  </button>
                  
                  {currentQuestion === quiz.questions.length - 1 ? (
                    <button
                      className="submit-button"
                      onClick={handleSubmit}
                      disabled={answers.includes(null)}
                    >
                      Submit Quiz
                    </button>
                  ) : (
                    <button
                      className="nav-button"
                      onClick={handleNext}
                      disabled={answers[currentQuestion] === null}
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizPage;