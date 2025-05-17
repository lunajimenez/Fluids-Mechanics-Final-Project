import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Bienvenido al Curso de Mecánica de Fluidos</h1>
      <div className="home-content">
        <p>
          Explora conceptos fundamentales de la mecánica de fluidos a través de simulaciones
          interactivas y visualizaciones dinámicas.
        </p>
        
        <div className="topic-grid">
          <div className="topic-card">
            <h2 className="topic-title">Estabilidad de Cuerpos Sumergidos</h2>
            <p className="topic-description">
              Aprende sobre la estabilidad de cuerpos flotantes y cómo la posición relativa
              del centro de gravedad y centro de flotación afecta su comportamiento.
            </p>
            <a href="/stability" className="topic-link">Ir a la simulación →</a>
          </div>

          <div className="topic-card">
            <h2 className="topic-title">Principio de Arquímedes</h2>
            <p className="topic-description">
              Descubre cómo funciona la fuerza de flotación y su relación con el volumen
              de fluido desplazado.
            </p>
            <a href="/archimedes" className="topic-link">Próximamente →</a>
          </div>

          <div className="topic-card">
            <h2 className="topic-title">Dinámica de Fluidos</h2>
            <p className="topic-description">
              Visualiza el comportamiento de los fluidos en movimiento y comprende los
              principios fundamentales de la dinámica de fluidos.
            </p>
            <a href="/dynamics" className="topic-link">Próximamente →</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 