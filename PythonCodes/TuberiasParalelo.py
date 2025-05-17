import math

# Constantes físicas
GRAVEDAD = 9.81  # m/s²
RUGOSIDAD = 4.6e-5  # m (PVC)
VISCOSIDAD = 8.94e-7  # m²/s (agua a 25°C)
DENSIDAD_AGUA = 997  # kg/m³

# Coeficientes de pérdidas menores (del Excel)
K1 = [340, 30]  # Válvula de globo + codo estándar
K2 = [150, 20]  # Válvula de ángulo + codo radio largo

def calcular_factor_friccion(reynolds, diametro):
    """Calcula el factor de fricción usando Colebrook-White"""
    if reynolds < 2000:
        return 64 / reynolds if reynolds != 0 else 0.02
    
    f = 0.02
    for _ in range(100):
        termino = (RUGOSIDAD/(3.7*diametro)) + (2.51/(reynolds*math.sqrt(f)))
        nuevo_f = (-2 * math.log10(termino)) ** -2
        
        if abs(nuevo_f - f) < 1e-8:
            return nuevo_f
        f = nuevo_f
    return f

def calcular_perdidas_carga(caudal, diametro, longitud, coeficientes_K):
    """Calcula las pérdidas de carga totales para un ramal"""
    area = math.pi * (diametro**2) / 4
    velocidad = caudal / area
    reynolds = velocidad * diametro / VISCOSIDAD
    
    f = calcular_factor_friccion(reynolds, diametro)
    
    # Pérdidas por fricción
    hf = f * (longitud/diametro) * (velocidad**2)/(2*GRAVEDAD)
    
    # Pérdidas menores
    hm = sum(coeficientes_K) * (velocidad**2)/(2*GRAVEDAD)
    
    return hf + hm, hf, hm

def calcular_sistema_paralelo():
    print("\n=== Sistema de tuberías en paralelo ===")
    print("Datos de entrada (unidades SI):")
    
    # Datos de entrada
    Q_total = float(input("Caudal total (m³/s): "))
    D1 = float(input("Diámetro ramal 1 (m): "))
    D2 = float(input("Diámetro ramal 2 (m): "))
    L1 = float(input("Longitud ramal 1 (m): "))
    L2 = float(input("Longitud ramal 2 (m): "))
    
    # Método de Newton-Raphson
    Q1 = Q_total * 0.6  # Estimación inicial
    tolerancia = 1e-6
    iteraciones = 50
    
    for _ in range(iteraciones):
        Q2 = Q_total - Q1
        
        hL1, hf1, hm1 = calcular_perdidas_carga(Q1, D1, L1, K1)
        hL2, hf2, hm2 = calcular_perdidas_carga(Q2, D2, L2, K2)
        
        F = hL1 - hL2  # Función objetivo
        
        # Cálculo de derivada numérica
        delta = 1e-6
        hL1_d, _, _ = calcular_perdidas_carga(Q1 + delta, D1, L1, K1)
        hL2_d, _, _ = calcular_perdidas_carga(Q2 - delta, D2, L2, K2)
        dF = (hL1_d - hL2_d - F) / delta
        
        # Actualizar caudal
        Q1 -= F / dF
        
        # Asegurar valores físicamente posibles
        Q1 = max(0.001, min(Q1, Q_total - 0.001))
        
        if abs(F) < tolerancia:
            break
    
    # Resultados finales
    Q2 = Q_total - Q1
    hL1, hf1, hm1 = calcular_perdidas_carga(Q1, D1, L1, K1)
    hL2, hf2, hm2 = calcular_perdidas_carga(Q2, D2, L2, K2)
    delta_p = DENSIDAD_AGUA * GRAVEDAD * hL1  # ΔP = ρ*g*hL
    
    print("\n=== Resultados ===")
    print(f"Caudal ramal 1: {Q1:.6f} m³/s ({Q1*1000:.2f} L/s)")
    print(f"Caudal ramal 2: {Q2:.6f} m³/s ({Q2*1000:.2f} L/s)\n")
    
    print(f"Pérdidas ramal 1 - Fricción: {hf1:.4f} m | Menores: {hm1:.4f} m | Total: {hL1:.4f} m")
    print(f"Pérdidas ramal 2 - Fricción: {hf2:.4f} m | Menores: {hm2:.4f} m | Total: {hL2:.4f} m\n")
    
    print(f"Diferencia entre pérdidas: {abs(hL1 - hL2):.2e} m")
    print(f"Caída de presión (ΔP): {delta_p/1000:.2f} kPa")

# Ejecutar el programa
if __name__ == "__main__":
    calcular_sistema_paralelo()