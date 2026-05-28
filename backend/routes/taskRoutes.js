const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getAllTasks,
  createTask,
  updateTask,
  toggleComplete,
  deleteTask,
} = require('../controllers/taskController');

// Apply authMiddleware to ALL task routes
router.use(authMiddleware);

router.get('/', getAllTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.patch('/:id', toggleComplete);
router.delete('/:id', deleteTask);

module.exports = router;
