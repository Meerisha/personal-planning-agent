import React, { useState } from 'react';
import { GoalFormData } from '../types';

interface GoalFormProps {
  onSubmit: (data: GoalFormData) => void;
  onCancel?: () => void;
  initialData?: GoalFormData;
}

const GoalForm: React.FC<GoalFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState<GoalFormData>({
    name: initialData?.name ?? '',
    deadline: initialData?.deadline ?? ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSubmit({
        name: formData.name.trim(),
        deadline: formData.deadline || undefined
      });
      setFormData({ name: '', deadline: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="goal-form">
      <div className="form-group">
        <label htmlFor="goal-name">Goal name *</label>
        <input
          type="text"
          id="goal-name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g. Learn React"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="goal-deadline">Deadline (optional)</label>
        <input
          type="date"
          id="goal-deadline"
          value={formData.deadline ?? ''}
          onChange={(e) => setFormData({ ...formData, deadline: e.target.value || undefined })}
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {initialData ? 'Update goal' : 'Add goal'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default GoalForm;
