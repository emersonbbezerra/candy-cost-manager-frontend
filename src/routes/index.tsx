import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout';
import AddComponent from '../pages/AddComponent';
import AddProduct from '../pages/AddProduct';
import Dashboard from '../pages/Dashboard';
import ListComponents from '../pages/ListComponents';
import ListProducts from '../pages/ListProducts';
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
        <Route
          path="/products" // Nova rota para a lista de produtos
          element={
            <PrivateRoute>
              <ListProducts />
            </PrivateRoute>
          }
        />
        <Route
          path="/components/add"
          element={
            <PrivateRoute>
              <AddComponent />
            </PrivateRoute>
          }
        />
        <Route
          path="/components" // Nova rota para a lista de componentes
          element={
            <PrivateRoute>
              <ListComponents />
            </PrivateRoute>
          }
        />
      </Route>
    </Routes>
  );
};
