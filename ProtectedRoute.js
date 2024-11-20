import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, isAuth, redirectPath = '/pagina-principal' }) => {
  if (isAuth) {
    return <Navigate to={redirectPath} replace />;
  }
  return element;
};

export default ProtectedRoute;
