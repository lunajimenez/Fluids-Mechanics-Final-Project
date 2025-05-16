// js/main.js
document.addEventListener('DOMContentLoaded', () => {
  // Crear overlay para el menú
  const overlay = document.createElement('div');
  overlay.className = 'menu-overlay';
  document.body.appendChild(overlay);

  // Menú desplegable
  const menuToggle = document.getElementById('menu-toggle');
  const mainMenu = document.querySelector('.main-menu');
  
  // Función para animar el menú
  const toggleMenu = (show) => {
    if (show) {
      mainMenu.style.display = 'flex';
      // Forzar un reflow para que la animación funcione
      mainMenu.offsetHeight;
    }
    
    requestAnimationFrame(() => {
      mainMenu.classList.toggle('show', show);
      overlay.classList.toggle('show', show);
      menuToggle.classList.toggle('active', show);
      document.body.style.overflow = show ? 'hidden' : '';
    });

    if (!show) {
      // Esperar a que termine la animación antes de ocultar el menú
      setTimeout(() => {
        if (!mainMenu.classList.contains('show')) {
          mainMenu.style.display = 'none';
        }
      }, 300); // Debe coincidir con la duración de la transición en CSS
    }
  };

  menuToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    const willShow = !mainMenu.classList.contains('show');
    toggleMenu(willShow);
  });

  // Cerrar menú al hacer clic en el overlay
  overlay.addEventListener('click', () => {
    toggleMenu(false);
  });

  // Manejo de submenús con animación
  const menuTriggers = document.querySelectorAll('.menu-trigger');
  
  menuTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const parent = trigger.parentElement;
      const submenu = parent.querySelector('.submenu');
      
      // Cerrar otros submenús abiertos con animación
      document.querySelectorAll('.has-submenu').forEach(item => {
        if (item !== parent && item.classList.contains('active')) {
          item.classList.remove('active');
        }
      });
      
      // Toggle del submenú actual con animación
      parent.classList.toggle('active');
    });
  });

  // Manejar clics en enlaces del menú
  const menuLinks = document.querySelectorAll('.main-menu a:not(.menu-trigger)');
  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.stopPropagation();
      const href = link.getAttribute('href');
      
      if (href && href !== '#') {
        // Añadir una pequeña demora para que se vea la animación del hover
        setTimeout(() => {
          toggleMenu(false);
        }, 150);
      }
    });
  });

  // Evitar que los clics en el menú lo cierren
  mainMenu.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Animación de scroll suave para los enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Efecto de hover en las secciones
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    section.addEventListener('mouseenter', () => {
      section.style.transform = 'translateY(-5px)';
      section.style.boxShadow = '0 6px 12px rgba(0,0,0,0.1)';
    });
    
    section.addEventListener('mouseleave', () => {
      section.style.transform = 'translateY(0)';
      section.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
    });
  });

  // Calculadora de densidad (si existe en la página)
  const densityCalculator = document.getElementById('density-calculator');
  
  densityCalculator?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const mass = parseFloat(document.getElementById('mass').value);
    const volume = parseFloat(document.getElementById('volume').value);
    const g = 9.81;
    
    if (mass && volume && volume > 0) {
      const density = mass / volume;
      const specificWeight = density * g;
      
      const resultDiv = document.getElementById('density-result');
      resultDiv.style.opacity = '0';
      
      setTimeout(() => {
        resultDiv.innerHTML = `
          <p><strong>Densidad (ρ):</strong> ${density.toFixed(2)} kg/m³</p>
          <p><strong>Peso Específico (γ):</strong> ${specificWeight.toFixed(2)} N/m³</p>
        `;
        resultDiv.style.opacity = '1';
      }, 150);
    } else {
      document.getElementById('density-result').innerHTML = `
        <p class="error">Por favor, ingrese valores válidos. El volumen debe ser mayor que cero.</p>
      `;
    }
  });

  // Calculadora de viscosidad (si existe en la página)
  const viscosityCalculator = document.getElementById('viscosity-calculator');
  
  viscosityCalculator?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Obtener valores del formulario
    const L = parseFloat(document.getElementById('cylinder-length').value) / 100;  // Convertir a metros
    const D_exterior = parseFloat(document.getElementById('outer-diameter').value) / 100;  // Convertir a metros
    const brecha = parseFloat(document.getElementById('gap').value) / 100;  // Convertir a metros
    const rpm = parseFloat(document.getElementById('rpm').value);
    const torque = parseFloat(document.getElementById('torque').value);
    
    if (L && D_exterior && brecha && rpm && torque) {
      // Cálculos intermedios
      const R = D_exterior / 2;                       // Radio exterior (m)
      const r = R - brecha;                           // Radio interior (m)
      const omega = rpm * (2 * Math.PI) / 60;         // Velocidad angular (rad/s)
      
      // Fórmula para calcular la viscosidad
      const mu = (torque * brecha) / (2 * Math.PI * omega * Math.pow(r, 3) * L);  // Viscosidad en Pa·s
      const mu_mN = mu * 1000;                        // Conversión a mN·s/m²
      
      const resultDiv = document.getElementById('viscosity-result');
      resultDiv.style.opacity = '0';
      
      setTimeout(() => {
        resultDiv.innerHTML = `
          <p><strong>Radio exterior (R):</strong> ${R.toFixed(5)} m</p>
          <p><strong>Radio interior (r):</strong> ${r.toFixed(5)} m</p>
          <p><strong>Velocidad angular (ω):</strong> ${omega.toFixed(3)} rad/s</p>
          <p><strong>Viscosidad (μ):</strong> ${mu.toFixed(6)} Pa·s</p>
          <p><strong>Viscosidad:</strong> ${mu_mN.toFixed(4)} mN·s/m²</p>
        `;
        resultDiv.style.opacity = '1';
      }, 150);
      
      // Actualizar la simulación del viscosímetro
      if (viscosimeterScene) {
        updateViscosimeterSimulation(L, R, r, omega);
      }
    } else {
      document.getElementById('viscosity-result').innerHTML = `
        <p class="error">Por favor, ingrese todos los valores requeridos.</p>
      `;
    }
  });
  
  // Simulación 3D del viscosímetro con Three.js
  let viscosimeterScene, viscosimeterCamera, viscosimeterRenderer;
  let outerCylinder, innerCylinder, fluidLayer;
  let animationId;
  
  function initViscosimeterSimulation() {
    const container = document.getElementById('viscometer-canvas');
    
    if (!container) return;
    
    // Inicializar la escena
    viscosimeterScene = new THREE.Scene();
    viscosimeterScene.background = new THREE.Color(0xf8f9fa);
    
    // Cámara
    const aspect = container.clientWidth / container.clientHeight;
    viscosimeterCamera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    viscosimeterCamera.position.set(0, 0, 1.5);
    
    // Renderer
    viscosimeterRenderer = new THREE.WebGLRenderer({ antialias: true });
    viscosimeterRenderer.setSize(container.clientWidth, container.clientHeight);
    viscosimeterRenderer.setPixelRatio(window.devicePixelRatio);
    container.innerHTML = '';
    container.appendChild(viscosimeterRenderer.domElement);
    
    // Luz
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    viscosimeterScene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    viscosimeterScene.add(directionalLight);
    
    // Obtener valores iniciales del formulario si están disponibles
    let L = 0.779; // Valor por defecto
    let R = 0.0905; // Valor por defecto
    let r = 0.0905 - 0.00139; // Valor por defecto
    let omega = 32.99; // Valor por defecto
    
    const lengthInput = document.getElementById('cylinder-length');
    const diameterInput = document.getElementById('outer-diameter');
    const gapInput = document.getElementById('gap');
    const rpmInput = document.getElementById('rpm');
    
    if (lengthInput && diameterInput && gapInput && rpmInput) {
      L = parseFloat(lengthInput.value) / 100;
      R = parseFloat(diameterInput.value) / 200;
      r = R - parseFloat(gapInput.value) / 100;
      omega = parseFloat(rpmInput.value) * (2 * Math.PI) / 60;

      // Añadir event listeners para actualizar la simulación en tiempo real
      lengthInput.addEventListener('input', updateSimulationFromInputs);
      diameterInput.addEventListener('input', updateSimulationFromInputs);
      gapInput.addEventListener('input', updateSimulationFromInputs);
      rpmInput.addEventListener('input', updateSimulationFromInputs);
    }
    
    // Crear cilindros
    createViscosimeterCylinders(L, R, r);
    
    // Rotación de la escena para mejor visualización
    viscosimeterScene.rotation.x = Math.PI / 6;
    
    // Agregar rotación interactiva a la escena
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    
    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });
    
    container.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const deltaMove = {
          x: e.clientX - previousMousePosition.x,
          y: e.clientY - previousMousePosition.y
        };
        
        viscosimeterScene.rotation.y += deltaMove.x * 0.01;
        viscosimeterScene.rotation.x += deltaMove.y * 0.01;
        
        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    });
    
    container.addEventListener('mouseup', () => {
      isDragging = false;
    });
    
    container.addEventListener('mouseleave', () => {
      isDragging = false;
    });
    
    // Responsive handler
    window.addEventListener('resize', onWindowResize);
    
    // Iniciar animación
    animateViscosimeter(omega);
  }
  
  function createViscosimeterCylinders(L, R, r) {
    // Limpiar cilindros existentes si los hay
    if (outerCylinder) viscosimeterScene.remove(outerCylinder);
    if (innerCylinder) viscosimeterScene.remove(innerCylinder);
    if (fluidLayer) viscosimeterScene.remove(fluidLayer);
    
    // Geometrías
    const outerGeometry = new THREE.CylinderGeometry(R, R, L, 32, 1, true);
    const innerGeometry = new THREE.CylinderGeometry(r, r, L * 0.95, 32);
    const fluidGeometry = new THREE.CylinderGeometry(R - 0.001, R - 0.001, L, 32, 1, true);
    
    // Materiales
    const outerMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xcccccc, 
      transparent: true, 
      opacity: 0.7,
      side: THREE.DoubleSide 
    });
    
    const innerMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x4364f7
    });
    
    const fluidMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x6fb1fc, 
      transparent: true, 
      opacity: 0.3,
      side: THREE.DoubleSide 
    });
    
    // Mallas
    outerCylinder = new THREE.Mesh(outerGeometry, outerMaterial);
    innerCylinder = new THREE.Mesh(innerGeometry, innerMaterial);
    fluidLayer = new THREE.Mesh(fluidGeometry, fluidMaterial);
    
    // Añadir a la escena
    viscosimeterScene.add(outerCylinder);
    viscosimeterScene.add(innerCylinder);
    viscosimeterScene.add(fluidLayer);
  }
  
  function updateViscosimeterSimulation(L, R, r, omega) {
    // Detener animación actual
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    
    // Recrear cilindros con nuevas dimensiones
    createViscosimeterCylinders(L, R, r);
    
    // Reiniciar animación con nueva velocidad
    animateViscosimeter(omega);
  }
  
  function animateViscosimeter(omega) {
    animationId = requestAnimationFrame(() => animateViscosimeter(omega));
    
    // Rotar el cilindro interior
    if (innerCylinder) {
      innerCylinder.rotation.y += omega / 60; // Reducir velocidad para visualización
    }
    
    // Renderizar escena
    if (viscosimeterRenderer && viscosimeterScene && viscosimeterCamera) {
      viscosimeterRenderer.render(viscosimeterScene, viscosimeterCamera);
    }
  }
  
  function onWindowResize() {
    const container = document.getElementById('viscometer-canvas');
    if (!container || !viscosimeterCamera || !viscosimeterRenderer) return;
    
    viscosimeterCamera.aspect = container.clientWidth / container.clientHeight;
    viscosimeterCamera.updateProjectionMatrix();
    viscosimeterRenderer.setSize(container.clientWidth, container.clientHeight);
  }
  
  function updateSimulationFromInputs() {
    const lengthInput = document.getElementById('cylinder-length');
    const diameterInput = document.getElementById('outer-diameter');
    const gapInput = document.getElementById('gap');
    const rpmInput = document.getElementById('rpm');
    
    if (lengthInput && diameterInput && gapInput && rpmInput) {
      const L = parseFloat(lengthInput.value) / 100;
      const R = parseFloat(diameterInput.value) / 200;
      const r = R - parseFloat(gapInput.value) / 100;
      const omega = parseFloat(rpmInput.value) * (2 * Math.PI) / 60;
      
      // Solo actualizar si los valores son válidos
      if (L > 0 && R > 0 && r > 0 && r < R && omega >= 0) {
        updateViscosimeterSimulation(L, R, r, omega);
      }
    }
  }
  
  // Inicializar simulación cuando se cargue la página
  initViscosimeterSimulation();
  
  const units = {
    longitud: {
      metro: 1,
      pie: 0.3048,
      pulgada: 0.0254,
      kilometro: 1000,
      milla: 1609.34
    },
    masa: {
      kilogramo: 1,
      gramo: 0.001,
      libra: 0.453592,
      tonelada: 1000
    },
    area: {
      "m²": 1,
      "ft²": 0.092903,
      "cm²": 0.0001,
      "in²": 0.00064516
    },
    tiempo: {
      segundo: 1,
      minuto: 60,
      hora: 3600,
      día: 86400
    },
    corriente: {
      amperio: 1,
      miliamperio: 0.001
    },
    temperatura: {
      celsius: "C",
      fahrenheit: "F",
      kelvin: "K"
    },
    sustancia: {
      mol: 1
    },
    luminosa: {
      candela: 1
    },
    volumen: {
      "m³": 1,
      litro: 0.001,
      galón: 0.00378541,
      "ft³": 0.0283168
    },
    velocidad: {
      "m/s": 1,
      "km/h": 0.277778,
      "mph": 0.44704
    },
    aceleracion: {
      "m/s²": 1,
      "ft/s²": 0.3048
    },
    fuerza: {
      newton: 1,
      kilopondio: 9.80665,
      libra_fuerza: 4.44822
    },
    presion: {
      pascal: 1,
      atm: 101325,
      bar: 100000,
      psi: 6894.76
    },
    trabajo: {
      julio: 1,
      caloria: 4.184,
      kilojulio: 1000,
      BTU: 1055.06
    },
    potencia: {
      watt: 1,
      kilowatt: 1000,
      caballo_de_fuerza: 745.7
    }
  };
  
  const dimensionSelect = document.getElementById("dimension");
  const fromUnit = document.getElementById("fromUnit");
  const toUnit = document.getElementById("toUnit");
  const resultDisplay = document.getElementById("result");
  
  dimensionSelect.addEventListener("change", updateUnitOptions);
  
  function updateUnitOptions() {
    const dimension = dimensionSelect.value;
    const unitSet = units[dimension];
  
    if (!unitSet) return;
  
    let options = "";
    for (const unit in unitSet) {
      options += `<option value="${unit}">${unit}</option>`;
    }
  
    fromUnit.innerHTML = options;
    toUnit.innerHTML = options;
  }
  
  function convert() {
    const dimension = dimensionSelect.value;
    const value = parseFloat(document.getElementById("inputValue").value);
    const from = fromUnit.value;
    const to = toUnit.value;
  
    if (isNaN(value)) {
      resultDisplay.innerText = "Por favor ingresa un número válido.";
      return;
    }
  
    if (dimension === "temperatura") {
      const tempResult = convertTemperature(value, from, to);
      if (tempResult === null) {
        resultDisplay.innerText = "Conversión de temperatura no válida.";
      } else {
        resultDisplay.innerText = `Resultado: ${tempResult.toFixed(2)} ${to}`;
      }
      return;
    }
  
    const unitSet = units[dimension];
    if (!unitSet || !(from in unitSet) || !(to in unitSet)) {
      resultDisplay.innerText = "Conversión no válida.";
      return;
    }
  
    const valueInBase = value * unitSet[from];
    const converted = valueInBase / unitSet[to];
  
    resultDisplay.innerText = `Resultado: ${converted.toFixed(4)} ${to}`;
  }
  
  function convertTemperature(value, from, to) {
    if (from === to) return value;
  
    let celsius;
    switch (from) {
      case "celsius":
        celsius = value;
        break;
      case "fahrenheit":
        celsius = (value - 32) * 5 / 9;
        break;
      case "kelvin":
        celsius = value - 273.15;
        break;
      default:
        return null;
    }
  
    switch (to) {
      case "celsius":
        return celsius;
      case "fahrenheit":
        return (celsius * 9 / 5) + 32;
      case "kelvin":
        return celsius + 273.15;
      default:
        return null;
    }
  }
  
  // Inicializar al cargar
  updateUnitOptions();
  
});
