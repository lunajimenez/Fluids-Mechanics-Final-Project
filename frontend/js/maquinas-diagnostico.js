console.log('Script de diagnóstico de simulaciones cargado');

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM cargado completamente - Diagnóstico');
  
  // Comprobar si THREE.js está disponible
  if (typeof THREE === 'undefined') {
    console.error('ERROR: THREE.js no está disponible');
  } else {
    console.log('THREE.js disponible:', THREE.REVISION);
    
    if (typeof THREE.OrbitControls === 'undefined') {
      console.error('ERROR: THREE.OrbitControls no está disponible');
    } else {
      console.log('THREE.OrbitControls disponible');
    }
  }
  
  // Verificar elementos canvas
  const potenciaSimulation = document.getElementById('potencia-simulation');
  console.log('Canvas potencia-simulation:', potenciaSimulation ? 'Encontrado' : 'NO ENCONTRADO');
  
  const eficienciaSimulation = document.getElementById('eficiencia-simulation');
  console.log('Canvas eficiencia-simulation:', eficienciaSimulation ? 'Encontrado' : 'NO ENCONTRADO');
  
  const curvasCanvas = document.getElementById('curvas-canvas');
  console.log('Canvas curvas-canvas:', curvasCanvas ? 'Encontrado' : 'NO ENCONTRADO');
  
  // Verificar controles
  const controles = [
    'caudal', 'altura', 'fluido',
    'potencia-entrada', 'velocidad', 'perdidas',
    'velocidad-nominal', 'diametro'
  ];
  
  console.log('--- Estado de controles ---');
  controles.forEach(id => {
    const elemento = document.getElementById(id);
    console.log(`Control ${id}:`, elemento ? 'Encontrado' : 'NO ENCONTRADO');
  });
});
