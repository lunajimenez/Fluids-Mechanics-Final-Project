// Simulaciones para la página de Cinemática de Fluidos

// Clase base para simulaciones
class FluidSimulation {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.isRunning = false;
    this.setupCanvas();
  }

  setupCanvas() {
    // Hacer el canvas responsive
    const resize = () => {
      const parent = this.canvas.parentElement;
      this.canvas.width = parent.clientWidth;
      this.canvas.height = 400;
      this.width = this.canvas.width;
      this.height = this.canvas.height;
    };
    resize();
    window.addEventListener('resize', resize);
  }

  start() {
    this.isRunning = true;
    this.animate();
  }

  stop() {
    this.isRunning = false;
  }

  animate() {
    if (!this.isRunning) return;
    this.update();
    this.draw();
    requestAnimationFrame(() => this.animate());
  }

  update() {
    // Implementar en clases hijas
  }

  draw() {
    // Implementar en clases hijas
  }
}

// Simulación Lagrangiana
class LagrangianSimulation extends FluidSimulation {
  constructor(canvasId) {
    super(canvasId);
    this.particles = [];
    this.particleCount = 50;
    this.flowVelocity = 5;
    this.setupControls();
    this.initParticles();
  }

  setupControls() {
    const particleCountInput = document.getElementById('particle-count');
    const flowVelocityInput = document.getElementById('flow-velocity');

    particleCountInput.addEventListener('input', (e) => {
      this.particleCount = parseInt(e.target.value);
      this.initParticles();
    });

    flowVelocityInput.addEventListener('input', (e) => {
      this.flowVelocity = parseFloat(e.target.value);
    });
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        history: []
      });
    }
  }

  update() {
    this.particles.forEach(particle => {
      // Guardar historial de posiciones
      particle.history.push({x: particle.x, y: particle.y});
      if (particle.history.length > 50) particle.history.shift();

      // Actualizar posición
      particle.x += particle.vx * this.flowVelocity;
      particle.y += particle.vy * this.flowVelocity;

      // Rebotar en los bordes
      if (particle.x < 0 || particle.x > this.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.height) particle.vy *= -1;

      // Añadir pequeña perturbación aleatoria
      particle.vx += (Math.random() - 0.5) * 0.1;
      particle.vy += (Math.random() - 0.5) * 0.1;

      // Normalizar velocidad
      const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
      particle.vx = particle.vx / speed;
      particle.vy = particle.vy / speed;
    });
  }

  draw() {
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.particles.forEach(particle => {
      // Dibujar trayectoria
      if (particle.history.length > 1) {
        this.ctx.beginPath();
        this.ctx.moveTo(particle.history[0].x, particle.history[0].y);
        particle.history.forEach(pos => {
          this.ctx.lineTo(pos.x, pos.y);
        });
        this.ctx.strokeStyle = 'rgba(67, 100, 247, 0.5)';
        this.ctx.stroke();
      }

      // Dibujar partícula
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
      this.ctx.fillStyle = '#4364f7';
      this.ctx.fill();
    });
  }
}

// Simulación Euleriana
class EulerianSimulation extends FluidSimulation {
  constructor(canvasId) {
    super(canvasId);
    this.gridSize = 20;
    this.vectors = [];
    this.flowType = 'uniform';
    this.setupControls();
    this.initVectors();
  }

  setupControls() {
    const flowTypeSelect = document.getElementById('flow-type');
    const vectorDensityInput = document.getElementById('vector-density');

    flowTypeSelect.addEventListener('change', (e) => {
      this.flowType = e.target.value;
      this.initVectors();
    });

    vectorDensityInput.addEventListener('input', (e) => {
      this.gridSize = Math.floor(this.width / parseInt(e.target.value));
      this.initVectors();
    });
  }

  initVectors() {
    this.vectors = [];
    const cols = Math.floor(this.width / this.gridSize);
    const rows = Math.floor(this.height / this.gridSize);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = (i + 0.5) * this.gridSize;
        const y = (j + 0.5) * this.gridSize;
        this.vectors.push({x, y, vx: 0, vy: 0});
      }
    }
  }

  update() {
    const centerX = this.width / 2;
    const centerY = this.height / 2;

    this.vectors.forEach(vector => {
      switch (this.flowType) {
        case 'uniform':
          vector.vx = 1;
          vector.vy = 0;
          break;
        case 'source':
          const dx = vector.x - centerX;
          const dy = vector.y - centerY;
          const r = Math.sqrt(dx*dx + dy*dy);
          vector.vx = dx/r;
          vector.vy = dy/r;
          break;
        case 'vortex':
          const dxv = vector.x - centerX;
          const dyv = vector.y - centerY;
          const rv = Math.sqrt(dxv*dxv + dyv*dyv);
          vector.vx = -dyv/rv;
          vector.vy = dxv/rv;
          break;
      }
    });
  }

  draw() {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.vectors.forEach(vector => {
      const scale = 20;
      const arrowSize = 8;

      this.ctx.beginPath();
      this.ctx.moveTo(vector.x, vector.y);
      const endX = vector.x + vector.vx * scale;
      const endY = vector.y + vector.vy * scale;
      this.ctx.lineTo(endX, endY);

      const angle = Math.atan2(vector.vy, vector.vx);
      this.ctx.lineTo(
        endX - arrowSize * Math.cos(angle - Math.PI/6),
        endY - arrowSize * Math.sin(angle - Math.PI/6)
      );
      this.ctx.moveTo(endX, endY);
      this.ctx.lineTo(
        endX - arrowSize * Math.cos(angle + Math.PI/6),
        endY - arrowSize * Math.sin(angle + Math.PI/6)
      );

      this.ctx.strokeStyle = '#4364f7';
      this.ctx.stroke();
    });
  }
}

// Simulación de Patrones de Flujo
class FlowPatternSimulation extends FluidSimulation {
  constructor(canvasId) {
    super(canvasId);
    this.reynolds = 2000;
    this.obstacleType = 'cylinder';
    this.particles = [];
    this.setupControls();
    this.initParticles();
  }

  setupControls() {
    const reynoldsInput = document.getElementById('reynolds-number');
    const obstacleSelect = document.getElementById('obstacle-type');

    reynoldsInput.addEventListener('input', (e) => {
      this.reynolds = parseInt(e.target.value);
      document.getElementById('reynolds-value').textContent = `Re = ${this.reynolds}`;
    });

    obstacleSelect.addEventListener('change', (e) => {
      this.obstacleType = e.target.value;
    });
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < 200; i++) {
      this.particles.push({
        x: 0,
        y: Math.random() * this.height,
        vx: 2,
        vy: 0,
        age: Math.random() * 100
      });
    }
  }

  calculateVelocityField(x, y, obstacleType) {
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx*dx + dy*dy);
    const obstacleRadius = 30;
    const angle = Math.atan2(dy, dx);

    switch(obstacleType) {
      case 'cylinder':
        if (distance < obstacleRadius) {
          return { vx: 2, vy: 0 };
        }
        const factor = (obstacleRadius*obstacleRadius)/(distance*distance);
        return {
          vx: 2 * (1 - factor * dx*dx/(distance*distance)),
          vy: -2 * factor * dx*dy/(distance*distance)
        };

      case 'airfoil':
        const chord = 60; // Longitud del perfil
        const thickness = 15; // Espesor máximo
        const camber = 0.1; // Curvatura
        
        // Transformar coordenadas al sistema del perfil
        const xRel = dx + chord/2;
        const yRel = dy;
        
        if (xRel >= 0 && xRel <= chord) {
          // Forma del perfil (simplificada)
          const yUpper = thickness * (1 - (xRel/chord)**2) + camber * Math.sin(Math.PI * xRel/chord);
          const yLower = -thickness * (1 - (xRel/chord)**2) + camber * Math.sin(Math.PI * xRel/chord);
          
          if (yRel > yLower && yRel < yUpper) {
            return { vx: 2, vy: 0 };
          }
        }
        
        // Campo de velocidades alrededor del perfil
        const circulation = 5 * chord * Math.sin(Math.atan2(dy, dx));
        return {
          vx: 2 + circulation * dy/(2 * Math.PI * distance * distance),
          vy: -circulation * dx/(2 * Math.PI * distance * distance)
        };

      case 'plate':
        const plateLength = 60;
        const plateThickness = 4;
        
        // Rotar coordenadas 15 grados (ángulo de ataque)
        const angleOfAttack = 15 * Math.PI/180;
        const cosA = Math.cos(angleOfAttack);
        const sinA = Math.sin(angleOfAttack);
        const xRot = dx * cosA + dy * sinA;
        const yRot = -dx * sinA + dy * cosA;
        
        // Verificar si el punto está dentro de la placa
        if (Math.abs(xRot) <= plateLength/2 && Math.abs(yRot) <= plateThickness/2) {
          return { vx: 2, vy: 0 };
        }
        
        // Campo de velocidades alrededor de la placa
        const distanceFromEdge = Math.min(
          Math.sqrt((xRot + plateLength/2)**2 + yRot**2),
          Math.sqrt((xRot - plateLength/2)**2 + yRot**2)
        );
        const deflection = Math.sign(yRot) * Math.min(1, plateLength/(4 * distanceFromEdge));
        
        return {
          vx: 2,
          vy: 2 * deflection * Math.exp(-distanceFromEdge/plateLength)
        };

      default:
        return { vx: 2, vy: 0 };
    }
  }

  update() {
    this.particles.forEach(particle => {
      // Calcular el campo de velocidades según el tipo de obstáculo
      const velocityField = this.calculateVelocityField(particle.x, particle.y, this.obstacleType);
      
      // Actualizar velocidades
      particle.vx = velocityField.vx;
      particle.vy = velocityField.vy;

      // Añadir turbulencia basada en Reynolds
      if (this.reynolds > 2300) {
        const turbulence = (this.reynolds - 2300) / 7700;
        particle.vx += (Math.random() - 0.5) * turbulence;
        particle.vy += (Math.random() - 0.5) * turbulence;
      }

      // Actualizar posición
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.age++;

      // Reiniciar partículas que salen del canvas
      if (particle.x > this.width || particle.y < 0 || particle.y > this.height || particle.age > 200) {
        particle.x = 0;
        particle.y = Math.random() * this.height;
        particle.age = 0;
        particle.vx = 2;
        particle.vy = 0;
      }
    });
  }

  draw() {
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Dibujar obstáculo según su tipo
    const centerX = this.width/2;
    const centerY = this.height/2;

    this.ctx.fillStyle = '#2d3748';
    this.ctx.beginPath();

    switch(this.obstacleType) {
      case 'cylinder':
        this.ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
        break;

      case 'airfoil':
        const chord = 60;
        const thickness = 15;
        const camber = 0.1;
        
        this.ctx.moveTo(centerX - chord/2, centerY);
        
        // Dibujar superficie superior
        for(let x = -chord/2; x <= chord/2; x++) {
          const y = thickness * (1 - (x/(chord/2))**2) + camber * Math.sin(Math.PI * (x + chord/2)/chord);
          this.ctx.lineTo(centerX + x, centerY - y);
        }
        
        // Dibujar superficie inferior
        for(let x = chord/2; x >= -chord/2; x--) {
          const y = -thickness * (1 - (x/(chord/2))**2) + camber * Math.sin(Math.PI * (x + chord/2)/chord);
          this.ctx.lineTo(centerX + x, centerY - y);
        }
        break;

      case 'plate':
        const plateLength = 60;
        const plateThickness = 4;
        const angleOfAttack = 15 * Math.PI/180;
        
        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        this.ctx.rotate(angleOfAttack);
        this.ctx.rect(-plateLength/2, -plateThickness/2, plateLength, plateThickness);
        this.ctx.restore();
        break;
    }

    this.ctx.fill();

    // Dibujar partículas
    this.particles.forEach(particle => {
      const alpha = 1 - particle.age/200;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(67, 100, 247, ${alpha})`;
      this.ctx.fill();
    });
  }
}

// Inicializar simulaciones cuando el documento esté listo
document.addEventListener('DOMContentLoaded', () => {
  const lagrangianSim = new LagrangianSimulation('lagrangian-simulation');
  const eulerianSim = new EulerianSimulation('eulerian-simulation');
  const flowPatternSim = new FlowPatternSimulation('flow-pattern-simulation');

  // Iniciar simulaciones
  lagrangianSim.start();
  eulerianSim.start();
  flowPatternSim.start();
  
  // Simulaciones de Venturi
  setupVenturiSimulation();
  setupVenturiSystemSimulation();
}); 

// Simulación del Medidor Venturi
function setupVenturiSimulation() {
  const calculateButton = document.getElementById('calculate-venturi');
  const resultsDiv = document.getElementById('venturi-results');
  const visualizationDiv = document.getElementById('venturi-visualization');
  
  if (!calculateButton) return; // Si no existe el botón, salir
  
  // Configurar el canvas para la visualización
  const canvas = document.createElement('canvas');
  canvas.width = visualizationDiv.clientWidth;
  canvas.height = 300;
  visualizationDiv.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  
  calculateButton.addEventListener('click', () => {
    // Obtener valores de entrada
    const h_mm = parseFloat(document.getElementById('venturi-h').value);
    const d1_mm = parseFloat(document.getElementById('venturi-d1').value);
    const d2_mm = parseFloat(document.getElementById('venturi-d2').value);
    
    // Constantes
    const columna_mercurio = 13.54;
    const rho_mercurio = 13540;
    const rho_agua = 1000;
    const g = 9.81;
    
    // Conversión a metros
    const h = h_mm / 1000.0;
    const d1 = d1_mm / 1000.0;
    const d2 = d2_mm / 1000.0;
    
    // Cálculos
    const A1 = Math.PI * Math.pow(d1 / 2.0, 2);
    const A2 = Math.PI * Math.pow(d2 / 2.0, 2);
    
    const A1_sq = Math.pow(A1, 2);
    const A2_sq = Math.pow(A2, 2);
    
    const delta_p = (rho_agua * g * 2 * h) - (rho_mercurio * g * 2 * h) - (rho_agua * g);
    
    const bern_expr = (4 * g * h * (1.0 - columna_mercurio) * (A1_sq * A2_sq)) / (A2_sq - A1_sq);
    
    const Q_m3s = Math.sqrt(bern_expr);
    const Q_Ls = Q_m3s * 1000.0;
    
    // Mostrar resultados
    resultsDiv.innerHTML = `
      <table class="results-table">
        <tr><td>Área sección A1:</td><td>${A1.toFixed(6)} m²</td></tr>
        <tr><td>Área sección A2:</td><td>${A2.toFixed(6)} m²</td></tr>
        <tr><td>Diferencia de presión Δp:</td><td>${delta_p.toFixed(2)} Pa</td></tr>
        <tr><td>Expresión Bernoulli:</td><td>${bern_expr.toFixed(9)}</td></tr>
        <tr><td>Caudal Q:</td><td>${Q_m3s.toFixed(4)} m³/s (${Q_Ls.toFixed(2)} L/s)</td></tr>
      </table>
    `;
    
    // Dibujar visualización
    drawVenturiVisualization(ctx, canvas.width, canvas.height, d1_mm, d2_mm, Q_Ls);
  });
  
  // Dibujar visualización inicial
  drawVenturiVisualization(ctx, canvas.width, canvas.height, 50, 30, 10);
}

// Función para dibujar la visualización del medidor Venturi
function drawVenturiVisualization(ctx, width, height, d1_mm, d2_mm, flowRate) {
  // Limpiar canvas
  ctx.clearRect(0, 0, width, height);
  
  // Dimensiones del tubo Venturi
  const tubeLength = width * 0.8;
  const tubeStartX = (width - tubeLength) / 2;
  const tubeEndX = tubeStartX + tubeLength;
  const centerY = height / 2;
  
  // Dimensiones proporcionales
  const maxDiameter = height * 0.4;
  const d1Scaled = (d1_mm / 100) * maxDiameter;
  const d2Scaled = (d2_mm / 100) * maxDiameter;
  
  // Puntos de control para la curva
  const throatWidth = tubeLength * 0.2;
  const throatX = tubeStartX + tubeLength / 2;
  
  // Dibujar tubo Venturi
  ctx.beginPath();
  // Parte superior
  ctx.moveTo(tubeStartX, centerY - d1Scaled/2);
  ctx.lineTo(throatX - throatWidth/2, centerY - d1Scaled/2);
  ctx.quadraticCurveTo(throatX, centerY - d2Scaled/2, throatX + throatWidth/2, centerY - d1Scaled/2);
  ctx.lineTo(tubeEndX, centerY - d1Scaled/2);
  
  // Parte inferior
  ctx.lineTo(tubeEndX, centerY + d1Scaled/2);
  ctx.lineTo(throatX + throatWidth/2, centerY + d1Scaled/2);
  ctx.quadraticCurveTo(throatX, centerY + d2Scaled/2, throatX - throatWidth/2, centerY + d1Scaled/2);
  ctx.lineTo(tubeStartX, centerY + d1Scaled/2);
  ctx.closePath();
  
  // Estilo del tubo
  ctx.fillStyle = 'rgba(200, 230, 255, 0.6)';
  ctx.strokeStyle = '#4364f7';
  ctx.lineWidth = 2;
  ctx.fill();
  ctx.stroke();
  
  // Dibujar partículas de fluido
  const particleCount = Math.min(100, Math.max(20, flowRate * 2));
  const particles = [];
  
  // Crear partículas
  for (let i = 0; i < particleCount; i++) {
    const x = Math.random() * tubeLength + tubeStartX;
    let y;
    
    // Calcular posición Y según la forma del tubo
    if (x < throatX - throatWidth/2) {
      y = centerY + (Math.random() * d1Scaled - d1Scaled/2);
    } else if (x > throatX + throatWidth/2) {
      y = centerY + (Math.random() * d1Scaled - d1Scaled/2);
    } else {
      // Interpolación en la garganta
      const factor = (x - (throatX - throatWidth/2)) / throatWidth;
      const currentDiameter = d1Scaled - (d1Scaled - d2Scaled) * Math.sin(factor * Math.PI);
      y = centerY + (Math.random() * currentDiameter - currentDiameter/2);
    }
    
    // Velocidad proporcional al caudal e inversamente proporcional al área
    let speed;
    if (x < throatX - throatWidth/2 || x > throatX + throatWidth/2) {
      speed = flowRate / 20;
    } else {
      // Mayor velocidad en la garganta
      const factor = (x - (throatX - throatWidth/2)) / throatWidth;
      const speedFactor = 1 + 2 * Math.sin(factor * Math.PI);
      speed = (flowRate / 20) * speedFactor * (d1_mm / d2_mm);
    }
    
    particles.push({ x, y, speed });
  }
  
  // Dibujar partículas
  particles.forEach(particle => {
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#4364f7';
    ctx.fill();
  });
  
  // Dibujar etiquetas
  ctx.font = '12px Arial';
  ctx.fillStyle = '#2d3748';
  ctx.textAlign = 'center';
  
  ctx.fillText(`d1 = ${d1_mm} mm`, tubeStartX + tubeLength * 0.2, centerY - d1Scaled/2 - 10);
  ctx.fillText(`d2 = ${d2_mm} mm`, throatX, centerY - d2Scaled/2 - 10);
  ctx.fillText(`Q = ${flowRate.toFixed(2)} L/s`, tubeEndX - tubeLength * 0.2, centerY - d1Scaled/2 - 10);
  
  // Dibujar flechas de dirección del flujo
  drawArrow(ctx, tubeStartX + tubeLength * 0.2, centerY, tubeStartX + tubeLength * 0.3, centerY, '#2d3748');
  drawArrow(ctx, throatX - throatWidth * 0.3, centerY, throatX + throatWidth * 0.3, centerY, '#2d3748');
  drawArrow(ctx, tubeEndX - tubeLength * 0.3, centerY, tubeEndX - tubeLength * 0.2, centerY, '#2d3748');
}

// Simulación del Sistema Venturi con Múltiples Puntos
function setupVenturiSystemSimulation() {
  const calculateButton = document.getElementById('calculate-venturi-system');
  const resultsDiv = document.getElementById('venturi-system-results');
  const visualizationDiv = document.getElementById('venturi-system-visualization');
  
  if (!calculateButton) return; // Si no existe el botón, salir
  
  // Configurar el canvas para la visualización
  const canvas = document.createElement('canvas');
  canvas.width = visualizationDiv.clientWidth;
  canvas.height = 400;
  visualizationDiv.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  
  calculateButton.addEventListener('click', () => {
    // Obtener valores de entrada
    const h1 = parseFloat(document.getElementById('venturi-h1').value);
    const h2 = parseFloat(document.getElementById('venturi-h2').value);
    const h3 = parseFloat(document.getElementById('venturi-h3').value);
    const d1 = parseFloat(document.getElementById('venturi-d1-in').value);
    const d2 = parseFloat(document.getElementById('venturi-d2-in').value);
    const d3 = parseFloat(document.getElementById('venturi-d3-in').value);
    
    // Convertir diámetros de pulgadas a pies
    const d1_ft = d1 / 12;
    const d2_ft = d2 / 12;
    const d3_ft = d3 / 12;
    
    const g = 32.2; // gravedad ft/s^2
    
    // Áreas
    const Ag = Math.PI * Math.pow(d3_ft, 2) / 4;
    const Af = Math.PI * Math.pow(d1_ft, 2) / 4;
    const Ac = Math.PI * Math.pow(d2_ft, 2) / 4;
    
    // Carga de elevación en puntos
    const carga_elevacion = {
      "B": h3 - h2,
      "C": h3 - h2,
      "D": h3 - h2,
      "E": h3,
      "F": 0,
      "G": 0
    };
    carga_elevacion["A"] = carga_elevacion["B"] + h1;
    
    // Inicializamos carga presión y velocidad
    const carga_presion = {"A": 0};
    const carga_velocidad = {"A": 0};
    
    // Calculamos carga total en A (solo elevación pues presión y velocidad = 0)
    const carga_total_A = carga_presion["A"] + carga_velocidad["A"] + carga_elevacion["A"];
    
    // Velocidades
    const Vg = Math.sqrt(2 * g * carga_total_A);
    const Vf = (Vg * Ag) / Af;
    const Vc = (Vf * Af) / Ac;
    
    // Cargas de velocidad
    const N1 = Math.pow(Vf, 2) / (2 * g);  // para B, D, E, F
    const N2 = Math.pow(Vc, 2) / (2 * g);  // para C
    
    carga_velocidad["B"] = N1;
    carga_velocidad["C"] = N2;
    carga_velocidad["D"] = N1;
    carga_velocidad["E"] = N1;
    carga_velocidad["F"] = N1;
    
    // Carga de presión en B-F
    for (const punto of ["B", "C", "D", "E", "F"]) {
      carga_presion[punto] = carga_total_A - carga_velocidad[punto] - carga_elevacion[punto];
    }
    
    carga_presion["G"] = 0; // definida como 0
    
    // Carga total en B para definir carga velocidad en G
    const carga_total_B = carga_presion["B"] + carga_velocidad["B"] + carga_elevacion["B"];
    carga_velocidad["G"] = carga_total_B;
    
    // Carga total en todos los puntos
    const carga_total = {};
    for (const punto of ["A", "B", "C", "D", "E", "F", "G"]) {
      const cp = carga_presion[punto] || 0;
      const cv = carga_velocidad[punto] || 0;
      const ce = carga_elevacion[punto] || 0;
      carga_total[punto] = cp + cv + ce;
    }
    
    // Mostrar resultados
    let resultHTML = '<table class="results-table">';
    for (const punto of ["A", "B", "C", "D", "E", "F", "G"]) {
      resultHTML += `
        <tr class="header-row"><th colspan="2">Punto ${punto}</th></tr>
        <tr><td>Carga Presión</td><td>${carga_presion[punto].toFixed(5)} ft</td></tr>
        <tr><td>Carga Velocidad</td><td>${carga_velocidad[punto] !== null ? carga_velocidad[punto].toFixed(5) : 'N/A'} ft</td></tr>
        <tr><td>Carga Elevación</td><td>${carga_elevacion[punto].toFixed(5)} ft</td></tr>
        <tr><td>Carga Total</td><td>${carga_total[punto].toFixed(5)} ft</td></tr>
      `;
    }
    
    resultHTML += `
      <tr class="header-row"><th colspan="2">Velocidades y Áreas</th></tr>
      <tr><td>Vg</td><td>${Vg.toFixed(5)} ft/s</td></tr>
      <tr><td>Vf</td><td>${Vf.toFixed(5)} ft/s</td></tr>
      <tr><td>Vc</td><td>${Vc.toFixed(5)} ft/s</td></tr>
      <tr><td>Ag</td><td>${Ag.toFixed(5)} ft²</td></tr>
      <tr><td>Af</td><td>${Af.toFixed(5)} ft²</td></tr>
      <tr><td>Ac</td><td>${Ac.toFixed(5)} ft²</td></tr>
    </table>`;
    
    resultsDiv.innerHTML = resultHTML;
    
    // Dibujar visualización
    drawVenturiSystemVisualization(ctx, canvas.width, canvas.height, h1, h2, h3, d1, d2, d3, carga_presion, carga_velocidad, carga_elevacion);
  });
  
  // Dibujar visualización inicial
  drawVenturiSystemVisualization(ctx, canvas.width, canvas.height, 10, 5, 15, 4, 2, 6, 
    {"A": 0, "B": 15, "C": 10, "D": 15, "E": 10, "F": 20, "G": 0},
    {"A": 0, "B": 5, "C": 15, "D": 5, "E": 5, "F": 5, "G": 20},
    {"A": 15, "B": 10, "C": 10, "D": 10, "E": 15, "F": 0, "G": 0}
  );
}

// Función para dibujar la visualización del sistema Venturi con múltiples puntos
function drawVenturiSystemVisualization(ctx, width, height, h1, h2, h3, d1, d2, d3, carga_presion, carga_velocidad, carga_elevacion) {
  // Limpiar canvas
  ctx.clearRect(0, 0, width, height);
  
  // Dimensiones del sistema
  const margin = 50;
  const systemWidth = width - 2 * margin;
  const systemHeight = height - 2 * margin;
  const baseY = height - margin;
  
  // Escalas
  const maxDiameter = 6; // máximo diámetro en pulgadas
  const diameterScale = systemHeight / (3 * maxDiameter);
  
  // Posiciones X de los puntos
  const pointsX = {
    "A": margin,
    "B": margin + systemWidth * 0.2,
    "C": margin + systemWidth * 0.35,
    "D": margin + systemWidth * 0.5,
    "E": margin + systemWidth * 0.65,
    "F": margin + systemWidth * 0.8,
    "G": margin + systemWidth
  };
  
  // Dibujar líneas de referencia
  ctx.strokeStyle = '#ddd';
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  
  // Línea h3
  const h3Line = baseY - h3 * 10;
  ctx.beginPath();
  ctx.moveTo(margin, h3Line);
  ctx.lineTo(margin + systemWidth, h3Line);
  ctx.stroke();
  
  // Línea h2
  const h2Line = h3Line + h2 * 10;
  ctx.beginPath();
  ctx.moveTo(margin, h2Line);
  ctx.lineTo(margin + systemWidth * 0.65, h2Line);
  ctx.stroke();
  
  ctx.setLineDash([]);
  
  // Dibujar sistema de tuberías
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#4364f7';
  
  // Tubería vertical A-B
  const d1Scaled = d1 * diameterScale;
  ctx.beginPath();
  ctx.moveTo(pointsX["A"] - d1Scaled/2, baseY - h1 * 10 - h2 * 10);
  ctx.lineTo(pointsX["A"] + d1Scaled/2, baseY - h1 * 10 - h2 * 10);
  ctx.lineTo(pointsX["A"] + d1Scaled/2, baseY - h2 * 10);
  ctx.lineTo(pointsX["A"] - d1Scaled/2, baseY - h2 * 10);
  ctx.closePath();
  ctx.fillStyle = 'rgba(200, 230, 255, 0.6)';
  ctx.fill();
  ctx.stroke();
  
  // Tubería horizontal B-F
  ctx.beginPath();
  ctx.moveTo(pointsX["B"] - d1Scaled/2, baseY - h2 * 10);
  
  // Sección B-C (transición a d2)
  const d2Scaled = d2 * diameterScale;
  ctx.lineTo(pointsX["B"], baseY - h2 * 10);
  ctx.lineTo(pointsX["C"] - d2Scaled/2, baseY - h2 * 10);
  ctx.lineTo(pointsX["C"] - d2Scaled/2, baseY - h2 * 10 - d2Scaled);
  ctx.lineTo(pointsX["C"] + d2Scaled/2, baseY - h2 * 10 - d2Scaled);
  ctx.lineTo(pointsX["C"] + d2Scaled/2, baseY - h2 * 10);
  
  // Sección C-D (transición a d1)
  ctx.lineTo(pointsX["D"] - d1Scaled/2, baseY - h2 * 10);
  ctx.lineTo(pointsX["D"] - d1Scaled/2, baseY - h2 * 10 - d1Scaled);
  ctx.lineTo(pointsX["D"] + d1Scaled/2, baseY - h2 * 10 - d1Scaled);
  ctx.lineTo(pointsX["D"] + d1Scaled/2, baseY - h2 * 10);
  
  // Sección D-E (elevación a h3)
  ctx.lineTo(pointsX["E"] - d1Scaled/2, baseY - h2 * 10);
  ctx.lineTo(pointsX["E"] - d1Scaled/2, baseY - h3 * 10);
  ctx.lineTo(pointsX["E"] + d1Scaled/2, baseY - h3 * 10);
  ctx.lineTo(pointsX["E"] + d1Scaled/2, baseY - h2 * 10);
  
  // Sección E-F (descenso a nivel 0)
  ctx.lineTo(pointsX["F"] - d1Scaled/2, baseY - h2 * 10);
  ctx.lineTo(pointsX["F"] - d1Scaled/2, baseY);
  ctx.lineTo(pointsX["F"] + d1Scaled/2, baseY);
  ctx.lineTo(pointsX["F"] + d1Scaled/2, baseY - h2 * 10);
  ctx.lineTo(pointsX["B"] + d1Scaled/2, baseY - h2 * 10);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  // Tubería F-G
  const d3Scaled = d3 * diameterScale;
  ctx.beginPath();
  ctx.moveTo(pointsX["F"], baseY);
  ctx.lineTo(pointsX["G"], baseY);
  ctx.lineTo(pointsX["G"], baseY - d3Scaled);
  ctx.lineTo(pointsX["F"], baseY - d3Scaled);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  // Dibujar puntos y etiquetas
  for (const punto of ["A", "B", "C", "D", "E", "F", "G"]) {
    let x = pointsX[punto];
    let y;
    
    // Determinar posición Y según el punto
    switch(punto) {
      case "A":
        y = baseY - h1 * 10 - h2 * 10;
        break;
      case "B":
      case "C":
      case "D":
        y = baseY - h2 * 10;
        break;
      case "E":
        y = baseY - h3 * 10;
        break;
      case "F":
      case "G":
        y = baseY;
        break;
    }
    
    // Dibujar punto
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#e53e3e';
    ctx.fill();
    ctx.stroke();
    
    // Etiqueta del punto
    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = '#2d3748';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(punto, x, y - 15);
    
    // Valores de carga
    const cp = carga_presion[punto] ? carga_presion[punto].toFixed(1) : 'N/A';
    const cv = carga_velocidad[punto] !== null ? carga_velocidad[punto].toFixed(1) : 'N/A';
    const ce = carga_elevacion[punto] ? carga_elevacion[punto].toFixed(1) : 'N/A';
    
    // Mostrar valores de carga cerca de cada punto
    if (punto === "A" || punto === "G") {
      // Puntos en los extremos, alinear diferente
      ctx.textAlign = punto === "A" ? "left" : "right";
      ctx.fillText(`P:${cp} V:${cv} E:${ce}`, x + (punto === "A" ? 10 : -10), y + 15);
    } else {
      ctx.fillText(`P:${cp}`, x, y + 15);
      ctx.fillText(`V:${cv}`, x, y + 30);
      ctx.fillText(`E:${ce}`, x, y + 45);
    }
  }
  
  // Dibujar etiquetas de altura
  ctx.font = '12px Arial';
  ctx.textAlign = 'right';
  ctx.fillStyle = '#2d3748';
  ctx.fillText(`h1 = ${h1} ft`, pointsX["A"] - 10, baseY - h1 * 5 - h2 * 10);
  ctx.fillText(`h2 = ${h2} ft`, pointsX["B"] - 10, baseY - h2 * 5);
  ctx.fillText(`h3 = ${h3} ft`, pointsX["E"] - 10, baseY - h3 * 5);
  
  // Dibujar etiquetas de diámetro
  ctx.textAlign = 'center';
  ctx.fillText(`d1 = ${d1}"`, (pointsX["B"] + pointsX["A"]) / 2, baseY - h2 * 10 - d1Scaled - 10);
  ctx.fillText(`d2 = ${d2}"`, pointsX["C"], baseY - h2 * 10 - d2Scaled - 10);
  ctx.fillText(`d3 = ${d3}"`, (pointsX["F"] + pointsX["G"]) / 2, baseY - d3Scaled - 10);
}

// Función auxiliar para dibujar flechas
function drawArrow(ctx, fromX, fromY, toX, toY, color) {
  const headLength = 10;
  const headAngle = Math.PI / 6;
  
  // Calcular ángulo de la flecha
  const angle = Math.atan2(toY - fromY, toX - fromX);
  
  // Dibujar línea
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Dibujar cabeza de flecha
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(toX - headLength * Math.cos(angle - headAngle), toY - headLength * Math.sin(angle - headAngle));
  ctx.lineTo(toX - headLength * Math.cos(angle + headAngle), toY - headLength * Math.sin(angle + headAngle));
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
} 