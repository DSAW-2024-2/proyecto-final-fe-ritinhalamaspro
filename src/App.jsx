import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ProfileInfo from './pages/ProfileInfo.jsx';
import RegisterCar from './pages/RegisterCar.jsx';

const App = () => {
  return (
    <Router>
      <div style={{ position: 'relative' }}>
        

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/iniciar-sesion" element={<Login />} />
          <Route path="/registrarse" element={<Register />} />
          <Route path="/registrar-carro" element={<RegisterCar />} />
          <Route path="/pagina-principal" element={<ProfileInfo />} />
          
        </Routes>
      </div>
    </Router>
  );
};

export default App;
