import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProjectAdd from './components/Project/ProjectAdd'; 
import ProjectList from './components/Project/ProjectList';
import Logout from './components/Auth/LogoutModal';
import Navbar from './components/Navbar';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
});

api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

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
            <div className="project-container">
                {errors && <p>{errors}</p>}
                <ProjectAdd addProject={addProject} newProject={newProject} setNewProject={setNewProject} />
                <ProjectList projects={projects} selectProject={selectProject} />
                <Logout />
            </div>
        </div>
    );
};

export default Project;
