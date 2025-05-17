/**
 * menu-fix.js - Script simplificado y robusto para el menú de navegación
 */

document.addEventListener('DOMContentLoaded', function() {
  // Evitar inicialización duplicada
  if (window.menuInitialized) return;
  window.menuInitialized = true;
  
  // Elementos del menú
  const mainMenu = document.querySelector('.main-menu');
  const menuToggle = document.getElementById('menu-toggle');
  const allSubmenus = document.querySelectorAll('.has-submenu');
  
  // Cerrar todos los submenús al inicio
  function closeAllSubmenus(exceptElement = null) {
    allSubmenus.forEach(submenu => {
      if (submenu !== exceptElement) {
        submenu.classList.remove('active');
      }
    });
  }
  
  // Inicializar - asegurar que todo esté cerrado al inicio
  closeAllSubmenus();
  
  // Inicializar menú móvil
  if (window.innerWidth <= 768 && mainMenu) {
    mainMenu.style.display = 'none';
    if (menuToggle) menuToggle.textContent = '☰';
  } else if (mainMenu) {
    mainMenu.style.display = 'flex';
  }
  
  // Toggle del menú móvil
  if (menuToggle && mainMenu) {
    // Remover eventos anteriores para evitar duplicación
    const newMenuToggle = menuToggle.cloneNode(true);
    if (menuToggle.parentNode) {
      menuToggle.parentNode.replaceChild(newMenuToggle, menuToggle);
    }
    
    newMenuToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      const isVisible = window.getComputedStyle(mainMenu).display !== 'none';
      
      if (isVisible) {
        mainMenu.style.display = 'none';
        newMenuToggle.textContent = '☰';
        closeAllSubmenus();
      } else {
        mainMenu.style.display = 'flex';
        newMenuToggle.textContent = '✕';
      }
    });
  }
  
  // Manejar clicks en triggers de submenús - método directo
  document.addEventListener('click', function(e) {
    // Si se hace clic en un trigger de submenú
    if (e.target.classList.contains('menu-trigger') || e.target.closest('.menu-trigger')) {
      e.preventDefault();
      e.stopPropagation();
      
      const trigger = e.target.classList.contains('menu-trigger') ? e.target : e.target.closest('.menu-trigger');
      const parent = trigger.parentElement;
      
      if (parent.classList.contains('active')) {
        // Si ya está activo, cerrarlo
        parent.classList.remove('active');
      } else {
        // Si no está activo, cerrar otros y abrir este
        closeAllSubmenus();
        parent.classList.add('active');
      }
      return;
    }
    
    // Si se hace clic fuera del menú, cerrar todos los submenús
    if (!e.target.closest('.main-menu')) {
      closeAllSubmenus();
    }
  });
  
  // Ajuste en redimensionamiento
  window.addEventListener('resize', function() {
    if (window.innerWidth <= 768) {
      // En móvil - mantener estado actual
      if (mainMenu && window.getComputedStyle(mainMenu).display !== 'none') {
        mainMenu.style.display = 'flex';
      }
    } else {
      // En desktop, siempre mostrar
      if (mainMenu) mainMenu.style.display = 'flex';
    }
  });
  
  console.log('Menú inicializado correctamente - versión simplificada');
}); 