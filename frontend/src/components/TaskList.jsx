import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, loading, onEdit, onDelete, onToggle, actionLoading }) => {
  if (loading) {
    return (
      <div className="task-list-section">
        <div className="task-loading">
          <div className="spinner" style={{ margin: '0 auto 1rem' }} />
          Loading tasks…
        </div>
      </div>
    );
  }

  return (
    <div className="task-list-section">
      <div className="task-list-header">
        <span className="task-list-title">Task List</span>
        <span className="task-count">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</span>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <div className="empty-title">No tasks here</div>
          <p className="empty-desc">Add a task above to get started.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Task</th>
                <th>Due Date</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggle={onToggle}
                  actionLoading={actionLoading}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TaskList;
