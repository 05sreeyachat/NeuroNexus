import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CreateQuiz from './components/CreateQuiz';
import TakeQuiz from './components/TakeQuiz';
import LandingPage from './components/LandingPage';
import QuizPage from './components/QuizPage';  // Add this import
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <div className="container">
            <Link className="navbar-brand" to="/">Quiz Platform</Link>
          </div>
        </nav>

        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route path="/create" element={<CreateQuiz />} />
          <Route path="/take" element={<TakeQuiz />} />
          <Route path="/quiz/:id" element={<QuizPage />} />  {/* Fixed comment style */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
