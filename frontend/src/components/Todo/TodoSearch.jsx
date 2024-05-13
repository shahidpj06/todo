import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

const TodoSearch = ({ add_todo }) => {
  const { register, handleSubmit, reset, formState:{ errors } } = useForm()
  
  return (
    <div className="todo-search">
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