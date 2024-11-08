import { Router } from "express";
import {
getNavCarousel,
removeNavCarousel,
postNavCarousel
} from "../controllers/navCarousel.controller.js"

const router = Router();

// Obtener imágenes del carrusel
router.get('/carousel', getNavCarousel);

// Agregar una imagen al carrusel
router.post('/carousel', postNavCarousel);

// Eliminar una imagen del carrusel
router.delete('/carousel/:img_key', removeNavCarousel);


export default router;
