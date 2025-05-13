// presion.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formPresion");
  const resultado = document.getElementById("resultado");

  form.addEventListener("submit", e => {
    e.preventDefault();

    const rho = parseFloat(document.getElementById("densidad").value);
    const g   = parseFloat(document.getElementById("gravedad").value);
    const h   = parseFloat(document.getElementById("altura").value);

    if (isNaN(rho) || isNaN(g) || isNaN(h)) {
      resultado.textContent = "Introduce valores numéricos válidos.";
      return;
    }

    if (h < 0) {
      resultado.textContent = "La altura no puede ser negativa.";
      return;
    }

    const P = rho * g * h;
    resultado.innerHTML = `La presión hidrostática es: <strong>${P.toFixed(2)}</strong> Pa`;
  });
});
