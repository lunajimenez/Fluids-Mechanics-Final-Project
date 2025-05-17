import React, { useState, useEffect } from 'react';

type StabilityState = 'stable' | 'neutral' | 'unstable';

const StabilitySimulation: React.FC = () => {
  const [stabilityState, setStabilityState] = useState<StabilityState>('stable');
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    let animationId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;

      setRotation(prevRotation => {
        let newRotation = prevRotation;
        
        switch (stabilityState) {
          case 'stable':
            // Return to vertical position with damping
            newRotation *= 0.95;
            break;
          case 'unstable':
            // Continue rotating with acceleration
            newRotation += 45 * deltaTime; // 45 degrees per second
            break;
          case 'neutral':
            // Stay at current position
            break;
        }

        return newRotation;
      });

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [stabilityState]);

  const getPointPositions = () => {
    switch (stabilityState) {
      case 'stable':
        return { g: '70%', b: '30%' };
      case 'neutral':
        return { g: '50%', b: '50%' };
      case 'unstable':
        return { g: '30%', b: '70%' };
    }
  };

  const positions = getPointPositions();

  return (
    <div className="simulation-container">
      <div className="simulation-view">
        <div 
          className="simulation-object"
          style={{ 
            transform: `rotate(${rotation}deg)`
          }}
        >
          <div className="body">
            <div 
              className="point G" 
              style={{ top: positions.g }}
              title="Centro de Gravedad (G)"
            >
              <span className="label">G</span>
            </div>
            <div 
              className="point B" 
              style={{ top: positions.b }}
              title="Centro de Flotación (B)"
            >
              <span className="label">B</span>
            </div>
          </div>
        </div>
        <div className="water-surface" />
      </div>

      <div className="control-panel">
        <h2>Control de Estabilidad</h2>
        <button 
          className={`button ${stabilityState === 'stable' ? 'active' : ''}`}
          onClick={() => setStabilityState('stable')}
        >
          Estable (G debajo de B)
        </button>
        <button 
          className={`button ${stabilityState === 'neutral' ? 'active' : ''}`}
          onClick={() => setStabilityState('neutral')}
        >
          Neutral (G = B)
        </button>
        <button 
          className={`button ${stabilityState === 'unstable' ? 'active' : ''}`}
          onClick={() => setStabilityState('unstable')}
        >
          Inestable (G arriba de B)
        </button>

        <div style={{ marginTop: '20px' }}>
          <h3>Estado Actual</h3>
          <p>Estado: {stabilityState}</p>
          <p>Rotación: {rotation.toFixed(1)}°</p>
        </div>
      </div>
    </div>
  );
};

export default StabilitySimulation; 