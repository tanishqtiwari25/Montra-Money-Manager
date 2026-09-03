import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { ProtectedRoute } from './components/ProtectedRoute';

// Agar Dashboard component pages/dashboard folder ke andar hai:
import { Dashboard } from './pages/dashboard/Dashboard'; 
// (Agar file ka naam Dashboard.jsx hai aur direct pages/ me hai to './pages/Dashboard.jsx' karo)

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;