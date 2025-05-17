/**
 * Calculadora de Coeficientes Adimensionales
 * Este archivo implementa la funcionalidad para calcular coeficientes adimensionales
 * utilizando el análisis dimensional basado en el Teorema Pi de Buckingham.
 */

document.addEventListener('DOMContentLoaded', function() {
  // Inicializar la calculadora
  setupDimensionalCalculator();
});

/**
 * Configura la calculadora de análisis dimensional
 */
function setupDimensionalCalculator() {
  const numVariablesInput = document.getElementById('num-variables');
  const variablesContainer = document.getElementById('variables-container');
  const calcularButton = document.getElementById('calcular-pi');
  
  if (!numVariablesInput || !variablesContainer || !calcularButton) return;
  
  // Generar campos iniciales
  generateVariableFields(parseInt(numVariablesInput.value));
  
  // Manejar cambios en el número de variables
  numVariablesInput.addEventListener('change', function() {
    generateVariableFields(parseInt(this.value));
  });
  
  // Manejar el cálculo del coeficiente Pi
  calcularButton.addEventListener('click', function() {
    calcularCoeficienteAdimensional();
  });
}

/**
 * Genera los campos de entrada para las variables
 */
function generateVariableFields(numVars) {
  const container = document.getElementById('variables-container');
  if (!container) return;
  
  // Limpiar contenedor
  container.innerHTML = '';
  
  // Generar campos para cada variable
  for (let i = 0; i < numVars; i++) {
    const varDiv = document.createElement('div');
    varDiv.className = 'variable-group';
    varDiv.style.marginBottom = '1.5rem';
    varDiv.style.padding = '1rem';
    varDiv.style.border = '1px solid rgba(102,126,234,0.2)';
    varDiv.style.borderRadius = '8px';
    varDiv.style.background = '#fff';
    
    varDiv.innerHTML = `
      <h4 style="margin-top: 0; color: #4a5568;">Variable ${i+1}</h4>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <div class="control-group">
          <label for="var-name-${i}">Nombre:</label>
          <input type="text" id="var-name-${i}" placeholder="ej: v, L, ρ" required>
        </div>
        <div class="control-group">
          <label for="var-value-${i}">Valor:</label>
          <input type="number" id="var-value-${i}" step="any" required>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-top: 0.5rem;">
        <div class="control-group">
          <label for="var-m-${i}">Exp. M:</label>
          <input type="number" id="var-m-${i}" step="any" value="0" required>
        </div>
        <div class="control-group">
          <label for="var-l-${i}">Exp. L:</label>
          <input type="number" id="var-l-${i}" step="any" value="0" required>
        </div>
        <div class="control-group">
          <label for="var-t-${i}">Exp. T:</label>
          <input type="number" id="var-t-${i}" step="any" value="0" required>
        </div>
      </div>
    `;
    
    container.appendChild(varDiv);
  }
}

/**
 * Calcula el coeficiente adimensional usando SVD
 */
function calcularCoeficienteAdimensional() {
  const numVars = parseInt(document.getElementById('num-variables').value);
  
  // Recopilar datos de las variables
  const variables = [];
  for (let i = 0; i < numVars; i++) {
    const nombre = document.getElementById(`var-name-${i}`).value || `Var${i+1}`;
    const valor = parseFloat(document.getElementById(`var-value-${i}`).value);
    const expM = parseFloat(document.getElementById(`var-m-${i}`).value);
    const expL = parseFloat(document.getElementById(`var-l-${i}`).value);
    const expT = parseFloat(document.getElementById(`var-t-${i}`).value);
    
    if (isNaN(valor) || isNaN(expM) || isNaN(expL) || isNaN(expT)) {
      alert('Por favor, complete todos los campos con valores numéricos válidos.');
      return;
    }
    
    variables.push({
      nombre: nombre,
      valor: valor,
      dimensiones: [expM, expL, expT]
    });
  }
  
  // Construir matriz dimensional
  const matriz = [];
  for (let d = 0; d < 3; d++) {  // 3 dimensiones: M, L, T
    const fila = [];
    for (let v = 0; v < numVars; v++) {
      fila.push(variables[v].dimensiones[d]);
    }
    matriz.push(fila);
  }
  
  // Calcular rango de la matriz usando eliminación gaussiana
  const rango = calcularRangoMatriz(matriz);
  const numPi = numVars - rango;
  
  if (numPi !== 1) {
    alert(`El sistema requiere ${numPi} términos Pi. Esta calculadora está diseñada para sistemas que generan 1 solo término Pi.`);
    return;
  }
  
  // Calcular coeficientes usando eliminación gaussiana y sustitución hacia atrás
  const coeficientes = resolverSistemaHomogeneo(matriz);
  
  if (!coeficientes) {
    alert('No se pudo calcular el coeficiente adimensional. Verifique las dimensiones ingresadas.');
    return;
  }
  
  // Construir ecuación del número Pi y calcular su valor
  let ecuacion = "Π = ";
  let valorPi = 1.0;
  
  for (let i = 0; i < numVars; i++) {
    const exp = coeficientes[i];
    if (Math.abs(exp) > 1e-10) {  // Si el exponente no es prácticamente cero
      const expRedondeado = Math.round(exp * 1000) / 1000;  // Redondear a 3 decimales
      ecuacion += `${variables[i].nombre}^{${expRedondeado}} · `;
      valorPi *= Math.pow(variables[i].valor, exp);
    }
  }
  
  ecuacion = ecuacion.slice(0, -3);  // Eliminar el último " · "
  
  // Mostrar resultados
  document.getElementById('ecuacion-pi').textContent = ecuacion;
  document.getElementById('valor-pi').textContent = valorPi.toFixed(4);
  document.getElementById('resultado-pi').style.display = 'block';
}

/**
 * Calcula el rango de una matriz usando eliminación gaussiana
 */
function calcularRangoMatriz(matriz) {
  const m = matriz.length;     // Número de filas
  const n = matriz[0].length;  // Número de columnas
  
  // Crear una copia de la matriz para no modificar la original
  const A = matriz.map(row => [...row]);
  
  let rango = 0;
  let filaActual = 0;
  
  for (let col = 0; col < n && filaActual < m; col++) {
    // Buscar el pivote máximo en esta columna
    let maxFila = filaActual;
    for (let i = filaActual + 1; i < m; i++) {
      if (Math.abs(A[i][col]) > Math.abs(A[maxFila][col])) {
        maxFila = i;
      }
    }
    
    // Si el elemento máximo es cero, esta columna ya está en forma escalonada
    if (Math.abs(A[maxFila][col]) < 1e-10) continue;
    
    // Intercambiar filas si es necesario
    if (maxFila !== filaActual) {
      [A[filaActual], A[maxFila]] = [A[maxFila], A[filaActual]];
    }
    
    // Eliminar hacia abajo
    for (let i = filaActual + 1; i < m; i++) {
      const factor = A[i][col] / A[filaActual][col];
      A[i][col] = 0;  // Exactamente cero para evitar errores de redondeo
      
      for (let j = col + 1; j < n; j++) {
        A[i][j] -= factor * A[filaActual][j];
      }
    }
    
    rango++;
    filaActual++;
  }
  
  return rango;
}

/**
 * Resuelve un sistema homogéneo para encontrar los coeficientes del número Pi
 */
function resolverSistemaHomogeneo(matriz) {
  const m = matriz.length;     // Número de filas (dimensiones)
  const n = matriz[0].length;  // Número de columnas (variables)
  
  // Si no hay suficientes variables para formar un Pi
  if (n <= m) return null;
  
  // Crear una matriz aumentada para resolver el sistema
  const A = matriz.map(row => [...row]);
  
  // Aplicar eliminación gaussiana
  let filaActual = 0;
  let pivotCols = [];  // Columnas donde encontramos pivotes
  
  for (let col = 0; col < n && filaActual < m; col++) {
    // Buscar el pivote máximo en esta columna
    let maxFila = filaActual;
    for (let i = filaActual + 1; i < m; i++) {
      if (Math.abs(A[i][col]) > Math.abs(A[maxFila][col])) {
        maxFila = i;
      }
    }
    
    // Si el elemento máximo es cero, esta columna ya está en forma escalonada
    if (Math.abs(A[maxFila][col]) < 1e-10) continue;
    
    // Intercambiar filas si es necesario
    if (maxFila !== filaActual) {
      [A[filaActual], A[maxFila]] = [A[maxFila], A[filaActual]];
    }
    
    // Normalizar la fila del pivote
    const pivote = A[filaActual][col];
    for (let j = col; j < n; j++) {
      A[filaActual][j] /= pivote;
    }
    
    // Eliminar hacia arriba y hacia abajo
    for (let i = 0; i < m; i++) {
      if (i !== filaActual) {
        const factor = A[i][col];
        for (let j = col; j < n; j++) {
          A[i][j] -= factor * A[filaActual][j];
        }
      }
    }
    
    pivotCols.push(col);
    filaActual++;
  }
  
  // Crear vector solución
  const coeficientes = new Array(n).fill(0);
  
  // Asignar 1 a una variable libre (la primera que encontremos)
  let varLibre = 0;
  while (pivotCols.includes(varLibre)) {
    varLibre++;
  }
  coeficientes[varLibre] = 1;
  
  // Resolver para las variables pivote
  for (let i = 0; i < pivotCols.length; i++) {
    const pivotCol = pivotCols[i];
    let suma = 0;
    
    for (let j = 0; j < n; j++) {
      if (!pivotCols.includes(j) && j !== varLibre) {
        suma += A[i][j] * coeficientes[j];
      }
    }
    
    coeficientes[pivotCol] = -suma - A[i][varLibre];
  }
  
  return coeficientes;
} 