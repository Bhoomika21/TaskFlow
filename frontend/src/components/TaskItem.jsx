import React from 'react';

const priorityBadge = (priority) => {
  const map = { High: 'badge-high', Medium: 'badge-medium', Low: 'badge-low' };
  const dot = { High: '🔴', Medium: '🟡', Low: '⚪' };
  return (
    <span className={`badge ${map[priority] || 'badge-low'}`}>
      {dot[priority]} {priority}
    </span>
  );
};

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const isOverdue = d < now;
  return (
    <span className={`due-date ${isOverdue ? 'overdue' : ''}`}>
      {isOverdue ? '⚠ ' : '📅 '}
      {d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
    </span>
  );
};

const TaskItem = ({ task, onEdit, onDelete, onToggle, actionLoading }) => {
  const isLoading = actionLoading === task._id;

  return (
    <tr className={task.completed ? 'completed-row' : ''}>
      <td>
        <div className={`task-title-cell ${task.completed ? 'done' : ''}`}>{task.title}</div>
        {task.description && <div className="task-desc">{task.description}</div>}
      </td>

      <td className="hidden-mobile">
        {task.dueDate ? formatDate(task.dueDate) : <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>—</span>}
      </td>

      <td>{priorityBadge(task.priority)}</td>

      <td>
        <span className={`badge ${task.completed ? 'badge-completed' : 'badge-pending'}`}>
          {task.completed ? '✓ Done' : '◌ Pending'}
        </span>
      </td>

      <td>
        <div className="actions-cell">
          <button
            className="btn btn-sm btn-success"
            onClick={() => onToggle(task._id, !task.completed)}
            disabled={isLoading}
            title={task.completed ? 'Mark pending' : 'Mark complete'}
          >
            {task.completed ? '↩' : '✓'}
          </button>

          <button
            className="btn btn-sm btn-edit"
            onClick={() => onEdit(task)}
            disabled={isLoading}
            title="Edit task"
          >
            ✏
          </button>

          <button
            className="btn btn-sm btn-danger"
            onClick={() => onDelete(task._id)}
            disabled={isLoading}
            title="Delete task"
          >
            🗑
          </button>
        </div>
      </td>
    </tr>
  );
};

export default TaskItem;
