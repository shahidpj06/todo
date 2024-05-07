import { useState, useEffect } from 'react';
import axios from 'axios'
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import TodoSearch from './components/TodoSearch';
import TodoFilter from './components/TodoFilter';
import TodoList from './components/TodoList';

function App() {
    const [todos, setTodos] = useState([]);
    const [errors, setErrors] = useState("");
    const [pendingTodos, setPendingTodos] = useState([]);
    const [completedTodos, setCompletedTodos] = useState([]);



    useEffect(() => {
      axios.get("http://127.0.0.1:8000/todos/")
      .then(res => setTodos(res.data))
      .catch(err => setErrors(err.message));
    }, []);

    const addTodo = (data) => {
      const originalTodos = [...todos]
      setTodos([ ...todos, data= { ...data, id: parseInt(todos[todos.length-1].id) + 1, status: "Active" }]);
      axios.post("http://127.0.0.1:8000/todos/", data)
      .then(res => setTodos([...todos, res.data]))
      .catch(err => {
        setErrors(err.message)
        setTodos(originalTodos)
      })
    }  


    const delTodo = (id) => {
      setTodos(todos.filter( todo => todo.id != id ))
      const originalTodos = [...todos]
      axios.delete("http://127.0.0.1:8000/todos/" + id)
      .catch(err => {
        setErrors(err.message)
      setTodos(originalTodos)
      })
    }


    const updateTodo = (e, id, text, todo) => {
      e.preventDefault()
      
      const updatedUser = { ...todo, task:text, status: "Active"}
      setTodos(todos.map(t => t.id == id ? updatedUser : t))
      const updatedTodo = {...todo, task:text}
      axios.patch("http://127.0.0.1:8000/todos/" + id, updatedTodo)
    }
    
    const completeTodo = (e, id, todo) => {
      if(e.target.checked){
        setTodos(todos.map(todo => todo.id == id ? { ...todo, status:true }: todo))
        const updatedTodo = { ...todo, status:true}
        axios.patch("http://127.0.0.1:8000/todos/" + id, updatedTodo)
        .then(res => console.log(res))
        .catch(err => console.error(err));
      }
      else
      {
        setTodos(todos.map(todo => todo.id == id ? { ...todo, status:false}: todo))
        const updatedTodo = { ...todo, status:false}
        axios.patch("http://127.0.0.1:8000/todos/" + id, updatedTodo)
      }
  
     
    }

    const filterTodo = (cat_value) => {
      setTodos(todos.filter((todo) => todo.status === cat_value ))
    }

    

  return (
   <div className="todo-container"> 
   {errors && <p>{errors}</p>}
    <TodoSearch add_todo = {addTodo} />
    <TodoFilter todos={todos} />
    <TodoList todos = {todos} delete_todo = {delTodo} updated_todo = {updateTodo} complete_todo = {completeTodo} filter_todo = {filterTodo} />
   </div>
  )
}

export default App;
