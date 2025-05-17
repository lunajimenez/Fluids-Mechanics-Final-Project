/**
 * Calculadoras de Fuerzas Hidrostáticas
 * Este archivo contiene las funciones para calcular fuerzas hidrostáticas
 * en diferentes tipos de superficies sumergidas.
 */

document.addEventListener('DOMContentLoaded', function() {
  // Inicializar todas las calculadoras
  setupCilindricaCalculator();
  setupCompuertaCalculator();
  setupEsfericaCalculator();
  setupInclinadaCalculator();
});

/**
 * Calculadora de Fuerza Hidrostática en Compuerta Cilíndrica
 */
function setupCilindricaCalculator() {
  const calcularButton = document.getElementById('calcular-cilindrica');
  if (!calcularButton) return;

  calcularButton.addEventListener('click', function() {
    // Obtener valores
    const gamma = parseFloat(document.getElementById('gamma-cilindrica').value);
    const h = parseFloat(document.getElementById('h-cilindrica').value);
    const A = parseFloat(document.getElementById('A-cilindrica').value);
    const theta = parseFloat(document.getElementById('theta-cilindrica').value);
    const L = parseFloat(document.getElementById('L-cilindrica').value);

    // Validar entrada
    if (isNaN(gamma) || isNaN(h) || isNaN(A) || isNaN(theta) || isNaN(L)) {
      alert('Por favor, ingrese todos los valores numéricos requeridos.');
      return;
    }

    // Conversión de ángulo a radianes
    const thetaRad = theta * Math.PI / 180;

    // Cálculos
    const Fh = gamma * h * A;
    const Fv = gamma * A * L * Math.sin(thetaRad);
    const Fr = Math.sqrt(Fh * Fh + Fv * Fv);
    const alpha = Math.atan(Fv / Fh) * 180 / Math.PI;

    // Mostrar resultados
    document.getElementById('fh-cilindrica').textContent = Fh.toFixed(2) + ' N';
    document.getElementById('fv-cilindrica').textContent = Fv.toFixed(2) + ' N';
    document.getElementById('fr-cilindrica').textContent = Fr.toFixed(2) + ' N';
    document.getElementById('alpha-cilindrica').textContent = alpha.toFixed(2);

    // Mostrar panel de resultados
    document.getElementById('cilindrica-result').style.display = 'block';

    // Actualizar visualización (opcional)
    updateCilindricaVisualization(Fh, Fv, Fr, alpha);
  });
}

/**
 * Actualiza la visualización de la compuerta cilíndrica
 */
function updateCilindricaVisualization(Fh, Fv, Fr, alpha) {
  // Normalizar fuerzas para visualización
  const maxForce = Math.max(Fh, Fv, Fr);
  const scale = 30 / maxForce;
  
  // Actualizar flechas
  const fhArrow = document.getElementById('fh-arrow');
  const fvArrow = document.getElementById('fv-arrow');
  const frArrow = document.getElementById('fr-arrow');
  
  if (fhArrow && fvArrow && frArrow) {
    fhArrow.style.width = (Fh * scale) + '%';
    fvArrow.style.height = (Fv * scale) + '%';
    frArrow.style.width = (Fr * scale / 2) + '%';
    frArrow.style.transform = `rotate(${alpha}deg) translateY(-50%)`;
  }
}

/**
 * Calculadora de Fuerza Mínima para Mantener Cerrada una Compuerta
 */
function setupCompuertaCalculator() {
  const calcularButton = document.getElementById('calcular-compuerta');
  if (!calcularButton) return;

  calcularButton.addEventListener('click', function() {
    // Obtener valores
    const ancho = parseFloat(document.getElementById('ancho-compuerta').value);
    const altura = parseFloat(document.getElementById('altura-compuerta').value);
    const h = parseFloat(document.getElementById('h-fluido').value);
    const densidadRelativa = parseFloat(document.getElementById('densidad-relativa').value);

    // Validar entrada
    if (isNaN(ancho) || isNaN(altura) || isNaN(h) || isNaN(densidadRelativa)) {
      alert('Por favor, ingrese todos los valores numéricos requeridos.');
      return;
    }

    // Constantes
    const g = 9.81;  // m/s² (gravedad)
    const gammaAgua = 9810;  // N/m³ (peso específico del agua)

    // Cálculos
    const gammaFluido = gammaAgua * densidadRelativa;  // Peso específico del fluido (N/m³)
    const A = ancho * altura;  // Área de la compuerta (m²)
    const hC = altura / 2;  // Centroide desde la base
    const hP = h + hC;  // Profundidad del centroide desde la superficie libre

    // Fuerza hidrostática total
    const Fh = gammaFluido * A * hP;  // N

    // Distancia desde la bisagra (pivote) al centroide: momento respecto a bisagra
    const brazoMomento = hC;  // m (desde bisagra que está al tope)
    const momento = Fh * brazoMomento;  // N·m

    // Brazo de la fuerza F (está al extremo inferior de la compuerta)
    const brazoF = altura;  // m

    // Fuerza F requerida (en N)
    const F = momento / brazoF;

    // Convertimos a kN
    const FkN = F / 1000;

    // Mostrar resultados
    document.getElementById('fuerza-hidrostatica').textContent = Fh.toFixed(2) + ' N';
    document.getElementById('fuerza-minima').textContent = FkN.toFixed(2) + ' kN';

    // Mostrar panel de resultados
    document.getElementById('compuerta-result').style.display = 'block';

    // Actualizar visualización (opcional)
    updateCompuertaVisualization(h, altura);
  });
}

/**
 * Actualiza la visualización de la compuerta
 */
function updateCompuertaVisualization(h, altura) {
  // Implementar si se desea una visualización dinámica
}

/**
 * Calculadora de Fuerza Hidrostática en Superficie Esférica
 */
function setupEsfericaCalculator() {
  const calcularButton = document.getElementById('calcular-esferica');
  if (!calcularButton) return;

  calcularButton.addEventListener('click', function() {
    // Obtener valores
    const gamma = parseFloat(document.getElementById('gamma-esferica').value);
    const h = parseFloat(document.getElementById('h-esferica').value);
    const R = parseFloat(document.getElementById('R-esferica').value);
    const H = parseFloat(document.getElementById('H-esferica').value);

    // Validar entrada
    if (isNaN(gamma) || isNaN(h) || isNaN(R) || isNaN(H)) {
      alert('Por favor, ingrese todos los valores numéricos requeridos.');
      return;
    }

    // Cálculos intermedios
    const hCentroide = H;  // Para una esfera completa, el centroide está en el centro
    const AProyectada = Math.PI * R * R;  // Área del círculo proyectado

    // Fuerza horizontal (igual que en cilindros)
    const Fh = gamma * hCentroide * AProyectada;

    // Fuerza vertical (peso del volumen desplazado)
    const volumenDesplazado = (4/3) * Math.PI * Math.pow(R, 3);
    const Fv = gamma * volumenDesplazado;

    // Resultante
    const Fr = Math.sqrt(Fh * Fh + Fv * Fv);
    const alpha = Math.atan(Fv / Fh) * 180 / Math.PI;

    // Mostrar resultados
    document.getElementById('fh-esferica').textContent = Fh.toFixed(2) + ' N';
    document.getElementById('fv-esferica').textContent = Fv.toFixed(2) + ' N';
    document.getElementById('fr-esferica').textContent = Fr.toFixed(2) + ' N';
    document.getElementById('alpha-esferica').textContent = alpha.toFixed(2);

    // Mostrar panel de resultados
    document.getElementById('esferica-result').style.display = 'block';

    // Actualizar visualización (opcional)
    updateEsfericaVisualization(Fh, Fv);
  });
}

/**
 * Actualiza la visualización de la superficie esférica
 */
function updateEsfericaVisualization(Fh, Fv) {
  // Normalizar fuerzas para visualización
  const maxForce = Math.max(Fh, Fv);
  const scale = 25 / maxForce;
  
  // Actualizar flechas
  const fhArrow = document.getElementById('fh-esferica-arrow');
  const fvArrow = document.getElementById('fv-esferica-arrow');
  
  if (fhArrow && fvArrow) {
    fhArrow.style.width = (Fh * scale) + '%';
    fvArrow.style.height = (Fv * scale) + '%';
  }
}

/**
 * Calculadora para Compuerta Inclinada
 */
function setupInclinadaCalculator() {
  const calcularButton = document.getElementById('calcular-inclinada');
  if (!calcularButton) return;

  calcularButton.addEventListener('click', function() {
    // Obtener valores
    const peso = parseFloat(document.getElementById('peso-inclinada').value);
    const ancho = parseFloat(document.getElementById('ancho-inclinada').value);
    const largo = parseFloat(document.getElementById('largo-inclinada').value);
    const betaGrados = parseFloat(document.getElementById('beta-inclinada').value);
    const h1 = parseFloat(document.getElementById('h1-inclinada').value);
    const h2Pulgadas = parseFloat(document.getElementById('h2-inclinada').value);

    // Validar entrada
    if (isNaN(peso) || isNaN(ancho) || isNaN(largo) || isNaN(betaGrados) || isNaN(h1) || isNaN(h2Pulgadas)) {
      alert('Por favor, ingrese todos los valores numéricos requeridos.');
      return;
    }

    // Conversión de unidades
    const h2 = h2Pulgadas / 12;  // convertir a pies
    const beta = betaGrados * Math.PI / 180;  // convertir a radianes
    const gammaAgua = 62.4;  // lb/ft³ (peso específico del agua)

    // Altura desde la superficie al centroide (hc)
    const hc = h1 - h2 / 2;

    // Área de la compuerta
    const A = ancho * largo;

    // Fuerza hidrostática
    const Fh = gammaAgua * A * hc;

    // Momento de inercia para un rectángulo vertical
    const I = (ancho * Math.pow(largo, 3)) / 12;

    // Profundidad al centro de presión
    const hp = hc + (I * Math.pow(Math.sin(beta), 2)) / (A * hc);

    // Distancia desde el punto de bisagra B al centroide
    const distanciaCentroide = largo / 2;

    // Brazo del momento de la fuerza hidrostática respecto al punto B
    const brazoHidrostatico = distanciaCentroide * Math.cos(beta);

    // Fuerza mínima F requerida para abrir la compuerta (equilibrio de momentos)
    const FMinima = Fh * brazoHidrostatico / distanciaCentroide;

    // Mostrar resultados
    document.getElementById('hp-inclinada').textContent = hp.toFixed(2);
    document.getElementById('fh-inclinada').textContent = Fh.toFixed(2);
    document.getElementById('fmin-inclinada').textContent = FMinima.toFixed(2);

    // Mostrar panel de resultados
    document.getElementById('inclinada-result').style.display = 'block';

    // Actualizar visualización (opcional)
    updateInclinadaVisualization(betaGrados, hp, largo);
  });
}

/**
 * Actualiza la visualización de la compuerta inclinada
 */
function updateInclinadaVisualization(betaGrados, hp, largo) {
  // Actualizar rotación de la compuerta
  const compuerta = document.querySelector('#inclinada-visualization > div:first-child');
  if (compuerta) {
    compuerta.style.transform = `rotate(${betaGrados}deg)`;
  }
  
  // Actualizar posición del centro de presión
  const cpMarker = document.getElementById('cp-marker');
  if (cpMarker) {
    const posY = 30 + (hp / largo) * 50;
    cpMarker.style.top = posY + '%';
  }
} 