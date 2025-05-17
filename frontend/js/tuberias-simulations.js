// Simulación de Pérdidas Menores
class MinorLossesSimulation {
  constructor(containerId) {
    // Inicialización de propiedades
    this.container = document.getElementById(containerId);
    this.accessoryType = 'elbow90';
    this.diameter = 100;
    this.velocity = 2;
    this.fluidType = 'water';
    this.valveOpening = 100;
    this.showParticles = true;
    this.particles = [];
    this.particleSystem = null;

    // Configuración de Three.js
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );
    
    // Configuración del renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setClearColor(0x000000);
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);

    // Configuración de la cámara y controles
    this.camera.position.set(3, 2, 3);
    this.camera.lookAt(0, 0, 0);
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    // Configuración de luces
    this.setupLights();

    // Inicialización
    this.setupScene();
    this.animate();
  }

  setupLights() {
    // Luz ambiente
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    this.scene.add(ambientLight);

    // Luz direccional principal
    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(5, 5, 5);
    mainLight.castShadow = true;
    this.scene.add(mainLight);

    // Luz de relleno
    const fillLight = new THREE.PointLight(0x3494e6, 0.5);
    fillLight.position.set(-5, 3, -5);
    this.scene.add(fillLight);
  }

  setupScene() {
    // Crear grid helper
    const gridHelper = new THREE.GridHelper(10, 10);
    this.scene.add(gridHelper);

    // Crear geometría inicial
    this.createAccessoryGeometry();
  }

  createAccessoryGeometry() {
    // Limpiar geometría existente
    if (this.accessoryMesh) {
      this.scene.remove(this.accessoryMesh);
    }
    if (this.particleSystem) {
      this.scene.remove(this.particleSystem);
    }

    let geometry;
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x3494e6,
      metalness: 0.2,
      roughness: 0.3,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
      transmission: 0.5
    });

    switch (this.accessoryType) {
      case 'elbow90':
        geometry = this.createElbowGeometry();
        break;
      case 'tee':
        geometry = this.createTeeGeometry();
        break;
      default:
        geometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 32);
        geometry.rotateZ(Math.PI / 2);
    }

    this.accessoryMesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.accessoryMesh);

    // Crear sistema de partículas
    this.createParticleSystem();
  }

  createElbowGeometry() {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 1, 0)
    ]);

    return new THREE.TubeGeometry(curve, 32, 0.1, 16, false);
  }

  createTeeGeometry() {
    const group = new THREE.Group();

    // Tubería horizontal
    const horizontalGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 32);
    horizontalGeometry.rotateZ(Math.PI / 2);
    const horizontalMesh = new THREE.Mesh(
      horizontalGeometry,
      new THREE.MeshStandardMaterial({ color: 0x3494e6 })
    );
    group.add(horizontalMesh);

    // Tubería vertical
    const verticalGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 32);
    const verticalMesh = new THREE.Mesh(
      verticalGeometry,
      new THREE.MeshStandardMaterial({ color: 0x3494e6 })
    );
    verticalMesh.position.y = -0.5;
    group.add(verticalMesh);

    return group;
  }

  createParticleSystem() {
    const particleCount = 100;
    const particles = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const particleGeometry = new THREE.BufferGeometry();
    const particleMaterial = new THREE.PointsMaterial({
      vertexColors: true,
      size: 0.03,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    // Inicializar partículas según el tipo de accesorio
    for (let i = 0; i < particleCount; i++) {
      let x, y, z;
      switch (this.accessoryType) {
        case 'elbow90':
          if (Math.random() > 0.5) {
            x = -Math.random();
            y = 0;
            z = 0;
          } else {
            x = 0;
            y = Math.random();
            z = 0;
          }
          break;
        case 'tee':
          if (Math.random() > 0.3) {
            x = -1 + Math.random() * 2;
            y = 0;
            z = 0;
          } else {
            x = 0;
            y = -Math.random();
            z = 0;
          }
          break;
        default:
          x = -1 + Math.random() * 2;
          y = 0;
          z = 0;
      }
      particles[i * 3] = x;
      particles[i * 3 + 1] = y;
      particles[i * 3 + 2] = z;
      
      // Color inicial (rojo)
      colors[i * 3] = 1;     // R
      colors[i * 3 + 1] = 0; // G
      colors[i * 3 + 2] = 0; // B
      
      // Tamaño inicial
      sizes[i] = 0.03;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particles, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    this.particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    this.scene.add(this.particleSystem);
    this.particles = particles;
  }

  updateParticles() {
    if (!this.particleSystem || !this.showParticles) return;

    const positions = this.particleSystem.geometry.attributes.position.array;
    const colors = this.particleSystem.geometry.attributes.color.array;
    const sizes = this.particleSystem.geometry.attributes.size.array;
    const speed = this.velocity * 0.01;
    const losses = this.calculateLosses();

    for (let i = 0; i < positions.length; i += 3) {
      let particleIndex = i / 3;
      let isInLossZone = false;
      
      switch (this.accessoryType) {
        case 'elbow90':
          if (positions[i + 1] === 0) { // Movimiento horizontal
            positions[i] += speed;
            if (positions[i] > 0) {
              positions[i] = 0;
              positions[i + 1] = 0;
              isInLossZone = true;
            }
          } else { // Movimiento vertical
            positions[i + 1] += speed;
            isInLossZone = positions[i + 1] < 0.3;
            if (positions[i + 1] > 1) {
              positions[i] = -Math.random();
              positions[i + 1] = 0;
            }
          }
          break;
        case 'tee':
          if (positions[i + 1] === 0) { // Movimiento horizontal
            positions[i] += speed;
            isInLossZone = Math.abs(positions[i]) < 0.2;
            if (positions[i] > 1) {
              positions[i] = -1;
            }
          } else { // Movimiento vertical
            positions[i + 1] -= speed;
            isInLossZone = positions[i + 1] > -0.3;
            if (positions[i + 1] < -1) {
              positions[i] = -1 + Math.random() * 2;
              positions[i + 1] = 0;
            }
          }
          break;
        default:
          positions[i] += speed;
          if (positions[i] > 1) {
            positions[i] = -1;
          }
      }

      // Actualizar color y tamaño basado en pérdidas
      if (isInLossZone) {
        // Color más brillante en zona de pérdidas
        colors[i] = 1;       // R
        colors[i + 1] = 0.3; // G
        colors[i + 2] = 0;   // B
        sizes[particleIndex] = 0.05;
      } else {
        // Color normal
        colors[i] = 1;     // R
        colors[i + 1] = 0; // G
        colors[i + 2] = 0; // B
        sizes[particleIndex] = 0.03;
      }
    }

    this.particleSystem.geometry.attributes.position.needsUpdate = true;
    this.particleSystem.geometry.attributes.color.needsUpdate = true;
    this.particleSystem.geometry.attributes.size.needsUpdate = true;
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    
    this.controls.update();
    this.updateParticles();
    this.renderer.render(this.scene, this.camera);
  }

  updateAccessoryType(type) {
    this.accessoryType = type;
    this.createAccessoryGeometry();
  }

  updateDiameter(diameter) {
    this.diameter = diameter;
    this.createAccessoryGeometry();
  }

  updateVelocity(velocity) {
    this.velocity = velocity;
  }

  updateFluidType(type) {
    this.fluidType = type;
    if (this.accessoryMesh) {
      this.accessoryMesh.material.color.setHex(
        type === 'water' ? 0x3494e6 :
        type === 'water-hot' ? 0xe65c41 :
        type === 'oil' ? 0xe6c034 :
        0xa8c6df
      );
    }
  }

  updateValveOpening(opening) {
    this.valveOpening = opening;
    if (this.accessoryType.includes('valve')) {
      this.createAccessoryGeometry();
    }
  }

  resetCamera() {
    this.camera.position.set(3, 2, 3);
    this.camera.lookAt(0, 0, 0);
    this.controls.reset();
  }

  onWindowResize() {
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  getFluidProperties() {
    const properties = {
      'water': { density: 998, viscosity: 0.001 },
      'water-hot': { density: 983, viscosity: 0.00047 },
      'oil': { density: 920, viscosity: 0.03 },
      'air': { density: 1.225, viscosity: 0.0000181 }
    };
    return properties[this.fluidType] || properties['water'];
  }

  calculateReynolds() {
    const { density, viscosity } = this.getFluidProperties();
    return (density * this.velocity * (this.diameter / 1000)) / viscosity;
  }

  getKValue() {
    const baseK = {
      'elbow90': 0.9,
      'elbow90-lr': 0.6,
      'elbow45': 0.4,
      'tee': 0.6,
      'tee-branch': 1.8,
      'gate-valve': 0.2,
      'globe-valve': 10.0,
      'check-valve': 2.5,
      'butterfly-valve': 0.7,
      'entrance-sharp': 0.5,
      'entrance-rounded': 0.2,
      'exit': 1.0,
      'expansion': 1.0,
      'contraction': 0.5
    }[this.accessoryType] || 1.0;

    if (this.accessoryType.includes('valve') && this.valveOpening < 100) {
      return baseK * Math.pow(100 / this.valveOpening, 2);
    }

    return baseK;
  }

  calculateLosses() {
    const k = this.getKValue();
    const g = 9.81;
    const { density } = this.getFluidProperties();
    
    const headLoss = k * Math.pow(this.velocity, 2) / (2 * g);
    const energyLoss = headLoss * g;
    const pressureDrop = headLoss * density * g / 1000; // kPa
    
    return { k, headLoss, energyLoss, pressureDrop };
  }
}

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
  const minorLossesContainer = document.getElementById('minor-losses-simulation');
  if (minorLossesContainer) {
    const lossesSim = new MinorLossesSimulation('minor-losses-simulation');
    
    // Event Listeners
    window.addEventListener('resize', () => lossesSim.onWindowResize());
    
    // Botones de control
    document.getElementById('reset-camera').addEventListener('click', () => lossesSim.resetCamera());
    
    // Controles principales
    const accessorySelect = document.getElementById('accessory-type');
    const diameterSlider = document.getElementById('pipe-diameter');
    const velocitySlider = document.getElementById('flow-velocity');
    const fluidSelect = document.getElementById('fluid-type');
    const valveOpeningSlider = document.getElementById('valve-opening');
    
    function updateSimulation() {
      if (accessorySelect) lossesSim.updateAccessoryType(accessorySelect.value);
      if (diameterSlider) lossesSim.updateDiameter(parseFloat(diameterSlider.value));
      if (velocitySlider) lossesSim.updateVelocity(parseFloat(velocitySlider.value));
      if (fluidSelect) lossesSim.updateFluidType(fluidSelect.value);
      if (valveOpeningSlider) lossesSim.updateValveOpening(parseFloat(valveOpeningSlider.value));
      
      // Actualizar resultados
      const reynolds = lossesSim.calculateReynolds();
      const { k, headLoss, energyLoss, pressureDrop } = lossesSim.calculateLosses();
      
      document.getElementById('k-value').textContent = k.toFixed(3);
      document.getElementById('head-loss').textContent = `${headLoss.toFixed(3)} m`;
      document.getElementById('energy-loss').textContent = `${energyLoss.toFixed(2)} J/kg`;
      document.getElementById('pressure-drop').textContent = `${pressureDrop.toFixed(2)} kPa`;
      document.getElementById('reynolds-number').textContent = reynolds.toFixed(0);
      document.getElementById('flow-regime').textContent = 
        reynolds < 2300 ? 'Laminar' :
        reynolds > 4000 ? 'Turbulento' : 'Transición';
    }
    
    // Event listeners para controles
    if (accessorySelect) {
      accessorySelect.addEventListener('change', updateSimulation);
    }
    
    if (diameterSlider) {
      diameterSlider.addEventListener('input', (e) => {
        document.getElementById('diameter-value').textContent = `${e.target.value} mm`;
        updateSimulation();
      });
    }
    
    if (velocitySlider) {
      velocitySlider.addEventListener('input', (e) => {
        document.getElementById('velocity-value').textContent = `${parseFloat(e.target.value).toFixed(1)} m/s`;
        updateSimulation();
      });
    }
    
    if (fluidSelect) {
      fluidSelect.addEventListener('change', updateSimulation);
    }
    
    if (valveOpeningSlider) {
      valveOpeningSlider.addEventListener('input', (e) => {
        document.getElementById('opening-value').textContent = `${e.target.value}%`;
        updateSimulation();
      });
    }
    
    // Inicializar resultados
    updateSimulation();
  }
}); 