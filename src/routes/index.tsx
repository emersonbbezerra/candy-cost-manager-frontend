import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout';
import AddProduct from '../pages/AddProduct';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import Register from '../pages/Register';
import { PrivateRoute } from './PrivateRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/products/add"
          element={
            <PrivateRoute>
              <AddProduct />
            </PrivateRoute>
          }
        />
      </Route>
    </Routes>
  );
};
