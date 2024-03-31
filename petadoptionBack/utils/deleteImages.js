const fs = require('fs');
const path = require('path');

const deleteImages = () => {
  const imagesFolder = path.join(__dirname, '../public/images');
  const productsFolder = path.join(__dirname, '../public/images/products');
  const blogsFolder = path.join(__dirname, '../public/images/blogs');

  // Obtener la lista de archivos en la carpeta de imágenes
  fs.readdir(imagesFolder, (err, files) => {
    if (err) {
      console.error('Error al leer la carpeta de imágenes:', err);
      return;
    }

    // Eliminar cada archivo de la carpeta de imágenes
    files.forEach((file) => {
      const filePath = path.join(imagesFolder, file);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error al eliminar el archivo:', err);
        } else {
          console.log('Archivo eliminado:', filePath);
        }
      });
    });
  });

  // Obtener la lista de archivos en la carpeta de productos
  fs.readdir(productsFolder, (err, files) => {
    if (err) {
      console.error('Error al leer la carpeta de productos:', err);
      return;
    }

    // Eliminar cada archivo de la carpeta de productos
    files.forEach((file) => {
      const filePath = path.join(productsFolder, file);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error al eliminar el archivo:', err);
        } else {
          console.log('Archivo eliminado:', filePath);
        }
      });
    });
  });
  fs.readdir(blogsFolder, (err, files) => {
    if (err) {
      console.error('Error al leer la carpeta de productos:', err);
      return;
    }

    // Eliminar cada archivo de la carpeta de productos
    files.forEach((file) => {
      const filePath = path.join(blogsFolder, file);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error al eliminar el archivo:', err);
        } else {
          console.log('Archivo eliminado:', filePath);
        }
      });
    });
  });
};

// Ejecutar la función para eliminar las imágenes
deleteImages();
