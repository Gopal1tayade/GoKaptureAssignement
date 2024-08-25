const express = require('express');
const { Task } = require('../models');
const router = express.Router();

// CRUD Operations

router.post('/', async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, user_id: req.user.id });
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
    const { status, priority, due_date, search } = req.query;

    const where = { user_id: req.user.id };
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (due_date) where.due_date = due_date;
    if (search) where.title = { [Op.iLike]: `%${search}%` };
  
    const tasks = await Task.findAll({ where });
    res.json(tasks);
});

router.put('/:id', async (req, res) => {
  const task = await Task.findOne({ where: { id: req.params.id, user_id: req.user.id } });
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  await task.update(req.body);
  res.json(task);
});

router.delete('/:id', async (req, res) => {
  const task = await Task.findOne({ where: { id: req.params.id, user_id: req.user.id } });
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  await task.destroy();
  res.json({ message: 'Task deleted' });
});

module.exports = router;
