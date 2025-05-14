// Advanced Unit Conversion System
const conversionFactors = {
    pressure: {
        'Pa': 1,
        'kPa': 1000,
        'MPa': 1000000,
        'bar': 100000,
        'psi': 6894.76,
        'atm': 101325,
        'mmHg': 133.322,
        'Torr': 133.322
    },
    velocity: {
        'm/s': 1,
        'km/h': 0.277778,
        'ft/s': 0.3048,
        'mph': 0.44704,
        'knot': 0.514444
    },
    viscosity: {
        'Pa·s': 1,
        'cP': 0.001,
        'P': 0.1,
        'mPa·s': 0.001,
        'N·s/m²': 1
    },
    density: {
        'kg/m³': 1,
        'g/cm³': 1000,
        'g/mL': 1000,
        'lb/ft³': 16.0185,
        'kg/L': 1000
    },
    temperature: {
        '°C': { factor: 1, offset: 0 },
        '°F': { factor: 5/9, offset: -32 },
        'K': { factor: 1, offset: -273.15 }
    },
    flow: {
        'm³/s': 1,
        'L/s': 0.001,
        'L/min': 1.66667e-5,
        'gal(US)/min': 6.30902e-5,
        'ft³/s': 0.0283168,
        'ft³/min': 0.000471947
    }
};

// Historial de conversiones
let conversionHistory = [];

class UnitConverter {
    constructor() {
        this.setupEventListeners();
        this.initializeCalculators();
        this.setupHistoryFeature();
        this.setupCommonConversions();
    }

    convert(value, fromUnit, toUnit, type) {
        if (!conversionFactors[type]) return null;
        
        const baseValue = value * (1 / conversionFactors[type][fromUnit]);
        return baseValue * conversionFactors[type][toUnit];
    }

    formatResult(value) {
        // Formato más inteligente con diferentes niveles de precisión
        if (Math.abs(value) >= 1000) {
            return value.toLocaleString('es-ES', { maximumFractionDigits: 2 });
        } else if (Math.abs(value) >= 10) {
            return value.toLocaleString('es-ES', { maximumFractionDigits: 4 });
        } else if (Math.abs(value) >= 0.01) {
            return value.toLocaleString('es-ES', { maximumFractionDigits: 6 });
        } else {
            return value.toExponential(4);
        }
    }

    initializeCalculators() {
        const calculatorTypes = ['pressure', 'velocity', 'viscosity', 'density'];
        
        calculatorTypes.forEach(type => {
            const units = Object.keys(conversionFactors[type]);
            const fromSelect = document.getElementById(`${type}From`);
            const toSelect = document.getElementById(`${type}To`);
            
            if (fromSelect && toSelect) {
                fromSelect.innerHTML = '';
                toSelect.innerHTML = '';
                
                units.forEach(unit => {
                    fromSelect.innerHTML += `<option value="${unit}">${unit}</option>`;
                    toSelect.innerHTML += `<option value="${unit}">${unit}</option>`;
                });
                
                // Establece valores diferentes por defecto
                if (units.length > 1) {
                    toSelect.selectedIndex = 1;
                }
            }
        });
    }
    
    createCalculatorCard(type, container) {
        // Iconos para cada tipo
        const icons = {
            pressure: '🔄',
            velocity: '🏃',
            viscosity: '💧',
            density: '⚖️',
            temperature: '🌡️',
            flow: '🚿'
        };
        
        // Títulos más amigables
        const titles = {
            pressure: 'Presión',
            velocity: 'Velocidad',
            viscosity: 'Viscosidad',
            density: 'Densidad',
            temperature: 'Temperatura',
            flow: 'Caudal'
        };
        
        const cardHTML = `
            <div class="calculator-card" data-type="${type}">
                <div class="calculator-header">
                    <div class="calculator-icon">${icons[type] || '🔄'}</div>
                    <h2 class="calculator-title">${titles[type] || type}</h2>
                </div>
                <div class="input-group">
                    <label>Valor:</label>
                    <input type="number" id="${type}Input" placeholder="Ingrese el valor" step="any">
                </div>
                <div class="input-group">
                    <label>De:</label>
                    <select id="${type}From"></select>
                </div>
                <div class="input-group">
                    <label>A:</label>
                    <select id="${type}To"></select>
                </div>
                <div class="result-display" id="${type}Result">---</div>
                <button class="save-conversion-btn" data-type="${type}">Guardar</button>
            </div>
        `;
        
        // Añadir al contenedor
        if (container) {
            container.insertAdjacentHTML('beforeend', cardHTML);
        }
    }

    setupEventListeners() {
        const calculatorTypes = ['pressure', 'velocity', 'viscosity', 'density'];
        
        calculatorTypes.forEach(type => {
            const input = document.getElementById(`${type}Input`);
            const fromSelect = document.getElementById(`${type}From`);
            const toSelect = document.getElementById(`${type}To`);
            const result = document.getElementById(`${type}Result`);
            const saveBtn = document.querySelector(`.save-conversion-btn[data-type="${type}"]`);

            if (input && fromSelect && toSelect && result) {
                const updateResult = () => {
                    const value = parseFloat(input.value);
                    if (isNaN(value)) {
                        result.textContent = '---';
                        return;
                    }

                    const convertedValue = this.convert(
                        value,
                        fromSelect.value,
                        toSelect.value,
                        type
                    );

                    result.textContent = this.formatResult(convertedValue);
                    
                    // Animate result update
                    result.classList.add('update-flash');
                    setTimeout(() => result.classList.remove('update-flash'), 300);
                };

                [input, fromSelect, toSelect].forEach(element => {
                    element.addEventListener('input', updateResult);
                    element.addEventListener('change', updateResult);
                });
                
                // Añadir botón de intercambio
                if (!document.querySelector(`.swap-btn-${type}`)) {
                    const swapButton = document.createElement('button');
                    swapButton.className = `swap-btn swap-btn-${type}`;
                    swapButton.innerHTML = '⇄';
                    swapButton.title = 'Intercambiar unidades';
                    
                    const fromGroup = fromSelect.closest('.input-group');
                    fromGroup.appendChild(swapButton);
                    
                    swapButton.addEventListener('click', () => {
                        const tempValue = fromSelect.value;
                        fromSelect.value = toSelect.value;
                        toSelect.value = tempValue;
                        updateResult();
                    });
                }
                
                // Guardar conversión
                if (saveBtn) {
                    saveBtn.addEventListener('click', () => {
                        const value = parseFloat(input.value);
                        if (!isNaN(value)) {
                            this.saveConversion(
                                value, 
                                fromSelect.value, 
                                toSelect.value, 
                                type
                            );
                        }
                    });
                }
            }
        });

        // Quick Convert Feature
        const quickConvertBtn = document.querySelector('.quick-convert');
        if (quickConvertBtn) {
            quickConvertBtn.addEventListener('click', () => {
                const calculators = document.querySelector('.calculator-grid');
                calculators.scrollIntoView({ behavior: 'smooth' });
            });
        }
    }
    
    saveConversion(value, fromUnit, toUnit, type) {
        const convertedValue = this.convert(value, fromUnit, toUnit, type);
        
        // Guardar en historial
        conversionHistory.unshift({
            type,
            originalValue: value,
            originalUnit: fromUnit,
            convertedValue,
            convertedUnit: toUnit,
            timestamp: new Date().toLocaleString()
        });
        
        // Limitar historial a 10 elementos
        if (conversionHistory.length > 10) {
            conversionHistory.pop();
        }
        
        // Actualizar visualización
        this.updateHistoryDisplay();
        
        // Guardar en localStorage
        localStorage.setItem('conversionHistory', JSON.stringify(conversionHistory));
        
        // Notificar al usuario
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = 'Conversión guardada';
        document.body.appendChild(toast);
        
        // Eliminar después de 3 segundos
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    setupHistoryFeature() {
        // Cargar historial del localStorage
        const savedHistory = localStorage.getItem('conversionHistory');
        if (savedHistory) {
            conversionHistory = JSON.parse(savedHistory);
        }
        
        // Crear sección de historial si no existe
        if (!document.querySelector('.conversion-history')) {
            const historySection = document.createElement('div');
            historySection.className = 'conversion-history';
            historySection.innerHTML = `
                <h3>Historial de Conversiones</h3>
                <div class="history-list" id="historyList"></div>
                <button id="clearHistory" class="clear-history-btn">Limpiar Historial</button>
            `;
            
            // Insertar después de la calculadora
            const calculatorGrid = document.querySelector('.calculator-grid');
            if (calculatorGrid) {
                calculatorGrid.after(historySection);
            }
            
            // Evento para limpiar historial
            const clearBtn = document.getElementById('clearHistory');
            if (clearBtn) {
                clearBtn.addEventListener('click', () => {
                    conversionHistory = [];
                    localStorage.removeItem('conversionHistory');
                    this.updateHistoryDisplay();
                });
            }
        }
        
        // Actualizar la visualización
        this.updateHistoryDisplay();
    }
    
    updateHistoryDisplay() {
        const historyList = document.getElementById('historyList');
        if (!historyList) return;
        
        if (conversionHistory.length === 0) {
            historyList.innerHTML = '<p class="empty-history">No hay conversiones guardadas</p>';
            return;
        }
        
        historyList.innerHTML = '';
        
        conversionHistory.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div class="history-item-header">
                    <span class="history-type">${item.type.toUpperCase()}</span>
                    <span class="history-time">${item.timestamp}</span>
                </div>
                <div class="history-conversion">
                    ${this.formatResult(item.originalValue)} ${item.originalUnit} = 
                    ${this.formatResult(item.convertedValue)} ${item.convertedUnit}
                </div>
                <button class="reuse-conversion" data-type="${item.type}" 
                data-from="${item.originalUnit}" data-to="${item.convertedUnit}" 
                data-value="${item.originalValue}">Reutilizar</button>
            `;
            
            historyList.appendChild(historyItem);
            
            // Evento para reutilizar
            const reuseBtn = historyItem.querySelector('.reuse-conversion');
            reuseBtn.addEventListener('click', () => {
                const type = reuseBtn.dataset.type;
                const input = document.getElementById(`${type}Input`);
                const fromSelect = document.getElementById(`${type}From`);
                const toSelect = document.getElementById(`${type}To`);
                
                if (input && fromSelect && toSelect) {
                    input.value = reuseBtn.dataset.value;
                    fromSelect.value = reuseBtn.dataset.from;
                    toSelect.value = reuseBtn.dataset.to;
                    
                    // Trigger para actualizar el resultado
                    const event = new Event('input');
                    input.dispatchEvent(event);
                    
                    // Scroll hasta la calculadora correspondiente
                    const calculator = document.querySelector(`.calculator-card[data-type="${type}"]`);
                    if (calculator) {
                        calculator.scrollIntoView({ behavior: 'smooth' });
                        calculator.classList.add('highlight');
                        setTimeout(() => calculator.classList.remove('highlight'), 1000);
                    }
                }
            });
        });
    }
    
    setupCommonConversions() {
        const commonConversions = document.querySelector('.conversion-chips');
        if (commonConversions) {
            commonConversions.addEventListener('click', (e) => {
                if (e.target.classList.contains('conversion-chip')) {
                    const chipText = e.target.textContent;
                    const match = chipText.match(/1\s+(\S+)\s+=\s+(.+)\s+(\S+)/);
                    
                    if (match) {
                        const fromUnit = match[1];
                        const toValue = parseFloat(match[2]);
                        const toUnit = match[3];
                        
                        // Identificar el tipo de unidad
                        let conversionType = null;
                        
                        for (const type in conversionFactors) {
                            if (fromUnit in conversionFactors[type] && toUnit in conversionFactors[type]) {
                                conversionType = type;
                                break;
                            }
                        }
                        
                        if (conversionType) {
                            const input = document.getElementById(`${conversionType}Input`);
                            const fromSelect = document.getElementById(`${conversionType}From`);
                            const toSelect = document.getElementById(`${conversionType}To`);
                            
                            if (input && fromSelect && toSelect) {
                                input.value = 1;
                                fromSelect.value = fromUnit;
                                toSelect.value = toUnit;
                                
                                // Trigger para actualizar
                                const event = new Event('input');
                                input.dispatchEvent(event);
                                
                                // Scroll a la calculadora
                                const calculator = document.querySelector(`.calculator-card[data-type="${conversionType}"]`);
                                if (calculator) {
                                    calculator.scrollIntoView({ behavior: 'smooth' });
                                    calculator.classList.add('highlight');
                                    setTimeout(() => calculator.classList.remove('highlight'), 1000);
                                }
                            }
                        }
                    }
                }
            });
        }
    }
}

// Inicializar el convertidor cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    new UnitConverter();
}); 