import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './TodoItem.css';

function TodoItem({ todo, onToggle, onDelete, onEdit }) {
    const formatDate = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString();
    };

    const getPriorityClass = (priority) => {
        if (!priority) return 'priority-medium';
        return `priority-${priority.toLowerCase()}`;
    };

    const handleDelete = async () => {
        try {
            if (window.confirm('Are you sure you want to delete this task?')) {
                await onDelete(todo._id);
            }
        } catch (error) {
            console.error('Delete error in TodoItem:', error);
        }
    };

    if (!todo) return null;

    return (
        <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <div className="todo-content">
                <input
                    type="checkbox"
                    checked={todo.completed || false}
                    onChange={() => onToggle(todo._id)}
                    className="todo-checkbox"
                />
                <div className="todo-details">
                    <span className="todo-text">{todo.text}</span>
                    <div className="todo-meta">
                        <span className={`priority-badge ${getPriorityClass(todo.priority)}`}>
                            {todo.priority || 'Medium'}
                        </span>
                        {todo.dueDate && (
                            <span className="due-date">
                                Due: {formatDate(todo.dueDate)}
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <div className="todo-actions">
                <button 
                    onClick={() => onEdit(todo)} 
                    className="btn btn-edit"
                    disabled={todo.completed}
                >
                    <FaEdit />
                </button>
                <button 
                    onClick={handleDelete} 
                    className="btn btn-delete"
                >
                    <FaTrash />
                </button>
            </div>
        </div>
    );
}

export default TodoItem; 