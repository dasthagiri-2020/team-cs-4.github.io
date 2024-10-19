// src/components/ExamResultsList.js
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';
import styled from 'styled-components';

const ListContainer = styled(Container)`
  margin-top: 50px;
`;

const ExamResultsList = ({ studentId }) => {
    const [examResults, setExamResults] = useState([]);

    useEffect(() => {
        const fetchExamResults = async () => {
            const examResultsCollection = await db.collection('students').doc(studentId).collection('examResults').get();
            setExamResults(examResultsCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };

        fetchExamResults();
    }, [studentId]);

    return (
        <ListContainer maxWidth="sm">
            <Typography variant="h4" gutterBottom>Exam Results</Typography>
            <List>
                {examResults.map(result => (
                    <ListItem key={result.id}>
                        <ListItemText primary={`${result.semester} - ${result.subject}: ${result.marks}`} />
                    </ListItem>
                ))}
            </List>
        </ListContainer>
    );
};

export default ExamResultsList;
