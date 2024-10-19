// src/components/AddStudent.js
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

const AddStudent = () => {
    const [student, setStudent] = useState({
        name: '',
        section: '',
        branch: '',
        address: '',
        dob: '',
        phoneNumber: '',
        parentPhoneNumbers: '',
        photoUrl: '',
        yop: '',
        attendance: {
            daysAbsent: '',
            daysAttended: '',
            totalWorkingDays: ''
        },
        examResults: {
            sem1: {
                labsFailed: '',
                labsPassed: 0,
                subjectsFailed: 0,
                subjectsPassed: 0,
                totalLabs: 0,
                totalSubjects: 0
            },
            sem2: {
                labsFailed: '',
                labsPassed: 0,
                subjectsFailed: 0,
                subjectsPassed: 0,
                totalLabs: 0,
                totalSubjects: 0
            }
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStudent({ ...student, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await db.collection('students').add(student);
            console.log('Student added successfully');
        } catch (error) {
            console.error('Error adding student: ', error);
        }
    };

    return (
        <FormContainer maxWidth="sm">
            <Typography variant="h4" gutterBottom>Add Student</Typography>
            <TextField
                label="Name"
                name="name"
                value={student.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Section"
                name="section"
                value={student.section}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Branch"
                name="branch"
                value={student.branch}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Address"
                name="address"
                value={student.address}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Date of Birth"
                name="dob"
                type="date"
                value={student.dob}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
            />
            <TextField
                label="Phone Number"
                name="phoneNumber"
                value={student.phoneNumber}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Parent Phone Numbers"
                name="parentPhoneNumbers"
                value={student.parentPhoneNumbers}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Photo URL"
                name="photoUrl"
                value={student.photoUrl}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Year of Passing"
                name="yop"
                value={student.yop}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <Typography variant="h6" gutterBottom>Attendance</Typography>
            <TextField
                label="Days Absent"
                name="attendance.daysAbsent"
                value={student.attendance.daysAbsent}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Days Attended"
                name="attendance.daysAttended"
                value={student.attendance.daysAttended}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Total Working Days"
                name="attendance.totalWorkingDays"
                value={student.attendance.totalWorkingDays}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <Typography variant="h6" gutterBottom>Exam Results - Semester 1</Typography>
            <TextField
                label="Labs Failed"
                name="examResults.sem1.labsFailed"
                value={student.examResults.sem1.labsFailed}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Labs Passed"
                name="examResults.sem1.labsPassed"
                type="number"
                value={student.examResults.sem1.labsPassed}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Subjects Failed"
                name="examResults.sem1.subjectsFailed"
                type="number"
                value={student.examResults.sem1.subjectsFailed}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Subjects Passed"
                name="examResults.sem1.subjectsPassed"
                type="number"
                value={student.examResults.sem1.subjectsPassed}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Total Labs"
                name="examResults.sem1.totalLabs"
                type="number"
                value={student.examResults.sem1.totalLabs}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Total Subjects"
                name="examResults.sem1.totalSubjects"
                type="number"
                value={student.examResults.sem1.totalSubjects}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <Typography variant="h6" gutterBottom>Exam Results - Semester 2</Typography>
            <TextField
                label="Labs Failed"
                name="examResults.sem2.labsFailed"
                value={student.examResults.sem2.labsFailed}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Labs Passed"
                name="examResults.sem2.labsPassed"
                type="number"
                value={student.examResults.sem2.labsPassed}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Subjects Failed"
                name="examResults.sem2.subjectsFailed"
                type="number"
                value={student.examResults.sem2.subjectsFailed}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Subjects Passed"
                name="examResults.sem2.subjectsPassed"
                type="number"
                value={student.examResults.sem2.subjectsPassed}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Total Labs"
                name="examResults.sem2.totalLabs"
                type="number"
                value={student.examResults.sem2.totalLabs}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Total Subjects"
                name="examResults.sem2.totalSubjects"
                type="number"
                value={student.examResults.sem2.totalSubjects}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleSubmit}>
                Add Student
            </Button>
        </FormContainer>
    );
};

export default AddStudent;
