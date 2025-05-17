/**
 * update-menus.js - Script para actualizar todos los menús del sitio
 * Asegura la consistencia en todos los enlaces de navegación
 */
const fs = require('fs');
const path = require('path');

// Configuración
const htmlDir = './'; // Directorio donde se encuentran los archivos HTML (relativo a frontend/)
const menuPattern = /<li class="has-submenu">\s*<a href="#" class="menu-trigger" aria-haspopup="true" aria-expanded="false">Cinemática de Fluidos<\/a>\s*<ul class="submenu">[\s\S]*?<\/ul>\s*<\/li>/;

// Menú actualizado para Cinemática de Fluidos
const updatedCinematicaMenu = `<li class="has-submenu">
            <a href="#" class="menu-trigger" aria-haspopup="true" aria-expanded="false">Cinemática de Fluidos</a>
            <ul class="submenu">
              <li><a href="cinematica.html#descripcion-lagrangiana">Descripción Lagrangiana</a></li>
              <li><a href="cinematica.html#descripcion-euleriana">Descripción Euleriana</a></li>
              <li><a href="cinematica.html#patrones-flujo">Patrones de Flujo</a></li>
              <li><a href="cinematica.html#analisis-movimiento">Análisis del Movimiento</a></li>
              <li><a href="cinematica.html#ecuacion-continuidad">Ecuación de Continuidad</a></li>
              <li><a href="cinematica.html#bernoulli">Ecuación de Bernoulli</a></li>
            </ul>
          </li>`;

// Menú actualizado para Análisis Dimensional
const updatedDimensionalMenu = `<li class="has-submenu">
            <a href="#" class="menu-trigger" aria-haspopup="true" aria-expanded="false">Análisis Dimensional</a>
            <ul class="submenu">
              <li><a href="dimensional.html#teorema-pi">Teorema Pi de Buckingham</a></li>
              <li><a href="dimensional.html#numeros-adimensionales">Números Adimensionales</a></li>
              <li><a href="dimensional.html#analisis-modelos">Análisis de Modelos</a></li>
            </ul>
          </li>`;

// Patrón para eliminar la sección Multimedia
const multimediaPattern = /<li><a href="simulacion-flujo\.html">Multimedia<\/a><\/li>/;

// Obtener todos los archivos HTML
const htmlFiles = fs.readdirSync(htmlDir)
  .filter(file => file.endsWith('.html'));

console.log(`Encontrados ${htmlFiles.length} archivos HTML para actualizar.`);

// Actualizar cada archivo
let updatedCount = 0;
for (const file of htmlFiles) {
  const filePath = path.join(htmlDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Actualizar el menú de Cinemática
  const originalContent = content;
  content = content.replace(menuPattern, updatedCinematicaMenu);
  
  // Actualizar el menú de Análisis Dimensional
  const dimensionalPattern = /<li class="has-submenu">\s*<a href="#" class="menu-trigger" aria-haspopup="true" aria-expanded="false">Análisis Dimensional<\/a>\s*<ul class="submenu">[\s\S]*?<\/ul>\s*<\/li>/;
  content = content.replace(dimensionalPattern, updatedDimensionalMenu);
  
  // Eliminar la sección Multimedia
  content = content.replace(multimediaPattern, '');
  
  // Guardar si hubo cambios
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    updatedCount++;
    console.log(`- Actualizado: ${file}`);
  } else {
    console.log(`- Sin cambios: ${file}`);
  }
}

console.log(`\nActualización completada. Se actualizaron ${updatedCount} archivos.`);
console.log('Los menús ahora son consistentes en todos los archivos HTML.');
console.log('Se ha eliminado la sección Multimedia de todos los archivos.'); 