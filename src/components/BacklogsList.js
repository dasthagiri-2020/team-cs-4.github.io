// src/components/BacklogsList.js
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';
import styled from 'styled-components';

const ListContainer = styled(Container)`
  margin-top: 50px;
`;

const BacklogsList = ({ studentId }) => {
    const [backlogs, setBacklogs] = useState([]);

    useEffect(() => {
        const fetchBacklogs = async () => {
            const backlogsCollection = await db.collection('students').doc(studentId).collection('backlogs').get();
            setBacklogs(backlogsCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };

        fetchBacklogs();
    }, [studentId]);

    return (
        <ListContainer maxWidth="sm">
            <Typography variant="h4" gutterBottom>Backlogs</Typography>
            <List>
                {backlogs.map(backlog => (
                    <ListItem key={backlog.id}>
                        <ListItemText primary={`${backlog.subject}: ${backlog.reason}`} />
                    </ListItem>
                ))}
            </List>
        </ListContainer>
    );
};

export default BacklogsList;
