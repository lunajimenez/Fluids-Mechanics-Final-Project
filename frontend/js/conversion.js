// Advanced Unit Conversion System
const conversionFactors = {
    pressure: {
        'Pa': 1,
        'kPa': 1000,
        'MPa': 1000000,
        'bar': 100000,
        'psi': 6894.76,
        'atm': 101325
    },
    velocity: {
        'm/s': 1,
        'km/h': 3.6,
        'ft/s': 3.2808399,
        'mph': 2.23693629
    },
    viscosity: {
        'Pa·s': 1,
        'cP': 0.001,
        'P': 0.1
    },
    density: {
        'kg/m³': 1,
        'g/cm³': 1000,
        'lb/ft³': 16.0185
    }
};

class UnitConverter {
    constructor() {
        this.setupEventListeners();
        this.initializeCalculators();
    }

    convert(value, fromUnit, toUnit, type) {
        if (!conversionFactors[type]) return null;
        
        const baseValue = value * (1 / conversionFactors[type][fromUnit]);
        return baseValue * conversionFactors[type][toUnit];
    }

    formatResult(value) {
        return Number(value.toFixed(6)).toString();
    }

    initializeCalculators() {
        const calculatorTypes = ['pressure', 'velocity', 'viscosity', 'density'];
        
        calculatorTypes.forEach(type => {
            const units = Object.keys(conversionFactors[type]);
            const fromSelect = document.getElementById(`${type}From`);
            const toSelect = document.getElementById(`${type}To`);
            
            units.forEach(unit => {
                fromSelect.innerHTML += `<option value="${unit}">${unit}</option>`;
                toSelect.innerHTML += `<option value="${unit}">${unit}</option>`;
            });
        });
    }

    setupEventListeners() {
        const calculatorTypes = ['pressure', 'velocity', 'viscosity', 'density'];
        
        calculatorTypes.forEach(type => {
            const input = document.getElementById(`${type}Input`);
            const fromSelect = document.getElementById(`${type}From`);
            const toSelect = document.getElementById(`${type}To`);
            const result = document.getElementById(`${type}Result`);

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
}

// Initialize the converter when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new UnitConverter();
}); 