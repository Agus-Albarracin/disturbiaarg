import { Router } from "express";
import {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
  getProductsHome,
  getProductsCat,
  getCategorias,
  filterProductsByCategoria
} from "../controllers/products.controller.js";

const router = Router();

//Categorias
router.get('/products/categorias', getCategorias);
router.post('/products/filter', filterProductsByCategoria);

// GET all products
router.get("/productsadmin", getProducts);
router.get("/products", getProductsHome);
router.get("/products/cat", getProductsCat);


// DELETE An product
router.delete("/products/:id", deleteProduct);

// INSERT An product
router.post("/products", createProduct);

router.post("/objects/:id", updateProduct);

export default router;
