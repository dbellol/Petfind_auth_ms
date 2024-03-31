const express = require('express');
const { uploadImages, deleteImages } = require('../controller/uploadCtrl');
/*const { isAdmin, isFoundation, authMiddleware } = require('../middlewares/authMiddleware');*/
const { uploadPhoto, productImgResize } = require('../middlewares/uploadImage');
const router = express.Router();
module.exports = router

// Ruta para la carga de imágenes de administradores
router.post('/', uploadPhoto.array("images", 10), productImgResize, uploadImages);

// Ruta para la carga de imágenes de fundaciones
/*router.post('/foundation-upload', authMiddleware, isFoundation, uploadPhoto.array("images", 10), productImgResize, uploadImages);*/

router.delete('/delete-img/:id', deleteImages);
module.exports = router;