import React, { useState, useEffect } from 'react';
import { Task, TaskFormData } from '../types';
import TaskForm from './TaskForm';
import TaskItem from './TaskItem';

const PlanningAgent: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('planningAgentTasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('planningAgentTasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (taskData: TaskFormData) => {
    const newTask: Task = {
      id: Date.now().toString(),
      ...taskData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [...prev, newTask]);
    setShowForm(false);
  };

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const getTaskCounts = () => {
    return {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      completed: tasks.filter(t => t.status === 'completed').length
    };
  };

  const counts = getTaskCounts();

  return (
    <div className="planning-agent">
      <header className="agent-header">
        <div className="header-content">
          <h1>Personal Planning Agent</h1>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary"
          >
            {showForm ? 'Cancel' : '+ New Task'}
          </button>
        </div>
      </header>

      <div className="agent-content">
        {showForm && (
          <div className="form-section">
            <h2>Add New Task</h2>
            <TaskForm 
              onSubmit={addTask}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        <div className="dashboard-section">
          <div className="stats-bar">
            <div className="stats">
              <span className="stat-item">Total: {counts.total}</span>
              <span className="stat-item pending">Pending: {counts.pending}</span>
              <span className="stat-item in-progress">In Progress: {counts.inProgress}</span>
              <span className="stat-item completed">Completed: {counts.completed}</span>
            </div>
            
            <div className="filter-controls">
              <label htmlFor="filter">Filter: </label>
              <select 
                id="filter"
                value={filter} 
                onChange={(e) => setFilter(e.target.value as typeof filter)}
                className="filter-select"
              >
                <option value="all">All Tasks</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="tasks-section">
            {filteredTasks.length === 0 ? (
              <div className="empty-state">
                <p>
                  {filter === 'all' 
                    ? 'No tasks yet. Create your first task to get started!'
                    : `No ${filter.replace('-', ' ')} tasks.`
                  }
                </p>
              </div>
            ) : (
              <div className="tasks-list">
                {filteredTasks
                  .sort((a, b) => {
                    // Sort by priority (high first), then by due date, then by creation date
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    const aPriority = priorityOrder[a.priority];
                    const bPriority = priorityOrder[b.priority];
                    
                    if (aPriority !== bPriority) {
                      return bPriority - aPriority;
                    }
                    
                    if (a.dueDate && b.dueDate) {
                      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                    }
                    
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                  })
                  .map(task => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onStatusChange={updateTaskStatus}
                      onDelete={deleteTask}
                    />
                  ))
                }
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanningAgent; 