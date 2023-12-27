// AddProjectModal.js
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import toast from 'react-hot-toast';

const AddProjectModal = ({ show, handleClose, handleAddProject }) => {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');

  const handleSave = async () => {
    if (name && link) {
      // Trimite datele către funcția de adăugare a proiectului
      await handleAddProject({ name, link });
      handleClose();
    } else {
      toast.error('Completați toate câmpurile.');
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formProjectName">
            <Form.Label>Project Name</Form.Label>
            <Form.Control type="text" placeholder="Enter project name" value={name} onChange={(e) => setName(e.target.value)} />
          </Form.Group>

          <Form.Group controlId="formProjectLink">
            <Form.Label>Project Link</Form.Label>
            <Form.Control type="text" placeholder="Enter project link" value={link} onChange={(e) => setLink(e.target.value)} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Project
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddProjectModal;