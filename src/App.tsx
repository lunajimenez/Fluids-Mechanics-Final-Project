import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import StabilitySimulation from './components/StabilitySimulation';

// Componente para páginas en desarrollo
const ComingSoon: React.FC<{ title: string }> = ({ title }) => (
  <div className="home-container">
    <div className="home-content">
      <h1 className="home-title">{title}</h1>
      <p>Esta sección está en desarrollo. ¡Vuelve pronto para ver el contenido!</p>
      <a href="/" className="topic-link" style={{ marginTop: '20px', display: 'inline-block' }}>
        ← Volver al inicio
      </a>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stability" element={<StabilitySimulation />} />
            
            {/* Rutas de Estabilidad */}
            <Route path="/metacenter" element={<ComingSoon title="Metacentro y Altura Metacéntrica" />} />
            <Route path="/dynamic-stability" element={<ComingSoon title="Estabilidad Dinámica" />} />
            
            {/* Rutas de Hidrostática */}
            <Route path="/archimedes" element={<ComingSoon title="Principio de Arquímedes" />} />
            <Route path="/hydrostatic-pressure" element={<ComingSoon title="Presión Hidrostática" />} />
            
            {/* Rutas de Dinámica */}
            <Route path="/bernoulli" element={<ComingSoon title="Ecuación de Bernoulli" />} />
            <Route path="/pipe-flow" element={<ComingSoon title="Flujo en Tuberías" />} />
            
            {/* Ruta por defecto - redirige a inicio */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 