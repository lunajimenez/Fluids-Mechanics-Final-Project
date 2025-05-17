import math

def calcular_tension_superficial():
    print("Cálculo de la Tensión Superficial por Capilaridad")
    print("Se sabe el ascenso o descenso por capilaridad de un fluido (con densidad relativa de 12.87) en un recipiente de vidrio que tiene un diámetro de 0.793 pulgadas es 0.0882 pulgadas.  El ángulo de contacto es de 133°. Cuál es la tensión superficial del fluido en las condiciones indicadas en mlb/ft. ")
    
    try:
        # Datos proporcionados por el usuario
        densidad_relativa = float(input("Ingrese la densidad relativa del fluido: "))
        diametro_pulg = float(input("Ingrese el diámetro del tubo en pulgadas: "))
        altura_cambio_pulg = float(input("Ingrese el ascenso/descenso capilar en pulgadas: "))
        angulo_contacto = float(input("Ingrese el ángulo de contacto en grados: "))
        
        # Convertir ángulo a radianes para cálculos
        angulo_rad = math.radians(angulo_contacto)
        
        # Determinar si es ascenso o descenso
        if angulo_contacto < 90:
            print("\nEl fluido experimenta ASCENSO capilar (ángulo < 90°)")
        else:
            print("\nEl fluido experimenta DESCENSO capilar (ángulo ≥ 90°)")
        
        # Constantes y conversiones
        densidad_agua = 1.94  # slugs/ft³
        g = 32.174  # ft/s² (aceleración gravitacional)
        
        # Conversión de unidades
        diametro_ft = diametro_pulg / 12
        radio_ft = diametro_ft / 2
        altura_cambio_ft = altura_cambio_pulg / 12
        
        # Cálculo de la densidad del fluido
        densidad_fluido = densidad_relativa * densidad_agua  # slugs/ft³
        
        # Cálculo de la tensión superficial (σ = (h * ρ * g * r) / (2 * cosθ))
        tension_superficial = (altura_cambio_ft * densidad_fluido * g * radio_ft) / (2 * math.cos(angulo_rad))
        
        # Convertir a mililibras por pie (mlb/ft)
        # 1 slug/ft·s² = 1 lb/ft → 1000 mlb/ft
        tension_mlb_ft = tension_superficial * 1000
        
        # Mostrar resultados
        print("\nResultados:")
        print(f"Radio del tubo: {radio_ft:.6f} ft")
        print(f"Cambio de altura: {altura_cambio_ft:.6f} ft")
        print(f"Ángulo de contacto: {angulo_contacto}° ({angulo_rad:.4f} rad)")
        print(f"Densidad del fluido: {densidad_fluido:.4f} slugs/ft³")
        print(f"\nTensión superficial calculada: {tension_mlb_ft:.4f} mlb/ft")
        
    except ValueError:
        print("Error: Por favor ingrese valores numéricos válidos.")
    except ZeroDivisionError:
        print("Error: El ángulo de contacto no puede ser exactamente 90° (cos(90°)=0).")

# Ejecutar el cálculo
if __name__ == "__main__":
    calcular_tension_superficial()