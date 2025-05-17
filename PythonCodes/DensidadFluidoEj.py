"""
EJERCICIO #1

Código Python para calcular la densidad de un fluido a partir de las fuerzas necesarias
para sumergir un cuerpo en agua y en ese otro fluido.
hecho por: JAAJ

"""

def calcular_densidad_fluido(volume_dm3, fuerza_agua, fuerza_fluido, densidad_agua=1000, g=9.81):
    """
    Calcula la densidad del fluido dado el volumen del cuerpo y las fuerzas necesarias para sumergir
    en agua y en el fluido desconocido.

    Parámetros:
    -----------
    volume_dm3 : float
        Volumen del cuerpo en decímetros cúbicos.
    fuerza_agua : float
        Fuerza necesaria para sumergir el cuerpo en agua (N).
    fuerza_fluido : float
        Fuerza necesaria para sumergir el cuerpo en el otro fluido (N).
    densidad_agua : float, opcional
        Densidad del agua en kg/m^3 (por defecto 1000 kg/m^3).
    g : float, opcional
        Aceleración de la gravedad en m/s^2 (por defecto 9.81 m/s^2).

    Retorna:
    --------
    densidad_fluido : float
        Densidad del otro fluido en kg/m^3.
    """
    # Convertir volumen de dm^3 a m^3
    volumen_m3 = volume_dm3 * 1e-3
    # Fórmula: F_fluido - F_agua = (ρ_fluido - ρ_agua)·V·g
    densidad_fluido = densidad_agua + (fuerza_fluido - fuerza_agua) / (volumen_m3 * g)
    return densidad_fluido


def main():
    try:
        # Entradas por consola
        vol = float(input("Ingrese el volumen del cuerpo (dm^3): "))
        f_agua = float(input("Fuerza necesaria en agua (N): "))
        f_fluido = float(input("Fuerza necesaria en el otro fluido (N): "))
        # Cálculo
        dens = calcular_densidad_fluido(vol, f_agua, f_fluido)
        # Salida formateada
        print(f"La densidad del otro fluido es: {dens:.2f} kg/m^3")
    except ValueError:
        print("Error: por favor ingrese valores numéricos válidos.")

if __name__ == "__main__":
    main()
