import math

def calcular_factor_friccion(epsilon, diametro, reynolds):
    """Calcula el factor de fricción usando la fórmula del Excel"""
    if reynolds == 0:
        return 0.0
    try:
        termino = (epsilon/(3.7*diametro)) + (5.74/(reynolds**0.9))
        return 0.25 / (math.log10(termino))**2
    except:
        return 0.02  # Valor por defecto en caso de error

def interpolar_k(relacion_diametros):
    """Interpola el coeficiente de pérdida para expansión súbita"""
    # Datos de la tabla del Excel
    datos = {
        2.5: 0.6,
        3: 0.67,
        9: 0.58,
        12: 0.65
    }
    claves = sorted(datos.keys())
    
    if relacion_diametros <= claves[0]:
        return datos[claves[0]]
    elif relacion_diametros >= claves[-1]:
        return datos[claves[-1]]
    
    # Buscar intervalo de interpolación
    for i in range(len(claves)-1):
        if claves[i] <= relacion_diametros <= claves[i+1]:
            x0, x1 = claves[i], claves[i+1]
            y0, y1 = datos[x0], datos[x1]
            return y0 + (y1 - y0)*(relacion_diametros - x0)/(x1 - x0)
    return 0.6  # Valor por defecto

def calcular_presion_A():
    print("=== Cálculo de presión en punto A ===")
    print("Ingrese los datos en unidades del SI (metros, segundos, etc.)\n")
    
    # Constantes físicas
    gamma = 9770       # Peso específico del agua (N/m³)
    mu = 8.03e-7       # Viscosidad cinemática (m²/s)
    epsilon = 4.6e-5   # Rugosidad acero comercial (m)
    g = 9.81           # Gravedad (m/s²)
    
    # Datos de entrada
    Da = float(input("Diámetro tubería 2\" (Da en metros): "))
    Db = float(input("Diámetro tubería 6\" (Db en metros): "))
    La = float(input("Longitud tubería 2\" (La en metros): "))
    Lb = float(input("Longitud tubería 6\" (Lb en metros): "))
    Pb = float(input("Presión en B (Pb en MPa): ")) * 1e6  # Convertir a Pa
    Q = float(input("Caudal (Q en m³/s): "))
    ha = float(input("Altura ha en metros: "))
    
    # Cálculos intermedios
    Aa = math.pi * (Da**2) / 4
    Ab = math.pi * (Db**2) / 4
    Va = Q / Aa
    Vb = Q / Ab
    
    Re_a = (Va * Da) / mu
    Re_b = (Vb * Db) / mu
    
    fa = calcular_factor_friccion(epsilon, Da, Re_a)
    fb = calcular_factor_friccion(epsilon, Db, Re_b)
    
    # Pérdidas por fricción
    hLa = fa * (La / Da) * (Va**2) / (2 * g)
    hLb = fb * (Lb / Db) * (Vb**2) / (2 * g)
    
    # Pérdidas en codos (2 codos)
    k_codo = 20  # ft (del Excel)
    hLcodos = 2 * k_codo * fa * (Va**2) / (2 * g)
    
    # Pérdida por expansión súbita
    relacion = Db / Da
    k_exp = interpolar_k(relacion)
    hL_exp = k_exp * (Va**2) / (2 * g)
    
    # Pérdida total
    hL_total = hLa + hLb + hLcodos + hL_exp
    
    # Cálculo de presión en A
    termino_velocidad = (Vb**2 - Va**2) / (2 * g)
    termino_presion = Pb / gamma
    PA = gamma * (termino_velocidad + termino_presion - ha + hL_total)
    
    # Resultados
    print("\n=== Resultados ===")
    print(f"Velocidad en tubería 2\": {Va:.2f} m/s")
    print(f"Velocidad en tubería 6\": {Vb:.2f} m/s")
    print(f"Número de Reynolds (2\"): {Re_a:.1f}")
    print(f"Número de Reynolds (6\"): {Re_b:.1f}")
    print(f"\nPérdidas totales: {hL_total:.2f} m")
    print(f"Presión en punto A: {PA/1e6:.3f} MPa")

# Ejecutar el cálculo
if __name__ == "__main__":
    calcular_presion_A()