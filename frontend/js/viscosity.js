// JavaScript para la página de Viscosidad en Fluidos

document.addEventListener('DOMContentLoaded', function() {
  // Referencias a elementos DOM
  const fluidOptions = document.querySelectorAll('.fluid-option');
  const shearRateSlider = document.getElementById('shear-rate');
  const shearRateValue = document.getElementById('shear-rate-value');
  const viscosityCoefSlider = document.getElementById('viscosity-coef');
  const viscosityCoefValue = document.getElementById('viscosity-coef-value');
  const yieldStressControl = document.getElementById('yield-stress-control');
  const yieldStressSlider = document.getElementById('yield-stress');
  const yieldStressValue = document.getElementById('yield-stress-value');
  const flowIndexControl = document.getElementById('flow-index-control');
  const flowIndexSlider = document.getElementById('flow-index');
  const flowIndexValue = document.getElementById('flow-index-value');
  const calcViscosityBtn = document.getElementById('calc-viscosity');
  const viscosityResult = document.getElementById('viscosity-result');

  // Variables para el gráfico
  let viscosityChart;
  let currentFluidType = 'newtonian';
  
  // Variables para animaciones
  let viscosityConceptAnimation;
  let flowAnimationCanvas;

  // Inicializar gráfico de viscosidad
  initViscosityChart();

  // Configurar selectores de tipo de fluido
  fluidOptions.forEach(option => {
    option.addEventListener('click', function() {
      // Eliminar clase activa de todas las opciones
      fluidOptions.forEach(opt => opt.classList.remove('active'));
      
      // Añadir clase activa a la opción seleccionada
      this.classList.add('active');
      
      // Actualizar tipo de fluido actual
      currentFluidType = this.dataset.type;
      
      // Mostrar/ocultar controles según el tipo de fluido
      updateControlsVisibility();
      
      // Actualizar el gráfico
      updateViscosityChart();
      
      // Actualizar la animación de flujo
      updateFlowAnimation();
    });
  });

  // Actualizar valores y gráfico cuando cambian los sliders
  shearRateSlider.addEventListener('input', function() {
    shearRateValue.textContent = this.value;
    updateViscosityChart();
    updateFlowAnimation();
  });

  viscosityCoefSlider.addEventListener('input', function() {
    viscosityCoefValue.textContent = this.value;
    updateViscosityChart();
    updateFlowAnimation();
  });

  yieldStressSlider.addEventListener('input', function() {
    yieldStressValue.textContent = this.value;
    updateViscosityChart();
    updateFlowAnimation();
  });

  flowIndexSlider.addEventListener('input', function() {
    flowIndexValue.textContent = this.value;
    updateViscosityChart();
    updateFlowAnimation();
  });

  // Calcular viscosidad aparente
  calcViscosityBtn.addEventListener('click', function() {
    const shearRate = parseFloat(shearRateSlider.value);
    const viscosityCoef = parseFloat(viscosityCoefSlider.value);
    const flowIndex = parseFloat(flowIndexSlider.value);
    const yieldStress = parseFloat(yieldStressSlider.value);
    
    let apparentViscosity;
    let shearStress;
    
    switch(currentFluidType) {
      case 'newtonian':
        apparentViscosity = viscosityCoef;
        shearStress = viscosityCoef * shearRate;
        break;
      case 'pseudoplastic':
        // Modelo de ley de potencia para pseudoplásticos (n < 1)
        shearStress = viscosityCoef * Math.pow(shearRate, flowIndex);
        apparentViscosity = viscosityCoef * Math.pow(shearRate, flowIndex - 1);
        break;
      case 'dilatant':
        // Modelo de ley de potencia para dilatantes (n > 1)
        shearStress = viscosityCoef * Math.pow(shearRate, flowIndex);
        apparentViscosity = viscosityCoef * Math.pow(shearRate, flowIndex - 1);
        break;
      case 'bingham':
        // Modelo de Bingham
        shearStress = yieldStress + viscosityCoef * shearRate;
        apparentViscosity = (yieldStress / shearRate) + viscosityCoef;
        break;
    }
    
    // Mostrar resultados
    viscosityResult.style.display = 'block';
    viscosityResult.innerHTML = `
      <p><strong>Esfuerzo cortante (τ):</strong> ${shearStress.toFixed(2)} Pa</p>
      <p><strong>Viscosidad aparente (μ<sub>aparente</sub>):</strong> ${apparentViscosity.toFixed(4)} Pa·s</p>
      <p><strong>Tipo de fluido:</strong> ${getFluidTypeName(currentFluidType)}</p>
    `;
  });

  // Formulario de problemas de viscosidad
  const problemForm = document.getElementById('viscosity-problem');
  const problemResult = document.getElementById('problem-result');
  const problemFluidType = document.getElementById('problem-fluid-type');
  const problemYieldStressGroup = document.getElementById('problem-yield-stress-group');
  const problemFlowIndexGroup = document.getElementById('problem-flow-index-group');

  // Mostrar/ocultar campos según el tipo de fluido seleccionado
  problemFluidType.addEventListener('change', function() {
    const fluidType = this.value;
    
    // Mostrar/ocultar campos según el tipo de fluido
    if (fluidType === 'bingham') {
      problemYieldStressGroup.style.display = 'block';
    } else {
      problemYieldStressGroup.style.display = 'none';
    }
    
    if (fluidType === 'pseudoplastic' || fluidType === 'dilatant') {
      problemFlowIndexGroup.style.display = 'block';
    } else {
      problemFlowIndexGroup.style.display = 'none';
    }
  });

  // Procesar formulario
  problemForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const fluidType = problemFluidType.value;
    const shearRate = parseFloat(document.getElementById('problem-shear-rate').value);
    const viscosity = parseFloat(document.getElementById('problem-viscosity').value);
    const yieldStress = parseFloat(document.getElementById('problem-yield-stress').value || 0);
    const flowIndex = parseFloat(document.getElementById('problem-flow-index').value || 1);
    const temperature = parseFloat(document.getElementById('problem-temperature').value);
    
    // Ajuste de viscosidad por temperatura (simplificado)
    // Usando una aproximación de la ecuación de Arrhenius
    const referenceTemp = 25; // °C
    const activationEnergy = 2000; // J/mol, valor típico para agua
    const gasConstant = 8.314; // J/(mol·K)
    
    // Convertir a Kelvin
    const T = temperature + 273.15;
    const Tref = referenceTemp + 273.15;
    
    // Factor de corrección por temperatura
    const tempFactor = Math.exp(activationEnergy * (1/T - 1/Tref) / gasConstant);
    const tempAdjustedViscosity = viscosity * tempFactor;
    
    let apparentViscosity;
    let shearStress;
    
    switch(fluidType) {
      case 'newtonian':
        apparentViscosity = tempAdjustedViscosity;
        shearStress = tempAdjustedViscosity * shearRate;
        break;
      case 'pseudoplastic':
        // Modelo de ley de potencia para pseudoplásticos (n < 1)
        shearStress = tempAdjustedViscosity * Math.pow(shearRate, flowIndex);
        apparentViscosity = tempAdjustedViscosity * Math.pow(shearRate, flowIndex - 1);
        break;
      case 'dilatant':
        // Modelo de ley de potencia para dilatantes (n > 1)
        shearStress = tempAdjustedViscosity * Math.pow(shearRate, flowIndex);
        apparentViscosity = tempAdjustedViscosity * Math.pow(shearRate, flowIndex - 1);
        break;
      case 'bingham':
        // Modelo de Bingham
        shearStress = yieldStress + tempAdjustedViscosity * shearRate;
        apparentViscosity = (yieldStress / shearRate) + tempAdjustedViscosity;
        break;
    }
    
    // Mostrar resultados
    problemResult.innerHTML = `
      <h4>Resultados:</h4>
      <p><strong>Viscosidad ajustada por temperatura:</strong> ${tempAdjustedViscosity.toFixed(4)} Pa·s</p>
      <p><strong>Esfuerzo cortante (τ):</strong> ${shearStress.toFixed(2)} Pa</p>
      <p><strong>Viscosidad aparente (μ<sub>aparente</sub>):</strong> ${apparentViscosity.toFixed(4)} Pa·s</p>
      <p><strong>Tipo de fluido:</strong> ${getFluidTypeName(fluidType)}</p>
    `;
  });

  // Funciones auxiliares
  function updateControlsVisibility() {
    // Mostrar/ocultar controles según el tipo de fluido
    if (currentFluidType === 'bingham') {
      yieldStressControl.style.display = 'block';
    } else {
      yieldStressControl.style.display = 'none';
    }
    
    if (currentFluidType === 'newtonian') {
      flowIndexControl.style.display = 'none';
    } else {
      flowIndexControl.style.display = 'block';
      
      // Ajustar valores predeterminados según el tipo de fluido
      if (currentFluidType === 'pseudoplastic') {
        flowIndexSlider.value = 0.5;
        flowIndexValue.textContent = '0.5';
      } else if (currentFluidType === 'dilatant') {
        flowIndexSlider.value = 1.5;
        flowIndexValue.textContent = '1.5';
      } else {
        flowIndexSlider.value = 1;
        flowIndexValue.textContent = '1';
      }
    }
  }

  function getFluidTypeName(type) {
    switch(type) {
      case 'newtonian': return 'Fluido Newtoniano';
      case 'pseudoplastic': return 'Fluido Pseudoplástico';
      case 'dilatant': return 'Fluido Dilatante';
      case 'bingham': return 'Plástico de Bingham';
      default: return 'Desconocido';
    }
  }

  function initViscosityChart() {
    const ctx = document.getElementById('viscosity-chart').getContext('2d');
    
    viscosityChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array.from({length: 11}, (_, i) => i * 10), // 0 a 100
        datasets: [
          {
            label: 'Esfuerzo Cortante (τ)',
            borderColor: '#6b46c1',
            backgroundColor: 'rgba(107, 70, 193, 0.1)',
            data: [],
            fill: true,
            tension: 0.4
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
            }
          },
          y: {
            title: {
              display: true,
              text: 'Esfuerzo Cortante (τ) [Pa]'
            },
            beginAtZero: true
          }
        }
      }
    });
    
    // Actualizar gráfico inicial
    updateViscosityChart();
  }

  function updateViscosityChart() {
    const shearRates = Array.from({length: 11}, (_, i) => i * 10); // 0 a 100
    const shearStresses = [];
    
    const viscosityCoef = parseFloat(viscosityCoefSlider.value);
    const flowIndex = parseFloat(flowIndexSlider.value);
    const yieldStress = parseFloat(yieldStressSlider.value);
    
    // Calcular esfuerzos cortantes según el tipo de fluido
    for (let rate of shearRates) {
      let stress;
      
      switch(currentFluidType) {
        case 'newtonian':
          stress = viscosityCoef * rate;
          break;
        case 'pseudoplastic':
          stress = viscosityCoef * Math.pow(rate, flowIndex);
          break;
        case 'dilatant':
          stress = viscosityCoef * Math.pow(rate, flowIndex);
          break;
        case 'bingham':
          stress = rate > 0 ? yieldStress + viscosityCoef * rate : 0;
          break;
      }
      
      shearStresses.push(stress);
    }
    
    // Actualizar datos del gráfico
    viscosityChart.data.datasets[0].data = shearStresses;
    viscosityChart.data.datasets[0].label = `Esfuerzo Cortante - ${getFluidTypeName(currentFluidType)}`;
    viscosityChart.update();
  }

  // Inicializar animación del concepto de viscosidad con Canvas
  function initViscosityConcept() {
    const container = document.getElementById('viscosity-concept');
    if (!container) return;
    
    // Crear canvas
    const canvas = document.createElement('canvas');
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Configurar animación
    const layers = {
      top: {
        y: canvas.height * 0.25,
        speed: 2,
        particles: []
      },
      middle: {
        y: canvas.height * 0.5,
        speed: 1,
        particles: []
      },
      bottom: {
        y: canvas.height * 0.75,
        speed: 0,
        particles: []
      }
    };
    
    // Crear partículas para cada capa
    const particleCount = 30;
    const colors = ['#c7d2fe', '#a5b4fc', '#818cf8'];
    
    for (const layer in layers) {
      for (let i = 0; i < particleCount; i++) {
        layers[layer].particles.push({
          x: Math.random() * canvas.width,
          y: layers[layer].y + (Math.random() * 20 - 10),
          radius: Math.random() * 4 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: Math.random() * 0.5 + 0.5
        });
      }
    }
    
    // Función para dibujar la animación
    function drawViscosityConcept() {
      // Limpiar canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Dibujar fondo degradado
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#c7d2fe');
      gradient.addColorStop(1, '#818cf8');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Dibujar líneas de separación entre capas
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1;
      
      for (const layer in layers) {
        ctx.beginPath();
        ctx.moveTo(0, layers[layer].y);
        ctx.lineTo(canvas.width, layers[layer].y);
        ctx.stroke();
      }
      
      // Dibujar etiquetas de velocidad
      ctx.fillStyle = 'white';
      ctx.font = '14px Arial';
      ctx.textAlign = 'right';
      ctx.fillText('Velocidad alta', canvas.width - 10, layers.top.y - 10);
      ctx.fillText('Velocidad media', canvas.width - 10, layers.middle.y - 10);
      ctx.fillText('Velocidad baja', canvas.width - 10, layers.bottom.y - 10);
      
      // Dibujar flechas de velocidad
      drawArrow(ctx, canvas.width - 50, layers.top.y - 20, canvas.width - 20, layers.top.y - 20, 'white');
      drawArrow(ctx, canvas.width - 40, layers.middle.y - 20, canvas.width - 20, layers.middle.y - 20, 'white');
      drawArrow(ctx, canvas.width - 30, layers.bottom.y - 20, canvas.width - 20, layers.bottom.y - 20, 'white');
      
      // Dibujar partículas
      for (const layer in layers) {
        const layerData = layers[layer];
        
        for (const particle of layerData.particles) {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          ctx.fillStyle = particle.color + Math.floor(particle.opacity * 255).toString(16).padStart(2, '0');
          ctx.fill();
          
          // Mover partículas
          particle.x += layerData.speed;
          
          // Reiniciar partículas que salen del canvas
          if (particle.x > canvas.width) {
            particle.x = 0;
            particle.y = layerData.y + (Math.random() * 20 - 10);
          }
        }
      }
      
      // Dibujar título
      ctx.fillStyle = 'white';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Perfil de Velocidad en Fluido Viscoso', canvas.width / 2, 20);
      
      // Continuar animación
      requestAnimationFrame(drawViscosityConcept);
    }
    
    // Iniciar animación
    drawViscosityConcept();
    
    // Función auxiliar para dibujar flechas
    function drawArrow(ctx, fromX, fromY, toX, toY, color) {
      const headLength = 10;
      const headWidth = 8;
      const angle = Math.atan2(toY - fromY, toX - fromX);
      
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      
      // Línea
      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
      ctx.stroke();
      
      // Punta de flecha
      ctx.beginPath();
      ctx.moveTo(toX, toY);
      ctx.lineTo(
        toX - headLength * Math.cos(angle) + headWidth * Math.sin(angle),
        toY - headLength * Math.sin(angle) - headWidth * Math.cos(angle)
      );
      ctx.lineTo(
        toX - headLength * Math.cos(angle) - headWidth * Math.sin(angle),
        toY - headLength * Math.sin(angle) + headWidth * Math.cos(angle)
      );
      ctx.closePath();
      ctx.fill();
    }
    
    // Manejar cambios de tamaño
    window.addEventListener('resize', function() {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      
      // Actualizar posiciones de las capas
      layers.top.y = canvas.height * 0.25;
      layers.middle.y = canvas.height * 0.5;
      layers.bottom.y = canvas.height * 0.75;
    });
  }

  // Inicializar animación de flujo
  function initFlowAnimation() {
    const container = document.getElementById('flow-animation');
    if (!container) return;
    
    // Crear canvas
    const canvas = document.createElement('canvas');
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    container.appendChild(canvas);
    flowAnimationCanvas = canvas;
    
    const ctx = canvas.getContext('2d');
    
    // Configuración de la animación
    const config = {
      particles: [],
      particleCount: 100,
      containerWidth: canvas.width,
      containerHeight: canvas.height,
      maxSpeed: 3,
      fluidColors: {
        newtonian: {
          primary: '#c7d2fe',
          secondary: '#818cf8',
          particle: '#4338ca'
        },
        pseudoplastic: {
          primary: '#ddd6fe',
          secondary: '#a78bfa',
          particle: '#7e22ce'
        },
        dilatant: {
          primary: '#fae8ff',
          secondary: '#d946ef',
          particle: '#a21caf'
        },
        bingham: {
          primary: '#fed7aa',
          secondary: '#fb923c',
          particle: '#c2410c'
        }
      }
    };
    
    // Crear partículas
    function createParticles() {
      config.particles = [];
      
      for (let i = 0; i < config.particleCount; i++) {
        config.particles.push({
          x: Math.random() * config.containerWidth,
          y: Math.random() * config.containerHeight,
          size: Math.random() * 4 + 1,
          speedX: 0,
          speedY: 0,
          opacity: Math.random() * 0.7 + 0.3
        });
      }
    }
    
    // Actualizar partículas según el tipo de fluido
    function updateParticles() {
      const shearRate = parseFloat(shearRateSlider ? shearRateSlider.value : 50);
      const viscosityCoef = parseFloat(viscosityCoefSlider ? viscosityCoefSlider.value : 1);
      const flowIndex = parseFloat(flowIndexSlider ? flowIndexSlider.value : 1);
      const yieldStress = parseFloat(yieldStressSlider ? yieldStressSlider.value : 0);
      
      // Factor de velocidad basado en la velocidad de corte
      const speedFactor = shearRate / 50;
      
      // Actualizar cada partícula
      config.particles.forEach(particle => {
        // Calcular posición normalizada (0-1) para determinar el comportamiento
        const normalizedY = particle.y / config.containerHeight;
        
        // Velocidad base que varía según la posición vertical (perfil de velocidad)
        let baseSpeed;
        
        switch(currentFluidType) {
          case 'newtonian':
            // Perfil de velocidad parabólico para fluido newtoniano
            baseSpeed = 4 * normalizedY * (1 - normalizedY);
            break;
          case 'pseudoplastic':
            // Perfil más plano en el centro para pseudoplástico
            baseSpeed = Math.pow(4 * normalizedY * (1 - normalizedY), flowIndex);
            break;
          case 'dilatant':
            // Perfil más pronunciado para dilatante
            baseSpeed = Math.pow(4 * normalizedY * (1 - normalizedY), 1/flowIndex);
            break;
          case 'bingham':
            // Zona de "tapón" en el centro para plástico de Bingham
            const distFromCenter = Math.abs(normalizedY - 0.5) * 2;
            if (distFromCenter < yieldStress / 50) {
              // Zona de tapón
              baseSpeed = 1 - (yieldStress / 50);
            } else {
              // Zona de flujo
              baseSpeed = 4 * normalizedY * (1 - normalizedY);
            }
            break;
        }
        
        // Ajustar velocidad según parámetros
        const adjustedSpeed = baseSpeed * speedFactor * config.maxSpeed;
        
        // Añadir componente aleatorio para simular turbulencia
        const randomFactor = currentFluidType === 'newtonian' ? 0.1 : 
                            currentFluidType === 'pseudoplastic' ? 0.2 : 
                            currentFluidType === 'dilatant' ? 0.3 : 0.15;
        
        // Actualizar velocidades
        particle.speedX = adjustedSpeed + (Math.random() - 0.5) * randomFactor;
        particle.speedY = (Math.random() - 0.5) * randomFactor;
        
        // Actualizar posiciones
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Mantener partículas dentro del contenedor
        if (particle.x > config.containerWidth) {
          particle.x = 0;
        } else if (particle.x < 0) {
          particle.x = config.containerWidth;
        }
        
        if (particle.y > config.containerHeight) {
          particle.y = config.containerHeight;
          particle.speedY *= -0.5;
        } else if (particle.y < 0) {
          particle.y = 0;
          particle.speedY *= -0.5;
        }
      });
    }
    
    // Dibujar animación
    function drawFlowAnimation() {
      // Obtener colores según el tipo de fluido
      const colors = config.fluidColors[currentFluidType];
      
      // Limpiar canvas
      ctx.clearRect(0, 0, config.containerWidth, config.containerHeight);
      
      // Dibujar fondo degradado
      const gradient = ctx.createLinearGradient(0, 0, config.containerWidth, config.containerHeight);
      gradient.addColorStop(0, colors.primary);
      gradient.addColorStop(1, colors.secondary);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, config.containerWidth, config.containerHeight);
      
      // Dibujar líneas de flujo
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      
      const lineCount = 5;
      const lineSpacing = config.containerHeight / (lineCount + 1);
      
      for (let i = 1; i <= lineCount; i++) {
        const y = i * lineSpacing;
        
        ctx.beginPath();
        ctx.moveTo(0, y);
        
        // Dibujar línea ondulada
        for (let x = 0; x < config.containerWidth; x += 20) {
          const amplitude = 5;
          const frequency = 0.05;
          const time = Date.now() * 0.001;
          const offset = Math.sin((x * frequency) + time) * amplitude;
          
          ctx.lineTo(x, y + offset);
        }
        
        ctx.stroke();
      }
      
      // Dibujar partículas
      config.particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = colors.particle + Math.floor(particle.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });
      
      // Dibujar etiqueta del tipo de fluido
      ctx.fillStyle = 'white';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(getFluidTypeName(currentFluidType), config.containerWidth / 2, 30);
      
      // Dibujar información de parámetros
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Velocidad de corte: ${shearRateSlider ? shearRateSlider.value : 50} s⁻¹`, 10, config.containerHeight - 40);
      ctx.fillText(`Viscosidad: ${viscosityCoefSlider ? viscosityCoefSlider.value : 1} Pa·s`, 10, config.containerHeight - 20);
      
      // Actualizar partículas
      updateParticles();
      
      // Continuar animación
      requestAnimationFrame(drawFlowAnimation);
    }
    
    // Crear partículas iniciales
    createParticles();
    
    // Iniciar animación
    drawFlowAnimation();
    
    // Manejar cambios de tamaño
    window.addEventListener('resize', function() {
      config.containerWidth = container.offsetWidth;
      config.containerHeight = container.offsetHeight;
      canvas.width = config.containerWidth;
      canvas.height = config.containerHeight;
      createParticles();
    });
  }

  function updateFlowAnimation() {
    // Esta función se llama cuando cambian los parámetros
    // La lógica de actualización ya está en la función drawFlowAnimation
  }

  // Inicializar animaciones
  initViscosityConcept();
  initFlowAnimation();

  // Inicializar valores
  updateControlsVisibility();
});
