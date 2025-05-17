/**
 * update-all-scripts.js
 * Este script actualiza todas las páginas HTML para incluir los scripts del menú
 * Ejecutar con: node update-all-scripts.js
 */

const fs = require('fs');
const path = require('path');

// Obtener todos los archivos HTML en el directorio actual
const getHtmlFiles = () => {
  return fs.readdirSync('.').filter(file => file.endsWith('.html'));
};

// Scripts del menú a insertar antes de </body>
const menuScripts = `
  <!-- Scripts del menú -->
  <script src="js/menu.js"></script>
  <script src="js/menu-fix.js"></script>
  
  <!-- Otros scripts -->
`;

// Actualizar un archivo HTML
const updateFile = (filename) => {
  try {
    // Leer el contenido del archivo
    let content = fs.readFileSync(filename, 'utf8');
    
    // Verificar si los scripts ya están incluidos
    if (content.includes('menu-fix.js')) {
      console.log(`${filename}: Ya incluye los scripts del menú, omitiendo...`);
      return false;
    }
    
    // Encontrar dónde colocar los scripts (antes de </body>)
    const bodyRegex = /<script.*?><\/script>\s*<\/body>/i;
    
    if (!bodyRegex.test(content)) {
      console.log(`${filename}: No se pudo encontrar un patrón adecuado para insertar los scripts`);
      return false;
    }
    
    // Insertar los scripts antes de los scripts existentes
    content = content.replace(bodyRegex, match => {
      return menuScripts + match;
    });
    
    // Escribir el archivo actualizado
    fs.writeFileSync(filename, content, 'utf8');
    console.log(`${filename}: Actualizado correctamente`);
    return true;
  } catch (err) {
    console.error(`Error al procesar ${filename}:`, err.message);
    return false;
  }
};

// Procesar todos los archivos HTML
const updateAllFiles = () => {
  const htmlFiles = getHtmlFiles();
  console.log(`Encontrados ${htmlFiles.length} archivos HTML`);
  
  let updatedCount = 0;
  
  htmlFiles.forEach(file => {
    if (updateFile(file)) {
      updatedCount++;
    }
  });
  
  console.log(`\nActualización completada. Se actualizaron ${updatedCount} de ${htmlFiles.length} archivos.`);
};

// Ejecutar el script
updateAllFiles(); 