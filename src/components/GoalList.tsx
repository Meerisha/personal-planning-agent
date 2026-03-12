import React, { useState } from 'react';
import { Goal, Task } from '../types';
import GoalCard from './GoalCard';
import GoalForm from './GoalForm';
import { GoalFormData } from '../types';

interface GoalListProps {
  goals: Goal[];
  tasks: Task[];
  onAddGoal: (data: GoalFormData) => void;
  onUpdateGoal: (goalId: string, data: GoalFormData) => void;
  onDeleteGoal: (goalId: string) => void;
  onTaskStatusChange: (taskId: string, status: Task['status']) => void;
  onDeleteTask: (taskId: string) => void;
}

type GoalFilter = 'all' | 'in-progress' | 'completed';

const isGoalCompleted = (goalId: string, tasks: Task[]): boolean => {
  const linked = tasks.filter((t) => t.goalId === goalId);
  if (linked.length === 0) return false;
  return linked.every((t) => t.status === 'completed');
};

const GoalList: React.FC<GoalListProps> = ({
  goals,
  tasks,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal,
  onTaskStatusChange,
  onDeleteTask
}) => {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<GoalFilter>('all');

  const filteredGoals = goals.filter((goal) => {
    const completed = isGoalCompleted(goal.id, tasks);
    if (filter === 'all') return true;
    if (filter === 'completed') return completed;
    return !completed;
  });

  return (
    <div className="goals-section">
      <div className="goals-header">
        <h2>Goals</h2>
        <div className="goals-header-actions">
          <label htmlFor="goal-filter" className="visually-hidden">Filter goals</label>
          <select
            id="goal-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value as GoalFilter)}
            className="filter-select"
          >
            <option value="all">All goals</option>
            <option value="in-progress">In progress</option>
            <option value="completed">Completed</option>
          </select>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : '+ Add goal'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="goal-form-section">
          <GoalForm
            onSubmit={(data) => {
              onAddGoal(data);
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <div className="goal-list">
        {filteredGoals.length === 0 ? (
          <div className="empty-state">
            <p>
              {filter === 'all'
                ? 'No goals yet. Add a goal to group tasks around it.'
                : `No ${filter.replace('-', ' ')} goals.`}
            </p>
          </div>
        ) : (
          filteredGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              tasks={tasks}
              onUpdateGoal={onUpdateGoal}
              onDeleteGoal={onDeleteGoal}
              onTaskStatusChange={onTaskStatusChange}
              onDeleteTask={onDeleteTask}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default GoalList;
