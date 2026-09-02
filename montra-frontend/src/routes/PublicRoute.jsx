import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const PublicRoute = () => {
  const { user } = useAuth();

  return !user ? <Outlet /> : <Navigate to="/dashboard" replace />;
};