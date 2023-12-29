// BugDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, Spinner } from 'react-bootstrap';
import Sidebar from './SidebarMenu';
import Header from './Header';
import toast, { Toaster } from 'react-hot-toast';

import './sidebar.css';
import ConfirmationModal from './ConfirmationModal';
import verifyToken from './authService';

const BugDetails = () => {
  const { id } = useParams();
  const [bugDetails, setBugDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const fetchBugDetails = async () => {
      try {

        const tokenVerification = await verifyToken();
        if (tokenVerification.success) {
          setCurrentUser(tokenVerification.user);
        } else {
          console.error('Failed to verify token:', tokenVerification.error);
        }

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


  const handleMarkAsFixedClick = () => {
    // Implementează logica pentru marcarea bug-ului ca rezolvat
    console.log('Mark as Fixed');
  };

  const handleCommentClick = () => {
    // Implementează logica pentru adăugare comentariu
    console.log('Comment');
  };

  const handleAssignClick = () => {
    setShowAssignModal(true);
  };

  const [showAssignModal, setShowAssignModal] = useState(false);
  const handleAssignConfirm = async () => {
    try {
      // Faceți solicitarea API pentru a obține cele mai recente informații despre bug
      const bugResponse = await fetch(`http://localhost:8080/api/bug/${id}`);
      const bugData = await bugResponse.json();
  
      // Verificăm dacă bugul este deja atribuit
      if (bugData.allocatedto) {
        toast.error('Bug already assigned to someone else');
        return;
      }
  
      // Faceți o altă solicitare API pentru a atribui bug-ul utilizatorului curent
      const response = await fetch(`http://localhost:8080/api/bugs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...bugData,  // Utilizăm cele mai recente informații despre bug
          allocatedto: currentUser.id,
        }),
      });
  
      if (response.ok) {
        // Actualizați starea bug-ului pentru a reflecta atribuirea
        setBugDetails((prevDetails) => ({
          ...prevDetails,
          ...bugData,  // Actualizăm cu cele mai recente informații
          allocatedto: currentUser.id,
        }));
  
        // Închideți modalul de confirmare
        setShowAssignModal(false);
        toast.success('Bug-ul ți-a fost atribuit cu succes!');
      } else {
        toast.error('Failed to assign bug');
      }
    } catch (error) {
      toast.error('Error assigning bug:', error.message);
    }
  };

  const handleAssignCancel = () => {
    // Închideți modalul de confirmare fără a face nicio acțiune
    setShowAssignModal(false);
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
                <Button variant="success" onClick={handleAssignClick}>
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
                <ConfirmationModal
                  show={showAssignModal}
                  handleClose={handleAssignCancel}
                  handleConfirm={handleAssignConfirm}
                  itemName="Assign this bug to yourself?"
                  itemTitle="Assign Bug"
                />
          </Card.Body>
        </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default BugDetails;