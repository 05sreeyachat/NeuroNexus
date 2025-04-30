import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TakeQuiz.css';
import api from '../api/config';

function TakeQuiz() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const response = await api.get('/quizzes');
        setQuizzes(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        setError('Failed to load quizzes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  if (loading) {
    return (
      <div className="take-quiz-container">
        <div className="container text-center text-white">
          <h2>Loading quizzes...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="take-quiz-container">
        <div className="container text-center text-white">
          <h2>Error</h2>
          <p>{error}</p>
          <button className="btn btn-light" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="take-quiz-container">
      <button 
        className="back-button"
        onClick={() => navigate('/')}
      >
        ← Back to Home
      </button>
      <div className="container">
        <h2 className="text-center text-white mb-4">Available Quizzes</h2>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="quiz-list">
              {quizzes.map((quiz, index) => (
                <div key={index} className="quiz-card">
                  <h3 className="quiz-title">{quiz.title}</h3>
                  <p className="quiz-info">
                    {quiz.questions.length} Questions • Estimated Time: {quiz.questions.length * 2} mins
                  </p>
                  <button
                    className="start-quiz-btn"
                    onClick={() => navigate(`/quiz/${quiz._id}`)}
                  >
                    Start Quiz
                  </button>
                </div>
              ))}
              {quizzes.length === 0 && (
                <p className="text-center text-white">No quizzes available yet. Create a quiz first!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TakeQuiz;