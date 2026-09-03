import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { config } from '../config/config';
import { storage } from '../utils/storage';

export const ProtectedRoute = () => {
  const token = storage.get(config.storageKeys.AUTH_TOKEN);

  // Token nahi hai to Login par redirect karo
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};