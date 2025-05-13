<!-- js/main.js -->
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
});
