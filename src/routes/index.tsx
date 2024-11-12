import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout';
import AddProduct from '../pages/AddProduct';
import ComponentList from '../pages/ComponentList'; // Importando a nova página de lista de componentes
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import ProductList from '../pages/ProductList'; // Importando a nova página de lista de produtos
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
              <ProductList />
            </PrivateRoute>
          }
        />
        <Route
          path="/components" // Nova rota para a lista de componentes
          element={
            <PrivateRoute>
              <ComponentList />
            </PrivateRoute>
          }
        />
      </Route>
    </Routes>
  );
};
