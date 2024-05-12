import React from 'react';
import { useForm } from 'react-hook-form';

const ProjectAdd = ({ addProject }) => {
  const { register, handleSubmit, reset, formState:{ errors } } = useForm();

  const onSubmit = (data) => {
    addProject(data.title);
    reset();
  };

  return (
    <div className="project-container">
      <div className="project-add">
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            placeholder="Enter Project Title"
            {...register("title", { required: true })}
          />
          <button>New Project</button>
        </form>
        {errors.title && <small>This field is required</small>}
        <br />
      </div>
    </div>  
  );
};

export default ProjectAdd;
