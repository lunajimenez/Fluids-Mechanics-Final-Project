/**
 * Moody Diagram and Friction Calculator
 * Este archivo implementa la funcionalidad para el diagrama de Moody interactivo
 * y la calculadora de pérdidas por fricción.
 */

document.addEventListener('DOMContentLoaded', function() {
  // Inicializar calculadora de fricción
  setupFrictionCalculator();
  
  // Inicializar diagrama de Moody interactivo
  setupMoodyDiagram();
  
  // Generar el diagrama de Moody
  generateMoodyDiagram();
});

/**
 * Configuración de la calculadora de pérdidas por fricción
 */
function setupFrictionCalculator() {
  const calculateButton = document.getElementById('calculate-friction');
  const roughnessSelect = document.getElementById('roughness');
  const customRoughnessGroup = document.getElementById('custom-roughness-group');
  
  if (!calculateButton || !roughnessSelect) return;
  
  // Mostrar/ocultar campo de rugosidad personalizada
  roughnessSelect.addEventListener('change', function() {
    if (this.value === 'custom') {
      customRoughnessGroup.style.display = 'block';
    } else {
      customRoughnessGroup.style.display = 'none';
    }
  });
  
  // Cálculo de pérdidas por fricción
  calculateButton.addEventListener('click', calculateFrictionLosses);
}

/**
 * Calcula las pérdidas por fricción en la tubería
 */
function calculateFrictionLosses() {
  // Obtener valores de entrada
  const diameter = parseFloat(document.getElementById('pipe-diameter').value) / 1000; // Convertir mm a m
  const length = parseFloat(document.getElementById('pipe-length').value);
  const flowRate = parseFloat(document.getElementById('flow-rate').value) / 1000; // Convertir L/s a m³/s
  const roughnessSelect = document.getElementById('roughness');
  const density = parseFloat(document.getElementById('fluid-density').value);
  const viscosity = parseFloat(document.getElementById('fluid-viscosity').value);
  
  // Validar entrada
  if (isNaN(diameter) || isNaN(length) || isNaN(flowRate) || isNaN(density) || isNaN(viscosity)) {
    alert('Por favor, complete todos los campos con valores numéricos válidos.');
    return;
  }
  
  // Obtener rugosidad
  let roughness;
  if (roughnessSelect.value === 'custom') {
    roughness = parseFloat(document.getElementById('custom-roughness').value) / 1000; // Convertir mm a m
  } else {
    roughness = parseFloat(roughnessSelect.value) / 1000; // Convertir mm a m
  }
  
  // Calcular velocidad
  const area = Math.PI * Math.pow(diameter / 2, 2);
  const velocity = flowRate / area;
  
  // Calcular número de Reynolds
  const reynolds = velocity * diameter / viscosity;
  
  // Determinar régimen de flujo
  let regime;
  if (reynolds < 2300) {
    regime = 'Laminar';
  } else if (reynolds < 4000) {
    regime = 'Transición';
  } else {
    regime = 'Turbulento';
  }
  
  // Calcular rugosidad relativa
  const relativeRoughness = roughness / diameter;
  
  // Calcular factor de fricción
  let frictionFactor;
  
  if (reynolds < 2300) {
    // Flujo laminar
    frictionFactor = 64 / reynolds;
  } else if (reynolds < 4000) {
    // Región de transición - interpolación
    const f_2300 = 64 / 2300;
    const f_4000 = calculateTurbulentFrictionFactor(4000, relativeRoughness);
    frictionFactor = f_2300 + (f_4000 - f_2300) * (reynolds - 2300) / (4000 - 2300);
  } else {
    // Flujo turbulento - ecuación de Colebrook-White
    frictionFactor = calculateTurbulentFrictionFactor(reynolds, relativeRoughness);
  }
  
  // Calcular pérdida de carga (m)
  const headLoss = frictionFactor * (length / diameter) * (Math.pow(velocity, 2) / (2 * 9.81));
  
  // Calcular pérdida de presión (Pa)
  const pressureLoss = frictionFactor * (length / diameter) * (density * Math.pow(velocity, 2) / 2);
  
  // Mostrar resultados
  document.getElementById('result-velocity').textContent = velocity.toFixed(2) + ' m/s';
  document.getElementById('result-reynolds').textContent = reynolds.toFixed(0);
  document.getElementById('result-regime').textContent = regime;
  document.getElementById('result-rel-roughness').textContent = relativeRoughness.toExponential(4);
  document.getElementById('result-friction-factor').textContent = frictionFactor.toFixed(5);
  document.getElementById('result-head-loss').textContent = headLoss.toFixed(2) + ' m';
  document.getElementById('result-pressure-loss').textContent = (pressureLoss / 1000).toFixed(2) + ' kPa';
  
  // Mostrar panel de resultados
  document.getElementById('friction-results').style.display = 'block';
}

/**
 * Calcula el factor de fricción para flujo turbulento usando la ecuación de Colebrook-White
 */
function calculateTurbulentFrictionFactor(reynolds, relativeRoughness) {
  // Valor inicial (aproximación de Swamee-Jain)
  let f = 0.25 / Math.pow(Math.log10(relativeRoughness/3.7 + 5.74/Math.pow(reynolds, 0.9)), 2);
  
  // Iteración para resolver la ecuación implícita de Colebrook-White
  for (let i = 0; i < 20; i++) {
    const f_new = 1 / Math.pow((-2 * Math.log10(relativeRoughness/3.7 + 2.51/(reynolds * Math.sqrt(f)))), 2);
    
    // Verificar convergencia
    if (Math.abs(f - f_new) < 1e-8) {
      return f_new;
    }
    
    f = f_new;
  }
  
  return f;
}

/**
 * Configuración del diagrama de Moody interactivo
 */
function setupMoodyDiagram() {
  const reynoldsSlider = document.getElementById('moody-reynolds');
  const roughnessSlider = document.getElementById('moody-roughness');
  const calculateButton = document.getElementById('calculate-moody');
  
  if (!reynoldsSlider || !roughnessSlider || !calculateButton) return;
  
  // Actualizar valores mostrados al mover los sliders
  reynoldsSlider.addEventListener('input', function() {
    const value = Math.pow(10, parseFloat(this.value));
    document.getElementById('moody-reynolds-value').textContent = value.toExponential(1);
  });
  
  roughnessSlider.addEventListener('input', function() {
    const value = Math.pow(10, parseFloat(this.value));
    document.getElementById('moody-roughness-value').textContent = value.toExponential(4);
  });
  
  // Calcular factor de fricción y mostrar en el diagrama
  calculateButton.addEventListener('click', function() {
    const reynolds = Math.pow(10, parseFloat(reynoldsSlider.value));
    const roughness = Math.pow(10, parseFloat(roughnessSlider.value));
    
    // Calcular factor de fricción
    let frictionFactor;
    
    if (reynolds < 2300) {
      frictionFactor = 64 / reynolds;
    } else {
      frictionFactor = calculateTurbulentFrictionFactor(reynolds, roughness);
    }
    
    // Mostrar resultado
    document.getElementById('moody-friction-factor').textContent = frictionFactor.toFixed(5);
    
    // Posicionar marcador en el diagrama
    positionMarkerOnMoodyDiagram(reynolds, roughness, frictionFactor);
  });
}

/**
 * Posiciona el marcador en el diagrama de Moody
 */
function positionMarkerOnMoodyDiagram(reynolds, roughness, frictionFactor) {
  const diagram = document.getElementById('moody-diagram');
  const marker = document.getElementById('moody-marker');
  
  if (!diagram || !marker) return;
  
  // Obtener dimensiones del diagrama
  const diagramRect = diagram.getBoundingClientRect();
  
  // Calcular posición X (Reynolds)
  // Mapear el rango logarítmico de Reynolds (4e3 a 1e7) al ancho del diagrama
  const minLogRe = Math.log10(4e3);
  const maxLogRe = Math.log10(1e7);
  const logRe = Math.log10(reynolds);
  
  // Calcular posición normalizada (0-1)
  const normalizedX = (logRe - minLogRe) / (maxLogRe - minLogRe);
  
  // Calcular posición Y (factor de fricción)
  // Mapear el rango logarítmico de f (0.008 a 0.1) a la altura del diagrama
  const minLogF = Math.log10(0.008);
  const maxLogF = Math.log10(0.1);
  const logF = Math.log10(frictionFactor);
  
  // Calcular posición normalizada (0-1), invertida porque el eje Y crece hacia abajo en pantalla
  const normalizedY = 1 - (logF - minLogF) / (maxLogF - minLogF);
  
  // Aplicar posición al marcador (con margen para el borde del diagrama)
  const margin = 0.1; // 10% de margen en cada lado
  const effectiveWidth = diagramRect.width * (1 - 2 * margin);
  const effectiveHeight = diagramRect.height * (1 - 2 * margin);
  
  const x = margin * diagramRect.width + normalizedX * effectiveWidth;
  const y = margin * diagramRect.height + normalizedY * effectiveHeight;
  
  marker.style.left = x + 'px';
  marker.style.top = y + 'px';
  marker.style.display = 'block';
}

/**
 * Genera el diagrama de Moody usando la biblioteca de gráficos (si está disponible)
 * Si no hay biblioteca disponible, se usa la imagen estática
 */
function generateMoodyDiagram() {
  // Verificar si tenemos acceso a una biblioteca de gráficos (como Chart.js)
  // Si no, usamos la imagen estática que ya está en el HTML
  
  // Este es un marcador de posición para una futura implementación
  // con una biblioteca de gráficos que permita generar el diagrama dinámicamente
} 