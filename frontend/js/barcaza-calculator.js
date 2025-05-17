/**
 * Barcaza Stability Calculator
 * 
 * JavaScript implementation of the barcaza stability calculator based on
 * the Python code provided. Calculates BC (center of flotation), BM, and stability rule.
 */

document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements
  const form = document.getElementById('barcaza-calculator');
  const calcButton = document.getElementById('calcular-barcaza');
  const resultPanel = document.getElementById('barcaza-result');
  
  // Get result display elements
  const volumenSumergido = document.getElementById('volumen-sumergido');
  const densidadFluido = document.getElementById('densidad-fluido');
  const fuerzaFlotacion = document.getElementById('fuerza-flotacion');
  const alturaOblicua = document.getElementById('altura-oblicua');
  const momentoInercia = document.getElementById('momento-inercia');
  const alturaBM = document.getElementById('altura-BM');
  const centroBC = document.getElementById('centro-BC');
  const estabilidad = document.getElementById('estabilidad');
  
  // Visualization elements
  const barcazaObject = document.getElementById('barcaza-object');
  const centroGravedad = document.getElementById('centro-gravedad');
  const centroFlotacion = document.getElementById('centro-flotacion');
  const metacentro = document.getElementById('metacentro');
  
  // Add event listener to calculate button
  if (calcButton) {
    calcButton.addEventListener('click', calcularEstabilidad);
  }
  
  /**
   * Calculate the submerged volume of the barcaza
   * Volumen sumergido = eslora * manga * calado * 0.5
   */
  function calcularVolumenSumergido(eslora, manga, calado) {
    return eslora * manga * calado * 0.5;
  }
  
  /**
   * Calculate the flotation force (Archimedes' principle)
   * Empuje de Arquímedes = densidad * g * volumen,
   * donde densidad = densidad_relativa * 1000 (kg/m^3)
   */
  function calcularFuerzaFlotacion(volumen, densidadRelativa, g = 9.81) {
    const densidad = densidadRelativa * 1000.0;
    const fuerza = densidad * g * volumen;
    return { fuerza, densidad };
  }
  
  /**
   * Calculate the oblique height h = sqrt(manga^2 + calado^2)
   */
  function calcularHOblicua(manga, calado) {
    return Math.sqrt(manga**2 + calado**2);
  }
  
  /**
   * Calculate the minimum moment of inertia
   * - Choose the smaller dimension between eslora and h
   * - I_min = (1/12) * eslora * (dim_min ** 3)
   */
  function calcularMomentoInerciaMinimo(eslora, h) {
    const dimMin = Math.min(eslora, h);
    return (1.0/12.0) * eslora * (dimMin ** 3);
  }
  
  /**
   * Calculate the metacentric height BM = I_min / volume
   */
  function calcularBM(IMin, volumen) {
    return IMin / volumen;
  }
  
  /**
   * Calculate the flotation center BC = Yc - Yb,
   * where Yc = puntal/2 (center of gravity) and Yb = h/2 (flotation center)
   */
  function calcularBC(puntal, h) {
    const Yc = puntal / 2.0;
    const Yb = h / 2.0;
    return Yc - Yb;
  }
  
  /**
   * Determine if the barcaza is stable (BM > BC)
   */
  function determinarEstabilidad(BM, BC) {
    return BM > BC;
  }
  
  /**
   * Main function to calculate stability and update UI
   */
  function calcularEstabilidad() {
    try {
      // Get input values
      const eslora = parseFloat(document.getElementById('eslora').value);
      const manga = parseFloat(document.getElementById('manga').value);
      const puntal = parseFloat(document.getElementById('puntal').value);
      const calado = parseFloat(document.getElementById('calado').value);
      const densRel = parseFloat(document.getElementById('densidad-relativa').value);
      
      // Validate inputs
      if (isNaN(eslora) || isNaN(manga) || isNaN(puntal) || isNaN(calado) || isNaN(densRel)) {
        alert('Por favor, complete todos los campos con valores numéricos válidos.');
        return;
      }
      
      // Perform calculations
      const volumen = calcularVolumenSumergido(eslora, manga, calado);
      const { fuerza, densidad } = calcularFuerzaFlotacion(volumen, densRel);
      const h = calcularHOblicua(manga, calado);
      const IMin = calcularMomentoInerciaMinimo(eslora, h);
      const BM = calcularBM(IMin, volumen);
      const BC = calcularBC(puntal, h);
      const esEstable = determinarEstabilidad(BM, BC);
      
      // Update result display
      volumenSumergido.textContent = volumen.toFixed(4);
      densidadFluido.textContent = densidad.toFixed(2);
      fuerzaFlotacion.textContent = fuerza.toFixed(2);
      alturaOblicua.textContent = h.toFixed(4);
      momentoInercia.textContent = IMin.toFixed(5);
      alturaBM.textContent = BM.toFixed(4);
      centroBC.textContent = BC.toFixed(4);
      
      if (esEstable) {
        estabilidad.textContent = "La barcaza ES ESTABLE (BM > BC)";
        estabilidad.style.color = "#22c55e"; // Green color
      } else {
        estabilidad.textContent = "La barcaza NO ES estable (BM ≤ BC)";
        estabilidad.style.color = "#ef4444"; // Red color
      }
      
      // Show results
      resultPanel.style.display = 'block';
      
      // Update visualization
      updateVisualization(puntal, calado, BM, BC, esEstable);
      
    } catch (error) {
      console.error("Error en los cálculos:", error);
      alert('Ha ocurrido un error en los cálculos. Por favor, verifique los valores ingresados.');
    }
  }
  
  /**
   * Update the barcaza visualization based on calculation results
   */
  function updateVisualization(puntal, calado, BM, BC, esEstable) {
    // Update barcaza dimensions
    const barcazaHeight = 80; // Base height in pixels
    const scale = barcazaHeight / puntal; // Scale factor for visualization
    
    // Calculate positions for visualization elements
    const caladoPixels = calado * scale;
    
    // Position the center of gravity (G)
    centroGravedad.style.top = `${50}%`; // Center of the barcaza
    
    // Position the center of flotation (B)
    const bPos = 50 + (BC * scale);
    centroFlotacion.style.top = `${bPos}%`;
    
    // Position the metacenter (M)
    const mPos = 50 - (BM * scale);
    metacentro.style.top = `${mPos}%`;
    
    // Apply color based on stability
    if (esEstable) {
      barcazaObject.style.borderTop = "3px solid #22c55e";
    } else {
      barcazaObject.style.borderTop = "3px solid #ef4444";
    }
  }
}); 