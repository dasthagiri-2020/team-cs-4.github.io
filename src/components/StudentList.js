import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { Container, Typography, List, ListItem, ListItemText, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid } from '@mui/material';
import { Chart } from 'react-google-charts';
import styled from 'styled-components';
import emailjs from 'emailjs-com';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ListContainer = styled(Container)`
  margin-top: 50px;
`;

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [open, setOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [newStudent, setNewStudent] = useState({
        name: '',
        rollNumber: '',
        email: '',
        section: '',
        branch: '',
        address: '',
        dob: '',
        phoneNumber: '',
        parentPhoneNumbers: '',
        photoUrl: '',
        yop: '',
        currentSemester: 1,
        attendance: {
            daysAbsent: '',
            daysAttended: '',
            totalWorkingDays: ''
        },
        examResults: Array.from({ length: 1 }, () => ({
            labsFailed: '',
            labsPassed: '0',
            subjectsFailed: '0',
            subjectsPassed: '0',
            totalLabs: '0',
            totalSubjects: '0'
        }))
    });

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const studentsCollection = collection(db, 'students');
                const studentSnapshot = await getDocs(studentsCollection);
                const studentList = studentSnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ...data,
                        examResults: Array.isArray(data.examResults) ? data.examResults : []
                    };
                });
                setStudents(studentList);
            } catch (error) {
                console.error('Error fetching students: ', error);
            }
        };

        fetchStudents();
    }, []);

    const handleClickOpen = (student) => {
        setSelectedStudent(student);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedStudent(null);
    };

    const handleAddOpen = () => {
        setAddOpen(true);
    };

    const handleAddClose = () => {
        setAddOpen(false);
    };

    const handleAddChange = (e) => {
        const { name, value } = e.target;
        const keys = name.split('.');
        if (keys.length === 1) {
            if (name === 'currentSemester') {
                const semesterCount = parseInt(value, 10);
                setNewStudent({
                    ...newStudent,
                    [name]: semesterCount,
                    examResults: Array.from({ length: semesterCount }, () => ({
                        labsFailed: '',
                        labsPassed: '0',
                        subjectsFailed: '0',
                        subjectsPassed: '0',
                        totalLabs: '0',
                        totalSubjects: '0'
                    }))
                });
            } else {
                setNewStudent({ ...newStudent, [name]: value });
            }
        } else if (keys.length === 2) {
            setNewStudent({
                ...newStudent,
                [keys[0]]: {
                    ...newStudent[keys[0]],
                    [keys[1]]: value
                }
            });
        } else if (keys.length === 3) {
            const [parent, index, child] = keys;
            const updatedExamResults = [...newStudent.examResults];
            updatedExamResults[index] = {
                ...updatedExamResults[index],
                [child]: value
            };
            setNewStudent({
                ...newStudent,
                [parent]: updatedExamResults
            });
        }
    };

    const handleAddSubmit = async () => {
        try {
            const studentToAdd = {
                ...newStudent,
                currentSemester: parseInt(newStudent.currentSemester, 10),
                attendance: {
                    ...newStudent.attendance,
                    daysAbsent: parseInt(newStudent.attendance.daysAbsent, 10),
                    daysAttended: parseInt(newStudent.attendance.daysAttended, 10),
                    totalWorkingDays: parseInt(newStudent.attendance.totalWorkingDays, 10)
                },
                examResults: newStudent.examResults.map(result => ({
                    labsFailed: parseInt(result.labsFailed, 10),
                    labsPassed: parseInt(result.labsPassed, 10),
                    subjectsFailed: parseInt(result.subjectsFailed, 10),
                    subjectsPassed: parseInt(result.subjectsPassed, 10),
                    totalLabs: parseInt(result.totalLabs, 10),
                    totalSubjects: parseInt(result.totalSubjects, 10)
                }))
            };

            await addDoc(collection(db, 'students'), studentToAdd);
            setAddOpen(false);
            setNewStudent({
                name: '',
                rollNumber: '',
                email: '',
                section: '',
                branch: '',
                address: '',
                dob: '',
                phoneNumber: '',
                parentPhoneNumbers: '',
                photoUrl: '',
                yop: '',
                currentSemester: 1,
                attendance: {
                    daysAbsent: '',
                    daysAttended: '',
                    totalWorkingDays: ''
                },
                examResults: Array.from({ length: 1 }, () => ({
                    labsFailed: '',
                    labsPassed: '0',
                    subjectsFailed: '0',
                    subjectsPassed: '0',
                    totalLabs: '0',
                    totalSubjects: '0'
                }))
            });
            // Refresh the student list
            const studentsCollection = collection(db, 'students');
            const studentSnapshot = await getDocs(studentsCollection);
            const studentList = studentSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    examResults: Array.isArray(data.examResults) ? data.examResults : []
                };
            });
            setStudents(studentList);
        } catch (error) {
            console.error('Error adding student: ', error);
        }
    };

    const calculateAttendancePercentage = (attendance) => {
        const { daysAttended, totalWorkingDays } = attendance;
        return (daysAttended / totalWorkingDays) * 100;
    };

    const sendEmail = (student, reason) => {
        const templateParams = {
            to_name: student.name,
            to_email: student.email,
            reason: reason,
            form_link: 'https://forms.gle/your_actual_form_link' // Replace with your actual Google Form link
        };

        emailjs.send('your_service_id', 'your_template_id', templateParams, 'your_public_key')
            .then((response) => {
                console.log('Email sent successfully!', response.status, response.text);
            }, (error) => {
                console.error('Failed to send email.', error);
            });
    };

    const handleSendEmail = (student, type) => {
        if (type === 'attendance') {
            sendEmail(student, 'attendance');
        } else if (type === 'examResults') {
            sendEmail(student, 'exam results');
        }
    };

    return (
        <ListContainer maxWidth="sm">
            <Typography variant="h4" gutterBottom>Student List</Typography>
            <List>
                {students.map(student => (
                    <ListItem key={student.id}>
                        <ListItemText
                            primary={`${student.name} (Roll No: ${student.rollNumber})`}
                            secondary={`Branch: ${student.branch}, Section: ${student.section}`}
                        />
                        <Button variant="outlined" color="primary" onClick={() => handleClickOpen(student)}>
                            View Details
                        </Button>
                    </ListItem>
                ))}
            </List>
            <Button variant="contained" color="primary" onClick={handleAddOpen} style={{ marginTop: '20px' }}>
                Add Student
            </Button>
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>Student Details</DialogTitle>
                <DialogContent>
                    {selectedStudent && (
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <img src={selectedStudent.photoUrl} alt={selectedStudent.name} style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <Typography variant="h6" gutterBottom>Name: {selectedStudent.name}</Typography>
                                <Typography variant="body1" gutterBottom>Roll Number: {selectedStudent.rollNumber}</Typography>
                                <Typography variant="body1" gutterBottom>Branch: {selectedStudent.branch}</Typography>
                                <Typography variant="body1" gutterBottom>Section: {selectedStudent.section}</Typography>
                                <Typography variant="body1" gutterBottom>Address: {selectedStudent.address}</Typography>
                                <Typography variant="body1" gutterBottom>Phone Number: {selectedStudent.phoneNumber}</Typography>
                                <Typography variant="body1" gutterBottom>
                                    Parent Phone Numbers: {Array.isArray(selectedStudent.parentPhoneNumbers) ? selectedStudent.parentPhoneNumbers.join(', ') : selectedStudent.parentPhoneNumbers}
                                </Typography>
                                <Typography variant="body1" gutterBottom>Date of Birth: {new Date(selectedStudent.dob.seconds * 1000).toLocaleDateString()}</Typography>
                                <Typography variant="body1" gutterBottom>Year of Passing: {selectedStudent.yop}</Typography>

                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography variant="h6">Attendance</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant="body1">Days Absent: {selectedStudent.attendance.daysAbsent}</Typography>
                                        <Typography variant="body1">Days Attended: {selectedStudent.attendance.daysAttended}</Typography>
                                        <Typography variant="body1">Total Working Days: {selectedStudent.attendance.totalWorkingDays}</Typography>
                                        <Chart
                                            width={'300px'}
                                            height={'300px'}
                                            chartType="PieChart"
                                            loader={<div>Loading Chart</div>}
                                            data={[
                                                ['Status', 'Percentage'],
                                                ['Attended', selectedStudent.attendance.daysAttended],
                                                ['Absent', selectedStudent.attendance.totalWorkingDays - selectedStudent.attendance.daysAttended],
                                            ]}
                                            options={{
                                                title: 'Attendance Percentage',
                                                pieHole: 0.4,
                                            }}
                                        />
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleSendEmail(selectedStudent, 'attendance')}
                                            disabled={calculateAttendancePercentage(selectedStudent.attendance) >= 75}
                                        >
                                            Send Attendance Email Alert
                                        </Button>
                                    </AccordionDetails>
                                </Accordion>

                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography variant="h6">Exam Results</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {selectedStudent.examResults.map((result, index) => (
                                            <div key={index} style={{ marginBottom: '16px' }}>
                                                <Typography variant="subtitle1">Semester {index + 1}</Typography>
                                                <Typography variant="body1">Labs Failed: {result.labsFailed}</Typography>
                                                <Typography variant="body1">Labs Passed: {result.labsPassed}</Typography>
                                                <Typography variant="body1">Subjects Failed: {result.subjectsFailed}</Typography>
                                                <Typography variant="body1">Subjects Passed: {result.subjectsPassed}</Typography>
                                                <Typography variant="body1">Total Labs: {result.totalLabs}</Typography>
                                                <Typography variant="body1">Total Subjects: {result.totalSubjects}</Typography>
                                                <Chart
                                                    width={'300px'}
                                                    height={'300px'}
                                                    chartType="BarChart"
                                                    loader={<div>Loading Chart</div>}
                                                    data={[
                                                        ['Status', 'Count'],
                                                        ['Labs Passed', result.labsPassed],
                                                        ['Labs Failed', result.labsFailed],
                                                        ['Subjects Passed', result.subjectsPassed],
                                                        ['Subjects Failed', result.subjectsFailed],
                                                    ]}
                                                    options={{
                                                        title: `Semester ${index + 1} Results`,
                                                        chartArea: { width: '50%' },
                                                        hAxis: {
                                                            title: 'Count',
                                                            minValue: 0,
                                                        },
                                                        vAxis: {
                                                            title: 'Status',
                                                        },
                                                    }}
                                                />
                                            </div>
                                        ))}
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleSendEmail(selectedStudent, 'examResults')}
                                            disabled={!selectedStudent.examResults.some(result => result.labsFailed > 0 || result.subjectsFailed > 0)}
                                        >
                                            Send Exam Results Email Alert
                                        </Button>
                                    </AccordionDetails>
                                </Accordion>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={addOpen} onClose={handleAddClose} maxWidth="md" fullWidth>
                <DialogTitle>Add Student</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        name="name"
                        value={newStudent.name}
                        onChange={handleAddChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Roll Number"
                        name="rollNumber"
                        value={newStudent.rollNumber}
                        onChange={handleAddChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Email"
                        name="email"
                        value={newStudent.email}
                        onChange={handleAddChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Section"
                        name="section"
                        value={newStudent.section}
                        onChange={handleAddChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Branch"
                        name="branch"
                        value={newStudent.branch}
                        onChange={handleAddChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Address"
                        name="address"
                        value={newStudent.address}
                        onChange={handleAddChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Date of Birth"
                        name="dob"
                        type="date"
                        value={newStudent.dob}
                        onChange={handleAddChange}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Phone Number"
                        name="phoneNumber"
                        value={newStudent.phoneNumber}
                        onChange={handleAddChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Parent Phone Numbers"
                        name="parentPhoneNumbers"
                        value={newStudent.parentPhoneNumbers}
                        onChange={handleAddChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Photo URL"
                        name="photoUrl"
                        value={newStudent.photoUrl}
                        onChange={handleAddChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Year of Passing"
                        name="yop"
                        value={newStudent.yop}
                        onChange={handleAddChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Current Semester"
                        name="currentSemester"
                        type="number"
                        value={newStudent.currentSemester}
                        onChange={handleAddChange}
                        fullWidth
                        margin="normal"
                    />
                    <Typography variant="h6" gutterBottom>Attendance</Typography>
                    <TextField
                        label="Days Absent"
                        name="attendance.daysAbsent"
                        value={newStudent.attendance.daysAbsent}
                        onChange={handleAddChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Days Attended"
                        name="attendance.daysAttended"
                        value={newStudent.attendance.daysAttended}
                        onChange={handleAddChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Total Working Days"
                        name="attendance.totalWorkingDays"
                        value={newStudent.attendance.totalWorkingDays}
                        onChange={handleAddChange}
                        fullWidth
                        margin="normal"
                    />
                    <Typography variant="h6" gutterBottom>Exam Results</Typography>
                    {newStudent.examResults.map((result, index) => (
                        <div key={index}>
                            <Typography variant="subtitle1">Semester {index + 1}</Typography>
                            <TextField
                                label="Labs Failed"
                                name={`examResults.${index}.labsFailed`}
                                value={result.labsFailed}
                                onChange={handleAddChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Labs Passed"
                                name={`examResults.${index}.labsPassed`}
                                type="number"
                                value={result.labsPassed}
                                onChange={handleAddChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Subjects Failed"
                                name={`examResults.${index}.subjectsFailed`}
                                type="number"
                                value={result.subjectsFailed}
                                onChange={handleAddChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Subjects Passed"
                                name={`examResults.${index}.subjectsPassed`}
                                type="number"
                                value={result.subjectsPassed}
                                onChange={handleAddChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Total Labs"
                                name={`examResults.${index}.totalLabs`}
                                type="number"
                                value={result.totalLabs}
                                onChange={handleAddChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Total Subjects"
                                name={`examResults.${index}.totalSubjects`}
                                type="number"
                                value={result.totalSubjects}
                                onChange={handleAddChange}
                                fullWidth
                                margin="normal"
                            />
                        </div>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddClose} color="primary">Cancel</Button>
                    <Button onClick={handleAddSubmit} color="primary">Add Student</Button>
                </DialogActions>
            </Dialog>
        </ListContainer>
    );
};

export default StudentList;
