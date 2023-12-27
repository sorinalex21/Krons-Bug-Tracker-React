import React, { useState, useEffect } from 'react';
import { Button, Card, Accordion } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import verifyToken from './authService';

import Sidebar from './SidebarMenu';
import Header from './Header';
import AddProjectModal from './ProjectModal';

const ProjectsListPage = () => {
  const [projects, setProjects] = useState([]);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/projects');
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error.message);
      toast.error('Error fetching projects');
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAddProject = async (projectData) => {
    try {
      // Adaugă un nou proiect folosind API-ul de pe ruta api/projects
      const date = await verifyToken();
      projectData.userId = date.user.id; //ca sa nu mai apelez inutil o noua verificare de token in modal, ne folosim de api.
      const response = await fetch('http://localhost:8080/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        toast.success('Project added successfully.');
        fetchProjects(); // Reîncarcă lista de proiecte după adăugarea unui proiect nou
      } else {
        throw new Error('Failed to add project');
      }
    } catch (error) {
      console.error('Error adding project:', error.message);
      toast.error('Error adding project');
    }
  };

  const handleEditProject = (projectId) => {
    // Implementează logica pentru editare proiect
    console.log(`Edit project with ID ${projectId}`);
  };

  const handleAddMember = (projectId) => {
    // Implementează logica pentru adăugare membru la proiect
    console.log(`Add member to project with ID ${projectId}`);
  };

  const handleDeleteProject = (projectId) => {
    // Implementează logica pentru ștergere proiect
    console.log(`Delete project with ID ${projectId}`);
  };

  const handleShowAddProjectModal = () => {
    setShowAddProjectModal(true);
  };

  const handleCloseAddProjectModal = () => {
    setShowAddProjectModal(false);
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-grow-1">
        {/* Header */}
        <Header />
        <main className="container-fluid p-3">
          <h1>Projects List</h1>

          <Button variant="primary" className="mb-3" onClick={handleShowAddProjectModal}>
            Add New Project
          </Button>

          <Accordion>
            {projects.map((project) => (
              <Accordion.Item key={project.id} eventKey={project.id.toString()}>
                <Accordion.Header>{project.name}</Accordion.Header>
                <Accordion.Body>
                  <Card className="mb-3">
                    <Card.Header>{project.name}</Card.Header>
                    <Card.Body>
                      <Card.Text>
                        <strong>Id:</strong> {project.id}<br />
                        <strong>Link:</strong> {project.link}<br />
                        <strong>Created By:</strong> {project.userId}
                      </Card.Text>
                      <Button variant="success" onClick={() => handleAddMember(project.id)}>
                        Manage Members
                      </Button>{' '}
                      <Button variant="warning" onClick={() => handleEditProject(project.id)}>
                        Edit Project
                      </Button>{' '}
                      <Button variant="danger" onClick={() => handleDeleteProject(project.id)}>
                        Delete Project
                      </Button>
                    </Card.Body>
                  </Card>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>

          {/* Modal pentru adăugarea unui nou proiect */}
          <AddProjectModal
            show={showAddProjectModal}
            handleClose={handleCloseAddProjectModal}
            handleAddProject={handleAddProject}
          />
        </main>
      </div>
    </div>
  );
};

export default ProjectsListPage;