import React, { useState } from 'react';
import { Goal, Task } from '../types';
import TaskItem from './TaskItem';
import GoalForm from './GoalForm';
import { GoalFormData } from '../types';

interface GoalCardProps {
  goal: Goal;
  tasks: Task[];
  onUpdateGoal: (goalId: string, data: GoalFormData) => void;
  onDeleteGoal: (goalId: string) => void;
  onTaskStatusChange: (taskId: string, status: Task['status']) => void;
  onDeleteTask: (taskId: string) => void;
}

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  tasks,
  onUpdateGoal,
  onDeleteGoal,
  onTaskStatusChange,
  onDeleteTask
}) => {
  const [editing, setEditing] = useState(false);
  const linkedTasks = tasks.filter((t) => t.goalId === goal.id);
  const completedCount = linkedTasks.filter((t) => t.status === 'completed').length;
  const total = linkedTasks.length;
  const progressLabel = total === 0 ? '0 tasks' : `${completedCount}/${total} tasks done`;

  const handleSubmit = (data: GoalFormData) => {
    onUpdateGoal(goal.id, data);
    setEditing(false);
  };

  return (
    <div className="goal-card">
      <div className="goal-card-header">
        <div className="goal-title-row">
          {editing ? (
            <GoalForm
              initialData={{ name: goal.name, deadline: goal.deadline }}
              onSubmit={handleSubmit}
              onCancel={() => setEditing(false)}
            />
          ) : (
            <>
              <h3 className="goal-title">{goal.name}</h3>
              <div className="goal-card-actions">
                <button
                  type="button"
                  className="btn btn-secondary btn-small"
                  onClick={() => setEditing(true)}
                  title="Edit goal"
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-delete btn-small"
                  onClick={() => onDeleteGoal(goal.id)}
                  title="Delete goal"
                >
                  ×
                </button>
              </div>
            </>
          )}
        </div>
        {!editing && (
          <div className="goal-meta">
            <span className="goal-progress">{progressLabel}</span>
            {goal.deadline && (
              <span className="goal-deadline">Deadline: {formatDate(goal.deadline)}</span>
            )}
          </div>
        )}
      </div>
      {!editing && (
        <div className="goal-tasks">
          {linkedTasks.length === 0 ? (
            <p className="goal-tasks-empty">No tasks linked yet. Add a task and choose this goal.</p>
          ) : (
            <ul className="goal-tasks-list">
              {linkedTasks
                .sort((a, b) => {
                  const p = { high: 3, medium: 2, low: 1 };
                  if (p[a.priority] !== p[b.priority]) return p[b.priority] - p[a.priority];
                  if (a.dueDate && b.dueDate) return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                })
                .map((task) => (
                  <li key={task.id}>
                    <TaskItem
                      task={task}
                      onStatusChange={onTaskStatusChange}
                      onDelete={onDeleteTask}
                    />
                  </li>
                ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default GoalCard;
