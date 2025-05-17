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
}); 