import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      <div className="text-center">
        <div className="typewriter">
          <h1>Quiz Platform</h1>
        </div>
        <p className="lead mb-5 animate__animated animate__fadeIn animate__delay-1s">
          Test your knowledge or create challenging quizzes for others
        </p>
        
        <div className="row justify-content-center">
          <div className="col-md-4 mb-4">
            <div className="card bg-transparent border-light text-white hover-card animate__animated animate__fadeInLeft animate__delay-1s">
              <div className="card-body">
                <h3 className="card-title mb-4">Create Quiz</h3>
                <p className="card-text mb-4">Design your own quiz with multiple choice questions</p>
                <button 
                  className="btn btn-outline-light btn-lg w-100 pulse-button"
                  onClick={() => navigate('/create')}
                >
                  Start Creating
                </button>
              </div>
            </div>
          </div>
          
          <div className="col-md-4 mb-4">
            <div className="card bg-transparent border-light text-white hover-card animate__animated animate__fadeInRight animate__delay-1s">
              <div className="card-body">
                <h3 className="card-title mb-4">Take Quiz</h3>
                <p className="card-text mb-4">Challenge yourself with existing quizzes</p>
                <button 
                  className="btn btn-outline-light btn-lg w-100 pulse-button"
                  onClick={() => navigate('/take')}
                >
                  Start Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;