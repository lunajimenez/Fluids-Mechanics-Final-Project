// JavaScript para las funcionalidades relacionadas con presión hidrostática, fuerzas sobre superficies sumergidas y flotabilidad

document.addEventListener('DOMContentLoaded', function() {
  // Calculadora de Presión Hidrostática
  const hydrostaticCalculator = document.getElementById('hydrostatic-calculator');
  if (hydrostaticCalculator) {
    const fluidType = document.getElementById('fluid-type');
    const customDensityGroup = document.getElementById('custom-density-group');
    const customDensity = document.getElementById('custom-density');
    const depth = document.getElementById('depth');
    const surfacePressure = document.getElementById('surface-pressure');
    const pressureResult = document.getElementById('pressure-result');
    const totalPressure = document.getElementById('total-pressure');
    const hydrostaticPressure = document.getElementById('hydrostatic-pressure');
    const pressureBar = document.getElementById('pressure-bar');
    const pressureAtm = document.getElementById('pressure-atm');
    const pressurePsi = document.getElementById('pressure-psi');
    const pressureIndicator = document.getElementById('pressure-indicator');
    const pressureValue = document.getElementById('pressure-value');
    
    // Mostrar/ocultar campo de densidad personalizada
    fluidType.addEventListener('change', function() {
      if (this.value === 'custom') {
        customDensityGroup.style.display = 'block';
      } else {
        customDensityGroup.style.display = 'none';
      }
    });
    
    // Calcular presión hidrostática
    hydrostaticCalculator.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Obtener densidad según el tipo de fluido seleccionado
      let density;
      switch(fluidType.value) {
        case 'water':
          density = 1000; // kg/m³
          break;
        case 'seawater':
          density = 1025; // kg/m³
          break;
        case 'oil':
          density = 920; // kg/m³
          break;
        case 'mercury':
          density = 13600; // kg/m³
          break;
        case 'custom':
          density = parseFloat(customDensity.value);
          break;
      }
      
      const depthValue = parseFloat(depth.value);
      const surfacePressureValue = parseFloat(surfacePressure.value);
      const g = 9.81; // m/s²
      
      // Calcular presión hidrostática: P = P₀ + ρgh
      const hydrostaticPressureValue = density * g * depthValue;
      const totalPressureValue = surfacePressureValue + hydrostaticPressureValue;
      
      // Convertir a otras unidades
      const barValue = totalPressureValue / 100000;
      const atmValue = totalPressureValue / 101325;
      const psiValue = totalPressureValue / 6895;
      
      // Mostrar resultados
      totalPressure.textContent = totalPressureValue.toLocaleString(undefined, {maximumFractionDigits: 2});
      hydrostaticPressure.textContent = hydrostaticPressureValue.toLocaleString(undefined, {maximumFractionDigits: 2});
      pressureBar.textContent = barValue.toLocaleString(undefined, {maximumFractionDigits: 4});
      pressureAtm.textContent = atmValue.toLocaleString(undefined, {maximumFractionDigits: 4});
      pressurePsi.textContent = psiValue.toLocaleString(undefined, {maximumFractionDigits: 4});
      
      pressureResult.style.display = 'block';
      
      // Actualizar visualización
      const maxDepth = 100; // Para normalizar la visualización
      const normalizedDepth = Math.min(depthValue / maxDepth, 1);
      pressureIndicator.style.top = `${normalizedDepth * 100}%`;
      pressureValue.style.top = `${normalizedDepth * 100 - 3}%`;
      pressureValue.textContent = `${totalPressureValue.toLocaleString(undefined, {maximumFractionDigits: 0})} Pa`;
    });
  }
  
  // Visualización interactiva de presión en diferentes puntos
  const pressurePointsContainer = document.getElementById('pressure-points-container');
  if (pressurePointsContainer) {
    const pressurePointsDiagram = document.getElementById('pressure-points-diagram');
    const pressureInfo = document.getElementById('pressure-info');
    
    // Definir los puntos de presión según la imagen proporcionada
    const points = [
      { id: 'A', x: 10, y: 85, label: 'A', depth: 4.5 },
      { id: 'B', x: 30, y: 70, label: 'B', depth: 3.0 },
      { id: 'C', x: 50, y: 65, label: 'C', depth: 2.5 },
      { id: 'D', x: 65, y: 65, label: 'D', depth: 2.5 },
      { id: 'E', x: 80, y: 65, label: 'E', depth: 2.5 },
      { id: 'F', x: 90, y: 65, label: 'F', depth: 2.5 },
      { id: 'G', x: 95, y: 65, label: 'G', depth: 2.5 },
      { id: 'H', x: 65, y: 90, label: 'H', depth: 5.0 },
      { id: 'I', x: 95, y: 90, label: 'I', depth: 5.0 }
    ];
    
    // Crear el SVG para el diagrama
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    
    // Crear el fondo del diagrama (agua y recipiente)
    // Rectángulo para el agua
    const water = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    water.setAttribute('d', 'M 5,40 L 5,95 L 98,95 L 98,40 L 440,40 Z');
    water.setAttribute('fill', 'rgba(14, 165, 233, 0.2)');
    water.setAttribute('stroke', 'rgba(14, 165, 233, 0.5)');
    water.setAttribute('stroke-width', '1');
    svg.appendChild(water);
    
    // Línea para la superficie del agua
    const waterSurface = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    waterSurface.setAttribute('x1', '5');
    waterSurface.setAttribute('y1', '40');
    waterSurface.setAttribute('x2', '98');
    waterSurface.setAttribute('y2', '40');
    waterSurface.setAttribute('stroke', 'rgba(14, 165, 233, 0.8)');
    waterSurface.setAttribute('stroke-width', '2');
    svg.appendChild(waterSurface);
    
    // Añadir etiqueta para la superficie
    const surfaceLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    surfaceLabel.setAttribute('x', '50');
    surfaceLabel.setAttribute('y', '35');
    surfaceLabel.setAttribute('text-anchor', 'middle');
    surfaceLabel.setAttribute('fill', '#0c4a6e');
    surfaceLabel.setAttribute('font-weight', 'bold');
    surfaceLabel.textContent = 'Superficie (P = P₀)';
    svg.appendChild(surfaceLabel);
    
    // Crear el contorno del recipiente
    const container = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    container.setAttribute('d', 'M 5,20 L 5,95 L 20,95 L 20,60 L 40,95 L 60,60 L 80,95 L 98,60 L 98,95 L 98,20 Z');
    container.setAttribute('fill', 'none');
    container.setAttribute('stroke', '#0c4a6e');
    container.setAttribute('stroke-width', '2');
    svg.appendChild(container);
    
    // Niveles de profundidad
    const depths = [
      { y: 65, label: 'Nivel 1 - Profundidad 2.5m' },
      { y: 90, label: 'Nivel 2 - Profundidad 5.0m' }
    ];
    
    // Crear líneas horizontales para mostrar los niveles de profundidad
    depths.forEach(depth => {
      const depthLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      depthLine.setAttribute('x1', '5');
      depthLine.setAttribute('y1', depth.y);
      depthLine.setAttribute('x2', '98');
      depthLine.setAttribute('y2', depth.y);
      depthLine.setAttribute('stroke', 'rgba(220, 38, 38, 0.5)');
      depthLine.setAttribute('stroke-width', '1');
      depthLine.setAttribute('stroke-dasharray', '4');
      svg.appendChild(depthLine);
      
      // Añadir etiqueta para cada nivel
      const depthLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      depthLabel.setAttribute('x', '52');
      depthLabel.setAttribute('y', depth.y - 5);
      depthLabel.setAttribute('text-anchor', 'middle');
      depthLabel.setAttribute('fill', 'rgba(220, 38, 38, 0.8)');
      depthLabel.setAttribute('font-size', '10');
      depthLabel.textContent = depth.label;
      svg.appendChild(depthLabel);
    });
    
    // Añadir el SVG al contenedor
    pressurePointsDiagram.appendChild(svg);
    
    // Crear los puntos interactivos
    points.forEach(point => {
      const pointElement = document.createElement('div');
      pointElement.className = 'pressure-point';
      pointElement.id = `point-${point.id}`;
      pointElement.style.left = `${point.x}%`;
      pointElement.style.top = `${point.y}%`;
      pointElement.setAttribute('data-id', point.id);
      pointElement.setAttribute('data-depth', point.depth);
      
      const labelElement = document.createElement('div');
      labelElement.className = 'point-label';
      labelElement.textContent = point.label;
      labelElement.style.left = `${point.x + 2}%`;
      labelElement.style.top = `${point.y - 2}%`;
      
      pressurePointsDiagram.appendChild(pointElement);
      pressurePointsDiagram.appendChild(labelElement);
      
      // Añadir evento de clic
      pointElement.addEventListener('click', function() {
        // Eliminar clase activa de todos los puntos
        document.querySelectorAll('.pressure-point').forEach(p => p.classList.remove('active'));
        
        // Añadir clase activa al punto actual
        this.classList.add('active');
        
        // Obtener ID y profundidad del punto
        const pointId = this.getAttribute('data-id');
        const pointDepth = parseFloat(this.getAttribute('data-depth'));
        
        // Calcular la presión (ejemplo con agua)
        const density = 1000; // kg/m³ (agua)
        const g = 9.81; // m/s²
        const atmosphericPressure = 101325; // Pa
        const hydrostaticPressure = density * g * pointDepth;
        const totalPressure = atmosphericPressure + hydrostaticPressure;
        
        // Actualizar información
        let infoText = '';
        
        if (pointDepth === 5.0) {
          infoText = `<div class="info-card">
                        <h4>Punto ${pointId} - Profundidad: ${pointDepth} m</h4>
                        <p>Este punto está a una profundidad de ${pointDepth} metros bajo la superficie.</p>
                        <p>La presión hidrostática en este punto es aproximadamente:</p>
                        <div class="formula">P<sub>hidrostática</sub> = ρgh = ${density} × ${g.toFixed(2)} × ${pointDepth} = ${hydrostaticPressure.toLocaleString(undefined, {maximumFractionDigits: 0})} Pa</div>
                        <p>La presión total (incluyendo la presión atmosférica) es:</p>
                        <div class="formula">P<sub>total</sub> = P<sub>atm</sub> + ρgh = ${atmosphericPressure} + ${hydrostaticPressure.toLocaleString(undefined, {maximumFractionDigits: 0})} = ${totalPressure.toLocaleString(undefined, {maximumFractionDigits: 0})} Pa</div>
                        <p>Los puntos H e I están a mayor profundidad que los puntos A-G, por lo tanto tienen mayor presión:</p>
                        <div class="formula">P<sub>${pointId}</sub> > P<sub>C,D,E,F,G</sub></div>
                      </div>`;
        } else if (pointDepth === 2.5) {
          infoText = `<div class="info-card">
                        <h4>Punto ${pointId} - Profundidad: ${pointDepth} m</h4>
                        <p>Este punto está a una profundidad de ${pointDepth} metros bajo la superficie.</p>
                        <p>La presión hidrostática en este punto es aproximadamente:</p>
                        <div class="formula">P<sub>hidrostática</sub> = ρgh = ${density} × ${g.toFixed(2)} × ${pointDepth} = ${hydrostaticPressure.toLocaleString(undefined, {maximumFractionDigits: 0})} Pa</div>
                        <p>La presión total (incluyendo la presión atmosférica) es:</p>
                        <div class="formula">P<sub>total</sub> = P<sub>atm</sub> + ρgh = ${atmosphericPressure} + ${hydrostaticPressure.toLocaleString(undefined, {maximumFractionDigits: 0})} = ${totalPressure.toLocaleString(undefined, {maximumFractionDigits: 0})} Pa</div>
                        <p>Todos los puntos A, B, C, D, E, F y G están a la misma profundidad, por lo tanto tienen exactamente la misma presión, sin importar su posición horizontal:</p>
                        <div class="formula">P<sub>C</sub> = P<sub>D</sub> = P<sub>E</sub> = P<sub>F</sub> = P<sub>G</sub></div>
                      </div>`;
        } else {
          // Para los puntos A y B con diferentes profundidades
          infoText = `<div class="info-card">
                        <h4>Punto ${pointId} - Profundidad: ${pointDepth} m</h4>
                        <p>Este punto está a una profundidad de ${pointDepth} metros bajo la superficie.</p>
                        <p>La presión hidrostática en este punto es aproximadamente:</p>
                        <div class="formula">P<sub>hidrostática</sub> = ρgh = ${density} × ${g.toFixed(2)} × ${pointDepth} = ${hydrostaticPressure.toLocaleString(undefined, {maximumFractionDigits: 0})} Pa</div>
                        <p>La presión total (incluyendo la presión atmosférica) es:</p>
                        <div class="formula">P<sub>total</sub> = P<sub>atm</sub> + ρgh = ${atmosphericPressure} + ${hydrostaticPressure.toLocaleString(undefined, {maximumFractionDigits: 0})} = ${totalPressure.toLocaleString(undefined, {maximumFractionDigits: 0})} Pa</div>
                        <p>Este punto está a una profundidad diferente que otros puntos, por lo que su presión es proporcional a su profundidad.</p>
                      </div>`;
        }
        
        pressureInfo.innerHTML = infoText;
      });
    });
    
    // Activar el primer punto por defecto
    document.getElementById('point-A').click();
  }
  
  // Ejercicio Interactivo: Manómetro
  const manometerCalculator = document.getElementById('manometer-calculator');
  if (manometerCalculator) {
    const fluidTypeManometer = document.getElementById('fluid-type-manometer');
    const customDensityManometerGroup = document.getElementById('custom-density-manometer-group');
    const customDensityManometer = document.getElementById('custom-density-manometer');
    const depthManometer = document.getElementById('depth-manometer');
    const manometerResult = document.getElementById('manometer-result');
    const hydrostaticPressureManometer = document.getElementById('hydrostatic-pressure-manometer');
    const totalPressureManometer = document.getElementById('total-pressure-manometer');
    const pressureBarManometer = document.getElementById('pressure-bar-manometer');
    const pressureAtmManometer = document.getElementById('pressure-atm-manometer');
    const pressurePsiManometer = document.getElementById('pressure-psi-manometer');
    const pressureMmhgManometer = document.getElementById('pressure-mmhg-manometer');
    const manometerVisualization = document.getElementById('manometer-visualization');
    
    // Mostrar/ocultar campo de densidad personalizada
    fluidTypeManometer.addEventListener('change', function() {
      if (this.value === 'custom') {
        customDensityManometerGroup.style.display = 'block';
      } else {
        customDensityManometerGroup.style.display = 'none';
      }
    });
    
    // Inicializar visualización del manómetro
    if (manometerVisualization) {
      // Crear elementos para el manómetro
      const manometerContainer = document.createElement('div');
      manometerContainer.style.position = 'relative';
      manometerContainer.style.width = '100%';
      manometerContainer.style.height = '100%';
      manometerContainer.style.overflow = 'hidden';
      
      // Crear el tubo del manómetro
      const manometerTube = document.createElement('div');
      manometerTube.style.position = 'absolute';
      manometerTube.style.width = '40px';
      manometerTube.style.height = '80%';
      manometerTube.style.left = '50%';
      manometerTube.style.top = '10%';
      manometerTube.style.transform = 'translateX(-50%)';
      manometerTube.style.border = '2px solid #0c4a6e';
      manometerTube.style.borderRadius = '5px';
      manometerTube.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
      
      // Crear el fluido en el manómetro
      const manometerFluid = document.createElement('div');
      manometerFluid.id = 'manometer-fluid';
      manometerFluid.style.position = 'absolute';
      manometerFluid.style.width = '36px';
      manometerFluid.style.height = '50%';
      manometerFluid.style.bottom = '0';
      manometerFluid.style.left = '50%';
      manometerFluid.style.transform = 'translateX(-50%)';
      manometerFluid.style.backgroundColor = 'rgba(14, 165, 233, 0.7)';
      manometerFluid.style.transition = 'height 0.5s ease-in-out';
      
      // Crear escala de medición
      const manometerScale = document.createElement('div');
      manometerScale.style.position = 'absolute';
      manometerScale.style.width = '100px';
      manometerScale.style.height = '80%';
      manometerScale.style.left = 'calc(50% + 30px)';
      manometerScale.style.top = '10%';
      manometerScale.style.borderLeft = '1px solid #0c4a6e';
      
      // Añadir marcas en la escala
      for (let i = 0; i <= 10; i++) {
        const mark = document.createElement('div');
        mark.style.position = 'absolute';
        mark.style.width = '10px';
        mark.style.height = '1px';
        mark.style.backgroundColor = '#0c4a6e';
        mark.style.left = '0';
        mark.style.top = `${(10 - i) * 8}%`;
        
        const label = document.createElement('div');
        label.style.position = 'absolute';
        label.style.left = '15px';
        label.style.top = `${(10 - i) * 8 - 10}px`;
        label.style.fontSize = '12px';
        label.style.color = '#0c4a6e';
        label.textContent = `${i} m`;
        
        manometerScale.appendChild(mark);
        manometerScale.appendChild(label);
      }
      
      // Añadir indicador de presión
      const pressureIndicator = document.createElement('div');
      pressureIndicator.id = 'pressure-indicator-manometer';
      pressureIndicator.style.position = 'absolute';
      pressureIndicator.style.width = '80px';
      pressureIndicator.style.padding = '5px';
      pressureIndicator.style.backgroundColor = 'rgba(14, 165, 233, 0.9)';
      pressureIndicator.style.color = 'white';
      pressureIndicator.style.borderRadius = '5px';
      pressureIndicator.style.textAlign = 'center';
      pressureIndicator.style.fontSize = '12px';
      pressureIndicator.style.left = 'calc(50% - 100px)';
      pressureIndicator.style.top = '50%';
      pressureIndicator.style.transform = 'translateY(-50%)';
      pressureIndicator.style.opacity = '0';
      pressureIndicator.style.transition = 'opacity 0.5s ease-in-out, top 0.5s ease-in-out';
      
      // Añadir etiqueta de superficie
      const surfaceLabel = document.createElement('div');
      surfaceLabel.style.position = 'absolute';
      surfaceLabel.style.width = '100%';
      surfaceLabel.style.textAlign = 'center';
      surfaceLabel.style.top = '5%';
      surfaceLabel.style.color = '#0c4a6e';
      surfaceLabel.style.fontWeight = 'bold';
      surfaceLabel.textContent = 'Superficie (P = 1 atm)';
      
      // Añadir elementos al contenedor
      manometerTube.appendChild(manometerFluid);
      manometerContainer.appendChild(manometerTube);
      manometerContainer.appendChild(manometerScale);
      manometerContainer.appendChild(pressureIndicator);
      manometerContainer.appendChild(surfaceLabel);
      
      manometerVisualization.appendChild(manometerContainer);
    }
    
    // Calcular presión hidrostática
    manometerCalculator.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Obtener densidad según el tipo de fluido seleccionado
      let density;
      let fluidColor;
      
      switch(fluidTypeManometer.value) {
        case 'water':
          density = 1000; // kg/m³
          fluidColor = 'rgba(14, 165, 233, 0.7)';
          break;
        case 'seawater':
          density = 1025; // kg/m³
          fluidColor = 'rgba(14, 165, 233, 0.9)';
          break;
        case 'oil':
          density = 920; // kg/m³
          fluidColor = 'rgba(234, 179, 8, 0.7)';
          break;
        case 'mercury':
          density = 13600; // kg/m³
          fluidColor = 'rgba(107, 114, 128, 0.9)';
          break;
        case 'custom':
          density = parseFloat(customDensityManometer.value);
          fluidColor = 'rgba(168, 85, 247, 0.7)';
          break;
      }
      
      const depthValue = parseFloat(depthManometer.value);
      const g = 9.81; // m/s²
      const atmosphericPressure = 101325; // Pa (1 atm)
      
      // Calcular presión hidrostática: P = P₀ + ρgh
      const hydrostaticPressureValue = density * g * depthValue;
      const totalPressureValue = atmosphericPressure + hydrostaticPressureValue;
      
      // Convertir a otras unidades
      const barValue = totalPressureValue / 100000;
      const atmValue = totalPressureValue / 101325;
      const psiValue = totalPressureValue / 6895;
      const mmHgValue = totalPressureValue / 133.322;
      
      // Mostrar resultados
      hydrostaticPressureManometer.textContent = hydrostaticPressureValue.toLocaleString(undefined, {maximumFractionDigits: 2});
      totalPressureManometer.textContent = totalPressureValue.toLocaleString(undefined, {maximumFractionDigits: 2});
      pressureBarManometer.textContent = barValue.toLocaleString(undefined, {maximumFractionDigits: 4});
      pressureAtmManometer.textContent = atmValue.toLocaleString(undefined, {maximumFractionDigits: 4});
      pressurePsiManometer.textContent = psiValue.toLocaleString(undefined, {maximumFractionDigits: 4});
      pressureMmhgManometer.textContent = mmHgValue.toLocaleString(undefined, {maximumFractionDigits: 1});
      
      manometerResult.style.display = 'block';
      
      // Actualizar visualización del manómetro
      if (manometerVisualization) {
        const manometerFluid = document.getElementById('manometer-fluid');
        const pressureIndicator = document.getElementById('pressure-indicator-manometer');
        
        if (manometerFluid && pressureIndicator) {
          // Limitar la profundidad máxima para la visualización
          const maxDepth = 10;
          const normalizedDepth = Math.min(depthValue / maxDepth, 1);
          
          // Actualizar altura del fluido (limitado a 80% de la altura del tubo)
          manometerFluid.style.height = `${normalizedDepth * 80}%`;
          
          // Actualizar color del fluido
          manometerFluid.style.backgroundColor = fluidColor;
          
          // Actualizar posición del indicador de presión
          const topPosition = 10 + (80 - normalizedDepth * 80);
          pressureIndicator.style.top = `${topPosition}%`;
          
          // Actualizar texto del indicador
          pressureIndicator.textContent = `${hydrostaticPressureValue.toLocaleString(undefined, {maximumFractionDigits: 0})} Pa`;
          
          // Mostrar el indicador
          pressureIndicator.style.opacity = '1';
        }
      }
    });
  }
  
  // Calculadora de Fuerzas Hidrostáticas sobre Superficies Sumergidas
  const hydrostaticForceCalculator = document.getElementById('hydrostatic-force-calculator');
  if (hydrostaticForceCalculator) {
    const surfaceShape = document.getElementById('surface-shape');
    const rectDims = document.getElementById('rectangle-dims');
    const circleDims = document.getElementById('circle-dims');
    const triangleDims = document.getElementById('triangle-dims');
    const rectWidth = document.getElementById('rect-width');
    const rectHeight = document.getElementById('rect-height');
    const circleRadius = document.getElementById('circle-radius');
    const triangleBase = document.getElementById('triangle-base');
    const triangleHeight = document.getElementById('triangle-height');
    const topDepth = document.getElementById('top-depth');
    const fluidDensityForce = document.getElementById('fluid-density-force');
    const forceResult = document.getElementById('force-result');
    const totalForce = document.getElementById('total-force');
    const cpDepth = document.getElementById('cp-depth');
    const cpDistance = document.getElementById('cp-distance');
    const surfaceRepresentation = document.getElementById('surface-representation');
    const forceArrow = document.getElementById('force-arrow');
    const centerPressure = document.getElementById('center-pressure');
    
    // Mostrar/ocultar campos según la forma seleccionada
    surfaceShape.addEventListener('change', function() {
      rectDims.style.display = 'none';
      circleDims.style.display = 'none';
      triangleDims.style.display = 'none';
      
      switch(this.value) {
        case 'rectangle':
          rectDims.style.display = 'block';
          break;
        case 'circle':
          circleDims.style.display = 'block';
          break;
        case 'triangle':
          triangleDims.style.display = 'block';
          break;
      }
    });
    
    // Calcular fuerza hidrostática
    hydrostaticForceCalculator.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const shape = surfaceShape.value;
      const topDepthValue = parseFloat(topDepth.value);
      const density = parseFloat(fluidDensityForce.value);
      const g = 9.81; // m/s²
      
      let area, centroidDepth, momentOfInertia, width, height;
      
      // Calcular según la forma
      switch(shape) {
        case 'rectangle':
          width = parseFloat(rectWidth.value);
          height = parseFloat(rectHeight.value);
          area = width * height;
          centroidDepth = topDepthValue + height / 2;
          momentOfInertia = (width * Math.pow(height, 3)) / 12;
          break;
        case 'circle':
          const radius = parseFloat(circleRadius.value);
          area = Math.PI * Math.pow(radius, 2);
          centroidDepth = topDepthValue + radius;
          momentOfInertia = (Math.PI * Math.pow(radius, 4)) / 4;
          width = radius * 2;
          height = radius * 2;
          break;
        case 'triangle':
          width = parseFloat(triangleBase.value);
          height = parseFloat(triangleHeight.value);
          area = (width * height) / 2;
          centroidDepth = topDepthValue + height / 3;
          momentOfInertia = (width * Math.pow(height, 3)) / 36;
          break;
      }
      
      // Calcular fuerza hidrostática: F = ρgAh_c
      const force = density * g * area * centroidDepth;
      
      // Calcular centro de presión
      const cpDistanceValue = momentOfInertia / (area * centroidDepth);
      const cpDepthValue = centroidDepth + cpDistanceValue;
      
      // Mostrar resultados
      totalForce.textContent = force.toLocaleString(undefined, {maximumFractionDigits: 2});
      cpDepth.textContent = cpDepthValue.toLocaleString(undefined, {maximumFractionDigits: 3});
      cpDistance.textContent = cpDistanceValue.toLocaleString(undefined, {maximumFractionDigits: 3});
      
      forceResult.style.display = 'block';
      
      // Actualizar visualización
      if (surfaceRepresentation && forceArrow && centerPressure) {
        // Ajustar representación de la superficie
        let topPosition, leftPosition, surfaceWidth, surfaceHeight;
        
        switch(shape) {
          case 'rectangle':
            topPosition = 20;
            leftPosition = 25;
            surfaceWidth = 50;
            surfaceHeight = 60;
            surfaceRepresentation.style.borderRadius = '0';
            break;
          case 'circle':
            topPosition = 20;
            leftPosition = 25;
            surfaceWidth = 50;
            surfaceHeight = 50;
            surfaceRepresentation.style.borderRadius = '50%';
            break;
          case 'triangle':
            topPosition = 20;
            leftPosition = 25;
            surfaceWidth = 50;
            surfaceHeight = 60;
            // Usar un clip-path para el triángulo
            surfaceRepresentation.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
            break;
        }
        
        surfaceRepresentation.style.top = `${topPosition}%`;
        surfaceRepresentation.style.left = `${leftPosition}%`;
        surfaceRepresentation.style.width = `${surfaceWidth}%`;
        surfaceRepresentation.style.height = `${surfaceHeight}%`;
        
        // Posicionar el centro de presión
        const cpPositionFromTop = topPosition + (cpDistanceValue / height) * surfaceHeight;
        centerPressure.style.top = `${cpPositionFromTop}%`;
        centerPressure.style.left = '50%';
        
        // Posicionar la flecha de fuerza
        forceArrow.style.top = `${cpPositionFromTop}%`;
        forceArrow.style.left = '50%';
      }
    });
  }
  
  // Simulador de Prensa Hidráulica
  const pascalSimulator = document.getElementById('pascal-simulator');
  if (pascalSimulator) {
    const smallPistonArea = document.getElementById('small-piston-area');
    const largePistonArea = document.getElementById('large-piston-area');
    const inputForce = document.getElementById('input-force');
    const pascalResult = document.getElementById('pascal-result');
    const outputForce = document.getElementById('output-force');
    const systemPressure = document.getElementById('system-pressure');
    const mechanicalAdvantage = document.getElementById('mechanical-advantage');
    const smallDistance = document.getElementById('small-distance');
    const largeDistance = document.getElementById('large-distance');
    const smallPiston = document.getElementById('small-piston');
    const largePiston = document.getElementById('large-piston');
    
    pascalSimulator.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const smallArea = parseFloat(smallPistonArea.value) / 10000; // cm² a m²
      const largeArea = parseFloat(largePistonArea.value) / 10000; // cm² a m²
      const force = parseFloat(inputForce.value);
      
      // Calcular según el principio de Pascal
      const pressure = force / smallArea; // Pa
      const outputForceValue = pressure * largeArea; // N
      const advantage = largeArea / smallArea;
      
      // Calcular distancias (conservación del trabajo)
      const smallDistanceValue = 10; // cm, valor fijo para visualización
      const largeDistanceValue = smallDistanceValue * (smallArea / largeArea);
      
      // Mostrar resultados
      outputForce.textContent = outputForceValue.toLocaleString(undefined, {maximumFractionDigits: 2});
      systemPressure.textContent = pressure.toLocaleString(undefined, {maximumFractionDigits: 2});
      mechanicalAdvantage.textContent = advantage.toLocaleString(undefined, {maximumFractionDigits: 2});
      smallDistance.textContent = smallDistanceValue.toFixed(2);
      largeDistance.textContent = largeDistanceValue.toFixed(2);
      
      pascalResult.style.display = 'block';
      
      // Actualizar visualización
      if (smallPiston && largePiston) {
        smallPiston.style.bottom = '65%';
        largePiston.style.bottom = `${45 + largeDistanceValue}%`;
      }
    });
  }
  
  // Calculadora de Flotabilidad
  const buoyancyCalculator = document.getElementById('buoyancy-calculator');
  if (buoyancyCalculator) {
    const objectMass = document.getElementById('object-mass');
    const objectVolume = document.getElementById('object-volume');
    const fluidDensityBuoyancy = document.getElementById('fluid-density-buoyancy');
    const customFluidDensity = document.getElementById('custom-fluid-density');
    const customFluidDensityValue = document.getElementById('custom-fluid-density-value');
    const buoyancyResult = document.getElementById('buoyancy-result');
    const objectDensity = document.getElementById('object-density');
    const buoyancyForce = document.getElementById('buoyancy-force');
    const objectWeight = document.getElementById('object-weight');
    const netForce = document.getElementById('net-force');
    const forceDirection = document.getElementById('force-direction');
    const buoyancyState = document.getElementById('buoyancy-state');
    const submergedPercentage = document.getElementById('submerged-percentage');
    const floatingObject = document.getElementById('floating-object');
    const weightArrow = document.getElementById('weight-arrow');
    const buoyancyArrow = document.getElementById('buoyancy-arrow');
    
    // Mostrar/ocultar campo de densidad personalizada
    fluidDensityBuoyancy.addEventListener('change', function() {
      if (this.value === 'custom') {
        customFluidDensity.style.display = 'block';
      } else {
        customFluidDensity.style.display = 'none';
      }
    });
    
    // Calcular flotabilidad
    buoyancyCalculator.addEventListener('submit', function(e) {
    e.preventDefault();

      const mass = parseFloat(objectMass.value); // kg
      const volume = parseFloat(objectVolume.value); // m³
      
      // Obtener densidad del fluido
      let fluidDensity;
      if (fluidDensityBuoyancy.value === 'custom') {
        fluidDensity = parseFloat(customFluidDensityValue.value);
      } else {
        fluidDensity = parseFloat(fluidDensityBuoyancy.value);
      }
      
      const g = 9.81; // m/s²
      
      // Calcular densidad del objeto
      const objectDensityValue = mass / volume; // kg/m³
      
      // Calcular peso y empuje
      const weightValue = mass * g; // N
      const maxBuoyancyForceValue = fluidDensity * g * volume; // N
      
      // Determinar si flota o se hunde
      let netForceValue, submergPercentage, state;
      
      if (objectDensityValue < fluidDensity) {
        // El objeto flota parcialmente sumergido
        submergPercentage = (objectDensityValue / fluidDensity) * 100;
        netForceValue = 0; // En equilibrio
        state = "Flotando parcialmente sumergido";
      } else if (objectDensityValue === fluidDensity) {
        // El objeto flota completamente sumergido
        submergPercentage = 100;
        netForceValue = 0; // En equilibrio
        state = "Flotando completamente sumergido (equilibrio neutro)";
      } else {
        // El objeto se hunde
        submergPercentage = 100;
        netForceValue = weightValue - maxBuoyancyForceValue; // Fuerza neta hacia abajo
        state = "Hundiéndose";
      }
      
      // Mostrar resultados
      objectDensity.textContent = objectDensityValue.toLocaleString(undefined, {maximumFractionDigits: 2});
      buoyancyForce.textContent = maxBuoyancyForceValue.toLocaleString(undefined, {maximumFractionDigits: 2});
      objectWeight.textContent = weightValue.toLocaleString(undefined, {maximumFractionDigits: 2});
      netForce.textContent = Math.abs(netForceValue).toLocaleString(undefined, {maximumFractionDigits: 2});
      forceDirection.textContent = netForceValue > 0 ? "(hacia abajo)" : netForceValue < 0 ? "(hacia arriba)" : "(en equilibrio)";
      buoyancyState.textContent = state;
      submergedPercentage.textContent = submergPercentage.toLocaleString(undefined, {maximumFractionDigits: 1});
      
      buoyancyResult.style.display = 'block';
      
      // Actualizar visualización
      if (floatingObject && weightArrow && buoyancyArrow) {
        // Posicionar el objeto según su flotabilidad
        const waterLevel = 40; // % desde arriba
        
        if (objectDensityValue < fluidDensity) {
          // Flotando parcialmente
          const submergedHeight = (submergPercentage / 100) * 60; // 60px es el alto del objeto
          floatingObject.style.top = `${waterLevel - (60 - submergedHeight) / 2}%`;
          floatingObject.style.backgroundColor = '#fcd34d';
        } else if (objectDensityValue === fluidDensity) {
          // Equilibrio neutro
          floatingObject.style.top = `${waterLevel}%`;
          floatingObject.style.backgroundColor = '#a3e635';
        } else {
          // Hundiéndose
          floatingObject.style.top = `${waterLevel + 20}%`;
          floatingObject.style.backgroundColor = '#f87171';
        }
        
        // Ajustar flechas de fuerza
        const objectPosition = parseFloat(floatingObject.style.top);
        weightArrow.style.top = `${objectPosition}%`;
        weightArrow.style.height = `${weightValue / 10}px`;
        
        buoyancyArrow.style.top = `${objectPosition}%`;
        buoyancyArrow.style.height = `${maxBuoyancyForceValue / 10}px`;
      }
    });
  }
});
