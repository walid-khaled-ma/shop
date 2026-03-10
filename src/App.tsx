import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { POS } from './pages/POS';
import { Products } from './pages/Products';
import { Categories } from './pages/Categories';
import { Suppliers } from './pages/Suppliers';
import { Purchases } from './pages/Purchases';
import { Sales } from './pages/Sales';
import { Reports } from './pages/Reports';
import { Users } from './pages/Users';
import { Customers } from './pages/Customers';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { DataProvider } from './context/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const RoleRoute = ({ children, roles }: { children: React.ReactNode; roles: string[] }) => {
  const { user } = useAuth();
  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="pos" element={<POS />} />
              <Route 
                path="products" 
                element={
                  <RoleRoute roles={['admin', 'manager']}>
                    <Products />
                  </RoleRoute>
                } 
              />
              <Route 
                path="categories" 
                element={
                  <RoleRoute roles={['admin', 'manager']}>
                    <Categories />
                  </RoleRoute>
                } 
              />
              <Route 
                path="suppliers" 
                element={
                  <RoleRoute roles={['admin', 'manager']}>
                    <Suppliers />
                  </RoleRoute>
                } 
              />
              <Route 
                path="purchases" 
                element={
                  <RoleRoute roles={['admin', 'manager']}>
                    <Purchases />
                  </RoleRoute>
                } 
              />
              <Route path="sales" element={<Sales />} />
              <Route path="customers" element={<Customers />} />
              <Route 
                path="reports" 
                element={
                  <RoleRoute roles={['admin', 'manager']}>
                    <Reports />
                  </RoleRoute>
                } 
              />
              <Route 
                path="users" 
                element={
                  <RoleRoute roles={['admin']}>
                    <Users />
                  </RoleRoute>
                } 
              />
              <Route 
                path="settings" 
                element={
                  <RoleRoute roles={['admin']}>
                    <Settings />
                  </RoleRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}
