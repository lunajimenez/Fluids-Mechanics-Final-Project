import math
"""
Código para calcular carga de presión, velocidad y elevación en puntos en 8 puntos
distintos.
Autor: JAAJ
"""
def main():
    print("Ingrese los datos (unidades en ft e in):")

    # Entradas
    h1 = float(input("h1 (ft): "))
    h2 = float(input("h2 (ft): "))
    h3 = float(input("h3 (ft): "))
    d1 = float(input("d1 (in): "))
    d2 = float(input("d2 (in): "))
    d3 = float(input("d3 (in): "))

    # Convertir diámetros de pulgadas a pies
    d1_ft = d1 / 12
    d2_ft = d2 / 12
    d3_ft = d3 / 12

    g = 32.2  # gravedad ft/s^2

    # Áreas
    Ag = math.pi * (d3_ft ** 2) / 4
    Af = math.pi * (d1_ft ** 2) / 4
    Ac = math.pi * (d2_ft ** 2) / 4

    # Carga de elevación en puntos
    carga_elevacion = {
        "B": h3 - h2,
        "C": h3 - h2,
        "D": h3 - h2,
        "E": h3,
        "F": 0,
        "G": 0
    }
    carga_elevacion["A"] = carga_elevacion["B"] + h1

    # Inicializamos carga presión y velocidad
    carga_presion = {"A": 0}
    carga_velocidad = {"A": 0}

    # Calculamos carga total en A (solo elevacion pues presión y velocidad = 0)
    carga_total_A = carga_presion["A"] + carga_velocidad["A"] + carga_elevacion["A"]

    # Velocidades
    Vg = math.sqrt(2 * g * carga_total_A)
    Vf = (Vg * Ag) / Af
    Vc = (Vf * Af) / Ac

    # Cargas de velocidad
    N1 = (Vf ** 2) / (2 * g)  # para B, D, E, F
    N2 = (Vc ** 2) / (2 * g)  # para C

    carga_velocidad.update({
        "B": N1,
        "C": N2,
        "D": N1,
        "E": N1,
        "F": N1,
        "G": None  # se definirá después
    })

    # Carga de presión en B-F
    for punto in ["B", "C", "D", "E", "F"]:
        carga_presion[punto] = carga_total_A - carga_velocidad[punto] - carga_elevacion[punto]

    carga_presion["G"] = 0  # definida como 0

    # Carga total en B para definir carga velocidad en G
    carga_total_B = carga_presion["B"] + carga_velocidad["B"] + carga_elevacion["B"]
    carga_velocidad["G"] = carga_total_B

    # Carga total en todos los puntos
    carga_total = {}
    for punto in ["A", "B", "C", "D", "E", "F", "G"]:
        cp = carga_presion.get(punto, 0)
        cv = carga_velocidad.get(punto, 0)
        ce = carga_elevacion.get(punto, 0)
        carga_total[punto] = cp + cv + ce

    # Mostrar resultados
    print("\nResultados:")
    for punto in ["A", "B", "C", "D", "E", "F", "G"]:
        print(f"\nPunto {punto}:")
        print(f"  Carga Presión   = {carga_presion[punto]:.5f} ft")
        print(f"  Carga Velocidad = {carga_velocidad[punto]:.5f} ft")
        print(f"  Carga Elevación = {carga_elevacion[punto]:.5f} ft")
        print(f"  Carga Total     = {carga_total[punto]:.5f} ft")

    print("\nVelocidades y Áreas:")
    print(f"Vg = {Vg:.5f} ft/s")
    print(f"Vf = {Vf:.5f} ft/s")
    print(f"Vc = {Vc:.5f} ft/s")
    print(f"Ag = {Ag:.5f} ft²")
    print(f"Af = {Af:.5f} ft²")
    print(f"Ac = {Ac:.5f} ft²")

if __name__ == "__main__":
    main()
