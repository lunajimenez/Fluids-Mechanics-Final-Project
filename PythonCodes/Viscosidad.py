import math

def calcular_viscosidad():
    print("\n--- Cálculo de Viscosidad en Viscosímetro de Cilindros Concéntricos ---")
    print("(Todos los valores deben ingresarse en las unidades indicadas)\n")
    print("Se va a medir la viscosidad de un fluido con un viscosímetro construido de dos cilindros concéntricos de 77.9 cm de largo. El diámetro interior del cilindro exterior es de 18.1 cm y la brecha entre los dos cilindros es de 0.139 cm. Se hace girar el cilindro interior a 315  rpm y se mide que el par de torsión es de 1.122 N.m.  La viscosidad, en mN.s/m2 es: ")
    try:
        # Ingreso de datos por el usuario
        L = float(input("Longitud de los cilindros [cm]: ")) / 100          # Convertir a metros
        D_exterior = float(input("Diámetro interior del cilindro exterior [cm]: ")) / 100  # Convertir a metros
        brecha = float(input("Brecha entre los cilindros [cm]: ")) / 100     # Convertir a metros
        rpm = float(input("Velocidad de rotación (cilindro interior) [rpm]: "))
        torque = float(input("Par de torsión medido [N·m]: "))

        # Cálculos intermedios
        R = D_exterior / 2                          # Radio exterior (m)
        r = R - brecha                              # Radio interior (m)
        omega = rpm * (2 * math.pi) / 60            # Velocidad angular (rad/s)

        # Fórmula CORREGIDA (con r^3)
        mu = (torque * brecha) / (2 * math.pi * omega * r**3 * L)  # Viscosidad en Pa·s
        mu_mN = mu * 1000                           # Conversión a mN·s/m²

        # Resultados
        print("\n--- Resultados ---")
        print(f"Radio exterior (R): {R:.5f} m")
        print(f"Radio interior (r): {r:.5f} m")
        print(f"Velocidad angular (ω): {omega:.3f} rad/s")
        print(f"Viscosidad (μ): {mu:.6f} Pa·s")
        print(f"\n>>> Viscosidad en mN·s/m²: {mu_mN:.4f} <<<")  # Resultado final

    except ValueError:
        print("¡Error! Ingresa solo valores numéricos.")

# Ejecutar el programa
if __name__ == "__main__":
    calcular_viscosidad()