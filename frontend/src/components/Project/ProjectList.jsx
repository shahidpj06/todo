import React from 'react';
import { Link } from 'react-router-dom';

const ProjectList = ({ projects }) => {
  return (
    <div className="project-container">
      <div className="project-list">
        <h2>Projects</h2>
        <ul>
          {projects.map((project) => (
            <li key={project.id}>
              <Link to={`${project.id}`} className="project-box-link">
                <div className="project-box">
                  {project.title}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div> 
  );
};

export default ProjectList;
