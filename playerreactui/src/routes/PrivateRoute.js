// src/components/Dashboard/ProtectedRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const userToken = sessionStorage.getItem('userToken');

  return userToken ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;