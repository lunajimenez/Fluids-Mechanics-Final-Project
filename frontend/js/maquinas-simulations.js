document.addEventListener('DOMContentLoaded', () => {
  // Simulación de Potencia
  const potenciaContainer = document.getElementById('potencia-simulation');
  if (potenciaContainer) {
    const potenciaSim = new PotenciaSimulation('potencia-simulation');
    
    // Event Listeners
    window.addEventListener('resize', () => potenciaSim.onWindowResize());
    
    const caudalSlider = document.getElementById('caudal');
    const alturaSlider = document.getElementById('altura');
    const fluidoSelect = document.getElementById('fluido');
    
    function updatePotenciaSimulation() {
      const caudal = parseFloat(caudalSlider.value);
      const altura = parseFloat(alturaSlider.value);
      const fluido = fluidoSelect.value;
      const fluidProps = potenciaSim.fluidProperties[fluido];
      
      // Actualizar visualización
      potenciaSim.updateSimulation(caudal, altura);
      potenciaSim.updateFluidColor(fluido);
      
      // Calcular potencia
      const gamma = fluidProps.density * 9.81;
      const potencia = gamma * caudal * altura;
      const energiaEspecifica = potencia / (fluidProps.density * caudal);
      
      // Actualizar resultados
      document.getElementById('potencia-value').textContent = `${(potencia/1000).toFixed(2)} kW`;
      document.getElementById('energia-value').textContent = `${energiaEspecifica.toFixed(2)} J/kg`;
    }
    
    caudalSlider?.addEventListener('input', (e) => {
      document.getElementById('caudal-value').textContent = `${e.target.value} m³/s`;
      updatePotenciaSimulation();
    });
    
    alturaSlider?.addEventListener('input', (e) => {
      document.getElementById('altura-value').textContent = `${e.target.value} m`;
      updatePotenciaSimulation();
    });
    
    fluidoSelect?.addEventListener('change', updatePotenciaSimulation);
    
    // Inicializar simulación
    updatePotenciaSimulation();
  }
});

// Simulación de Potencia Hidráulica
class PotenciaSimulation {
  constructor(containerId) {
    // Configuración de Three.js
    this.container = document.getElementById(containerId);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000
    );
    
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setClearColor(0x1a1a1a);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // Configuración de la cámara y controles
    this.camera.position.set(5, 3, 5);
    this.camera.lookAt(0, 0, 0);
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 3;
    this.controls.maxDistance = 10;

    // Propiedades del fluido
    this.fluidProperties = {
      'water': { 
        density: 998, 
        viscosity: 0.001, 
        color: 0x3494e6,
        particleColor: 0x6ab7ff
      },
      'oil': { 
        density: 920, 
        viscosity: 0.03, 
        color: 0xe6c034,
        particleColor: 0xffd700
      },
      'glycol': { 
        density: 1113, 
        viscosity: 0.016, 
        color: 0x9b59b6,
        particleColor: 0xd2a8ea
      }
    };

    // Variables de animación
    this.clock = new THREE.Clock();
    this.particleSystems = [];
    this.impeller = null;
    this.currentFluid = 'water';
    this.flowRate = 1.0;
    this.head = 10.0;

    // Configuración inicial
    this.setupLights();
    this.setupScene();
    this.animate();

    // Event listener para redimensionamiento
    window.addEventListener('resize', () => this.onWindowResize());
  }

  setupLights() {
    // Luz ambiental
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    this.scene.add(ambientLight);

    // Luz principal direccional
    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(5, 5, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 50;
    this.scene.add(mainLight);

    // Luz de relleno
    const fillLight = new THREE.PointLight(0x3494e6, 0.5);
    fillLight.position.set(-5, 3, -5);
    this.scene.add(fillLight);
  }

  setupScene() {
    // Grid helper
    const gridHelper = new THREE.GridHelper(10, 10, 0x404040, 0x404040);
    this.scene.add(gridHelper);

    // Crear sistema de tuberías y bomba
    this.createPumpSystem();
    
    // Crear sistema de partículas
    this.createParticleSystems();
  }

  createPumpSystem() {
    // Grupo principal
    this.pumpSystem = new THREE.Group();

    // Material para tuberías con efecto metálico
    const pipeMaterial = new THREE.MeshStandardMaterial({
      color: 0x808080,
      metalness: 0.8,
      roughness: 0.3,
      envMapIntensity: 1.0
    });

    // Tubería de succión
    const suctionPipe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 2, 32),
      pipeMaterial
    );
    suctionPipe.rotation.z = Math.PI / 2;
    suctionPipe.position.x = -1;
    suctionPipe.castShadow = true;
    suctionPipe.receiveShadow = true;
    this.pumpSystem.add(suctionPipe);

    // Carcasa de la bomba
    const pumpBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 0.8, 32),
      new THREE.MeshStandardMaterial({
        color: 0x4a90e2,
        metalness: 0.9,
        roughness: 0.2,
        envMapIntensity: 1.0
      })
    );
    pumpBody.castShadow = true;
    pumpBody.receiveShadow = true;
    this.pumpSystem.add(pumpBody);

    // Impulsor
    this.impeller = new THREE.Group();
    const bladeGeometry = new THREE.BoxGeometry(0.3, 0.1, 0.05);
    const bladeMaterial = new THREE.MeshStandardMaterial({
      color: 0xc0c0c0,
      metalness: 0.9,
      roughness: 0.1
    });

    for (let i = 0; i < 6; i++) {
      const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
      blade.position.x = 0.15;
      blade.rotation.y = (i * Math.PI * 2) / 6;
      this.impeller.add(blade);
    }
    this.impeller.position.set(0, 0, 0);
    this.pumpSystem.add(this.impeller);

    // Tubería de descarga
    const dischargePipe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 3, 32),
      pipeMaterial
    );
    dischargePipe.position.y = 1.5;
    dischargePipe.castShadow = true;
    dischargePipe.receiveShadow = true;
    this.pumpSystem.add(dischargePipe);

    // Añadir conexiones y detalles
    this.addPumpDetails();

    this.scene.add(this.pumpSystem);
  }

  addPumpDetails() {
    // Material para detalles
    const detailMaterial = new THREE.MeshStandardMaterial({
      color: 0x666666,
      metalness: 0.7,
      roughness: 0.3
    });

    // Bridas
    const flangeGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.05, 32);
    
    // Brida de succión
    const suctionFlange = new THREE.Mesh(flangeGeometry, detailMaterial);
    suctionFlange.rotation.z = Math.PI / 2;
    suctionFlange.position.x = -2;
    this.pumpSystem.add(suctionFlange);

    // Brida de descarga
    const dischargeFlange = new THREE.Mesh(flangeGeometry, detailMaterial);
    dischargeFlange.position.y = 3;
    this.pumpSystem.add(dischargeFlange);

    // Soporte de la bomba
    const baseGeometry = new THREE.BoxGeometry(1.2, 0.1, 0.8);
    const base = new THREE.Mesh(baseGeometry, detailMaterial);
    base.position.y = -0.4;
    this.pumpSystem.add(base);
  }

  createParticleSystems() {
    // Limpiar sistemas existentes
    this.particleSystems.forEach(system => {
      this.scene.remove(system);
    });
    this.particleSystems = [];

    // Configuración de partículas
    const particleCount = 1000;
    
    // Sistema para tubería de succión
    const suctionParticles = this.createParticleSystem(particleCount, 'suction');
    this.particleSystems.push(suctionParticles);
    this.scene.add(suctionParticles);

    // Sistema para tubería de descarga
    const dischargeParticles = this.createParticleSystem(particleCount, 'discharge');
    this.particleSystems.push(dischargeParticles);
    this.scene.add(dischargeParticles);
  }

  createParticleSystem(count, type) {
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const color = new THREE.Color(this.fluidProperties[this.currentFluid].particleColor);

    if (type === 'suction') {
      // Partículas en tubería de succión
      for (let i = 0; i < count; i++) {
        positions[i * 3] = Math.random() * 2 - 3; // x: -3 a -1
        positions[i * 3 + 1] = (Math.random() - 0.5) * 0.2; // y
        positions[i * 3 + 2] = (Math.random() - 0.5) * 0.2; // z
        
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
        
        sizes[i] = 0.05;
      }
    } else {
      // Partículas en tubería de descarga
      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 0.2; // x
        positions[i * 3 + 1] = Math.random() * 3; // y: 0 a 3
        positions[i * 3 + 2] = (Math.random() - 0.5) * 0.2; // z
        
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
        
        sizes[i] = 0.05;
      }
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    return new THREE.Points(particles, material);
  }

  updateParticles(deltaTime) {
    this.particleSystems.forEach((system, index) => {
      const positions = system.geometry.attributes.position.array;
      const count = positions.length / 3;
      const speed = this.flowRate * 2;

      for (let i = 0; i < count; i++) {
        if (index === 0) { // Partículas de succión
          positions[i * 3] += speed * deltaTime;
          if (positions[i * 3] > -1) {
            positions[i * 3] = -3;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 0.2;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
          }
        } else { // Partículas de descarga
          positions[i * 3 + 1] += speed * deltaTime;
          if (positions[i * 3 + 1] > 3) {
            positions[i * 3 + 1] = 0;
            positions[i * 3] = (Math.random() - 0.5) * 0.2;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
          }
        }
      }
      system.geometry.attributes.position.needsUpdate = true;
    });

    // Actualizar rotación del impulsor
    if (this.impeller) {
      this.impeller.rotation.y += this.flowRate * deltaTime * 5;
    }
  }

  updateFluidColor(fluidType) {
    this.currentFluid = fluidType;
    const color = new THREE.Color(this.fluidProperties[fluidType].particleColor);

    this.particleSystems.forEach(system => {
      const colors = system.geometry.attributes.color.array;
      for (let i = 0; i < colors.length; i += 3) {
        colors[i] = color.r;
        colors[i + 1] = color.g;
        colors[i + 2] = color.b;
      }
      system.geometry.attributes.color.needsUpdate = true;
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    
    const deltaTime = this.clock.getDelta();
    
    // Actualizar controles
    this.controls.update();
    
    // Actualizar partículas
    this.updateParticles(deltaTime);
    
    // Renderizar escena
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  updateSimulation(caudal, altura) {
    this.flowRate = caudal;
    this.head = altura;
  }
}