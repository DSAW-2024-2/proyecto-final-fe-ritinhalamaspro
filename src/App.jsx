// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';


import LandingPage from './pages/LandingPage.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ProfileInfo from './pages/ProfileInfo.jsx';
import RegisterCar from './pages/RegisterCar.jsx';
import Header from './components/header/Header.jsx';
import Home from './components/home/Home.jsx';
import CreateTrip from './components/trips/CreateTrip.jsx';
import CreatedTrips from './components/trips/CreatedTrips.jsx';
import ReservedTrips from './components/trips/ReservedTrips.jsx';
import GoogleMapsProvider from './components/common/GoogleMapsProvider.jsx';



const App = () => {
  return (
    <GoogleMapsProvider>
    <Router>    
      <div className="main-content">
        <Header/>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/iniciar-sesion" element={<Login />} />
          <Route path="/registrarse" element={<Register />} />
          <Route path="/registrar-carro" element={<RegisterCar />} />
          <Route path="/pagina-principal" element={<ProfileInfo />} />
          <Route path="/home" element={<Home />} />
          <Route path="/create-trip" element={<CreateTrip/>}/>
          <Route path="/created-trips" element={<CreatedTrips/>}/>
          <Route path="/reserved-trips" element={<ReservedTrips/>}/>

        </Routes>

      </div>
    </Router>
    </GoogleMapsProvider>
  );
};

export default App;
