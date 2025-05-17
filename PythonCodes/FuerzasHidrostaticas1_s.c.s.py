import math

def calcular_fuerza_hidrostatica():
    print("\n=== CÁLCULO DE FUERZA HIDROSTÁTICA EN COMPUERTA CILÍNDRICA ===")
    print("Enunciado base:")
    print("Una compuerta cilíndrica de 5.50 m de longitud y 45.00° de inclinación está sumergida en un fluido con peso específico γ = 9810.00 N/m³. El centroide de la superficie curva se encuentra a 3.20 m de profundidad y tiene un área proyectada de 2.10 m²")
    
    
    # Valores por defecto (basados en tu enunciado)
    valores_por_defecto = {
        'gamma': 9810.00,
        'h': 3.20,
        'A': 2.10,
        'theta': 45.00,
        'L': 5.50
    }
    
    # Preguntar si usar valores por defecto o personalizados
    opcion = input("¿Usar valores por defecto? (s/n): ").lower()
    
    if opcion == 's':
        gamma = valores_por_defecto['gamma']
        h = valores_por_defecto['h']
        A = valores_por_defecto['A']
        theta = valores_por_defecto['theta']
        L = valores_por_defecto['L']
    else:
        print("\nIngrese los valores requeridos:")
        gamma = float(input("Peso específico del fluido γ (N/m³): ") or valores_por_defecto['gamma'])
        h = float(input("Profundidad del centroide h (m): ") or valores_por_defecto['h'])
        A = float(input("Área proyectada A (m²): ") or valores_por_defecto['A'])
        theta = float(input("Ángulo de inclinación θ (grados): ") or valores_por_defecto['theta'])
        L = float(input("Longitud de la compuerta L (m): ") or valores_por_defecto['L'])
    
    # Mostrar parámetros del problema
    print("\n=== PARÁMETROS DEL PROBLEMA ===")
    print(f"• Peso específico (γ): {gamma:.2f} N/m³")
    print(f"• Profundidad centroide (h): {h:.2f} m")
    print(f"• Área proyectada (A): {A:.2f} m²")
    print(f"• Ángulo inclinación (θ): {theta:.2f}°")
    print(f"• Longitud compuerta (L): {L:.2f} m")
    
    # Conversión de ángulo a radianes
    theta_rad = math.radians(theta)
    
    # Solución detallada
    print("\n=== SOLUCIÓN PASO A PASO ===")
    
    # 1. Fuerza horizontal
    Fh = gamma * h * A
    print("\n1. Componente horizontal (Fh):")
    print(f"   Fh = γ × h × A")
    print(f"      = {gamma:.2f} × {h:.2f} × {A:.2f}")
    print(f"      = {Fh:.2f} N (→)")
    
    # 2. Fuerza vertical
    Fv = gamma * A * L * math.sin(theta_rad)
    print("\n2. Componente vertical (Fv):")
    print(f"   Fv = γ × A × L × sinθ")
    print(f"      = {gamma:.2f} × {A:.2f} × {L:.2f} × sin({theta:.2f}°)")
    print(f"      = {Fv:.2f} N (↑)")
    
    # 3. Fuerza resultante
    Fr = math.sqrt(Fh**2 + Fv**2)
    print("\n3. Fuerza resultante (Fr):")
    print(f"   Fr = √(Fh² + Fv²)")
    print(f"      = √({Fh:.2f}² + {Fv:.2f}²)")
    print(f"      = {Fr:.2f} N")
    
    # 4. Dirección de la fuerza
    alpha = math.degrees(math.atan(Fv/Fh))
    print("\n4. Dirección de la fuerza resultante:")
    print(f"   α = arctan(Fv/Fh) = arctan({Fv:.2f}/{Fh:.2f})")
    print(f"     = {alpha:.2f}° desde la horizontal")
    
    # Diagrama de fuerzas
    print("\n=== DIAGRAMA DE FUERZAS ===")
    print("     ↑ Fv = {:.2f} N".format(Fv))
    print("     │ ")
    print("     │ α = {:.2f}°".format(alpha))
    print("     └───→ Fh = {:.2f} N".format(Fh))
    print("      ↘ ")
    print("       Fr = {:.2f} N".format(Fr))

# Ejecutar el programa
if __name__ == "__main__":
    while True:
        calcular_fuerza_hidrostatica()
        
        continuar = input("\n¿Desea realizar otro cálculo? (s/n): ").lower()
        if continuar != 's':
            print("¡Programa terminado!")
            break