/**
 * Simulación de Curvas Características para Máquinas de Flujo
 */
document.addEventListener('DOMContentLoaded', () => {
  // Verificar si el canvas está presente
  const curvasCanvas = document.getElementById('curvas-canvas');
  if (curvasCanvas) {
    console.log('Inicializando simulación de curvas características');
    
    try {
      const ctx = curvasCanvas.getContext('2d');
      if (!ctx) {
        console.error('No se pudo obtener el contexto 2D del canvas');
        return;
      }
      
      // Configurar tamaño canvas
      const resizeCanvas = () => {
        const container = curvasCanvas.parentElement;
        curvasCanvas.width = container.clientWidth;
        curvasCanvas.height = container.clientHeight;
        drawCurvasSimulation();
      };
      
      // Datos de la simulación
      let velocidadNominal = 1800; // rpm
      let diametroImpulsor = 300; // mm
      
      // Valores de diseño nominal (a velocidad y diámetro nominal)
      const datosNominales = {
        caudal: 100, // m³/h
        altura: 50, // m
        potencia: 30, // kW
        eficiencia: 75 // %
      };
      
      // Punto de operación
      let puntoOperacion = {
        caudal: 80, // m³/h
        altura: 0, // m (se calculará)
        eficiencia: 0 // % (se calculará)
      };
      
      // Rango de caudal para las curvas (de 0 a 150% del caudal nominal)
      const caudales = [];
      for (let i = 0; i <= 150; i += 5) {
        caudales.push(i);
      }
      
      function calcularCurvas() {
        const factorVelocidad = velocidadNominal / 1800;
        const factorDiametro = diametroImpulsor / 300;
        
        // Aplicar leyes de afinidad
        const alturas = caudales.map(q => {
          // H ∝ N² × D²
          // H = H_nominal × (Q/Q_nominal)² × affinityFactor
          const qRatio = q / datosNominales.caudal;
          return datosNominales.altura * Math.pow(factorVelocidad, 2) * Math.pow(factorDiametro, 2) * (1 - 0.15 * Math.pow(qRatio, 2));
        });
        
        const potencias = caudales.map(q => {
          // P ∝ N³ × D⁵
          // Modelo simplificado: P = P_nominal × (Q/Q_nominal) × affinityFactor
          const qRatio = q / datosNominales.caudal;
          return datosNominales.potencia * qRatio * Math.pow(factorVelocidad, 3) * Math.pow(factorDiametro, 5);
        });
        
        const eficiencias = caudales.map(q => {
          // Curva de eficiencia con máximo en el punto de diseño
          const qRatio = q / datosNominales.caudal;
          return datosNominales.eficiencia * (1 - 0.8 * Math.pow(qRatio - 1, 2));
        });
        
        return { alturas, potencias, eficiencias };
      }
      
      function calcularPuntoOperacion() {
        const { alturas, eficiencias } = calcularCurvas();
        
        // Encontrar la altura correspondiente a caudal del punto de operación
        const index = Math.round(puntoOperacion.caudal / datosNominales.caudal * (caudales.length - 1) / 1.5);
        
        if (index >= 0 && index < alturas.length) {
          puntoOperacion.altura = alturas[index];
          puntoOperacion.eficiencia = eficiencias[index];
        }
        
        // Actualizar información en el panel
        document.getElementById('caudal-operacion').textContent = puntoOperacion.caudal.toFixed(1);
        document.getElementById('altura-operacion').textContent = puntoOperacion.altura.toFixed(1);
        document.getElementById('eficiencia-operacion').textContent = puntoOperacion.eficiencia.toFixed(1);
      }
      
      function drawCurvasSimulation() {
        if (!ctx) return;
        
        // Limpiar canvas
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, curvasCanvas.width, curvasCanvas.height);
        
        // Calcular curvas
        const { alturas, potencias, eficiencias } = calcularCurvas();
        
        // Configuración de gráfica
        const padding = 40;
        const width = curvasCanvas.width - padding * 2;
        const height = curvasCanvas.height - padding * 2;
        
        // Encontrar valores máximos para escalado
        const maxAltura = Math.max(...alturas) * 1.2;
        const maxPotencia = Math.max(...potencias) * 1.2;
        const maxCaudal = caudales[caudales.length - 1];
        
        // Funciones para convertir valores a coordenadas en el canvas
        const cQ = q => padding + (q / maxCaudal) * width;
        const cH = h => curvasCanvas.height - padding - (h / maxAltura) * height;
        const cP = p => curvasCanvas.height - padding - (p / maxPotencia) * height;
        const cE = e => curvasCanvas.height - padding - (e / 100) * height;
        
        // Dibujar ejes
        ctx.strokeStyle = '#555555';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        // Eje X - Caudal
        ctx.moveTo(padding, curvasCanvas.height - padding);
        ctx.lineTo(curvasCanvas.width - padding, curvasCanvas.height - padding);
        
        // Eje Y - Altura/Potencia
        ctx.moveTo(padding, curvasCanvas.height - padding);
        ctx.lineTo(padding, padding);
        
        ctx.stroke();
        
        // Etiquetas de ejes
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        
        // Etiquetas Eje X
        for (let i = 0; i <= maxCaudal; i += 30) {
          const x = cQ(i);
          ctx.beginPath();
          ctx.moveTo(x, curvasCanvas.height - padding);
          ctx.lineTo(x, curvasCanvas.height - padding + 5);
          ctx.stroke();
          ctx.fillText(`${i}`, x, curvasCanvas.height - padding + 20);
        }
        ctx.fillText('Caudal (m³/h)', curvasCanvas.width / 2, curvasCanvas.height - 10);
        
        // Etiquetas Eje Y - Altura
        ctx.textAlign = 'right';
        for (let i = 0; i <= maxAltura; i += 20) {
          const y = cH(i);
          ctx.beginPath();
          ctx.moveTo(padding, y);
          ctx.lineTo(padding - 5, y);
          ctx.stroke();
          ctx.fillText(`${i}`, padding - 10, y + 4);
        }
        ctx.save();
        ctx.translate(15, curvasCanvas.height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = 'center';
        ctx.fillText('Altura (m) / Potencia (kW) / Eficiencia (%)', 0, 0);
        ctx.restore();
        
        // Dibujar curva H-Q
        ctx.beginPath();
        ctx.moveTo(cQ(caudales[0]), cH(alturas[0]));
        for (let i = 1; i < caudales.length; i++) {
          ctx.lineTo(cQ(caudales[i]), cH(alturas[i]));
        }
        ctx.strokeStyle = '#3494e6';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Dibujar curva P-Q
        ctx.beginPath();
        ctx.moveTo(cQ(caudales[0]), cP(potencias[0]));
        for (let i = 1; i < caudales.length; i++) {
          ctx.lineTo(cQ(caudales[i]), cP(potencias[i]));
        }
        ctx.strokeStyle = '#e67e22';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Dibujar curva η-Q
        ctx.beginPath();
        ctx.moveTo(cQ(caudales[0]), cE(eficiencias[0]));
        for (let i = 1; i < caudales.length; i++) {
          ctx.lineTo(cQ(caudales[i]), cE(eficiencias[i]));
        }
        ctx.strokeStyle = '#2ecc71';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Dibujar punto de operación
        const ptoX = cQ(puntoOperacion.caudal);
        const ptoY = cH(puntoOperacion.altura);
        
        // Líneas de referencia
        ctx.setLineDash([5, 3]);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        
        // Línea vertical
        ctx.moveTo(ptoX, ptoY);
        ctx.lineTo(ptoX, curvasCanvas.height - padding);
        
        // Línea horizontal
        ctx.moveTo(ptoX, ptoY);
        ctx.lineTo(padding, ptoY);
        
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Punto
        ctx.beginPath();
        ctx.arc(ptoX, ptoY, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#f1c40f';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      // Capturar y configurar los controles
      const velocidadNominalSlider = document.getElementById('velocidad-nominal');
      const diametroSlider = document.getElementById('diametro');
      const velocidadNominalValue = document.getElementById('velocidad-nominal-value');
      const diametroValue = document.getElementById('diametro-value');
      
      if (!velocidadNominalSlider || !diametroSlider) {
        console.error('No se encontraron todos los controles necesarios para la simulación de curvas');
        return;
      }
      
      // Inicializar valores mostrados
      velocidadNominalValue.textContent = `${velocidadNominal} rpm`;
      diametroValue.textContent = `${diametroImpulsor} mm`;
      
      // Función para actualizar valores y redibujar
      function updateCurvasSimulation() {
        console.log("Actualizando simulación de curvas...");
        velocidadNominal = parseFloat(velocidadNominalSlider.value);
        diametroImpulsor = parseFloat(diametroSlider.value);
        
        // Actualizar valores mostrados
        velocidadNominalValue.textContent = `${velocidadNominal} rpm`;
        diametroValue.textContent = `${diametroImpulsor} mm`;
        
        // Calcular nuevo punto de operación
        calcularPuntoOperacion();
        
        // Redibujar
        drawCurvasSimulation();
      }
      
      // Habilitar arrastre para establecer punto de operación
      function enableDragInteraction() {
        let isDragging = false;
        
        curvasCanvas.addEventListener('mousedown', (e) => {
          const rect = curvasCanvas.getBoundingClientRect();
          const x = e.clientX - rect.left;
          
          // Convertir coordenada x a caudal
          const maxCaudal = caudales[caudales.length - 1];
          const padding = 40;
          const width = curvasCanvas.width - padding * 2;
          
          const newCaudal = ((x - padding) / width) * maxCaudal;
          
          // Solo permitir arrastrar si estamos cerca del eje x válido
          if (newCaudal >= 0 && newCaudal <= maxCaudal) {
            isDragging = true;
            puntoOperacion.caudal = newCaudal;
            calcularPuntoOperacion();
            drawCurvasSimulation();
          }
        });
        
        curvasCanvas.addEventListener('mousemove', (e) => {
          if (!isDragging) return;
          
          const rect = curvasCanvas.getBoundingClientRect();
          const x = e.clientX - rect.left;
          
          // Convertir coordenada x a caudal
          const maxCaudal = caudales[caudales.length - 1];
          const padding = 40;
          const width = curvasCanvas.width - padding * 2;
          
          const newCaudal = ((x - padding) / width) * maxCaudal;
          
          // Mantener dentro de límites
          if (newCaudal >= 0 && newCaudal <= maxCaudal) {
            puntoOperacion.caudal = newCaudal;
            calcularPuntoOperacion();
            drawCurvasSimulation();
          }
        });
        
        window.addEventListener('mouseup', () => {
          isDragging = false;
        });
        
        // Tooltip explicativo
        curvasCanvas.title = "Haz clic y arrastra horizontalmente para cambiar el punto de operación";
      }
      
      // Eliminar listeners previos si existen (para evitar duplicación)
      velocidadNominalSlider.removeEventListener('input', updateCurvasSimulation);
      diametroSlider.removeEventListener('input', updateCurvasSimulation);
      
      // Agregar nuevos listeners
      velocidadNominalSlider.addEventListener('input', updateCurvasSimulation);
      diametroSlider.addEventListener('input', updateCurvasSimulation);
      window.addEventListener('resize', resizeCanvas);
      
      // Inicializar canvas y valores
      resizeCanvas();
      calcularPuntoOperacion();
      enableDragInteraction();
      
      console.log('Simulación de curvas características inicializada correctamente');
    } catch (error) {
      console.error('Error al inicializar la simulación de curvas características:', error);
    }
  }
}); 