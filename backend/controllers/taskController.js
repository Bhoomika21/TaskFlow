const Task = require('../models/Task');

// @desc    Get all tasks for logged-in user
// @route   GET /tasks
// @access  Private
const getAllTasks = async (req, res) => {
  try {
    const { filter, sort = 'newest' } = req.query;

    const query = { userId: req.user.userId };

    if (filter === 'completed') query.completed = true;
    if (filter === 'pending') query.completed = false;

    const sortOption =
      sort === 'oldest' ? { createdAt: 1 }
      : sort === 'priority' ? { priority: -1, createdAt: -1 }
      : { createdAt: -1 }; // newest default

    const tasks = await Task.find(query).sort(sortOption);

    return res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error('getAllTasks error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch tasks.' });
  }
};

// @desc    Create a new task
// @route   POST /tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ success: false, message: 'Task title is required.' });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description?.trim() || '',
      priority: priority || 'Medium',
      dueDate: dueDate || null,
      userId: req.user.userId,
    });

    return res.status(201).json({ success: true, message: 'Task created successfully.', task });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    console.error('createTask error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create task.' });
  }
};

// @desc    Update task title, description, priority, dueDate
// @route   PUT /tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    if (title !== undefined && title.trim() === '') {
      return res.status(400).json({ success: false, message: 'Task title cannot be empty.' });
    }

    // Find by _id AND userId — user cannot update another user's task
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      {
        ...(title && { title: title.trim() }),
        ...(description !== undefined && { description: description.trim() }),
        ...(priority && { priority }),
        ...(dueDate !== undefined && { dueDate: dueDate || null }),
      },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found or access denied.' });
    }

    return res.status(200).json({ success: true, message: 'Task updated successfully.', task });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid task ID.' });
    }
    console.error('updateTask error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update task.' });
  }
};

// @desc    Toggle task completed status
// @route   PATCH /tasks/:id
// @access  Private
const toggleComplete = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.userId });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found or access denied.' });
    }

    task.completed = req.body.completed !== undefined ? req.body.completed : !task.completed;
    await task.save();

    return res.status(200).json({ success: true, message: 'Task status updated.', task });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid task ID.' });
    }
    console.error('toggleComplete error:', error);
    return res.status(500).json({ success: false, message: 'Failed to toggle task status.' });
  }
};

// @desc    Delete a task
// @route   DELETE /tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    // Find by both _id AND userId — prevents deleting another user's task
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found or access denied.' });
    }

    return res.status(200).json({ success: true, message: 'Task deleted successfully.' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid task ID.' });
    }
    console.error('deleteTask error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete task.' });
  }
};

module.exports = { getAllTasks, createTask, updateTask, toggleComplete, deleteTask };
