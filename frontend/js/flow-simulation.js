// Fluid properties (viscosity in m²/s)
const fluidProperties = {
    water: { viscosity: 1.004e-6, color: '#4A90E2' },
    oil: { viscosity: 5e-5, color: '#F5A623' },
    honey: { viscosity: 1e-3, color: '#F8E71C' },
    glycerin: { viscosity: 1.12e-3, color: '#D0021B' }
};

// Get canvas and context
const canvas = document.getElementById('flowCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

// Initial resize
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Get UI elements
const fluidTypeSelect = document.getElementById('fluidType');
const velocityInput = document.getElementById('velocity');
const diameterInput = document.getElementById('diameter');
const velocityValue = document.getElementById('velocityValue');
const diameterValue = document.getElementById('diameterValue');
const reynoldsNumberSpan = document.getElementById('reynoldsNumber');
const flowTypeSpan = document.getElementById('flowType');

// Update display values
velocityInput.addEventListener('input', () => {
    velocityValue.textContent = velocityInput.value + ' m/s';
    updateSimulation();
});

diameterInput.addEventListener('input', () => {
    diameterValue.textContent = diameterInput.value + ' mm';
    updateSimulation();
});

fluidTypeSelect.addEventListener('change', updateSimulation);

// Calculate Reynolds number
function calculateReynolds(velocity, diameter, viscosity) {
    return (velocity * (diameter / 1000)) / viscosity;
}

// Determine flow type
function getFlowType(reynolds) {
    if (reynolds < 2300) return { type: 'Laminar', class: 'laminar' };
    if (reynolds > 4000) return { type: 'Turbulento', class: 'turbulent' };
    return { type: 'Transición', class: '' };
}

// Draw flow visualization
function drawFlow(reynolds, fluidColor) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerY = canvas.height / 2;
    const pipeHeight = canvas.height * 0.6;
    const particleCount = 50;
    const time = Date.now() / 1000;
    
    // Draw pipe
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, centerY - pipeHeight/2, canvas.width, pipeHeight);
    
    // Draw flow particles
    ctx.fillStyle = fluidColor;
    
    for (let i = 0; i < particleCount; i++) {
        const x = ((time * velocityInput.value * 50 + i * (canvas.width / particleCount)) % canvas.width);
        
        if (reynolds < 2300) {
            // Laminar flow - organized pattern
            const y = centerY + Math.sin(x / 50) * (pipeHeight * 0.2);
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Turbulent flow - chaotic pattern
            const y = centerY + (Math.sin(x / 30) + Math.cos((x + time * 100) / 20)) * (pipeHeight * 0.2);
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// Update simulation
function updateSimulation() {
    const velocity = parseFloat(velocityInput.value);
    const diameter = parseFloat(diameterInput.value);
    const fluidType = fluidTypeSelect.value;
    const viscosity = fluidProperties[fluidType].viscosity;
    
    const reynolds = calculateReynolds(velocity, diameter, viscosity);
    const flowType = getFlowType(reynolds);
    
    reynoldsNumberSpan.textContent = Math.round(reynolds);
    flowTypeSpan.textContent = flowType.type;
    flowTypeSpan.className = flowType.class;
    
    drawFlow(reynolds, fluidProperties[fluidType].color);
}

// Animation loop
function animate() {
    updateSimulation();
    requestAnimationFrame(animate);
}

// Start animation
animate(); 