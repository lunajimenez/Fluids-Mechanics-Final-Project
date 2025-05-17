import math

def calcular_ascenso_entre_placas():
    print("CÁLCULO DE ASCENSO CAPILAR ENTRE PLACAS PARALELAS")
    print("Se sabe el ascenso o descenso por capilaridad de un fluido (con densidad relativa de 12.87) en un recipiente de vidrio que tiene un diámetro de 0.793 pulgadas es 0.0882 pulgadas.  El ángulo de contacto es de 133°. Cuál es la tensión superficial del fluido en las condiciones indicadas en mlb/ft.")
    
    try:
        # Selección de unidades
        print("\nSeleccione las unidades de entrada:")
        print("1. Milímetros (mm)")
        print("2. Pulgadas (in)")
        unidad_separacion = input("Ingrese su opción (1 o 2): ")
        
        print("\nSeleccione las unidades para la tensión superficial:")
        print("1. Newton por metro (N/m)")
        print("2. Libras por pie (lb/ft)")
        unidad_tension = input("Ingrese su opción (1 o 2): ")
        
        # Datos de entrada
        if unidad_separacion == "1":
            separacion = float(input("Ingrese la separación entre placas en mm: "))
            separacion_m = separacion / 1000  # Convertir mm a m
        else:
            separacion = float(input("Ingrese la separación entre placas en pulgadas: "))
            separacion_m = separacion * 0.0254  # Convertir in a m
            
        densidad_relativa = float(input("Ingrese la densidad relativa del líquido: "))
        angulo_contacto = float(input("Ingrese el ángulo de contacto en grados: "))
        
        if unidad_tension == "1":
            tension_superficial = float(input("Ingrese la tensión superficial en N/m: "))
        else:
            tension_superficial = float(input("Ingrese la tensión superficial en lb/ft: "))
            tension_superficial *= 14.5939  # Convertir lb/ft a N/m
        
        # Verificar datos válidos
        if separacion <= 0:
            raise ValueError("La separación entre placas debe ser positiva")
        if angulo_contacto >= 90:
            raise ValueError("Para ascenso capilar, el ángulo debe ser menor a 90°")
        
        # Constantes
        densidad_agua = 1000  # kg/m³
        g = 9.81  # m/s²
        
        # Cálculo de densidad del líquido
        densidad_liquido = densidad_relativa * densidad_agua  # kg/m³
        
        # Cálculo del ascenso capilar (h = 2σcosθ / (ρgD))
        cos_theta = math.cos(math.radians(angulo_contacto))
        ascenso_m = (2 * tension_superficial * cos_theta) / (densidad_liquido * g * separacion_m)
        
        # Conversión a diferentes unidades
        ascenso_um = ascenso_m * 1e6  # micrómetros
        ascenso_mm = ascenso_m * 1000  # milímetros
        ascenso_in = ascenso_m * 39.3701  # pulgadas
        ascenso_uin = ascenso_um * 39.3701  # micro-pulgadas
        
        # Resultados
        print("\nPARÁMETROS CALCULADOS:")
        print(f"Separación entre placas: {separacion_m:.6f} m")
        print(f"Densidad del líquido: {densidad_liquido:.2f} kg/m³")
        print(f"Ángulo de contacto: {angulo_contacto}° (cosθ = {cos_theta:.4f})")
        print(f"Tensión superficial: {tension_superficial:.6f} N/m")
        
        print("\nRESULTADOS:")
        print(f"Ascenso capilar:")
        print(f"- {ascenso_m:.6f} metros")
        print(f"- {ascenso_mm:.4f} milímetros")
        print(f"- {ascenso_um:.2f} micrómetros (μm)")
        print(f"- {ascenso_in:.4f} pulgadas")
        print(f"- {ascenso_uin:.2f} micro-pulgadas (μin)")
        
    except ValueError as e:
        print(f"\nERROR: {e}")
    except Exception as e:
        print(f"\nOcurrió un error inesperado: {e}")

# Ejecutar el programa
if __name__ == "__main__":
    calcular_ascenso_entre_placas()