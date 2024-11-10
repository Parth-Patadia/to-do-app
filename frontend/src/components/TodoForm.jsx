import React, { useState } from 'react';
import { toast } from 'react-toastify';
import './TodoForm.css';

function TodoForm({ addTodo }) {
    const [formData, setFormData] = useState({
        text: '',
        priority: 'Medium',
        dueDate: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.text.trim()) {
            toast.error('Please enter a task');
            return;
        }

        try {
            console.log('Form data being submitted:', formData);

            const todoData = {
                text: formData.text.trim(),
                priority: formData.priority,
                dueDate: formData.dueDate || null
            };

            await addTodo(todoData);

            setFormData({
                text: '',
                priority: 'Medium',
                dueDate: ''
            });
        } catch (error) {
            console.error('Form submission error:', error);
            toast.error('Failed to add todo');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="todo-form">
            <div className="form-row">
                <input
                    type="text"
                    value={formData.text}
                    onChange={(e) => setFormData({...formData, text: e.target.value})}
                    placeholder="Add a new task"
                    className="todo-input"
                    required
                />
                <select
                    value={formData.priority}
                    onChange={(e) => {
                        console.log('Priority selected:', e.target.value);
                        setFormData({...formData, priority: e.target.value});
                    }}
                    className="priority-select"
                >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                </select>
                <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => {
                        console.log('Date selected:', e.target.value);
                        setFormData({...formData, dueDate: e.target.value});
                    }}
                    className="date-input"
                />
                <button type="submit" className="add-button">Add Task</button>
            </div>
        </form>
    );
}

export default TodoForm; 