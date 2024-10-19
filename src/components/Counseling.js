// src/components/Counseling.js
import React from 'react';
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';
import styled from 'styled-components';

const CounselingContainer = styled(Container)`
  margin-top: 50px;
`;

const Counseling = ({ attendanceData }) => {
    const attendancePercentage = (attendanceData.present / (attendanceData.present + attendanceData.absent)) * 100;

    return (
        <CounselingContainer maxWidth="sm">
            <Typography variant="h4" gutterBottom>Counseling</Typography>
            {attendancePercentage < 75 ? (
                <div>
                    <Typography variant="body1">Your attendance is below 75%. Here are some tips to improve:</Typography>
                    <List>
                        <ListItem>
                            <ListItemText primary="Attend all classes regularly." />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Inform your teachers in advance if you need to miss a class." />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Participate in class activities to stay engaged." />
                        </ListItem>
                    </List>
                </div>
            ) : (
                <Typography variant="body1">Your attendance is satisfactory. Keep it up!</Typography>
            )}
        </CounselingContainer>
    );
};

export default Counseling;
