// JavaScript para la simulación de flujo en tubería

document.addEventListener('DOMContentLoaded', function() {
  // Referencias a elementos DOM
  const canvas = document.getElementById('flowCanvas');
  const ctx = canvas.getContext('2d');
  const fluidTypeSelect = document.getElementById('fluidType');
  const velocitySlider = document.getElementById('velocity');
  const velocityValue = document.getElementById('velocityValue');
  const diameterSlider = document.getElementById('diameter');
  const diameterValue = document.getElementById('diameterValue');
  const reynoldsNumberElement = document.getElementById('reynoldsNumber');
  const flowTypeElement = document.getElementById('flowType');
  
  // Propiedades de los fluidos (densidad en kg/m³, viscosidad en Pa·s)
  const fluids = {
    water: { name: 'Agua', density: 1000, viscosity: 0.001, color: '#3b82f6' },
    oil: { name: 'Aceite', density: 900, viscosity: 0.03, color: '#eab308' },
    honey: { name: 'Miel', density: 1400, viscosity: 10, color: '#d97706' },
    glycerin: { name: 'Glicerina', density: 1260, viscosity: 1.5, color: '#a1a1aa' }
  };
  
  // Variables para la simulación
  let currentFluid = fluids.water;
  let velocity = parseFloat(velocitySlider.value);
  let diameter = parseFloat(diameterSlider.value) / 1000; // Convertir mm a m
  let reynoldsNumber = 0;
  let flowType = '';
  let particles = [];
  let animationId;
  
  // Configurar canvas para alta resolución
  function setupCanvas() {
    // Ajustar el tamaño del canvas al tamaño del contenedor
    const containerWidth = canvas.parentElement.clientWidth;
    canvas.width = containerWidth;
    canvas.height = 300;
    
    // Escalar para dispositivos de alta resolución
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
  }
  
  // Inicializar la simulación
  function initSimulation() {
    setupCanvas();
    updateSimulationValues();
    createParticles();
    startAnimation();
    
    // Event listeners para controles
    fluidTypeSelect.addEventListener('change', function() {
      currentFluid = fluids[this.value];
      updateSimulationValues();
    });
    
    velocitySlider.addEventListener('input', function() {
      velocity = parseFloat(this.value);
      velocityValue.textContent = `${velocity} m/s`;
      updateSimulationValues();
    });
    
    diameterSlider.addEventListener('input', function() {
      diameter = parseFloat(this.value) / 1000; // Convertir mm a m
      diameterValue.textContent = `${this.value} mm`;
      updateSimulationValues();
    });
    
    // Manejar cambios de tamaño de ventana
    window.addEventListener('resize', function() {
      cancelAnimationFrame(animationId);
      setupCanvas();
      createParticles();
      startAnimation();
    });
  }
  
  // Actualizar valores de la simulación
  function updateSimulationValues() {
    // Calcular número de Reynolds
    reynoldsNumber = (currentFluid.density * velocity * diameter) / currentFluid.viscosity;
    reynoldsNumberElement.textContent = Math.round(reynoldsNumber);
    
    // Determinar tipo de flujo
    if (reynoldsNumber < 2300) {
      flowType = 'Laminar';
      flowTypeElement.textContent = 'Laminar';
      flowTypeElement.className = 'laminar';
    } else if (reynoldsNumber > 4000) {
      flowType = 'Turbulento';
      flowTypeElement.textContent = 'Turbulento';
      flowTypeElement.className = 'turbulent';
    } else {
      flowType = 'Transición';
      flowTypeElement.textContent = 'Transición';
      flowTypeElement.className = '';
    }
    
    // Recrear partículas con nuevas propiedades
    createParticles();
  }
  
  // Crear partículas para la visualización
  function createParticles() {
    particles = [];
    const pipeHeight = canvas.height * 0.6;
    const pipeTop = (canvas.height - pipeHeight) / 2;
    const particleCount = 100;
    
    for (let i = 0; i < particleCount; i++) {
      // Posición aleatoria dentro de la tubería
      const x = Math.random() * canvas.width;
      
      // Para flujo laminar, la velocidad varía con la posición (perfil parabólico)
      // Para flujo turbulento, la velocidad es más caótica
      let y, particleVelocity;
      
      if (flowType === 'Laminar') {
        // Distribución más uniforme para flujo laminar
        const normalizedPos = Math.random();
        y = pipeTop + normalizedPos * pipeHeight;
        
        // Perfil de velocidad parabólico (máximo en el centro, cero en las paredes)
        const distFromCenter = Math.abs((y - pipeTop) / pipeHeight - 0.5) * 2;
        particleVelocity = velocity * (1 - distFromCenter * distFromCenter);
      } else {
        // Distribución más aleatoria para flujo turbulento
        y = pipeTop + Math.random() * pipeHeight;
        
        // Velocidad con componente aleatorio para simular turbulencia
        const baseVelocity = velocity * 0.7;
        const randomComponent = velocity * 0.6 * Math.random();
        particleVelocity = baseVelocity + randomComponent;
        
        // Añadir pequeña componente vertical para flujo turbulento
        const verticalVelocity = flowType === 'Turbulento' ? 
          (Math.random() - 0.5) * velocity * 0.4 : 0;
          
        particles.push({
          x, y, 
          vx: particleVelocity, 
          vy: verticalVelocity,
          size: Math.random() * 3 + 1,
          color: currentFluid.color
        });
        continue;
      }
      
      particles.push({
        x, y, 
        vx: particleVelocity, 
        vy: 0,
        size: Math.random() * 3 + 1,
        color: currentFluid.color
      });
    }
  }
  
  // Dibujar la tubería y las partículas
  function drawSimulation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const pipeHeight = canvas.height * 0.6;
    const pipeTop = (canvas.height - pipeHeight) / 2;
    
    // Dibujar tubería
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, pipeTop, canvas.width, pipeHeight);
    
    // Dibujar bordes de la tubería
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, pipeTop);
    ctx.lineTo(canvas.width, pipeTop);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(0, pipeTop + pipeHeight);
    ctx.lineTo(canvas.width, pipeTop + pipeHeight);
    ctx.stroke();
    
    // Dibujar partículas
    particles.forEach(particle => {
      ctx.beginPath();
      ctx.fillStyle = particle.color;
      
      // Dibujar partículas como círculos para flujo laminar
      // o formas más irregulares para flujo turbulento
      if (flowType === 'Laminar') {
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Para flujo turbulento, dibujar partículas con formas más irregulares
        const wobble = flowType === 'Turbulento' ? Math.random() * 2 : 0;
        ctx.ellipse(
          particle.x, 
          particle.y, 
          particle.size + wobble, 
          particle.size, 
          Math.random() * Math.PI, 
          0, 
          Math.PI * 2
        );
        ctx.fill();
      }
    });
  }
  
  // Actualizar posiciones de partículas
  function updateParticles() {
    const pipeHeight = canvas.height * 0.6;
    const pipeTop = (canvas.height - pipeHeight) / 2;
    
    particles.forEach(particle => {
      // Actualizar posición
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Si la partícula sale por la derecha, reiniciarla por la izquierda
      if (particle.x > canvas.width) {
        particle.x = 0;
      }
      
      // Mantener partículas dentro de la tubería (para flujo turbulento)
      if (particle.y < pipeTop) {
        particle.y = pipeTop;
        particle.vy = Math.abs(particle.vy) * 0.5; // Rebote suave
      } else if (particle.y > pipeTop + pipeHeight) {
        particle.y = pipeTop + pipeHeight;
        particle.vy = -Math.abs(particle.vy) * 0.5; // Rebote suave
      }
      
      // Añadir movimiento aleatorio para flujo turbulento
      if (flowType === 'Turbulento') {
        particle.vy += (Math.random() - 0.5) * 0.1;
        // Limitar la velocidad vertical
        particle.vy = Math.max(Math.min(particle.vy, velocity * 0.3), -velocity * 0.3);
      }
    });
  }
  
  // Bucle de animación
  function animate() {
    updateParticles();
    drawSimulation();
    animationId = requestAnimationFrame(animate);
  }
  
  // Iniciar animación
  function startAnimation() {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    animate();
  }
  
  // Iniciar la simulación
  initSimulation();
}); 