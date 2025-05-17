/**
 * Script para actualizar todas las páginas HTML con los scripts de menú
 * Guardar y ejecutar con: node update-all-pages.js
 */

const fs = require('fs');
const path = require('path');

// Lista de archivos HTML a actualizar
const htmlFiles = [
  'cinematica.html',
  'conversion.html',
  'ejercicios.html',
  'flotacion.html',
  'maquinas.html',
  'presion.html',
  'propiedades.html',
  'simulacion-flujo.html',
  'tuberias.html',
  'viscosidad.html'
];

// Scripts que deben incluirse en cada página
const menuScripts = `
  <!-- Scripts del menú -->
  <script src="js/menu.js"></script>
  <script src="js/menu-fix.js"></script>
`;

// Actualizar cada archivo
htmlFiles.forEach(fileName => {
  const filePath = path.join(__dirname, fileName);
  
  try {
    // Leer el archivo
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Verificar si los scripts ya están incluidos
    if (content.includes('js/menu.js') && content.includes('js/menu-fix.js')) {
      console.log(`${fileName}: Scripts ya incluidos, omitiendo...`);
      return;
    }
    
    // Buscar dónde insertar los scripts (antes de </body>)
    const bodyCloseIndex = content.lastIndexOf('</body>');
    
    if (bodyCloseIndex === -1) {
      console.log(`${fileName}: No se encontró la etiqueta de cierre </body>, omitiendo...`);
      return;
    }
    
    // Insertar los scripts antes del cierre del body
    const updatedContent = content.slice(0, bodyCloseIndex) + 
                           menuScripts + 
                           content.slice(bodyCloseIndex);
    
    // Escribir el archivo actualizado
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`${fileName}: Actualizado correctamente`);
    
  } catch (error) {
    console.error(`Error al procesar ${fileName}:`, error.message);
  }
});

console.log('Proceso completado.'); 