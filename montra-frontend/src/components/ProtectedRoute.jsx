import React from 'react';
import {
  Navigate,
  Outlet,
} from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import Loader from './common/Loader';

export const ProtectedRoute = () => {

  const {
    isAuthenticated,
    loading,
  } = useAuth();


  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader />
      </div>
    );
  }


  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  return <Outlet />;
};

export default ProtectedRoute;