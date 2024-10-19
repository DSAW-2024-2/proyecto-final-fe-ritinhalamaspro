import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import AddProfilePhoto from './pages/AddProfilePhoto.jsx';
import Role from './pages/Role.jsx';
import RegisterCar from './pages/RegisterCar.jsx';
import AddCarPhoto from './pages/AddCarPhoto.jsx';
import AddSoatPhoto from './pages/AddSoatPhoto.jsx';
import MainPage from './pages/MainPage.jsx';
import Loader from './components/Loader.jsx';
import Switch from './components/Switch.jsx'; // Importa el componente Switch

const App = () => {
  return (
    <Router>
      <div style={{ position: 'relative' }}>
        

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/iniciar-sesion" element={<Login />} />
          <Route path="/registrarse" element={<Register />} />
          <Route path="/agrega-tu-foto" element={<AddProfilePhoto />} />
          <Route path="/rol" element={<Role />} />
          <Route path="/registrar-carro" element={<RegisterCar />} />
          <Route path="/agrega-foto-carro" element={<AddCarPhoto />} />
          <Route path="/agrega-foto-soat" element={<AddSoatPhoto />} />
          <Route path="/pagina-principal" element={<MainPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
