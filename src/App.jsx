
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import AddProfilePhoto from './pages/AddProfilePhoto.jsx';
import AddPhoto from './components/AddPhoto.jsx';

import Loader from './components/Loader.jsx';



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/iniciar-sesion" element={<Login />} />
        <Route path="/registrarse" element={<Register />} />
        <Route path="/agrega-tu-foto" element={<AddProfilePhoto />} />


      </Routes>
    </Router>
  );
};

export default App;
