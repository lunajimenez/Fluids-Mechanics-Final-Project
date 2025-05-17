// Simulaciones para ejercicios de tuberías en paralelo y en serie

document.addEventListener('DOMContentLoaded', function() {
  // Inicializar las simulaciones si existen los elementos en la página
  setupTuberiasParaleloSimulation();
  setupTuberiasSerieSimulation();
});

// Constantes físicas
const GRAVEDAD = 9.81;  // m/s²
const RUGOSIDAD = 4.6e-5;  // m (PVC)
const VISCOSIDAD = 8.94e-7;  // m²/s (agua a 25°C)
const DENSIDAD_AGUA = 997;  // kg/m³

// Coeficientes de pérdidas menores
const K1 = [340, 30];  // Válvula de globo + codo estándar
const K2 = [150, 20];  // Válvula de ángulo + codo radio largo

// Simulación de tuberías en paralelo
function setupTuberiasParaleloSimulation() {
  const calculateButton = document.getElementById('calculate-paralelo');
  const resultsDiv = document.getElementById('paralelo-results');
  const visualizationDiv = document.getElementById('paralelo-visualization');
  
  if (!calculateButton) return; // Si no existe el botón, salir
  
  // Configurar el canvas para la visualización
  const canvas = document.createElement('canvas');
  canvas.width = visualizationDiv.clientWidth;
  canvas.height = 400;
  visualizationDiv.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  
  // Dibujar visualización inicial
  drawParaleloVisualization(ctx, canvas.width, canvas.height, 0.01, 0.05, 0.03, 50, 30, 0.006, 0.004);
  
  calculateButton.addEventListener('click', () => {
    // Obtener valores de entrada
    const Q_total = parseFloat(document.getElementById('paralelo-caudal').value) / 1000; // Convertir a m³/s
    const D1 = parseFloat(document.getElementById('paralelo-d1').value) / 1000; // Convertir a m
    const D2 = parseFloat(document.getElementById('paralelo-d2').value) / 1000; // Convertir a m
    const L1 = parseFloat(document.getElementById('paralelo-l1').value);
    const L2 = parseFloat(document.getElementById('paralelo-l2').value);
    
    // Método de Newton-Raphson para encontrar la distribución de caudal
    let Q1 = Q_total * 0.6;  // Estimación inicial
    const tolerancia = 1e-6;
    const iteraciones = 50;
    
    for (let i = 0; i < iteraciones; i++) {
      let Q2 = Q_total - Q1;
      
      // Calcular pérdidas de carga en cada ramal
      let hL1 = calcularPerdidasCarga(Q1, D1, L1, K1);
      let hL2 = calcularPerdidasCarga(Q2, D2, L2, K2);
      
      // Función objetivo (diferencia de pérdidas)
      let F = hL1.total - hL2.total;
      
      // Cálculo de derivada numérica
      const delta = 1e-6;
      let hL1_d = calcularPerdidasCarga(Q1 + delta, D1, L1, K1);
      let hL2_d = calcularPerdidasCarga(Q2 - delta, D2, L2, K2);
      let dF = (hL1_d.total - hL2_d.total - F) / delta;
      
      // Actualizar caudal
      Q1 -= F / dF;
      
      // Asegurar valores físicamente posibles
      Q1 = Math.max(0.001, Math.min(Q1, Q_total - 0.001));
      
      if (Math.abs(F) < tolerancia) {
        break;
      }
    }
    
    // Resultados finales
    const Q2 = Q_total - Q1;
    const hL1 = calcularPerdidasCarga(Q1, D1, L1, K1);
    const hL2 = calcularPerdidasCarga(Q2, D2, L2, K2);
    const delta_p = DENSIDAD_AGUA * GRAVEDAD * hL1.total;  // ΔP = ρ*g*hL
    
    // Mostrar resultados
    resultsDiv.innerHTML = `
      <table class="results-table">
        <tr class="header-row"><th colspan="2">Resultados del Sistema en Paralelo</th></tr>
        <tr><td>Caudal ramal 1:</td><td>${(Q1*1000).toFixed(2)} L/s</td></tr>
        <tr><td>Caudal ramal 2:</td><td>${(Q2*1000).toFixed(2)} L/s</td></tr>
        <tr><td>Pérdidas por fricción ramal 1:</td><td>${hL1.friccion.toFixed(4)} m</td></tr>
        <tr><td>Pérdidas menores ramal 1:</td><td>${hL1.menores.toFixed(4)} m</td></tr>
        <tr><td>Pérdidas totales ramal 1:</td><td>${hL1.total.toFixed(4)} m</td></tr>
        <tr><td>Pérdidas por fricción ramal 2:</td><td>${hL2.friccion.toFixed(4)} m</td></tr>
        <tr><td>Pérdidas menores ramal 2:</td><td>${hL2.menores.toFixed(4)} m</td></tr>
        <tr><td>Pérdidas totales ramal 2:</td><td>${hL2.total.toFixed(4)} m</td></tr>
        <tr><td>Diferencia entre pérdidas:</td><td>${Math.abs(hL1.total - hL2.total).toExponential(2)} m</td></tr>
        <tr><td>Caída de presión (ΔP):</td><td>${(delta_p/1000).toFixed(2)} kPa</td></tr>
      </table>
    `;
    
    // Actualizar visualización
    drawParaleloVisualization(ctx, canvas.width, canvas.height, D1, D2, Q_total, L1, L2, Q1, Q2);
  });
}

// Función para calcular pérdidas de carga
function calcularPerdidasCarga(caudal, diametro, longitud, coeficientes_K) {
  const area = Math.PI * (diametro**2) / 4;
  const velocidad = caudal / area;
  const reynolds = velocidad * diametro / VISCOSIDAD;
  
  const f = calcularFactorFriccion(reynolds, diametro);
  
  // Pérdidas por fricción
  const hf = f * (longitud/diametro) * (velocidad**2)/(2*GRAVEDAD);
  
  // Pérdidas menores
  const hm = coeficientes_K.reduce((sum, k) => sum + k, 0) * (velocidad**2)/(2*GRAVEDAD);
  
  return {
    friccion: hf,
    menores: hm,
    total: hf + hm
  };
}

// Función para calcular el factor de fricción
function calcularFactorFriccion(reynolds, diametro) {
  if (reynolds < 2000) {
    return reynolds !== 0 ? 64 / reynolds : 0.02;
  }
  
  let f = 0.02;
  for (let i = 0; i < 100; i++) {
    const termino = (RUGOSIDAD/(3.7*diametro)) + (2.51/(reynolds*Math.sqrt(f)));
    const nuevo_f = (-2 * Math.log10(termino)) ** -2;
    
    if (Math.abs(nuevo_f - f) < 1e-8) {
      return nuevo_f;
    }
    f = nuevo_f;
  }
  return f;
}

// Función para dibujar la visualización del sistema en paralelo
function drawParaleloVisualization(ctx, width, height, D1, D2, Q_total, L1, L2, Q1, Q2) {
  // Limpiar canvas
  ctx.clearRect(0, 0, width, height);
  
  // Dimensiones y posiciones
  const margin = 40;
  const centerY = height / 2;
  const startX = margin;
  const endX = width - margin;
  const branchGap = height / 4;
  
  // Dibujar tuberías principales
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#4364f7';
  
  // Tubería de entrada
  ctx.beginPath();
  ctx.moveTo(startX, centerY);
  ctx.lineTo(startX + 50, centerY);
  ctx.stroke();
  
  // Tubería de salida
  ctx.beginPath();
  ctx.moveTo(endX - 50, centerY);
  ctx.lineTo(endX, centerY);
  ctx.stroke();
  
  // Dibujar ramales
  const branch1Y = centerY - branchGap;
  const branch2Y = centerY + branchGap;
  const branchStartX = startX + 50;
  const branchEndX = endX - 50;
  
  // Escalar diámetros para visualización
  const maxDiameter = 20;
  const d1Scaled = Math.max(6, (D1 / 0.1) * maxDiameter);
  const d2Scaled = Math.max(6, (D2 / 0.1) * maxDiameter);
  
  // Ramal 1
  ctx.lineWidth = d1Scaled;
  ctx.beginPath();
  ctx.moveTo(branchStartX, centerY);
  ctx.lineTo(branchStartX + 30, branch1Y);
  ctx.lineTo(branchEndX - 30, branch1Y);
  ctx.lineTo(branchEndX, centerY);
  ctx.stroke();
  
  // Ramal 2
  ctx.lineWidth = d2Scaled;
  ctx.beginPath();
  ctx.moveTo(branchStartX, centerY);
  ctx.lineTo(branchStartX + 30, branch2Y);
  ctx.lineTo(branchEndX - 30, branch2Y);
  ctx.lineTo(branchEndX, centerY);
  ctx.stroke();
  
  // Dibujar accesorios
  // Válvula de globo en ramal 1
  drawValve(ctx, branchStartX + 80, branch1Y, d1Scaled, 'globo');
  // Codo estándar en ramal 1
  drawElbow(ctx, branchEndX - 80, branch1Y, d1Scaled);
  
  // Válvula de ángulo en ramal 2
  drawValve(ctx, branchStartX + 80, branch2Y, d2Scaled, 'angulo');
  // Codo radio largo en ramal 2
  drawElbow(ctx, branchEndX - 80, branch2Y, d2Scaled, true);
  
  // Dibujar flechas de flujo
  // Entrada
  drawFlowArrow(ctx, startX + 25, centerY, 20, 'right', Q_total * 1000);
  
  // Ramales
  if (Q1 > 0) {
    drawFlowArrow(ctx, branchStartX + 100, branch1Y, 20, 'right', Q1 * 1000);
  }
  if (Q2 > 0) {
    drawFlowArrow(ctx, branchStartX + 100, branch2Y, 20, 'right', Q2 * 1000);
  }
  
  // Salida
  drawFlowArrow(ctx, endX - 25, centerY, 20, 'right', Q_total * 1000);
  
  // Etiquetas
  ctx.font = '14px Arial';
  ctx.fillStyle = '#2d3748';
  ctx.textAlign = 'center';
  
  // Etiquetas de ramales
  ctx.fillText(`Ramal 1: Ø${(D1*1000).toFixed(0)} mm, L=${L1} m`, width/2, branch1Y - 25);
  ctx.fillText(`Ramal 2: Ø${(D2*1000).toFixed(0)} mm, L=${L2} m`, width/2, branch2Y + 35);
  
  // Etiqueta de caudal total
  ctx.fillText(`Caudal total: ${(Q_total*1000).toFixed(2)} L/s`, startX + 100, centerY - 25);
}

// Simulación de tuberías en serie
function setupTuberiasSerieSimulation() {
  const calculateButton = document.getElementById('calculate-serie');
  const resultsDiv = document.getElementById('serie-results');
  const visualizationDiv = document.getElementById('serie-visualization');
  
  if (!calculateButton) return; // Si no existe el botón, salir
  
  // Configurar el canvas para la visualización
  const canvas = document.createElement('canvas');
  canvas.width = visualizationDiv.clientWidth;
  canvas.height = 400;
  visualizationDiv.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  
  // Dibujar visualización inicial
  drawSerieVisualization(ctx, canvas.width, canvas.height, 0.05, 0.15, 10, 15, 1, 0.01, 2);
  
  calculateButton.addEventListener('click', () => {
    // Obtener valores de entrada
    const Da = parseFloat(document.getElementById('serie-da').value) / 1000; // Convertir a m
    const Db = parseFloat(document.getElementById('serie-db').value) / 1000; // Convertir a m
    const La = parseFloat(document.getElementById('serie-la').value);
    const Lb = parseFloat(document.getElementById('serie-lb').value);
    const Pb = parseFloat(document.getElementById('serie-pb').value) * 1e6; // Convertir a Pa
    const Q = parseFloat(document.getElementById('serie-q').value) / 1000; // Convertir a m³/s
    const ha = parseFloat(document.getElementById('serie-ha').value);
    
    // Constantes físicas
    const gamma = 9770;       // Peso específico del agua (N/m³)
    const mu = 8.03e-7;       // Viscosidad cinemática (m²/s)
    const epsilon = 4.6e-5;   // Rugosidad acero comercial (m)
    const g = 9.81;           // Gravedad (m/s²)
    
    // Cálculos intermedios
    const Aa = Math.PI * (Da**2) / 4;
    const Ab = Math.PI * (Db**2) / 4;
    const Va = Q / Aa;
    const Vb = Q / Ab;
    
    const Re_a = (Va * Da) / mu;
    const Re_b = (Vb * Db) / mu;
    
    const fa = calcularFactorFriccionExcel(epsilon, Da, Re_a);
    const fb = calcularFactorFriccionExcel(epsilon, Db, Re_b);
    
    // Pérdidas por fricción
    const hLa = fa * (La / Da) * (Va**2) / (2 * g);
    const hLb = fb * (Lb / Db) * (Vb**2) / (2 * g);
    
    // Pérdidas en codos (2 codos)
    const k_codo = 20;
    const hLcodos = 2 * k_codo * fa * (Va**2) / (2 * g);
    
    // Pérdida por expansión súbita
    const relacion = Db / Da;
    const k_exp = interpolarK(relacion);
    const hL_exp = k_exp * (Va**2) / (2 * g);
    
    // Pérdida total
    const hL_total = hLa + hLb + hLcodos + hL_exp;
    
    // Cálculo de presión en A
    const termino_velocidad = (Vb**2 - Va**2) / (2 * g);
    const termino_presion = Pb / gamma;
    const PA = gamma * (termino_velocidad + termino_presion - ha + hL_total);
    
    // Mostrar resultados
    resultsDiv.innerHTML = `
      <table class="results-table">
        <tr class="header-row"><th colspan="2">Resultados del Sistema en Serie</th></tr>
        <tr><td>Velocidad en tubería 2\":</td><td>${Va.toFixed(2)} m/s</td></tr>
        <tr><td>Velocidad en tubería 6\":</td><td>${Vb.toFixed(2)} m/s</td></tr>
        <tr><td>Número de Reynolds (2\"):</td><td>${Re_a.toFixed(1)}</td></tr>
        <tr><td>Número de Reynolds (6\"):</td><td>${Re_b.toFixed(1)}</td></tr>
        <tr><td>Pérdidas por fricción (2\"):</td><td>${hLa.toFixed(2)} m</td></tr>
        <tr><td>Pérdidas por fricción (6\"):</td><td>${hLb.toFixed(2)} m</td></tr>
        <tr><td>Pérdidas en codos:</td><td>${hLcodos.toFixed(2)} m</td></tr>
        <tr><td>Pérdida por expansión:</td><td>${hL_exp.toFixed(2)} m</td></tr>
        <tr><td>Pérdidas totales:</td><td>${hL_total.toFixed(2)} m</td></tr>
        <tr><td>Presión en punto A:</td><td>${(PA/1e6).toFixed(3)} MPa</td></tr>
      </table>
    `;
    
    // Actualizar visualización
    drawSerieVisualization(ctx, canvas.width, canvas.height, Da, Db, La, Lb, Pb/1e6, Q, ha);
  });
}

// Función para calcular el factor de fricción usando la fórmula del Excel
function calcularFactorFriccionExcel(epsilon, diametro, reynolds) {
  if (reynolds === 0) {
    return 0.0;
  }
  try {
    const termino = (epsilon/(3.7*diametro)) + (5.74/(reynolds**0.9));
    return 0.25 / (Math.log10(termino))**2;
  } catch {
    return 0.02;  // Valor por defecto en caso de error
  }
}

// Función para interpolar el coeficiente de pérdida para expansión súbita
function interpolarK(relacion_diametros) {
  // Datos de la tabla
  const datos = {
    2.5: 0.6,
    3: 0.67,
    9: 0.58,
    12: 0.65
  };
  const claves = Object.keys(datos).map(Number).sort((a, b) => a - b);
  
  if (relacion_diametros <= claves[0]) {
    return datos[claves[0]];
  } else if (relacion_diametros >= claves[claves.length-1]) {
    return datos[claves[claves.length-1]];
  }
  
  // Buscar intervalo de interpolación
  for (let i = 0; i < claves.length-1; i++) {
    if (claves[i] <= relacion_diametros && relacion_diametros <= claves[i+1]) {
      const x0 = claves[i];
      const x1 = claves[i+1];
      const y0 = datos[x0];
      const y1 = datos[x1];
      return y0 + (y1 - y0)*(relacion_diametros - x0)/(x1 - x0);
    }
  }
  return 0.6;  // Valor por defecto
}

// Función para dibujar la visualización del sistema en serie
function drawSerieVisualization(ctx, width, height, Da, Db, La, Lb, Pb, Q, ha) {
  // Limpiar canvas
  ctx.clearRect(0, 0, width, height);
  
  // Dimensiones y posiciones
  const margin = 40;
  const startX = margin;
  const endX = width - margin;
  const centerY = height / 2;
  
  // Escalar diámetros para visualización
  const maxDiameter = 30;
  const daScaled = Math.max(10, (Da / 0.15) * maxDiameter);
  const dbScaled = Math.max(15, (Db / 0.15) * maxDiameter);
  
  // Punto de expansión
  const expansionX = startX + (endX - startX) * 0.6;
  
  // Dibujar tubería pequeña (2")
  ctx.lineWidth = daScaled;
  ctx.strokeStyle = '#4364f7';
  ctx.beginPath();
  ctx.moveTo(startX, centerY);
  ctx.lineTo(expansionX, centerY);
  ctx.stroke();
  
  // Dibujar tubería grande (6")
  ctx.lineWidth = dbScaled;
  ctx.beginPath();
  ctx.moveTo(expansionX, centerY);
  ctx.lineTo(endX, centerY);
  ctx.stroke();
  
  // Dibujar expansión
  ctx.fillStyle = '#2d3748';
  ctx.beginPath();
  ctx.moveTo(expansionX - 5, centerY - daScaled/2);
  ctx.lineTo(expansionX + 5, centerY - dbScaled/2);
  ctx.lineTo(expansionX + 5, centerY + dbScaled/2);
  ctx.lineTo(expansionX - 5, centerY + daScaled/2);
  ctx.closePath();
  ctx.fill();
  
  // Dibujar codos
  drawElbow(ctx, startX + 80, centerY, daScaled);
  drawElbow(ctx, startX + 160, centerY, daScaled);
  
  // Dibujar puntos A y B
  drawPoint(ctx, startX + 40, centerY, 'A');
  drawPoint(ctx, endX - 40, centerY, 'B');
  
  // Dibujar altura ha
  const groundY = centerY + 100;
  ctx.strokeStyle = '#aaa';
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  
  // Línea de referencia
  ctx.beginPath();
  ctx.moveTo(startX, groundY);
  ctx.lineTo(endX, groundY);
  ctx.stroke();
  
  // Altura ha
  ctx.beginPath();
  ctx.moveTo(startX + 40, centerY);
  ctx.lineTo(startX + 40, groundY);
  ctx.stroke();
  
  // Altura en B
  ctx.beginPath();
  ctx.moveTo(endX - 40, centerY);
  ctx.lineTo(endX - 40, groundY);
  ctx.stroke();
  
  ctx.setLineDash([]);
  
  // Dibujar flechas de flujo
  drawFlowArrow(ctx, startX + 120, centerY, 20, 'right', Q * 1000);
  drawFlowArrow(ctx, expansionX + 80, centerY, 20, 'right', Q * 1000);
  
  // Etiquetas
  ctx.font = '14px Arial';
  ctx.fillStyle = '#2d3748';
  ctx.textAlign = 'center';
  
  // Etiquetas de diámetros
  ctx.fillText(`Ø${(Da*1000).toFixed(0)} mm, L=${La} m`, startX + 120, centerY - daScaled/2 - 15);
  ctx.fillText(`Ø${(Db*1000).toFixed(0)} mm, L=${Lb} m`, expansionX + 80, centerY - dbScaled/2 - 15);
  
  // Etiquetas de puntos
  ctx.fillText(`PA = ? MPa`, startX + 40, centerY - daScaled/2 - 25);
  ctx.fillText(`PB = ${Pb} MPa`, endX - 40, centerY - dbScaled/2 - 25);
  
  // Etiqueta de altura
  ctx.textAlign = 'right';
  ctx.fillText(`ha = ${ha} m`, startX + 35, groundY - ha*10 - 5);
  
  // Dibujar altura
  ctx.beginPath();
  ctx.moveTo(startX + 35, groundY);
  ctx.lineTo(startX + 35, groundY - ha*10);
  ctx.stroke();
  
  // Dibujar flecha de altura
  drawArrow(ctx, startX + 35, groundY - ha*5, 10, 'up');
}

// Funciones auxiliares para dibujar elementos
function drawPoint(ctx, x, y, label) {
  ctx.fillStyle = '#e53e3e';
  ctx.beginPath();
  ctx.arc(x, y, 8, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = 'white';
  ctx.font = 'bold 12px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, x, y);
}

function drawValve(ctx, x, y, diameter, type) {
  ctx.fillStyle = '#2d3748';
  
  if (type === 'globo') {
    // Válvula de globo
    ctx.beginPath();
    ctx.arc(x, y, diameter/1.5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - diameter/3, y);
    ctx.lineTo(x + diameter/3, y);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(x, y - diameter/3);
    ctx.lineTo(x, y + diameter/3);
    ctx.stroke();
  } else {
    // Válvula de ángulo
    ctx.beginPath();
    ctx.moveTo(x - diameter/2, y - diameter/2);
    ctx.lineTo(x + diameter/2, y - diameter/2);
    ctx.lineTo(x + diameter/2, y + diameter/2);
    ctx.lineTo(x - diameter/2, y + diameter/2);
    ctx.closePath();
    ctx.fill();
    
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - diameter/3, y);
    ctx.lineTo(x + diameter/3, y);
    ctx.stroke();
  }
}

function drawElbow(ctx, x, y, diameter, isLongRadius = false) {
  ctx.fillStyle = '#2d3748';
  
  const radius = isLongRadius ? diameter : diameter/1.5;
  
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 0.5);
  ctx.stroke();
  
  ctx.fillStyle = '#2d3748';
  ctx.beginPath();
  ctx.arc(x, y, diameter/4, 0, Math.PI * 2);
  ctx.fill();
}

function drawFlowArrow(ctx, x, y, size, direction, flowRate) {
  const angle = direction === 'right' ? 0 : Math.PI;
  
  ctx.fillStyle = '#4364f7';
  
  // Dibujar flecha
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - size * Math.cos(angle + Math.PI/6), y - size * Math.sin(angle + Math.PI/6));
  ctx.lineTo(x - size * Math.cos(angle - Math.PI/6), y - size * Math.sin(angle - Math.PI/6));
  ctx.closePath();
  ctx.fill();
  
  // Etiqueta de caudal
  ctx.fillStyle = '#2d3748';
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText(`${flowRate.toFixed(1)} L/s`, x, y - 10);
}

function drawArrow(ctx, x, y, size, direction) {
  const angle = direction === 'up' ? -Math.PI/2 : 0;
  
  ctx.fillStyle = '#2d3748';
  
  // Dibujar flecha
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - size * Math.cos(angle + Math.PI/6), y - size * Math.sin(angle + Math.PI/6));
  ctx.lineTo(x - size * Math.cos(angle - Math.PI/6), y - size * Math.sin(angle - Math.PI/6));
  ctx.closePath();
  ctx.fill();
} 