"""
Código Python para cálculo de caudal en un medidor de Venturi
con manometría y Bernoulli.
Hecho por: JAAJ

"""

import math

def main():
    # Constantes fijas
    columna_mercurio = 13.54        # densidad relativa del mercurio
    rho_mercurio    = 13540         # kg/m³
    rho_agua        = 1000          # kg/m³
    g               = 9.81          # m/s²

    try:
        # --- Entrada de datos por el usuario (en mm) ---
        h_mm   = float(input("Diferencia de altura h (mm): "))
        d1_mm  = float(input("Diámetro mayor d1 (mm): "))
        d2_mm  = float(input("Diámetro menor d2 (mm): "))

        # --- Conversión a metros ---
        h  = h_mm  / 1000.0  # m
        d1 = d1_mm / 1000.0  # m
        d2 = d2_mm / 1000.0  # m

        # --- Cálculo de áreas de las secciones ---
        A1 = math.pi * (d1 / 2.0)**2
        A2 = math.pi * (d2 / 2.0)**2

        # Áreas al cuadrado para Bernoulli
        A1_sq = A1 ** 2
        A2_sq = A2 ** 2

        # --- Manometría (pb - pa) ---
        delta_p = (rho_agua * g * 2 * h) \
                  - (rho_mercurio * g * 2 * h) \
                  - (rho_agua * g)

        # --- Ecuación de Bernoulli finalizada ---
        bern_expr = (4 * g * h * (1.0 - columna_mercurio) * (A1_sq * A2_sq)) \
                    / (A2_sq - A1_sq)

        # --- Caudal ---
        Q_m3s = math.sqrt(bern_expr)      # m³/s
        Q_Ls  = Q_m3s * 1000.0            # L/s

        # --- Resultados ---
        print(f"\nÁrea sección A1: {A1:.6f} m²")
        print(f"Área sección A2: {A2:.6f} m²")
        print(f"Diferencia de presión Δp: {delta_p:.2f} Pa")
        print(f"Expresión Bernoulli: {bern_expr:.9f}")
        print(f"Caudal Q: {Q_m3s:.4f} m³/s  ({Q_Ls:.2f} L/s)")

    except ValueError:
        print("Error: por favor ingrese valores numéricos válidos.")

if __name__ == "__main__":
    main()
