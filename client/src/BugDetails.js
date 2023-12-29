// BugDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, Spinner } from 'react-bootstrap';
import Sidebar from './SidebarMenu';
import Header from './Header';
import { Toaster } from 'react-hot-toast';

import './sidebar.css';

const BugDetails = () => {
  const { id } = useParams();
  const [bugDetails, setBugDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBugDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/bug/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch bug details');
        }

        const bugData = await response.json();
        setBugDetails(bugData);
        } catch (error) {
        console.error('Error fetching bug details:', error.message);
        } finally {
        setLoading(false);
      }
    };

    fetchBugDetails();
  }, [id]);

  const handleEditClick = () => {
    // Implementează logica pentru editare
    console.log('Edit bug');
  };

  const handleAssignToMeClick = () => {
    // Implementează logica pentru alocare la tine
    console.log('Assign to Me');
  };

  const handleMarkAsFixedClick = () => {
    // Implementează logica pentru marcarea bug-ului ca rezolvat
    console.log('Mark as Fixed');
  };

  const handleCommentClick = () => {
    // Implementează logica pentru adăugare comentariu
    console.log('Comment');
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-grow-1">
        {/* Header */}
        <Header />

        {/* Conținut principal */}
        <main className="container-fluid p-3">
        <Toaster />
          {loading && <div>Loading...</div>}

          {!loading && (
            <Card>
          <Card.Body>
            <Card.Title>
                <span className={`status-indicator ${bugDetails.status.toLowerCase()}`}>
                    {bugDetails.status}
                </span>
                - {bugDetails.name}
                </Card.Title>
            <Card.Text>
              <strong>Priority:</strong> {bugDetails.priority}
              <br />
              <strong>Creation Date:</strong> {bugDetails.creationdate}
            
              <br />
              <strong>Commit Link:</strong> {bugDetails.commitLink || 'N/A'}
              <br />
              <strong>Allocated To:</strong> {bugDetails.allocatedto || 'Bugul nu este alocat'}
              <br />
              <strong>Created By:</strong> {bugDetails.userId}
              <br />
              <strong>Project ID:</strong> {bugDetails.projectId}
              <br />
              <strong>Description:</strong> {bugDetails.description}
            </Card.Text>
                <Button variant="success" onClick={handleAssignToMeClick}>
                  Assign to Me
                </Button> {' '}
                <Button variant="warning" onClick={handleEditClick}>
                  Edit
                </Button> {' '}
                <Button variant="secondary" onClick={handleMarkAsFixedClick}>
                  Mark as Fixed
                </Button> {' '}
                <Button variant="primary" onClick={handleCommentClick}>
                  Comment
                </Button>
          </Card.Body>
        </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default BugDetails;