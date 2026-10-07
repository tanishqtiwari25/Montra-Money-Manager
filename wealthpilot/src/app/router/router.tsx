import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Skeleton } from '@shared/ui';
import { AppShell } from '../ui/AppShell';
const Dashboard = lazy(() => import('@pages/dashboard').then(module => ({ default: module.DashboardPage })));
const Transactions = lazy(() => import('@pages/transactions').then(module => ({ default: module.TransactionsPage })));
const Accounts = lazy(() => import('@pages/accounts').then(module => ({ default: module.AccountsPage })));
const Budgets = lazy(() => import('@pages/budgets').then(module => ({ default: module.BudgetsPage })));
const Loans = lazy(() => import('@pages/loans').then(module => ({ default: module.LoansPage })));
const Goals = lazy(() => import('@pages/goals').then(module => ({ default: module.GoalsPage })));
const Reports = lazy(() => import('@pages/reports').then(module => ({ default: module.ReportsPage })));
const Settings = lazy(() => import('@pages/settings').then(module => ({ default: module.SettingsPage })));
const AskCfo = lazy(() => import('@pages/ask-cfo').then(module => ({ default: module.AskCfoPage })));
export function AppRouter() { return <BrowserRouter basename={import.meta.env.BASE_URL}><Suspense fallback={<div className="mx-auto max-w-6xl space-y-5 p-8"><Skeleton className="h-12 w-72" /><Skeleton className="h-80" /></div>}><Routes><Route element={<AppShell />}><Route index element={<Navigate to="/dashboard" replace />} /><Route path="dashboard" element={<Dashboard />} /><Route path="transactions" element={<Transactions />} /><Route path="accounts" element={<Accounts />} /><Route path="budgets" element={<Budgets />} /><Route path="loans" element={<Loans />} /><Route path="goals" element={<Goals />} /><Route path="reports" element={<Reports />} /><Route path="settings" element={<Settings />} /><Route path="ask-cfo" element={<AskCfo />} /><Route path="*" element={<Navigate to="/dashboard" replace />} /></Route></Routes></Suspense></BrowserRouter>; }
