// js/viscosity.js
document.addEventListener('DOMContentLoaded', () => {
  // Referencias a elementos del DOM
  const viscosityChart = document.getElementById('viscosity-chart');
  const fluidTypeButtons = document.querySelectorAll('.fluid-option');
  const shearRateInput = document.getElementById('shear-rate');
  const shearRateValue = document.getElementById('shear-rate-value');
  const viscosityCoefInput = document.getElementById('viscosity-coef');
  const viscosityCoefValue = document.getElementById('viscosity-coef-value');
  const yieldStressControl = document.getElementById('yield-stress-control');
  const yieldStressInput = document.getElementById('yield-stress');
  const yieldStressValue = document.getElementById('yield-stress-value');
  const flowIndexControl = document.getElementById('flow-index-control');
  const flowIndexInput = document.getElementById('flow-index');
  const flowIndexValue = document.getElementById('flow-index-value');
  const calcViscosityBtn = document.getElementById('calc-viscosity');
  const viscosityResult = document.getElementById('viscosity-result');
  
  // Elementos para el problema
  const problemForm = document.getElementById('viscosity-problem');
  const problemFluidType = document.getElementById('problem-fluid-type');
  const problemYieldStressGroup = document.getElementById('problem-yield-stress-group');
  const problemFlowIndexGroup = document.getElementById('problem-flow-index-group');
  const problemResult = document.getElementById('problem-result');
  
  // Variables para animación
  let chart;
  let currentFluidType = 'newtonian';
  
  // Inicializar gráfico
  function initChart() {
    if (!viscosityChart) return;
    
    const ctx = viscosityChart.getContext('2d');
    
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Esfuerzo Cortante (τ)',
            borderColor: '#6b46c1',
            backgroundColor: 'rgba(107,70,193,0.1)',
            borderWidth: 3,
            pointRadius: 0,
            data: [],
            fill: true
          },
          {
            label: 'Relación Lineal (Newtoniano)',
            borderColor: '#cbd5e0',
            borderWidth: 2,
            borderDash: [5, 5],
            pointRadius: 0,
            data: [],
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Velocidad de Corte (γ̇) [s⁻¹]'
            },
            ticks: {
              callback: function(value) {
                return value;
              }
            }
          },
          y: {
            title: {
              display: true,
              text: 'Esfuerzo Cortante (τ) [Pa]'
            },
            beginAtZero: true
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${context.parsed.y.toFixed(2)} Pa`;
              }
            }
          }
        }
      }
    });
    
    updateChart();
  }
  
  // Actualizar el gráfico según los parámetros actuales
  function updateChart() {
    if (!chart) return;
    
    const shearRates = [];
    const shearStresses = [];
    const linearStresses = [];
    
    const maxShearRate = 100;
    const viscosity = parseFloat(viscosityCoefInput.value);
    const flowIndex = parseFloat(flowIndexInput.value);
    const yieldStress = parseFloat(yieldStressInput.value);
    
    // Generar los datos para diferentes velocidades de corte
    for (let i = 0; i <= maxShearRate; i += 2) {
      shearRates.push(i);
      
      // Calcular esfuerzo cortante según el tipo de fluido
      let stress = 0;
      switch (currentFluidType) {
        case 'newtonian':
          stress = viscosity * i;
          break;
        case 'pseudoplastic': // n < 1
          stress = viscosity * Math.pow(i, flowIndex);
          break;
        case 'dilatant': // n > 1
          stress = viscosity * Math.pow(i, flowIndex);
          break;
        case 'bingham':
          stress = i > 0 ? yieldStress + viscosity * i : 0;
          break;
      }
      
      shearStresses.push(stress);
      linearStresses.push(viscosity * i); // Para comparación con newtoniano
    }
    
    // Actualizar datos del gráfico
    chart.data.labels = shearRates;
    chart.data.datasets[0].data = shearStresses;
    chart.data.datasets[1].data = linearStresses;
    
    // Actualizar las etiquetas
    chart.data.datasets[0].label = `Esfuerzo Cortante (${getFluioTypeLabel()})`;
    
    chart.update();
  }
  
  function getFluioTypeLabel() {
    switch (currentFluidType) {
      case 'newtonian': return 'Newtoniano';
      case 'pseudoplastic': return 'Pseudoplástico (n < 1)';
      case 'dilatant': return 'Dilatante (n > 1)';
      case 'bingham': return 'Plástico de Bingham';
      default: return '';
    }
  }
  
  // Inicialización del simulador de flujo
  function initFlowAnimation() {
    const container = document.getElementById('flow-animation');
    const viscosityConcept = document.getElementById('viscosity-concept');
    
    if (!container && !viscosityConcept) return;
    
    // Aquí utilizaríamos Three.js para crear una simulación de flujo
    // Dado el alcance, implementaremos una versión simplificada
    
    if (container) {
      // Simulación básica con Three.js que muestre flujo con diferentes viscosidades
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf8fafc);
      
      const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
      camera.position.z = 5;
      
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      container.innerHTML = '';
      container.appendChild(renderer.domElement);
      
      // Luz
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(1, 1, 1);
      scene.add(directionalLight);
      
      // Crear representación de planos con partículas
      const layers = [];
      const numLayers = 10;
      const particlesPerLayer = 30;
      
      for (let i = 0; i < numLayers; i++) {
        const layerGeometry = new THREE.PlaneGeometry(8, 0.2);
        const layerMaterial = new THREE.MeshPhongMaterial({
          color: 0x6b46c1,
          transparent: true,
          opacity: 0.7 + (i / numLayers) * 0.3
        });
        
        const layer = new THREE.Mesh(layerGeometry, layerMaterial);
        layer.position.y = -4 + i * 0.8;
        layer.userData = { baseY: layer.position.y, speed: 0, dir: 1 };
        scene.add(layer);
        layers.push(layer);
        
        // Añadir partículas a cada capa
        for (let j = 0; j < particlesPerLayer; j++) {
          const particleSize = 0.05 + Math.random() * 0.05;
          const particleGeometry = new THREE.SphereGeometry(particleSize, 8, 8);
          const particleMaterial = new THREE.MeshPhongMaterial({
            color: 0x9f7aea,
            transparent: true,
            opacity: 0.8
          });
          
          const particle = new THREE.Mesh(particleGeometry, particleMaterial);
          particle.position.x = -4 + j * (8 / particlesPerLayer) + (Math.random() * 0.3 - 0.15);
          particle.position.y = layer.position.y + (Math.random() * 0.1 - 0.05);
          particle.position.z = Math.random() * 0.4 - 0.2;
          particle.userData = { 
            baseY: particle.position.y,
            baseX: particle.position.x,
            speed: 0.005 + Math.random() * 0.005,
            amplitude: 0.05 + Math.random() * 0.1
          };
          scene.add(particle);
          layers.push(particle);
        }
      }
      
      // Animación
      function animate() {
        requestAnimationFrame(animate);
        
        // Velocidades según el tipo de fluido
        let layerSpeedFactor;
        switch (currentFluidType) {
          case 'newtonian':
            // Velocidad uniforme para todas las capas
            layerSpeedFactor = (layer) => 0.01;
            break;
          case 'pseudoplastic': // Más rápido con mayor fuerza
            layerSpeedFactor = (layer) => {
              const normalizedY = (layer.position.y + 4) / 8; // 0 a 1 desde abajo hacia arriba
              return 0.005 + normalizedY * 0.02;
            };
            break;
          case 'dilatant': // Más lento con mayor fuerza
            layerSpeedFactor = (layer) => {
              const normalizedY = (layer.position.y + 4) / 8; // 0 a 1 desde abajo hacia arriba
              return 0.02 - normalizedY * 0.015;
            };
            break;
          case 'bingham': // No se mueve hasta un umbral, luego constante
            layerSpeedFactor = (layer) => {
              const normalizedY = (layer.position.y + 4) / 8; // 0 a 1
              return normalizedY < 0.3 ? 0 : 0.01;
            };
            break;
        }
        
        // Actualizar posiciones
        layers.forEach(layer => {
          if (layer.geometry instanceof THREE.PlaneGeometry) {
            // Capas principales
            const speed = layerSpeedFactor(layer);
            layer.position.x += speed * layer.userData.dir;
            
            // Invertir dirección al llegar a los límites
            if (Math.abs(layer.position.x) > 4) {
              layer.userData.dir *= -1;
            }
          } else {
            // Partículas
            const normalizedY = (layer.userData.baseY + 4) / 8;
            const speed = layerSpeedFactor({ position: { y: layer.userData.baseY } });
            
            // Movimiento con la capa
            layer.position.x += speed;
            
            // Reiniciar posición al salir de la pantalla
            if (layer.position.x > 4.5) {
              layer.position.x = -4.5;
            }
            
            // Pequeña oscilación vertical
            layer.position.y = layer.userData.baseY + 
              Math.sin(Date.now() * layer.userData.speed) * layer.userData.amplitude;
          }
        });
        
        renderer.render(scene, camera);
      }
      
      animate();
      
      // Responsive
      window.addEventListener('resize', () => {
        if (!container) return;
        
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      });
    }
    
    if (viscosityConcept) {
      // Animación para explicar el concepto de viscosidad
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf8fafc);
      
      const camera = new THREE.PerspectiveCamera(75, viscosityConcept.clientWidth / viscosityConcept.clientHeight, 0.1, 1000);
      camera.position.z = 5;
      
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(viscosityConcept.clientWidth, viscosityConcept.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      viscosityConcept.innerHTML = '';
      viscosityConcept.appendChild(renderer.domElement);
      
      // Luz
      const light = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(light);
      
      // Crear dos planos para ilustrar el concepto de viscosidad
      const topPlaneGeometry = new THREE.PlaneGeometry(6, 0.5);
      const topPlaneMaterial = new THREE.MeshBasicMaterial({ color: 0x6b46c1 });
      const topPlane = new THREE.Mesh(topPlaneGeometry, topPlaneMaterial);
      topPlane.position.y = 2;
      topPlane.userData = { speed: 0.03, dir: 1 };
      scene.add(topPlane);
      
      const bottomPlaneGeometry = new THREE.PlaneGeometry(6, 0.5);
      const bottomPlaneMaterial = new THREE.MeshBasicMaterial({ color: 0x6b46c1 });
      const bottomPlane = new THREE.Mesh(bottomPlaneGeometry, bottomPlaneMaterial);
      bottomPlane.position.y = -2;
      scene.add(bottomPlane);
      
      // Capas de fluido entre los planos
      const layers = [];
      const numLayers = 8;
      
      for (let i = 0; i < numLayers; i++) {
        const layerGeometry = new THREE.PlaneGeometry(5.8, 4 / numLayers);
        const hue = 260 + (i / numLayers) * 60;
        const layerMaterial = new THREE.MeshBasicMaterial({
          color: new THREE.Color(`hsl(${hue}, 70%, 60%)`),
          transparent: true,
          opacity: 0.6
        });
        
        const layer = new THREE.Mesh(layerGeometry, layerMaterial);
        layer.position.y = -2 + 0.25 + i * (4 / numLayers);
        layer.userData = { 
          index: i,
          speedFactor: i / (numLayers - 1) // 0 para la más baja, 1 para la más alta
        };
        scene.add(layer);
        layers.push(layer);
      }
      
      // Partículas para visualizar el gradiente de velocidad
      const particles = [];
      const numParticles = 40;
      
      for (let i = 0; i < numParticles; i++) {
        const particleGeometry = new THREE.CircleGeometry(0.08, 16);
        const particleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        const layerIndex = Math.floor(Math.random() * numLayers);
        const layerHeight = -2 + 0.25 + layerIndex * (4 / numLayers) + (4 / numLayers) / 2;
        
        particle.position.x = -2.5 + Math.random() * 5;
        particle.position.y = layerHeight;
        particle.userData = { layerIndex: layerIndex };
        
        scene.add(particle);
        particles.push(particle);
      }
      
      // Animación
      function animate() {
        requestAnimationFrame(animate);
        
        // Mover plano superior
        topPlane.position.x += topPlane.userData.speed * topPlane.userData.dir;
        if (Math.abs(topPlane.position.x) > 2) {
          topPlane.userData.dir *= -1;
        }
        
        // Actualizar capas con gradiente de velocidad
        layers.forEach(layer => {
          layer.position.x = topPlane.position.x * layer.userData.speedFactor;
        });
        
        // Actualizar partículas
        particles.forEach(particle => {
          const layerIndex = particle.userData.layerIndex;
          const speedFactor = layerIndex / (numLayers - 1);
          
          particle.position.x += topPlane.userData.speed * topPlane.userData.dir * speedFactor;
          
          // Reiniciar posición si sale de la pantalla
          if (topPlane.userData.dir > 0 && particle.position.x > 3) {
            particle.position.x = -3;
          } else if (topPlane.userData.dir < 0 && particle.position.x < -3) {
            particle.position.x = 3;
          }
        });
        
        renderer.render(scene, camera);
      }
      
      animate();
      
      // Responsive
      window.addEventListener('resize', () => {
        if (!viscosityConcept) return;
        
        camera.aspect = viscosityConcept.clientWidth / viscosityConcept.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(viscosityConcept.clientWidth, viscosityConcept.clientHeight);
      });
    }
  }
  
  // Manejador de tipo de fluido
  function handleFluidTypeChange(type) {
    currentFluidType = type;
    
    // Actualizar botones
    fluidTypeButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.type === type);
    });
    
    // Mostrar/ocultar controles según el tipo de fluido
    flowIndexControl.style.display = type === 'newtonian' || type === 'bingham' ? 'none' : 'flex';
    yieldStressControl.style.display = type === 'bingham' ? 'flex' : 'none';
    
    // Actualizar valor del índice de flujo según el tipo
    if (type === 'pseudoplastic') {
      flowIndexInput.value = 0.5;
      flowIndexValue.textContent = 0.5;
    } else if (type === 'dilatant') {
      flowIndexInput.value = 1.5;
      flowIndexValue.textContent = 1.5;
    } else {
      flowIndexInput.value = 1;
      flowIndexValue.textContent = 1;
    }
    
    updateChart();
  }
  
  // Event listeners para los controles de simulación
  if (fluidTypeButtons) {
    fluidTypeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        handleFluidTypeChange(btn.dataset.type);
      });
    });
  }
  
  // Actualizar valores mostrados cuando cambien los inputs
  if (shearRateInput) {
    shearRateInput.addEventListener('input', () => {
      shearRateValue.textContent = shearRateInput.value;
    });
  }
  
  if (viscosityCoefInput) {
    viscosityCoefInput.addEventListener('input', () => {
      viscosityCoefValue.textContent = viscosityCoefInput.value;
      updateChart();
    });
  }
  
  if (yieldStressInput) {
    yieldStressInput.addEventListener('input', () => {
      yieldStressValue.textContent = yieldStressInput.value;
      updateChart();
    });
  }
  
  if (flowIndexInput) {
    flowIndexInput.addEventListener('input', () => {
      flowIndexValue.textContent = flowIndexInput.value;
      updateChart();
    });
  }
  
  // Calculadora de viscosidad aparente
  if (calcViscosityBtn) {
    calcViscosityBtn.addEventListener('click', () => {
      const shearRate = parseFloat(shearRateInput.value);
      const viscosity = parseFloat(viscosityCoefInput.value);
      const flowIndex = parseFloat(flowIndexInput.value);
      const yieldStress = parseFloat(yieldStressInput.value);
      
      let apparentViscosity = 0;
      let shearStress = 0;
      
      switch (currentFluidType) {
        case 'newtonian':
          apparentViscosity = viscosity;
          shearStress = viscosity * shearRate;
          break;
        case 'pseudoplastic':
        case 'dilatant':
          shearStress = viscosity * Math.pow(shearRate, flowIndex);
          apparentViscosity = viscosity * Math.pow(shearRate, flowIndex - 1);
          break;
        case 'bingham':
          shearStress = yieldStress + viscosity * shearRate;
          apparentViscosity = (yieldStress / shearRate) + viscosity;
          break;
      }
      
      viscosityResult.innerHTML = `
        <p><strong>Tipo de fluido:</strong> ${getFluioTypeLabel()}</p>
        <p><strong>Esfuerzo Cortante (τ):</strong> ${shearStress.toFixed(4)} Pa</p>
        <p><strong>Viscosidad Aparente (η):</strong> ${apparentViscosity.toFixed(4)} Pa·s</p>
      `;
      viscosityResult.style.display = 'block';
    });
  }
  
  // Manejador para la calculadora de problemas
  if (problemForm) {
    // Mostrar/ocultar campos según el tipo de fluido seleccionado
    problemFluidType.addEventListener('change', () => {
      const selectedType = problemFluidType.value;
      
      problemYieldStressGroup.style.display = selectedType === 'bingham' ? 'flex' : 'none';
      problemFlowIndexGroup.style.display = 
        selectedType === 'pseudoplastic' || selectedType === 'dilatant' ? 'flex' : 'none';
    });
    
    // Manejar el envío del formulario
    problemForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const fluidType = problemFluidType.value;
      const shearRate = parseFloat(document.getElementById('problem-shear-rate').value);
      const viscosity = parseFloat(document.getElementById('problem-viscosity').value);
      const yieldStress = parseFloat(document.getElementById('problem-yield-stress').value || 0);
      const flowIndex = parseFloat(document.getElementById('problem-flow-index').value || 1);
      const temperature = parseFloat(document.getElementById('problem-temperature').value);
      
      // Cálculos
      let shearStress = 0;
      let apparentViscosity = 0;
      
      switch (fluidType) {
        case 'newtonian':
          shearStress = viscosity * shearRate;
          apparentViscosity = viscosity;
          break;
        case 'pseudoplastic':
        case 'dilatant':
          shearStress = viscosity * Math.pow(shearRate, flowIndex);
          apparentViscosity = viscosity * Math.pow(shearRate, flowIndex - 1);
          break;
        case 'bingham':
          shearStress = shearRate > 0 ? (yieldStress + viscosity * shearRate) : 0;
          apparentViscosity = shearRate > 0 ? (yieldStress / shearRate + viscosity) : Infinity;
          break;
      }
      
      // Estimar efecto de la temperatura (usando una relación simplificada)
      // Asumimos 25°C como temperatura de referencia
      const tempRef = 25; // °C
      const tempFactor = Math.exp(-0.02 * (temperature - tempRef)); // Coeficiente simplificado
      const tempAdjustedViscosity = apparentViscosity * tempFactor;
      
      // Mostrar resultados
      problemResult.innerHTML = `
        <p><strong>Tipo de fluido:</strong> ${problemFluidType.options[problemFluidType.selectedIndex].text}</p>
        <p><strong>Esfuerzo Cortante (τ):</strong> ${shearStress.toFixed(4)} Pa</p>
        <p><strong>Viscosidad Aparente (η) a ${tempRef}°C:</strong> ${apparentViscosity.toFixed(4)} Pa·s</p>
        <p><strong>Viscosidad Aparente (η) a ${temperature}°C:</strong> ${tempAdjustedViscosity.toFixed(4)} Pa·s</p>
        <p><strong>Factor de cambio por temperatura:</strong> ${tempFactor.toFixed(4)}</p>
      `;
      
      if (fluidType !== 'newtonian') {
        const consistencyIndex = viscosity.toFixed(4);
        const flowDescription = fluidType === 'pseudoplastic' ? 'disminuye' : 
                               fluidType === 'dilatant' ? 'aumenta' : 'constante después del umbral';
        
        problemResult.innerHTML += `
          <p><strong>Índice de consistencia (K):</strong> ${consistencyIndex} Pa·s${fluidType !== 'bingham' ? '^' + flowIndex : ''}</p>
          <p><strong>Comportamiento:</strong> La viscosidad ${flowDescription} con la velocidad de corte</p>
        `;
      }
    });
  }
  
  // Inicializar componentes si están disponibles
  initChart();
  initFlowAnimation();
}); 