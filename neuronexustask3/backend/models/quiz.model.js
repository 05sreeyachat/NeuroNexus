const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const quizSchema = new Schema({
  title: { type: String, required: true },
  questions: [{
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: Number, required: true }
  }]
}, {
  timestamps: true
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;