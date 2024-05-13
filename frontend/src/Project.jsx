import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProjectAdd from './components/Project/ProjectAdd'; 
import ProjectList from './components/Project/ProjectList';
import Navbar from './components/Navbar';
import api from './services/api'


const Project = () => {
    const [projects, setProjects] = useState([]);
    const [errors, setErrors] = useState("");
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [newProject, setNewProject] = useState({
        title: ''
    });
    const selectProject = (projectId) => {
        setSelectedProjectId(projectId);
    };


    useEffect(() => {
        api.get("projects/")
          .then(res => setProjects(res.data))
          .catch(err => {
               console.error(err);
               setErrors(err.message);
           });
    }, []);
    
    const addProject = (data) => {
        const requestData = { title: data };
        api.post("projects/", requestData)
          .then(res => setProjects([...projects, res.data]))
          .catch(err => {
               console.error(err);
               setErrors(err.message);
           });
    };

    return (
        
        <div>
            <Navbar />
            <div className='main-contaner'>
                <div className="project-container">
                    {errors && <p>{errors}</p>}
                    <ProjectAdd addProject={addProject} newProject={newProject} setNewProject={setNewProject} />
                    <ProjectList projects={projects} selectProject={selectProject} />
                </div>
            </div>
        </div>
    );
};

export default Project;
