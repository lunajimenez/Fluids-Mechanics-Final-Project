def calcular_fuerza_minima():
    print("=== Cálculo de la fuerza mínima F para mantener cerrada una compuerta ===")

    # Entrada de datos
    g = 9.81  # m/s² (gravedad)
    gamma_agua = 9810  # N/m³ (peso específico del agua)

    ancho = float(input("Ingrese el ancho de la compuerta (m): "))
    altura = float(input("Ingrese la altura de la compuerta (m): "))
    h = float(input("Ingrese la distancia desde el nivel del fluido hasta la bisagra (m): "))
    densidad_relativa = float(input("Ingrese la densidad relativa del fluido: "))

    # Cálculos
    gamma_fluido = gamma_agua * densidad_relativa  # Peso específico del fluido (N/m³)
    A = ancho * altura  # Área de la compuerta (m²)
    h_c = altura / 2  # Centroide desde la base
    h_p = h + h_c  # Profundidad del centroide desde la superficie libre

    # Fuerza hidrostática total
    F_h = gamma_fluido * A * h_p  # N

    # Distancia desde la bisagra (pivote) al centroide: momento respecto a bisagra
    brazo_momento = h_c  # m (desde bisagra que está al tope)
    momento = F_h * brazo_momento  # N·m

    # Brazo de la fuerza F (está al extremo inferior de la compuerta)
    brazo_F = altura  # m

    # Fuerza F requerida (en N)
    F = momento / brazo_F

    # Convertimos a kN
    F_kN = F / 1000

    print(f"\nLa fuerza mínima F requerida para mantener cerrada la compuerta es: {F_kN:.2f} kN")

# Ejecutar la función
calcular_fuerza_minima()