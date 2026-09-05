import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';

import { Dashboard } from './pages/dashboard/Dashboard';
import { Accounts } from './pages/accounts/Accounts';
import { Transactions } from './pages/transactions/Transactions';
import { Categories } from './pages/categories/Categories';
import { Budgets } from './pages/budgets/Budgets';
import { Reports } from './pages/reports/Reports';
import { Settings } from './pages/settings/Settings';

import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router basename={import.meta.env.BASE_URL}>
          <Routes>

            {/* Public Routes */}

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/signup"
              element={<Signup />}
            />

            <Route
              path="/register"
              element={<Signup />}
            />


            {/* Protected Routes */}

            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>

                <Route
                  path="/dashboard"
                  element={<Dashboard />}
                />

                <Route
                  path="/accounts"
                  element={<Accounts />}
                />

                <Route
                  path="/transactions"
                  element={<Transactions />}
                />

                <Route
                  path="/categories"
                  element={<Categories />}
                />

                <Route
                  path="/budgets"
                  element={<Budgets />}
                />

                <Route
                  path="/reports"
                  element={<Reports />}
                />

                <Route
                  path="/settings"
                  element={<Settings />}
                />

              </Route>
            </Route>


            {/* Default Route */}

            <Route
              path="/"
              element={
                <Navigate
                  to="/dashboard"
                  replace
                />
              }
            />


            {/* Unknown Route */}

            <Route
              path="*"
              element={
                <Navigate
                  to="/dashboard"
                  replace
                />
              }
            />

          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;