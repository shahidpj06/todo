import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

const TodoSearch = ({ add_todo, projectTitle }) => {
  const { register, handleSubmit, reset, formState:{ errors } } = useForm()
  
  return (
    <div className="todo-search">
      <div className='project-title'>
        <h1>{projectTitle}</h1>
      </div>
        <form action="" onSubmit={handleSubmit((data) => {
          add_todo(data);
          reset()
          })}>
            <input
              type="text" placeholder='Enter Todo' 
              {...register("task", { 
                required: "This field is required",
                validate: value => value.trim() !== "" || "This field cannot be empty"
              })}
            />
            <button>Add</button>    
        </form>   
          {errors.task && <small>{errors.task.message}</small>}
        
    </div>
    
  );
  
  
}

export default TodoSearch