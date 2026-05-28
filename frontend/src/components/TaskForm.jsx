import React, { useState, useEffect } from 'react';

const emptyForm = { title: '', description: '', priority: 'Medium', dueDate: '' };

const TaskForm = ({ editTask, onAdd, onUpdate, onCancel, loading }) => {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  // Pre-fill form when editing
  useEffect(() => {
    if (editTask) {
      setForm({
        title: editTask.title || '',
        description: editTask.description || '',
        priority: editTask.priority || 'Medium',
        dueDate: editTask.dueDate ? editTask.dueDate.slice(0, 10) : '',
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [editTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Task title is required.';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
      dueDate: form.dueDate || null,
    };

    if (editTask) {
      onUpdate(editTask._id, payload);
    } else {
      onAdd(payload);
      setForm(emptyForm);
    }
  };

  const isEditing = !!editTask;

  return (
    <div className="task-form-section">
      <div className="task-form-title">
        {isEditing ? '✏ Edit Task' : '＋ Add New Task'}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="task-form-grid">
          <div className={`form-group task-form-full`}>
            <label className="form-label" htmlFor="title">Task Title *</label>
            <input
              id="title" name="title" type="text"
              className={`form-input ${errors.title ? 'error' : ''}`}
              placeholder="What needs to be done?"
              value={form.title}
              onChange={handleChange}
            />
            {errors.title && <p className="form-error">⚠ {errors.title}</p>}
          </div>

          <div className="form-group task-form-full">
            <label className="form-label" htmlFor="description">Description</label>
            <input
              id="description" name="description" type="text"
              className="form-input"
              placeholder="Optional details…"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="priority">Priority</label>
            <select id="priority" name="priority" className="form-select" value={form.priority} onChange={handleChange}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="dueDate">Due Date</label>
            <input
              id="dueDate" name="dueDate" type="date"
              className="form-input"
              value={form.dueDate}
              onChange={handleChange}
              style={{ colorScheme: 'dark' }}
            />
          </div>
        </div>

        <div className="task-form-actions">
          {isEditing && (
            <button type="button" className="btn btn-cancel" onClick={onCancel} disabled={loading}>
              Cancel
            </button>
          )}
          <button type="submit" className={`btn ${isEditing ? 'btn-update' : 'btn-add'}`} disabled={loading}>
            {loading ? '…' : isEditing ? '✓ Update Task' : '＋ Add Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
