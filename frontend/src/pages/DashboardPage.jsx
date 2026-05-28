import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTasks, createTask, updateTask, toggleTask, deleteTask } from '../services/api';
import Navbar from '../components/Navbar';
import FilterBar from '../components/FilterBar';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

const DashboardPage = () => {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // task id being mutated
  const [editTask, setEditTask] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'completed'
  const [error, setError] = useState('');

  // ── Fetch tasks ───────────────────────────────────────
  const fetchTasks = useCallback(async () => {
    try {
      const res = await getTasks();
      setTasks(res.data.tasks || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  // ── Derived: filtered tasks ───────────────────────────
  const filteredTasks = tasks.filter((t) => {
    if (filter === 'completed') return t.completed;
    if (filter === 'pending')   return !t.completed;
    return true;
  });

  const stats = {
    all: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length,
  };

  // ── Handlers ──────────────────────────────────────────
  const handleAdd = async (data) => {
    setFormLoading(true);
    setError('');
    try {
      await createTask(data);
      await fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (id, data) => {
    setFormLoading(true);
    setError('');
    try {
      await updateTask(id, data);
      setEditTask(null);
      await fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggle = async (id, completed) => {
    setActionLoading(id);
    setError('');
    try {
      await toggleTask(id, { completed });
      setTasks((prev) => prev.map((t) => (t._id === id ? { ...t, completed } : t)));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task status.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    setActionLoading(id);
    setError('');
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      if (editTask?._id === id) setEditTask(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = (task) => {
    setEditTask(task);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => setEditTask(null);

  return (
    <div className="dashboard">
      <Navbar />

      <div className="dashboard-content">
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">My Tasks</h1>
          <p className="dashboard-subtitle">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card all">
            <div className="stat-value">{stats.all}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-card done">
            <div className="stat-value">{stats.completed}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card pending">
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>

        {/* Global error */}
        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
            <span>⚠</span> {error}
            <button onClick={() => setError('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>✕</button>
          </div>
        )}

        {/* Task Form */}
        <TaskForm
          editTask={editTask}
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          onCancel={handleCancelEdit}
          loading={formLoading}
        />

        {/* Filter Bar */}
        <FilterBar active={filter} onChange={setFilter} />

        {/* Task List */}
        <TaskList
          tasks={filteredTasks}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggle={handleToggle}
          actionLoading={actionLoading}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
