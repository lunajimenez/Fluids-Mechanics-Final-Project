#!/bin/bash

# Script para eliminar la sección Multimedia de todos los archivos HTML

echo "Eliminando la sección Multimedia de todos los archivos HTML..."

# Buscar todos los archivos HTML y reemplazar la línea que contiene Multimedia
find . -name "*.html" -exec sed -i '/<li><a href="simulacion-flujo.html">Multimedia<\/a><\/li>/d' {} \;

echo "Proceso completado. La sección Multimedia ha sido eliminada de todos los archivos HTML." 