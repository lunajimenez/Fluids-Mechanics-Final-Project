import numpy as np

def calcular_coeficiente():
    # Configurar las dimensiones básicas
    dimensiones = ['M', 'L', 'T']  # Masa, Longitud, Tiempo
    
    # Obtener variables del problema
    variables = []
    num_vars = int(input("¿Cuántas variables tiene el sistema? "))
    
    for i in range(num_vars):
        nombre = input(f"\nNombre de la variable {i+1}: ")
        valor = float(input(f"Valor de {nombre}: "))
        exp_m = float(input(f"Exponente M para {nombre}: "))
        exp_l = float(input(f"Exponente L para {nombre}: "))
        exp_t = float(input(f"Exponente T para {nombre}: "))
        variables.append((nombre, valor, [exp_m, exp_l, exp_t]))
    
    # Construir matriz dimensional
    matriz = np.array([var[2] for var in variables]).T
    
    # Calcular rango de la matriz
    rango = np.linalg.matrix_rank(matriz)
    num_pi = len(variables) - rango
    
    if num_pi != 1:
        print(f"\nEl sistema requiere {num_pi} términos Pi. Este código funciona para 1 término.")
        return
    
    # Encontrar coeficientes usando descomposición SVD
    _, s, vh = np.linalg.svd(matriz)
    tolerancia = max(1e-10, s[-1])
    coeficientes = vh[-1]
    
    # Normalizar coeficientes
    idx = np.argmax(np.abs(coeficientes) > tolerancia)
    factor = coeficientes[idx]
    coeficientes_normalizados = coeficientes / factor
    
    # Construir ecuación del número Pi
    ecuacion = "Π = "
    valor_pi = 1.0
    for i, var in enumerate(variables):
        exp = round(coeficientes_normalizados[i], 3)
        if exp != 0:
            ecuacion += f"{var[0]}^{{{exp}}}·"
            valor_pi *= (var[1] ** exp)
    
    print("\n" + "="*50)
    print("Resultado del análisis dimensional:")
    print(ecuacion.strip("·"))
    print(f"Valor del coeficiente adimensional: {valor_pi:.4f}")
    print("="*50)

# Ejecutar la calculadora
if __name__ == "__main__":
    calcular_coeficiente()