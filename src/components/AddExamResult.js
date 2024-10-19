// src/components/AddExamResult.js
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

const AddExamResult = ({ studentId }) => {
    const [examResult, setExamResult] = useState({
        semester: '',
        subject: '',
        marks: '',
    });

    const handleChange = (e) => {
        setExamResult({ ...examResult, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await db.collection('students').doc(studentId).collection('examResults').add(examResult);
            console.log('Exam result added successfully');
        } catch (error) {
            console.error('Error adding exam result: ', error);
        }
    };

    return (
        <FormContainer maxWidth="sm">
            <Typography variant="h4" gutterBottom>Add Exam Result</Typography>
            <TextField
                label="Semester"
                name="semester"
                value={examResult.semester}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Subject"
                name="subject"
                value={examResult.subject}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Marks"
                name="marks"
                type="number"
                value={examResult.marks}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleSubmit}>
                Add Exam Result
            </Button>
        </FormContainer>
    );
};

export default AddExamResult;
