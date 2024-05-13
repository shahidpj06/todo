import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TodoSearch from './components/Todo/TodoSearch';
import { FaRegEdit } from 'react-icons/fa';
import TodoFilter from './components/Todo/TodoFilter';
import TodoList from './components/Todo/TodoList';
import Navbar from './components/Navbar';
import api from './services/api'

const Home = () => {
  const { projectId } = useParams();
  const [todos, setTodos] = useState([]);
  const [projectTitle, setProjectTitle] = useState('');
  const [errors, setErrors] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`projects/${projectId}/todos/`);
        setTodos(response.data);
        const projectResponse = await api.get(`projects/${projectId}/`);
        setProjectTitle(projectResponse.data.title);
        setNewProjectTitle(projectResponse.data.title);
      } catch (error) {
        setErrors(error.response.data || error.message);
      }
    };

    fetchData();
  }, [projectId]);

  const addTodo = (data) => {
    const originalTodos = [...todos];
    const newData = { task: data.task, project: projectId };
    api.post(`projects/${projectId}/todos/`, newData)
      .then(res => setTodos([...todos, res.data]))
      .catch(err => {
        setErrors(err.message)
        setTodos(originalTodos)
      });
  };

  const delTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
    const originalTodos = [...todos]
    api.delete(`projects/${projectId}/todos/${id}/`)
      .catch(err => {
        setErrors(err.message)
        setTodos(originalTodos)
      })
  }

  const updateTodo = (e, id, text, todo) => {
    e.preventDefault()

    const updatedTodo = { task: text, updated_date: new Date() }
    api.patch(`projects/${projectId}/todos/${id}/`, updatedTodo)
      .then(res => {
        setTodos(todos.map(todo => todo.id === id ? { ...todo, ...updatedTodo } : todo));
        console.log(res);
      })
      .catch(err => console.error(err));
  }

  const completeTodo = (e, id, todo) => {
    const updatedStatus = e.target.checked;
    const updatedTodo = { ...todo, status: updatedStatus, updated_date: new Date() };
    setTodos(todos.map(t => t.id === id ? updatedTodo : t));
    api.patch(`projects/${projectId}/todos/${id}/`, updatedTodo)
      .then(res => {
        console.log(res);
      })
      .catch(err => console.error(err));
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setNewProjectTitle(projectTitle);
  };

  const handleSaveEdit = () => {
    api.patch(`projects/${projectId}/`, { title: newProjectTitle })
      .then(res => {
        setProjectTitle(newProjectTitle);
        setEditMode(false);
      })
      .catch(err => console.error(err));
  };

  return (
    <div>
      <Navbar />
      <div className='main-contaner'>
      <div className="todo-container">
        <div className="project-title" style={{ display: 'flex', alignItems: 'center' }}>
          {editMode ? (
            <>
              <input
                type="text"
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
              />
              <button className="edit" onClick={handleSaveEdit}>Save</button>
              <button className="cancel" onClick={handleCancelEdit}>Cancel</button>
            </>
          ) : (
            <>
              <h1 style={{ color: 'white', marginRight: '10px', fontSize: '2rem' }}>{projectTitle}</h1>
              <div className="edit"> <FaRegEdit style={{ color: 'white'}} size={18} onClick={handleEditClick}/></div>
            </>
          )}
        </div>
        <TodoSearch add_todo={addTodo} projectTitle={projectTitle} />
        <TodoFilter todos={todos} />
        <TodoList
          todos={todos}
          delete_todo={delTodo}
          updated_todo={updateTodo}
          complete_todo={completeTodo}
        />
      </div>
      </div>
    </div>
  );
};

export default Home;
