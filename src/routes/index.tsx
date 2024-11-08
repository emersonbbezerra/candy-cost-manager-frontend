import { Routes, Route } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
// import { Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import AddProduct from '../pages/AddProduct';

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