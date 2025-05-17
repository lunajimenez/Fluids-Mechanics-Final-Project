"""
Código Python para ejercicios de flotación y estabilidad de una barcaza,
incluye cálculo de BC (centro de flotación), BM y regla de estabilidad.
Autor: PuchiGPT
Fecha: 14/05/2025
"""

def calcular_volumen_sumergido(eslora, manga, calado):
    """
    Volumen sumergido = eslora * manga * calado * 0.5
    """
    return eslora * manga * calado * 0.5


def calcular_fuerza_flotacion(volumen, densidad_relativa, g=9.81):
    """
    Empuje de Arquímedes = densidad * g * volumen,
    donde densidad = densidad_relativa * 1000 (kg/m^3)
    """
    densidad = densidad_relativa * 1000.0
    fuerza = densidad * g * volumen
    return fuerza, densidad


def calcular_h_oblicua(manga, calado):
    """
    Altura oblicua h = sqrt(manga^2 + calado^2)
    """
    from math import sqrt
    return sqrt(manga**2 + calado**2)


def calcular_momento_inercia_minimo(eslora, h):
    """
    Momento de inercia mínimo:
    - Se elige la dimensión menor entre eslora y h.
    - I_min = (1/12) * eslora * (dim_min ** 3)
    """
    dim_min = min(eslora, h)
    return (1.0/12.0) * eslora * (dim_min ** 3)


def calcular_BM(I_min, volumen):
    """
    Altura metacéntrica BM = I_min / volumen
    """
    return I_min / volumen


def calcular_BC(puntal, h):
    """
    Centro de flotación BC = Yc - Yb,
    donde Yc = puntal/2 (centro de gravedad) y Yb = h/2 (centro de flotación)
    """
    Yc = puntal / 2.0
    Yb = h / 2.0
    return Yc - Yb


def determinar_estabilidad(BM, BC):
    """
    Barcaza estable si BM > BC.
    """
    return BM > BC


def main():
    """
    Solicita datos al usuario y muestra resultados de flotación y estabilidad.
    """
    try:
        eslora = float(input("Eslora (m): "))
        manga = float(input("Manga (m): "))
        puntal = float(input("Puntal (m): "))
        calado = float(input("Calado (m): "))
        dens_rel = float(input("Densidad relativa del fluido: "))

        # Cálculos
        volumen = calcular_volumen_sumergido(eslora, manga, calado)
        fuerza, dens = calcular_fuerza_flotacion(volumen, dens_rel)
        h = calcular_h_oblicua(manga, calado)
        I_min = calcular_momento_inercia_minimo(eslora, h)
        BM = calcular_BM(I_min, volumen)
        BC = calcular_BC(puntal, h)
        estable = determinar_estabilidad(BM, BC)

        # Resultados
        print(f"\nVolumen sumergido: {volumen:.4f} m^3")
        print(f"Densidad del fluido: {dens:.2f} kg/m^3")
        print(f"Fuerza de flotación: {fuerza:.2f} N")
        print(f"Altura oblicua h: {h:.4f} m")
        print(f"Momento de inercia mínimo I: {I_min:.5f} m^4")
        print(f"Altura metacéntrica BM: {BM:.4f} m")
        print(f"Centro de flotación BC: {BC:.4f} m")
        if estable:
            print("La barcaza ES ESTABLE (BM > BC).")
        else:
            print("La barcaza NO ES estable (BM ≤ BC).")
    except ValueError:
        print("Error: por favor ingrese valores numéricos válidos.")

if __name__ == "__main__":
    main()
