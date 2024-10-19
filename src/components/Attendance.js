// src/components/Attendance.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import AttendanceChart from './AttendanceChart';
import { Container, Typography } from '@mui/material';
import styled from 'styled-components';

const AttendanceContainer = styled(Container)`
  margin-top: 50px;
`;

const Attendance = ({ studentId }) => {
    const [attendanceData, setAttendanceData] = useState({ daysAbsent: 0, daysAttended: 0, totalWorkingDays: 0 });

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const studentDoc = await getDoc(doc(db, 'students', studentId));
                if (studentDoc.exists()) {
                    setAttendanceData(studentDoc.data().attendance);
                }
            } catch (error) {
                console.error('Error fetching attendance data: ', error);
            }
        };

        fetchAttendance();
    }, [studentId]);

    return (
        <AttendanceContainer maxWidth="sm">
            <Typography variant="h4" gutterBottom>Attendance</Typography>
            <AttendanceChart attendanceData={attendanceData} />
        </AttendanceContainer>
    );
};

export default Attendance;
