import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import TodoForm from '../components/TodoForm';
import TodoItem from '../components/TodoItem';
import { todoService } from '../services/api';
import './Dashboard.css';

function Dashboard() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTodo, setEditingTodo] = useState(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const data = await todoService.getTodos();
      setTodos(data);
    } catch (error) {
      toast.error('Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (todoData) => {
    try {
      console.log('Dashboard receiving todo data:', todoData);
      
      const newTodo = await todoService.createTodo({
        text: todoData.text,
        priority: todoData.priority,
        dueDate: todoData.dueDate
      });

      console.log('New todo created:', newTodo);
      setTodos(prevTodos => [newTodo, ...prevTodos]);
      toast.success('Todo added successfully');
    } catch (error) {
      console.error('Add todo error:', error);
      toast.error('Failed to add todo');
    }
  };

  const updateTodo = async (id, text) => {
    try {
      const updatedTodo = await todoService.updateTodo(id, { text });
      setTodos(todos.map(todo => 
        todo._id === id ? updatedTodo : todo
      ));
      setEditingTodo(null);
      toast.success('Todo updated successfully');
    } catch (error) {
      toast.error('Failed to update todo');
    }
  };

  const deleteTodo = async (id) => {
    try {
      await todoService.deleteTodo(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo._id !== id));
      toast.success('Todo deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete todo');
    }
  };

  const toggleTodo = async (id) => {
    try {
      const updatedTodo = await todoService.toggleTodo(id);
      setTodos(todos.map(todo => 
        todo._id === id ? updatedTodo : todo
      ));
    } catch (error) {
      toast.error('Failed to toggle todo');
    }
  };

  // Filter todos based on search and filter criteria
  const filteredTodos = todos
    .filter(todo => 
      todo.text.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(todo => 
      filterPriority === 'all' ? true : todo.priority === filterPriority
    )
    .filter(todo => {
      if (filterStatus === 'all') return true;
      return filterStatus === 'completed' ? todo.completed : !todo.completed;
    });

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <h1>My Tasks</h1>
      <TodoForm addTodo={addTodo} />
      
      <div className="filters">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Priorities</option>
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="active">Active</option>
        </select>
      </div>

      <div className="todos-container">
        {filteredTodos.length === 0 ? (
          <p className="no-todos">No tasks found</p>
        ) : (
          filteredTodos.map(todo => (
            <TodoItem
              key={todo._id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={setEditingTodo}
            />
          ))
        )}
      </div>

      {editingTodo && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <h3>Edit Todo</h3>
            <input
              type="text"
              value={editingTodo.text}
              onChange={(e) => setEditingTodo({...editingTodo, text: e.target.value})}
            />
            <div className="edit-modal-actions">
              <button 
                onClick={() => updateTodo(editingTodo._id, editingTodo.text)}
                className="btn btn-primary"
              >
                Save
              </button>
              <button 
                onClick={() => setEditingTodo(null)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard; 