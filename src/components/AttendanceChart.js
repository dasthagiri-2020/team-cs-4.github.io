// src/components/AttendanceChart.js
import React from 'react';
import { Chart } from 'react-google-charts';
import { Container, Typography } from '@mui/material';
import styled from 'styled-components';

const ChartContainer = styled(Container)`
  margin-top: 20px;
`;

const AttendanceChart = ({ attendanceData }) => {
    const data = [
        ['Status', 'Count'],
        ['Present', parseInt(attendanceData.daysAttended, 10)],
        ['Absent', parseInt(attendanceData.daysAbsent, 10)],
    ];

    const options = {
        title: 'Attendance',
        pieHole: 0.4,
        is3D: false,
        slices: {
            0: { color: '#4caf50' },
            1: { color: '#f44336' },
        },
    };

    return (
        <ChartContainer maxWidth="sm">
            <Typography variant="h5" gutterBottom>Attendance Overview</Typography>
            <Chart
                chartType="PieChart"
                data={data}
                options={options}
                width="100%"
                height="400px"
            />
        </ChartContainer>
    );
};

export default AttendanceChart;
