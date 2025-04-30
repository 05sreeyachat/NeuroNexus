import React, { useState } from 'react';
import './CreateQuiz.css';
import { useNavigate } from 'react-router-dom';
import api from '../api/config';

function CreateQuiz() {
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState({
    title: '',
    questions: [{ 
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    }]
  });

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...quiz.questions];
    newQuestions[index].question = value;
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuestions = [...quiz.questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const removeQuestion = (index) => {
    const newQuestions = quiz.questions.filter((_, i) => i !== index);
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const addQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [...quiz.questions, {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0
      }]
    });
  };

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/quizzes', quiz);
      setShowSuccess(true);
      setQuiz({
        title: '',
        questions: [{
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0
        }]
      });
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
  };

  return (
    <div className="create-quiz-container">
      {showSuccess && (
        <div className="success-message">
          Quiz created successfully!
        </div>
      )}
      <button 
        className="back-button"
        onClick={() => navigate('/')}
      >
        ← Back to Home
      </button>
      <div className="container">
        <h2 className="text-center text-white mb-4">Create New Quiz</h2>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <form className="quiz-form" onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label">Quiz Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter quiz title"
                  value={quiz.title}
                  onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                />
              </div>

              {quiz.questions.map((question, index) => (
                <div key={index} className="question-card">
                  <div className="mb-3">
                    <label className="form-label">Question {index + 1}</label>
                    <input
                      type="text"
                      className="form-control"
                      value={question.question}
                      onChange={(e) => handleQuestionChange(index, e.target.value)}
                      placeholder="Enter your question"
                    />
                  </div>

                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="option-input">
                      <input
                        type="text"
                        className="form-control"
                        value={option}
                        onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                        placeholder={`Option ${optionIndex + 1}`}
                      />
                    </div>
                  ))}

                  <div className="correct-answer-select mb-3">
                    <label className="form-label">Correct Answer</label>
                    <select 
                      className="form-select"
                      value={question.correctAnswer}
                      onChange={(e) => {
                        const newQuestions = [...quiz.questions];
                        newQuestions[index].correctAnswer = parseInt(e.target.value);
                        setQuiz({ ...quiz, questions: newQuestions });
                      }}
                    >
                      {question.options.map((_, optionIndex) => (
                        <option key={optionIndex} value={optionIndex}>
                          Option {optionIndex + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    className="remove-question-btn"
                    onClick={() => removeQuestion(index)}
                  >
                    Remove Question
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="add-question-btn"
                onClick={addQuestion}
              >
                Add Question
              </button>

              <button type="submit" className="submit-quiz-btn w-100">
                Create Quiz
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateQuiz;