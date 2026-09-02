import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { PublicRoute } from './PublicRoute';
import { ProtectedRoute } from './ProtectedRoute';

import { DashboardLayout } from '../layouts/DashboardLayout';

import { Login } from '../pages/auth/Login';
import { Signup } from '../pages/auth/Signup';
import { Dashboard } from '../pages/dashboard/Dashboard';
import { Transactions } from '../pages/transactions/Transactions';
import { Accounts } from '../pages/accounts/Accounts';
import { Budgets } from '../pages/budgets/Budgets';
import { Reports } from '../pages/reports/Reports';
import { Settings } from '../pages/settings/Settings';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/register" element={<Signup />} />
      </Route>

      {/* Protected SaaS App Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      {/* Fallback Redirect */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};