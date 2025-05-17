import math

def calcular_datos_compuerta():
    print("=== Cálculos para una compuerta inclinada ===")

    # Entrada de datos
    peso = float(input("Ingrese el peso de la compuerta (lb): "))
    ancho = float(input("Ingrese el ancho de la compuerta (ft): "))
    largo = float(input("Ingrese el largo (altura inclinada) de la compuerta (ft): "))
    beta_grados = float(input("Ingrese el ángulo beta en grados: "))
    h1 = float(input("Ingrese h1 (ft): "))
    h2_pulgadas = float(input("Ingrese h2 (en pulgadas): "))

    # Conversión de unidades
    h2 = h2_pulgadas / 12  # convertir a pies
    beta = math.radians(beta_grados)
    gamma_agua = 62.4  # lb/ft³ (peso específico del agua)

    # Altura desde la superficie al centroide (hc)
    hc = h1 - h2 / 2

    # Área de la compuerta
    A = ancho * largo

    # Fuerza hidrostática
    Fh = gamma_agua * A * hc

    # Momento de inercia para un rectángulo vertical
    I = (ancho * largo**3) / 12

    # Profundidad al centro de presión
    hp = hc + (I * math.sin(beta)**2) / (A * hc)

    # Distancia desde el punto de bisagra B al centroide
    distancia_centroide = largo / 2

    # Brazo del momento de la fuerza hidrostática respecto al punto B
    brazo_hidrostatico = distancia_centroide * math.cos(beta)

    # Fuerza mínima F requerida para abrir la compuerta (equilibrio de momentos)
    F_minima = Fh * brazo_hidrostatico / distancia_centroide

    # Resultados
    print("\n--- Resultados ---")
    print(f"1. Profundidad al centro de presión: {hp:.2f} ft")
    print(f"2. Fuerza hidrostática sobre la compuerta: {Fh:.2f} lb")
    print(f"3. Fuerza mínima requerida para abrir la compuerta: {F_minima:.2f} lb")

# Ejecutar función
calcular_datos_compuerta()
