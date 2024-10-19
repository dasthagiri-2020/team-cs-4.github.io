// src/components/LandingPage.js
import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const LandingContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
`;

const StyledButton = styled(Button)`
  margin-top: 20px;
`;

const LandingPage = () => {
    const navigate = useNavigate();
    return (
        <LandingContainer maxWidth="md">
            <Typography variant="h2" gutterBottom>Welcome to Student Management System</Typography>
            <Typography variant="h5" gutterBottom>Manage student data, track attendance, and provide counseling all in one place.</Typography>
            <StyledButton variant="contained" color="primary" onClick={() => navigate('/login')}>
                Get Started
            </StyledButton>
        </LandingContainer>
    );
};

export default LandingPage;
