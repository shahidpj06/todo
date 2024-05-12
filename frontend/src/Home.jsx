import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import TodoSearch from './components/Todo/TodoSearch';
import TodoFilter from './components/Todo/TodoFilter';
import TodoList from './components/Todo/TodoList';
import Navbar from './components/Navbar';

const Home = () => {
  const { projectId } = useParams();
  const [todos, setTodos] = useState([]);
  const [projectTitle, setProjectTitle] = useState('');
  const [errors, setErrors] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/projects/${projectId}/todos/`);
        setTodos(response.data);
        const projectResponse = await axios.get(`http://127.0.0.1:8000/api/projects/${projectId}/`);
        setProjectTitle(projectResponse.data.title);
      } catch (error) {
        setErrors(error.response.data || error.message);
      }
    };

    fetchData();
  }, [projectId]);



  const addTodo = (data) => {
    const originalTodos = [...todos];
    const newData = { task: data.task, project: projectId };
    axios.post(`http://127.0.0.1:8000/projects/${projectId}/todos/`, newData)
      .then(res => setTodos([...todos, res.data]))
      .catch(err => {
        setErrors(err.message)
        setTodos(originalTodos)
      });
  };


  const delTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
    const originalTodos = [...todos]
    axios.delete(`http://127.0.0.1:8000/projects/${projectId}/todos/${id}/`)
      .catch(err => {
        setErrors(err.message)
        setTodos(originalTodos)
      })
  }

  const updateTodo = (e, id, text, todo) => {
    e.preventDefault()

    const updatedTodo = { task: text, updated_date: new Date() }
    axios.patch(`http://127.0.0.1:8000/projects/${projectId}/todos/${id}/`, updatedTodo)
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
    axios.patch(`http://127.0.0.1:8000/projects/${projectId}/todos/${id}/`, updatedTodo)
      .then(res => {
        console.log(res);
      })
      .catch(err => console.error(err));
  };


  return (
    <div>
      <Navbar />
      <div className="todo-container">
        <TodoSearch
          add_todo={addTodo}
          projectTitle={projectTitle}
        />
        <TodoFilter todos={todos} />
        <TodoList
          todos={todos}
          delete_todo={delTodo}
          updated_todo={updateTodo}
          complete_todo={completeTodo}
        />
      </div>
    </div>
  );
};

export default Home;
