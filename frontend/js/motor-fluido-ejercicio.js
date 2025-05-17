/**
 * Motor de Fluido - Ejercicio de Potencia
 * Este script maneja los cálculos para el ejercicio de potencia en un motor de fluido.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar el ejercicio de potencia del motor de fluido
  setupMotorFluidoExercise();
});

/**
 * Configura los eventos y funcionalidad para el ejercicio de potencia del motor de fluido
 */
function setupMotorFluidoExercise() {
  const calcularButton = document.getElementById('calcular-potencia');
  if (!calcularButton) return; // Si no existe el botón, salir
  
  // Inicializar con valores por defecto
  calcularPotenciaMotor();
  
  // Añadir event listeners a todos los inputs para actualización en tiempo real
  document.getElementById('densidad-relativa').addEventListener('input', calcularPotenciaMotor);
  document.getElementById('caudal').addEventListener('input', calcularPotenciaMotor);
  document.getElementById('diametro-tuberia').addEventListener('input', calcularPotenciaMotor);
  document.getElementById('altura-h').addEventListener('input', calcularPotenciaMotor);
  
  // Añadir event listener al botón de calcular
  calcularButton.addEventListener('click', calcularPotenciaMotor);
}

/**
 * Calcula la potencia recibida por el motor y la potencia transmitida
 */
function calcularPotenciaMotor() {
  // Obtener valores de entrada
  const densidadRelativa = parseFloat(document.getElementById('densidad-relativa').value);
  const caudal = parseFloat(document.getElementById('caudal').value);
  const diametroTuberia = parseFloat(document.getElementById('diametro-tuberia').value) / 1000; // Convertir mm a m
  const alturaH = parseFloat(document.getElementById('altura-h').value);
  
  // Validar entradas
  if (isNaN(densidadRelativa) || isNaN(caudal) || isNaN(diametroTuberia) || isNaN(alturaH)) {
    return;
  }
  
  // Constantes físicas
  const gravedad = 9.81; // m/s²
  const densidadMercurio = 13.57; // Densidad relativa del mercurio
  
  // Cálculo de la potencia hidráulica recibida (SOLO CONSIDERA ALTURA h)
  const H = alturaH; // Se omite la cabeza de velocidad
  const potenciaRecibida = densidadRelativa * 1000 * gravedad * caudal * H;
  
  // Cálculo de la potencia transmitida con 65% de eficiencia
  const eficiencia = 0.65;
  const potenciaTransmitida = potenciaRecibida * eficiencia;
  
  // Mostrar resultados
  document.getElementById('potencia-recibida').textContent = formatearPotencia(potenciaRecibida);
  document.getElementById('potencia-transmitida').textContent = formatearPotencia(potenciaTransmitida);
}

/**
 * Formatea el valor de potencia para mostrar en la interfaz
 * @param {number} potencia - Valor de potencia en Watts
 * @returns {string} - Valor formateado con unidades apropiadas
 */
function formatearPotencia(potencia) {
  if (potencia >= 1000) {
    return `${(potencia / 1000).toFixed(2)} kW`;
  } else {
    return `${potencia.toFixed(2)} W`;
  }
} 