import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

const Navbar = () => {
    const [user] = useAuthState(auth);
    const navigate = useNavigate();

    const handleLogout = () => {
        auth.signOut().then(() => {
            navigate('/login');
        });
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu">
                    <MenuIcon />
                </IconButton>
                <img src={process.env.PUBLIC_URL + '/images/logo.jpg'} alt="College Logo" style={{ width: '50px', marginRight: '10px' }} />
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Student Management
                </Typography>
                {user ? (
                    <>
                        <Button color="inherit" component={Link} to="/">Home</Button>
                        <Button color="inherit" component={Link} to="/students">Students</Button>
                        <Button color="inherit" onClick={handleLogout}>Logout</Button>
                    </>
                ) : (
                    <>
                        <Button color="inherit" component={Link} to="/signup">Sign Up</Button>
                        <Button color="inherit" component={Link} to="/login">Login</Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
