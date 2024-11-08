import { Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout';
import AddProduct from '../pages/AddProduct';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import { PrivateRoute } from './PrivateRoute';

export const AppRoutes = () => {
  console.log('AppRoutes - Renderizando');
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/login" element={<Login />} />
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
          path="/"
          element={
            <PrivateRoute>
              <Dashboard /> {/* ou sua página inicial */}
            </PrivateRoute>
          }
        />
      </Route>
    </Routes>
  );
};
