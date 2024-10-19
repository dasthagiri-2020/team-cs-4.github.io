import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import SignUp from './components/SignUp';
import Login from './components/Login';
import AddStudent from './components/AddStudent';
import StudentList from './components/StudentList';
import LandingPage from './components/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/add-student" element={
            <ProtectedRoute>
              <AddStudent />
            </ProtectedRoute>
          } />
          <Route path="/students" element={
            <ProtectedRoute>
              <StudentList />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
