import numpy as np
import matplotlib.pyplot as plt
from matplotlib.ticker import LogFormatter, LogLocator
import matplotlib.ticker as ticker
import matplotlib.patches as patches
from matplotlib.colors import LinearSegmentedColormap

# Configuración del estilo de la gráfica
plt.rcParams['font.family'] = 'serif'
plt.style.use('default')

# Paleta de colores más sobria (similar al diagrama original)
dark_blue = '#000066'  # Azul oscuro para la línea principal
gray = '#404040'  # Gris para las líneas secundarias
light_gray = '#A0A0A0'  # Gris claro para líneas de cuadrícula

# Generar valores para el número de Reynolds (Re)
# Comenzando desde 4000 como solicitado (eliminando flujo laminar)
Re_turbulento = np.logspace(np.log10(4000), 7, 1000)  # Ajustado a 10⁷ como límite superior

# Definir rugosidades relativas ajustadas al diagrama original
rugosidades = [0, 0.00001, 0.00002, 0.00004, 0.00006, 0.0001,
               0.0002, 0.0004, 0.0006, 0.001, 0.002, 0.004,
               0.006, 0.008, 0.01, 0.015, 0.02, 0.03, 0.04, 0.05]

# Función de Colebrook-White para el factor de fricción (implícita)
def colebrook(re, rugosidad_rel):
    # Para tubería lisa
    if rugosidad_rel <= 0.000001:
        # Usar la ecuación de Prandtl para tuberías lisas
        f_aprox = 0.0072 + 0.5*re**(-0.55)  # Aproximación inicial
        for _ in range(15):
            f_nuevo = (2.0 * np.log10(re * np.sqrt(f_aprox)) - 0.8)**(-2)
            if np.allclose(f_aprox, f_nuevo, rtol=1e-8):
                break
            f_aprox = f_nuevo
        return f_aprox

    # Para tuberías rugosas
    # Valor inicial para f (aproximación de Swamee-Jain)
    f_aprox = 0.25 / (np.log10(rugosidad_rel/3.7 + 5.74/(re*0.9)))**2

    # Iteración de punto fijo para resolver la ecuación de Colebrook-White
    for _ in range(15):  # Más iteraciones para mayor precisión
        f_nuevo = 0.25 / (np.log10(rugosidad_rel/3.7 + 2.51/(re*np.sqrt(f_aprox))))**2
        if np.allclose(f_aprox, f_nuevo, rtol=1e-8):
            break
        f_aprox = f_nuevo

    return f_aprox

# Crear el gráfico con tamaño ajustado
fig, ax = plt.subplots(figsize=(12, 9))
fig.set_facecolor('white')
ax.set_facecolor('white')

# Definir colores para las líneas de rugosidad (usando escala de grises)
cmap = LinearSegmentedColormap.from_list('gray_gradient',
                                        ['black', 'black'], N=len(rugosidades))
rugosidad_colors = cmap(np.linspace(0, 1, len(rugosidades)))

# Graficar las curvas para diferentes rugosidades relativas
lineas_rugosidad = []
for i, rugosidad in enumerate(rugosidades):
    color = 'black'  # Todas las líneas en negro como en el diagrama original

    if rugosidad == 0:  # Tuberías lisas
        label = "Smooth Pipes"
        linestyle = '-'
        linewidth = 1.3
    else:
        mostrar_label = rugosidad in [0.00001, 0.0001, 0.001, 0.002, 0.004, 0.01, 0.02, 0.04]
        label = f"$\\varepsilon/D = {rugosidad}$" if mostrar_label else ""
        linestyle = '-'
        linewidth = 1.0

    # Calcular el factor de fricción para esta rugosidad
    if rugosidad == 0:  # Para tuberías lisas
        # Usar Prandtl-von Kármán para tubería lisa
        f_tuberia_lisa = np.zeros_like(Re_turbulento)
        for j, re in enumerate(Re_turbulento):
            # 1/√f = 2.0 log(Re·√f) - 0.8 (Ecuación para tubería lisa)
            f = 0.02  # Valor inicial
            for _ in range(20):
                f_new = (2.0 * np.log10(re * np.sqrt(f)) - 0.8)**(-2)
                if abs(f - f_new) < 1e-8:
                    break
                f = f_new
            f_tuberia_lisa[j] = f

        linea = ax.plot(Re_turbulento, f_tuberia_lisa, linestyle=linestyle, color=color,
                        linewidth=linewidth, label=label, alpha=0.9, zorder=3)
        lineas_rugosidad.append(linea[0])
    else:
        # Para tuberías rugosas, usar Colebrook-White preciso
        f_values = np.zeros_like(Re_turbulento)
        for j, re in enumerate(Re_turbulento):
            f_values[j] = colebrook(re, rugosidad)

        linea = ax.plot(Re_turbulento, f_values, linestyle=linestyle, color=color,
                        linewidth=linewidth, label=label if mostrar_label else "", alpha=0.9, zorder=2)
        lineas_rugosidad.append(linea[0])

# Configuración de ejes logarítmicos
ax.set_xscale('log')
ax.set_yscale('log')

# Límites de los ejes ajustados al diagrama original
ax.set_xlim(4e3, 1e7)
ax.set_ylim(0.008, 0.1)

# Estilo de la cuadrícula
ax.grid(True, which='both', linewidth=0.5, color='gray', linestyle='-', alpha=0.4, zorder=0)

# Etiquetas de los ejes
ax.set_xlabel('Re = Reynolds Number = $\\frac{ρVD}{μ}$ = $\\frac{VD}{ν}$, Dimensionless', fontsize=10)
ax.set_ylabel('$f$ = Friction Factor, Dimensionless', fontsize=10)

# Añadir segundo eje Y para la rugosidad relativa
ax2 = ax.twinx()
ax2.set_yscale('log')
ax2.set_ylim(0.00001, 0.1)  # Ajustado al diagrama original
ax2.set_ylabel('$\\varepsilon/D$ = Relative Roughness, Dimensionless', fontsize=10)

# Título principal
plt.suptitle('Moody Diagram', fontsize=16, fontweight='bold')

# Añadir texto para las zonas de flujo
ax.text(7e3, 0.09, "Transition\nZone", fontsize=9, ha='center', fontweight='bold')
ax.text(3e5, 0.09, "Complete Turbulence, Rough Pipes", fontsize=9, ha='left', fontweight='bold')
ax.text(3e5, 0.018, "Smooth Pipes", fontsize=9, ha='center', fontweight='bold')

# Añadir la ecuación
ax.text(1e4, 0.01, "$\\Delta P = f \\frac{L}{D} \\frac{ρV^2}{2}$", fontsize=10, bbox=dict(facecolor='white', alpha=0.7))

# ELIMINADO: Las líneas diagonales punteadas para zona de turbulencia plena y la línea horizontal en f = 0.02

# Configurar ticks con mejor espaciado para el eje X
major_ticks_x = [4e3, 6e3, 8e3, 1e4, 2e4, 4e4, 6e4, 8e4, 1e5, 2e5, 4e5, 6e5, 8e5, 1e6, 2e6, 4e6, 6e6, 8e6, 1e7]
major_ticks_y = [0.008, 0.009, 0.01, 0.015, 0.02, 0.025, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1]

ax.set_xticks(major_ticks_x)
ax.set_yticks(major_ticks_y)

# Formato de etiquetas personalizado
def formato_eje_x(x, pos):
    if x == 1e4:
        return '10$^4$'
    elif x == 1e5:
        return '10$^5$'
    elif x == 1e6:
        return '10$^6$'
    elif x == 1e7:
        return '10$^7$'
    elif x in [4e3, 6e3, 8e3, 2e4, 4e4, 6e4, 8e4, 2e5, 4e5, 6e5, 8e5, 2e6, 4e6, 6e6, 8e6]:
        return f'{int(x/10**(int(np.log10(x))))}·10$^{{{int(np.log10(x))}}}$'
    else:
        return ''

def formato_eje_y(y, pos):
    if y == 0.01:
        return '0.01'
    elif y == 0.1:
        return '0.1'
    elif y in [0.008, 0.009, 0.015, 0.02, 0.025, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09]:
        return f'{y:.3f}'.rstrip('0').rstrip('.')
    else:
        return ''

ax.xaxis.set_major_formatter(ticker.FuncFormatter(formato_eje_x))
ax.yaxis.set_major_formatter(ticker.FuncFormatter(formato_eje_y))

# Marcas del eje de rugosidad relativa
rugosidad_ticks = [0.00001, 0.00002, 0.00005, 0.0001, 0.0002, 0.0005, 0.001, 0.002, 0.005, 0.01, 0.02, 0.05, 0.1]
ax2.set_yticks(rugosidad_ticks)

def formato_rugosidad(y, pos):
    if y == 0.00001:
        return '0.00001'
    elif y == 0.0001:
        return '0.0001'
    elif y == 0.001:
        return '0.001'
    elif y == 0.002:
        return '0.002'
    elif y == 0.01:
        return '0.01'
    elif y == 0.05:
        return '0.05'
    elif y == 0.1:
        return '0.1'
    elif y in [0.00002, 0.00005, 0.0002, 0.0005, 0.005, 0.02]:
        return f'{y:.5f}'.rstrip('0').rstrip('.')
    else:
        return ''

ax2.yaxis.set_major_formatter(ticker.FuncFormatter(formato_rugosidad))

# Líneas verticales adicionales
for re_value in [1e4, 1e5, 1e6]:
    ax.axvline(x=re_value, color='gray', linestyle=':', linewidth=0.8, alpha=0.6)

# ELIMINADO: Línea punteada horizontal en f = 0.02
# ax.axhline(y=0.02, color='black', linestyle='--', linewidth=1.0)

# Crear leyenda
handles, labels = [], []

# Seleccionar rugosidades específicas para la leyenda
rugosidades_para_leyenda = [0, 0.00001, 0.0001, 0.001, 0.002, 0.004, 0.01, 0.02, 0.04]
for rugosidad in rugosidades_para_leyenda:
    if rugosidad in rugosidades:
        idx = rugosidades.index(rugosidad)
        if rugosidad == 0:
            label = "Smooth Pipes"
        else:
            label = f"$\\varepsilon/D = {rugosidad}$"
        handles.append(lineas_rugosidad[idx])
        labels.append(label)

# Crear leyenda compacta
legend = ax.legend(handles, labels, loc='upper right', fontsize=8,
                   framealpha=0.8, frameon=True, edgecolor='gray')

# Ajustes finales
plt.tight_layout()
plt.subplots_adjust(bottom=0.07, top=0.92, left=0.1, right=0.9)

# Guardar el diagrama con alta resolución
plt.savefig('moody_diagram_modified.png', dpi=300, bbox_inches='tight')

# Mostrar el diagrama
plt.show()