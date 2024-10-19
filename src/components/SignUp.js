import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { auth } from '../firebase';
import { TextField, Button, Container, Typography, Link } from '@mui/material';
import styled from 'styled-components';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const FormContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
`;

const validationSchema = yup.object({
    email: yup.string().email('Enter a valid email').required('Email is required'),
    password: yup.string().min(6, 'Password should be of minimum 6 characters length').required('Password is required'),
});

const SignUp = () => {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                await createUserWithEmailAndPassword(auth, values.email, values.password);
                navigate('/login'); // Redirect to the login page after successful signup
            } catch (error) {
                console.error("Error signing up:", error);
            }
        },
    });

    return (
        <FormContainer maxWidth="sm">
            <Typography variant="h4" gutterBottom>Sign Up</Typography>
            <form onSubmit={formik.handleSubmit}>
                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Password"
                    name="password"
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                    fullWidth
                    margin="normal"
                />
                <Button variant="contained" color="primary" type="submit">
                    Sign Up
                </Button>
            </form>
            <Typography variant="body2" style={{ marginTop: '20px' }}>
                Already have an account? <Link component={RouterLink} to="/login">Login</Link>
            </Typography>
        </FormContainer>
    );
};

export default SignUp;
