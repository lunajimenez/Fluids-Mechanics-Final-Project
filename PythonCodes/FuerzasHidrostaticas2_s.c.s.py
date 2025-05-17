import math

def ejercicio_compuerta_esferica():
    print("\n=== EJERCICIO: FUERZA HIDROSTÁTICA EN SUPERFICIE ESFÉRICA ===")
    print("Enunciado:")
    print("Una válvula esférica de acero de 1.2 m de radio está completamente sumergida en agua (γ = 9800 N/m³) en un tanque de almacenamiento. La parte superior de la esfera se encuentra a 4.5 m de profundidad desde la superficie libre del líquido, mientras que el centro de la esfera está a 6.0 m de profundidad. Determine: La fuerza horizontal (Fₕ) sobre la superficie esférica, La fuerza vertical (Fᵥ) ejercida por el fluido, La fuerza resultante total (Fᵣ) y su ángulo de inclinación (α)" )
    
    # Valores por defecto (ejercicio nuevo)
    valores_defecto = {
        'gamma': 9800,    # N/m³ (agua)
        'h': 4.5,         # m
        'R': 1.2,         # m
        'profundidad_total': 6.0  # m
    }
    
    # Elección de valores
    opcion = input("¿Usar valores por defecto? (s/n): ").lower()
    
    if opcion == 's':
        gamma = valores_defecto['gamma']
        h = valores_defecto['h']
        R = valores_defecto['R']
        H = valores_defecto['profundidad_total']
    else:
        print("\nIngrese los valores:")
        gamma = float(input("Peso específico γ (N/m³): "))
        h = float(input("Profundidad hasta la parte superior (h): "))
        R = float(input("Radio de la esfera (R): "))
        H = float(input("Profundidad total del centro (H): "))
    
    # Cálculos intermedios
    h_centroide = H  # Para una esfera completa, el centroide está en el centro
    A_proyectada = math.pi * R**2  # Área del círculo proyectado
    
    print("\n=== SOLUCIÓN ===")
    print(f"1. Profundidad del centroide (h_c): {h_centroide:.2f} m")
    print(f"2. Área proyectada (A): π × R² = π × {R:.2f}² = {A_proyectada:.2f} m²")
    
    # Fuerza horizontal (igual que en cilindros)
    Fh = gamma * h_centroide * A_proyectada
    print("\n3. Fuerza horizontal (Fh):")
    print(f"   Fh = γ × h_c × A")
    print(f"      = {gamma:.2f} × {h_centroide:.2f} × {A_proyectada:.2f}")
    print(f"      = {Fh:.2f} N")
    
    # Fuerza vertical (peso del volumen desplazado)
    volumen_desplazado = (4/3) * math.pi * R**3
    Fv = gamma * volumen_desplazado
    print("\n4. Fuerza vertical (Fv):")
    print(f"   Fv = γ × Volumen desplazado")
    print(f"      = {gamma:.2f} × (4/3 × π × {R:.2f}³)")
    print(f"      = {gamma:.2f} × {volumen_desplazado:.2f}")
    print(f"      = {Fv:.2f} N (↑)")
    
    # Resultante
    Fr = math.sqrt(Fh**2 + Fv**2)
    alpha = math.degrees(math.atan(Fv/Fh))
    
    print("\n5. Fuerza resultante:")
    print(f"   Fr = √({Fh:.2f}² + {Fv:.2f}²) = {Fr:.2f} N")
    print(f"   Ángulo: α = arctan({Fv:.2f}/{Fh:.2f}) = {alpha:.2f}° desde la horizontal")
    
    # Diagrama
    print("\n=== DIAGRAMA ===")
    print(f"   ↑ Fv = {Fv:.2f} N")
    print(f"   │ \\")
    print(f"   │  \\ α = {alpha:.2f}°")
    print(f"   │   \\")
    print(f"   └────→ Fh = {Fh:.2f} N")
    print(f"       Fr = {Fr:.2f} N")

# Ejecución
if __name__ == "__main__":
    while True:
        ejercicio_compuerta_esferica()
        if input("\n¿Otro ejercicio? (s/n): ").lower() != 's':
            print("¡Fin del programa!")
            break