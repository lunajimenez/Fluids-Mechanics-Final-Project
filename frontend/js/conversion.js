// js/conversion.js
document.addEventListener('DOMContentLoaded', () => {
  const units = {
    longitud: {
      metro: 1,
      pie: 0.3048,
      pulgada: 0.0254,
      kilometro: 1000,
      milla: 1609.34,
      centimetro: 0.01,
      milimetro: 0.001,
      yarda: 0.9144
    },
    masa: {
      kilogramo: 1,
      gramo: 0.001,
      libra: 0.453592,
      tonelada: 1000,
      onza: 0.0283495
    },
    area: {
      "m²": 1,
      "ft²": 0.092903,
      "cm²": 0.0001,
      "in²": 0.00064516,
      "km²": 1000000,
      "ha": 10000
    },
    tiempo: {
      segundo: 1,
      minuto: 60,
      hora: 3600,
      día: 86400,
      semana: 604800
    },
    corriente: {
      amperio: 1,
      miliamperio: 0.001,
      microamperio: 0.000001
    },
    temperatura: {
      celsius: "C",
      fahrenheit: "F",
      kelvin: "K"
    },
    sustancia: {
      mol: 1,
      kilomol: 1000,
      milimol: 0.001
    },
    luminosa: {
      candela: 1,
      lumen: 1
    },
    volumen: {
      "m³": 1,
      litro: 0.001,
      galón: 0.00378541,
      "ft³": 0.0283168,
      "cm³": 0.000001,
      mililitro: 0.000001
    },
    velocidad: {
      "m/s": 1,
      "km/h": 0.277778,
      "mph": 0.44704,
      "ft/s": 0.3048,
      nudo: 0.514444
    },
    aceleracion: {
      "m/s²": 1,
      "ft/s²": 0.3048,
      "g": 9.80665
    },
    fuerza: {
      newton: 1,
      kilopondio: 9.80665,
      libra_fuerza: 4.44822,
      kilonewton: 1000
    },
    presion: {
      pascal: 1,
      atm: 101325,
      bar: 100000,
      psi: 6894.76,
      mmHg: 133.322,
      kPa: 1000,
      MPa: 1000000
    },
    trabajo: {
      julio: 1,
      caloria: 4.184,
      kilojulio: 1000,
      BTU: 1055.06,
      kilocaloría: 4184
    },
    potencia: {
      watt: 1,
      kilowatt: 1000,
      caballo_de_fuerza: 745.7,
      BTU_h: 0.293071
    },
    densidad: {
      "kg/m³": 1,
      "g/cm³": 1000,
      "lb/ft³": 16.0185,
      "g/mL": 1000
    }
  };

  // Obtener elementos del DOM
  const dimensionButtons = document.querySelectorAll('.dimension-btn');
  const inputValue = document.getElementById('inputValue');
  const outputValue = document.getElementById('outputValue');
  const fromUnitSelect = document.getElementById('fromUnit');
  const toUnitSelect = document.getElementById('toUnit');
  const swapUnitsBtn = document.getElementById('swapUnits');
  const conversionChips = document.querySelectorAll('.conversion-chip');
  const historyList = document.getElementById('historyList');
  const clearHistoryBtn = document.getElementById('clearHistory');
  
  // Estado actual
  let currentDimension = 'longitud';
  
  // Inicializar la interfaz
  initializeInterface();
  
  // Event listeners
  dimensionButtons.forEach(button => {
    button.addEventListener('click', () => {
      setActiveDimension(button.dataset.dimension);
    });
  });
  
  inputValue.addEventListener('input', performConversion);
  fromUnitSelect.addEventListener('change', performConversion);
  toUnitSelect.addEventListener('change', performConversion);
  swapUnitsBtn.addEventListener('click', swapUnits);
  clearHistoryBtn.addEventListener('click', clearHistory);
  
  conversionChips.forEach(chip => {
    chip.addEventListener('click', () => {
      useConversionChip(chip);
    });
  });
  
  // Cargar historial desde localStorage
  loadHistory();
  
  // Función para inicializar la interfaz
  function initializeInterface() {
    setActiveDimension('longitud');
  }
  
  // Función para establecer la dimensión activa
  function setActiveDimension(dimension) {
    // Actualizar estado
    currentDimension = dimension;
    
    // Actualizar botones
    dimensionButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.dimension === dimension);
    });
    
    // Actualizar selectores de unidades
    updateUnitOptions(dimension);
    
    // Limpiar valores
    inputValue.value = '';
    outputValue.value = '';
  }
  
  // Función para actualizar las opciones de unidades según la dimensión seleccionada
  function updateUnitOptions(dimension) {
    const unitSet = units[dimension];
    
    if (!unitSet) return;
    
    // Limpiar selectores
    fromUnitSelect.innerHTML = '';
    toUnitSelect.innerHTML = '';
    
    // Poblar selectores con nuevas opciones
    for (const unit in unitSet) {
      const fromOption = document.createElement('option');
      fromOption.value = unit;
      fromOption.textContent = unit;
      fromUnitSelect.appendChild(fromOption);
      
      const toOption = document.createElement('option');
      toOption.value = unit;
      toOption.textContent = unit;
      toUnitSelect.appendChild(toOption);
    }
    
    // Seleccionar opciones diferentes por defecto si es posible
    if (toUnitSelect.options.length > 1) {
      toUnitSelect.selectedIndex = 1;
    }
  }
  
  // Función para realizar la conversión
  function performConversion() {
    const value = parseFloat(inputValue.value);
    
    if (isNaN(value)) {
      outputValue.value = '';
      return;
    }
    
    const fromUnit = fromUnitSelect.value;
    const toUnit = toUnitSelect.value;
    
    // Manejar conversión de temperatura de forma especial
    if (currentDimension === 'temperatura') {
      const result = convertTemperature(value, fromUnit, toUnit);
      if (result !== null) {
        outputValue.value = result.toFixed(6);
        outputValue.classList.add('update-flash');
        setTimeout(() => outputValue.classList.remove('update-flash'), 300);
      } else {
        outputValue.value = 'Error';
      }
      return;
    }
    
    // Conversión normal para otras dimensiones
    const unitSet = units[currentDimension];
    if (!unitSet || !(fromUnit in unitSet) || !(toUnit in unitSet)) {
      outputValue.value = 'Error';
      return;
    }
    
    // Realizar la conversión
    const valueInBase = value * unitSet[fromUnit];
    const result = valueInBase / unitSet[toUnit];
    
    // Mostrar el resultado
    outputValue.value = result.toFixed(6);
    
    // Añadir efecto visual
    outputValue.classList.add('update-flash');
    setTimeout(() => outputValue.classList.remove('update-flash'), 300);
  }
  
  // Función para convertir temperaturas
  function convertTemperature(value, fromUnit, toUnit) {
    if (fromUnit === toUnit) return value;
    
    // Convertir a Celsius primero
    let celsius;
    switch (fromUnit) {
      case 'celsius':
        celsius = value;
        break;
      case 'fahrenheit':
        celsius = (value - 32) * 5 / 9;
        break;
      case 'kelvin':
        celsius = value - 273.15;
        break;
      default:
        return null;
    }
    
    // Convertir de Celsius a la unidad de destino
    switch (toUnit) {
      case 'celsius':
        return celsius;
      case 'fahrenheit':
        return (celsius * 9 / 5) + 32;
      case 'kelvin':
        return celsius + 273.15;
      default:
        return null;
    }
  }
  
  // Función para intercambiar unidades
  function swapUnits() {
    const fromIndex = fromUnitSelect.selectedIndex;
    const toIndex = toUnitSelect.selectedIndex;
    
    fromUnitSelect.selectedIndex = toIndex;
    toUnitSelect.selectedIndex = fromIndex;
    
    if (inputValue.value) {
      performConversion();
    }
    
    // Efecto visual
    swapUnitsBtn.classList.add('update-flash');
    setTimeout(() => swapUnitsBtn.classList.remove('update-flash'), 300);
  }
  
  // Función para usar un chip de conversión
  function useConversionChip(chip) {
    const dimension = chip.dataset.dimension;
    const fromUnit = chip.dataset.from;
    const toUnit = chip.dataset.to;
    const value = parseFloat(chip.dataset.value);
    
    if (dimension && fromUnit && toUnit && !isNaN(value)) {
      // Cambiar a la dimensión correspondiente
      setActiveDimension(dimension);
      
      // Establecer valores
      inputValue.value = value;
      
      // Seleccionar unidades
      for (let i = 0; i < fromUnitSelect.options.length; i++) {
        if (fromUnitSelect.options[i].value === fromUnit) {
          fromUnitSelect.selectedIndex = i;
          break;
        }
      }
      
      for (let i = 0; i < toUnitSelect.options.length; i++) {
        if (toUnitSelect.options[i].value === toUnit) {
          toUnitSelect.selectedIndex = i;
          break;
        }
      }
      
      // Realizar conversión
      performConversion();
      
      // Guardar en historial
      saveToHistory();
    }
    
    // Efecto visual
    chip.classList.add('update-flash');
    setTimeout(() => chip.classList.remove('update-flash'), 300);
  }
  
  // Función para guardar conversión en historial
  function saveToHistory() {
    const value = parseFloat(inputValue.value);
    
    if (isNaN(value)) return;
    
    const fromUnit = fromUnitSelect.value;
    const toUnit = toUnitSelect.value;
    const result = outputValue.value;
    
    const conversion = {
      dimension: currentDimension,
      fromValue: value,
      fromUnit: fromUnit,
      toValue: parseFloat(result),
      toUnit: toUnit,
      timestamp: new Date().toISOString()
    };
    
    // Obtener historial existente
    let history = JSON.parse(localStorage.getItem('conversionHistory') || '[]');
    
    // Añadir nueva conversión al principio
    history.unshift(conversion);
    
    // Limitar a 10 entradas
    if (history.length > 10) {
      history = history.slice(0, 10);
    }
    
    // Guardar en localStorage
    localStorage.setItem('conversionHistory', JSON.stringify(history));
    
    // Actualizar visualización
    updateHistoryDisplay(history);
  }
  
  // Función para cargar historial
  function loadHistory() {
    const history = JSON.parse(localStorage.getItem('conversionHistory') || '[]');
    updateHistoryDisplay(history);
  }
  
  // Función para actualizar visualización del historial
  function updateHistoryDisplay(history) {
    if (history.length === 0) {
      historyList.innerHTML = '<p class="empty-history">No hay conversiones guardadas</p>';
      return;
    }
    
    historyList.innerHTML = '';
    
    history.forEach((item, index) => {
      const historyItem = document.createElement('div');
      historyItem.className = 'history-item';
      
      const date = new Date(item.timestamp);
      const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      
      historyItem.innerHTML = `
        <div class="history-item-header">
          <span class="history-type">${capitalizeFirstLetter(item.dimension)}</span>
          <span class="history-time">${formattedDate}</span>
        </div>
        <div class="history-conversion">
          ${item.fromValue} ${item.fromUnit} = ${item.toValue} ${item.toUnit}
        </div>
        <button class="reuse-conversion" data-index="${index}">Reutilizar</button>
      `;
      
      historyList.appendChild(historyItem);
    });
    
    // Añadir event listeners para botones de reutilización
    document.querySelectorAll('.reuse-conversion').forEach(button => {
      button.addEventListener('click', () => {
        const index = parseInt(button.dataset.index);
        reuseConversion(index);
      });
    });
  }
  
  // Función para reutilizar una conversión del historial
  function reuseConversion(index) {
    const history = JSON.parse(localStorage.getItem('conversionHistory') || '[]');
    
    if (index >= 0 && index < history.length) {
      const item = history[index];
      
      // Cambiar a la dimensión correspondiente
      setActiveDimension(item.dimension);
      
      // Establecer valores
      inputValue.value = item.fromValue;
      
      // Seleccionar unidades
      for (let i = 0; i < fromUnitSelect.options.length; i++) {
        if (fromUnitSelect.options[i].value === item.fromUnit) {
          fromUnitSelect.selectedIndex = i;
          break;
        }
      }
      
      for (let i = 0; i < toUnitSelect.options.length; i++) {
        if (toUnitSelect.options[i].value === item.toUnit) {
          toUnitSelect.selectedIndex = i;
          break;
        }
      }
      
      // Realizar conversión
      performConversion();
    }
  }
  
  // Función para limpiar historial
  function clearHistory() {
    localStorage.removeItem('conversionHistory');
    updateHistoryDisplay([]);
  }
  
  // Función auxiliar para capitalizar primera letra
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
});
