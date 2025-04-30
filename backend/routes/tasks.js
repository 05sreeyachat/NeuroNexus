const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      assignedTo: req.body.assignedTo || req.userId
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.userId })
      .populate('project')
      .populate('assignedTo');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, assignedTo: req.userId },
      req.body,
      { new: true }
    );
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id, assignedTo: req.userId });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;