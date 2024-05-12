import React, { useState, useRef } from 'react'
import { FaRegEdit } from 'react-icons/fa';
import { MdDeleteOutline } from 'react-icons/md';
import moment from 'moment';
import { useForm } from 'react-hook-form'

  const TodoList = ({ todos, delete_todo, updated_todo, complete_todo }) => {

  let taskRef = useRef(null);
  let[ todoId, setTodoId ] = useState(0);
  let[ toggle, setToggle ] = useState(false);
  let[ task, setTask ] = useState("");
  let[ todo, setTodo ] = useState({});

  const todoItem = (task, id, todo) => {
    setTodoId(id);
    setTask(task);
    setToggle(true);
    setTodo(todo);
  };

  const completedTodos = todos.filter(todo => todo.status);
  const pendingTodos = todos.filter(todo => !todo.status);
  
  return (
    <>
    <div className="todo-list">
        <h4>Pending</h4>
        {pendingTodos.map((todo, index) => (
          <div className='todo-list-item' key={index}>
            <div className="task">
              <input type="checkbox" onChange={(e) => complete_todo(e, todo.id, todo)} checked={todo.status} />
              <p id="t_task">{todo.task}</p>
            </div>
            <div className='task'>
            <p>{todo.updated_date ? moment(todo.updated_date).format("h:mm a, Do MMMM YYYY") : moment(todo.created_date).format("h:mm a, Do MMMM YYYY")}</p>
            </div>
            <div className="btn-container">
              <div className="edit"><FaRegEdit size={18} onClick={(e) => todoItem(todo.task, todo.id, todo)} /></div>
              <div className="del"><MdDeleteOutline size={20} onClick={() => delete_todo(todo.id)} /></div>
            </div>
          </div>
        ))}
      </div>
      <br />

      <div className="todo-list">
        <h4>Completed</h4>
        {completedTodos.map((todo, index) => (
          <div className='todo-list-item' key={index}>
            <div className="task">
              <input type="checkbox" onChange={(e) => complete_todo(e, todo.id, todo)} checked={todo.status} />
              <p id="t_task" className="completed">{todo.task}</p>
            </div>
            <div className='task'>
            <p>{todo.updated_date ? moment(todo.updated_date).format("h:mm a, Do MMMM YYYY") : moment(todo.created_date).format("h:mm a, Do MMMM YYYY")}</p>
            </div>
            <div className="btn-container">
              <div className="edit"><FaRegEdit size={18} onClick={(e) => todoItem(todo.task, todo.id, todo)} /></div>
              <div className="del"><MdDeleteOutline size={20} onClick={() => delete_todo(todo.id)} /></div>
            </div>
          </div>
        ))}
      </div>

      {toggle && (
        <div className="modal-container">
          <div className="modal">
            <h1>Update Form</h1>
            <form action="" onSubmit={(e)=> {updated_todo(e, todoId, task); setToggle(false)} }>
              <input type="text" ref={taskRef}
                placeholder='Update Todo'
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />
              {errors.task && <small>{errors.task.message}</small>}
              <button id='add'>Add</button>
            </form>
            <div className="btn-container">
              <button className='cancel mod-btn' onClick={()=> setToggle(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}



        </>

  )        
}
      

export default TodoList