import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardShell from './components/layout/DashboardShell';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Attendance from './pages/Attendance';
import Performance from './pages/Performance';
import Employees from './pages/Employees';
import Chat from './pages/Chat';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><DashboardShell><Dashboard /></DashboardShell></PrivateRoute>} />
          <Route path="/students" element={<PrivateRoute><DashboardShell><Students /></DashboardShell></PrivateRoute>} />
          <Route path="/attendance" element={<PrivateRoute><DashboardShell><Attendance /></DashboardShell></PrivateRoute>} />
          <Route path="/performance" element={<PrivateRoute><DashboardShell><Performance /></DashboardShell></PrivateRoute>} />
          <Route path="/employees" element={<PrivateRoute><DashboardShell><Employees /></DashboardShell></PrivateRoute>} />
          <Route path="/chat" element={<PrivateRoute><DashboardShell><Chat /></DashboardShell></PrivateRoute>} />
          <Route path="/" element={<Landing />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
