import math

# Solicitar datos al usuario
densidad_relativa = float(input("Ingrese la densidad relativa (ρr): "))
caudal = float(input("Ingrese el caudal (Q) en m³/s: "))
diametro = float(input("Ingrese el diámetro interior de la tubería (d) en metros: "))
h = float(input("Ingrese la altura (h) en metros: "))

# Constante gravitacional
g = 9.81  # m/s²

# Cálculo de la potencia hidráulica recibida (SOLO CONSIDERA ALTURA h)
H = h  # Se omite la cabeza de velocidad
potencia_recibida = densidad_relativa * 1000 * g * caudal * H

# Cálculo de la potencia transmitida con 65% de eficiencia
eficiencia = 0.65
potencia_transmitida = potencia_recibida * eficiencia

# Mostrar resultados
print(f"\nPotencia que el motor recibe del fluido: {potencia_recibida:.2f} Watts")
print(f"Potencia transmitida por el motor (65% eficiencia): {potencia_transmitida:.2f} Watts")