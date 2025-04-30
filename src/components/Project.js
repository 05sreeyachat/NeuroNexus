import React, { useState } from 'react';
import './Project.css';

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    deadline: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProjects((prev) => [...prev, { ...newProject, id: Date.now(), tasks: [] }]);
    setNewProject({ title: '', description: '', deadline: '' });
  };

  return (
    <div className="project-container">
      <h2>Projects</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Project Title"
          value={newProject.title}
          onChange={handleInputChange}
        />
        <textarea
          name="description"
          placeholder="Project Description"
          value={newProject.description}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="deadline"
          value={newProject.deadline}
          onChange={handleInputChange}
        />
        <button type="submit">Create Project</button>
      </form>

      <div className="projects-list">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <p>Deadline: {project.deadline}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Project;