import React from 'react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onStatusChange: (taskId: string, status: Task['status']) => void;
  onDelete: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onStatusChange, onDelete }) => {
  const getPriorityClass = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  const getStatusClass = (status: Task['status']) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'in-progress': return 'status-in-progress';
      case 'pending': return 'status-pending';
      default: return '';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate || task.status === 'completed') return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div className={`task-item ${getStatusClass(task.status)} ${isOverdue(task.dueDate) ? 'overdue' : ''}`}>
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <div className="task-actions">
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value as Task['status'])}
            className="status-select"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button
            onClick={() => onDelete(task.id)}
            className="btn btn-delete"
            title="Delete task"
          >
            ×
          </button>
        </div>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-meta">
        <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
        </span>
        
        {task.dueDate && (
          <span className={`due-date ${isOverdue(task.dueDate) ? 'overdue' : ''}`}>
            Due: {formatDate(task.dueDate)}
          </span>
        )}
        
        <span className="created-date">
          Created: {formatDate(task.createdAt)}
        </span>
      </div>
    </div>
  );
};

export default TaskItem; 