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
    }
  };

  // Obtener elementos del DOM
  const dimensionSelect = document.getElementById('dimension');
  const inputValue = document.getElementById('inputValue');
  const fromUnitSelect = document.getElementById('fromUnit');
  const toUnitSelect = document.getElementById('toUnit');
  const convertBtn = document.getElementById('convertBtn');
  const resultDisplay = document.getElementById('result');
  const swapUnitsBtn = document.getElementById('swapUnits');
  const saveConversionBtn = document.getElementById('saveConversion');

  // Inicializar selectores de unidades
  updateUnitOptions();

  // Event listeners
  dimensionSelect.addEventListener('change', updateUnitOptions);
  convertBtn.addEventListener('click', performConversion);
  swapUnitsBtn.addEventListener('click', swapUnits);
  saveConversionBtn.addEventListener('click', saveConversion);
  inputValue.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      performConversion();
    }
  });

  // Función para actualizar las opciones de unidades según la dimensión seleccionada
  function updateUnitOptions() {
    const dimension = dimensionSelect.value;
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
    const dimension = dimensionSelect.value;
    const value = parseFloat(inputValue.value);
    const fromUnit = fromUnitSelect.value;
    const toUnit = toUnitSelect.value;

    if (isNaN(value)) {
      resultDisplay.textContent = "Por favor ingresa un número válido";
      resultDisplay.classList.add('error');
      return;
    }

    resultDisplay.classList.remove('error');

    // Manejar conversión de temperatura de forma especial
    if (dimension === 'temperatura') {
      const result = convertTemperature(value, fromUnit, toUnit);
      if (result !== null) {
        resultDisplay.textContent = `${value} ${fromUnit} = ${result.toFixed(4)} ${toUnit}`;
        resultDisplay.classList.add('update-flash');
        setTimeout(() => resultDisplay.classList.remove('update-flash'), 300);
      } else {
        resultDisplay.textContent = "Error en la conversión de temperatura";
        resultDisplay.classList.add('error');
      }
      return;
    }

    // Conversión normal para otras dimensiones
    const unitSet = units[dimension];
    if (!unitSet || !(fromUnit in unitSet) || !(toUnit in unitSet)) {
      resultDisplay.textContent = "Conversión no válida";
      resultDisplay.classList.add('error');
      return;
    }

    // Realizar la conversión
    const valueInBase = value * unitSet[fromUnit];
    const result = valueInBase / unitSet[toUnit];

    // Mostrar el resultado
    resultDisplay.textContent = `${value} ${fromUnit} = ${result.toFixed(6)} ${toUnit}`;
    
    // Añadir efecto visual
    resultDisplay.classList.add('update-flash');
    setTimeout(() => resultDisplay.classList.remove('update-flash'), 300);
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
  }

  // Función para guardar la conversión en el historial
  function saveConversion() {
    if (!inputValue.value) return;
    
    const dimension = dimensionSelect.value;
    const value = parseFloat(inputValue.value);
    const fromUnit = fromUnitSelect.value;
    const toUnit = toUnitSelect.value;
    
    if (isNaN(value)) return;
    
    // Obtener historial existente o crear uno nuevo
    let conversionHistory = JSON.parse(localStorage.getItem('conversionHistory')) || [];
    
    // Añadir nueva conversión
    conversionHistory.push({
      dimension: dimension,
      value: value,
      fromUnit: fromUnit,
      toUnit: toUnit,
      result: resultDisplay.textContent,
      timestamp: new Date().toISOString()
    });
    
    // Limitar a 10 entradas
    if (conversionHistory.length > 10) {
      conversionHistory = conversionHistory.slice(-10);
    }
    
    // Guardar en localStorage
    localStorage.setItem('conversionHistory', JSON.stringify(conversionHistory));
    
    // Actualizar la visualización del historial
    updateHistoryDisplay();
  }

  // Función para actualizar la visualización del historial
  function updateHistoryDisplay() {
    const historyList = document.getElementById('historyList');
    const conversionHistory = JSON.parse(localStorage.getItem('conversionHistory')) || [];
    
    if (conversionHistory.length === 0) {
      historyList.innerHTML = '<p class="empty-history">No hay conversiones guardadas</p>';
      return;
    }
    
    historyList.innerHTML = '';
    
    // Mostrar conversiones en orden inverso (más recientes primero)
    conversionHistory.slice().reverse().forEach((item, index) => {
      const historyItem = document.createElement('div');
      historyItem.className = 'history-item';
      
      const date = new Date(item.timestamp);
      const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      
      historyItem.innerHTML = `
        <div class="history-item-header">
          <span class="history-type">${item.dimension}</span>
          <span class="history-time">${formattedDate}</span>
        </div>
        <div class="history-conversion">${item.result}</div>
        <button class="reuse-conversion" data-index="${conversionHistory.length - 1 - index}">Usar esta conversión</button>
      `;
      
      historyList.appendChild(historyItem);
    });
    
    // Añadir event listeners a los botones de reutilización
    document.querySelectorAll('.reuse-conversion').forEach(button => {
      button.addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-index'));
        reuseConversion(index);
      });
    });
  }

  // Función para reutilizar una conversión del historial
  function reuseConversion(index) {
    const conversionHistory = JSON.parse(localStorage.getItem('conversionHistory')) || [];
    const item = conversionHistory[index];
    
    if (!item) return;
    
    // Establecer los valores en el formulario
    dimensionSelect.value = item.dimension;
    updateUnitOptions();
    
    // Encontrar y establecer las unidades
    Array.from(fromUnitSelect.options).forEach((option, i) => {
      if (option.value === item.fromUnit) {
        fromUnitSelect.selectedIndex = i;
      }
    });
    
    Array.from(toUnitSelect.options).forEach((option, i) => {
      if (option.value === item.toUnit) {
        toUnitSelect.selectedIndex = i;
      }
    });
    
    inputValue.value = item.value;
    performConversion();
  }

  // Botón para limpiar el historial
  const clearHistoryBtn = document.getElementById('clearHistory');
  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', function() {
      localStorage.removeItem('conversionHistory');
      updateHistoryDisplay();
    });
  }

  // Inicializar la visualización del historial al cargar la página
  updateHistoryDisplay();
});
