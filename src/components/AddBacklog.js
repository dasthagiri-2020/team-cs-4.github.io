// src/components/AddBacklog.js
import React, { useState } from 'react';
import { db } from '../firebase';
import { TextField, Button, Container, Typography } from '@mui/material';
import styled from 'styled-components';

const FormContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
`;

const AddBacklog = ({ studentId }) => {
    const [backlog, setBacklog] = useState({
        subject: '',
        reason: '',
    });

    const handleChange = (e) => {
        setBacklog({ ...backlog, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await db.collection('students').doc(studentId).collection('backlogs').add(backlog);
            console.log('Backlog added successfully');
        } catch (error) {
            console.error('Error adding backlog: ', error);
        }
    };

    return (
        <FormContainer maxWidth="sm">
            <Typography variant="h4" gutterBottom>Add Backlog</Typography>
            <TextField
                label="Subject"
                name="subject"
                value={backlog.subject}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Reason"
                name="reason"
                value={backlog.reason}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleSubmit}>
                Add Backlog
            </Button>
        </FormContainer>
    );
};

export default AddBacklog;
