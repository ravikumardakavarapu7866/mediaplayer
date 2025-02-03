// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../src/components/LoginPage/loginPage';
import PageNotFound from '../src/components/ErrorPages/PageNotFound';
import Dashboard from './components/Dashbord/dashbord';
import PlayerContainer from './components/Player/PlayerContainer';
import ProtectedRoute from './routes/PrivateRoute';

const App = () => {
  return (
    <Router basename="/playerreact">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path='/player' element={<PlayerContainer />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
};

export default App;