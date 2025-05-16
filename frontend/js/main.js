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
