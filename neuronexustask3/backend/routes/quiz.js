const router = require('express').Router();
let Quiz = require('../models/quiz.model');

// Get all quizzes
router.route('/').get((req, res) => {
  Quiz.find()
    .then(quizzes => res.json(quizzes))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Add new quiz
router.route('/').post((req, res) => {
  const newQuiz = new Quiz(req.body);

  newQuiz.save()
    .then(() => res.json('Quiz added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Get specific quiz
router.route('/:id').get((req, res) => {
  Quiz.findById(req.params.id)
    .then(quiz => res.json(quiz))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;