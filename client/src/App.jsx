import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Attendance from './pages/Attendance';
import Performance from './pages/Performance';
import Employees from './pages/Employees';
import Chat from './pages/Chat';
import Navbar from './components/layout/Navbar';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const AppLayout = ({ children }) => (
  <div className="min-h-screen overflow-x-hidden bg-slate-50">
    <Navbar />
    <main className="mx-auto min-w-0 max-w-7xl px-3 py-4 sm:px-6 sm:py-8 lg:px-8">{children}</main>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><AppLayout><Dashboard /></AppLayout></PrivateRoute>} />
          <Route path="/students" element={<PrivateRoute><AppLayout><Students /></AppLayout></PrivateRoute>} />
          <Route path="/attendance" element={<PrivateRoute><AppLayout><Attendance /></AppLayout></PrivateRoute>} />
          <Route path="/performance" element={<PrivateRoute><AppLayout><Performance /></AppLayout></PrivateRoute>} />
          <Route path="/employees" element={<PrivateRoute><AppLayout><Employees /></AppLayout></PrivateRoute>} />
          <Route path="/chat" element={<PrivateRoute><AppLayout><Chat /></AppLayout></PrivateRoute>} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
