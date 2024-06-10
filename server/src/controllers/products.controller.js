import { pool } from "../db.js";

export const getProductsCat = async (req, res) => {
  try {
    let query = "SELECT * FROM products";
    const params = [];

    if (req.query.category) {
      query += " WHERE categoria = ?";
      params.push(req.query.category);
    }

    const [rows] = await pool.query(query, params);

    const productsWithImageUrls = rows.map(product => ({
      ...product,
      images: JSON.parse(product.images).map(url => url) // Simplified mapping
    }));

    res.json(productsWithImageUrls);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
}


export const getProductsHome = async (req, res) => {
  const { filterType } = req.query;

  let query = "SELECT * FROM products";
  if (filterType) {
    switch (filterType) {
      case 'masvendidos':
        query += " WHERE masVendidos = 1";
        break;
      case 'novedades':
        query += " WHERE novedades = 1";
        break;
      case 'promociones':
        query += " WHERE promociones = 1";
        break;
      default:
        return res.status(400).json({ message: "Invalid filter type" });
    }
  }

  try {
    const [rows] = await pool.query(query);
    const productsWithImageUrls = rows.map(product => ({
      ...product,
      images: JSON.parse(product.images).map(url => url)
    }));
    res.json(productsWithImageUrls);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};


export const getProducts = async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 3;
    const offset = (page - 1) * limit;
    const filter = req.query.filter || '';
    const search = req.query.search ? req.query.search.trim() : '';
    const categoria = req.query.categoria || ''; // Nueva línea para obtener la categoría

    const connection = await pool.getConnection();

    let whereClause = 'WHERE 1=1';
    if (filter) {
      whereClause += ` AND ${filter} = 1`;
    }
    if (search) {
      whereClause += ` AND name LIKE ?`;
    }
    if (categoria) { // Si se proporciona una categoría, agregarla a la cláusula WHERE
      whereClause += ` AND categoria = ?`;
    }

    const queryParams = [];
    if (search) {
      queryParams.push(`%${search}%`);
    }
    if (categoria) { // Si se proporciona una categoría, agregarla a los parámetros de consulta
      queryParams.push(categoria);
    }
    queryParams.push(limit, offset); // Agregar limit y offset al final de los parámetros de consulta

    const [rows] = await connection.query(`
      SELECT * FROM products 
      ${whereClause}
      ORDER BY id DESC
      LIMIT ? OFFSET ?
    `, queryParams);

    const productsWithImageUrls = rows.map(product => ({
      ...product,
      images: JSON.parse(product.images).map(url => url)
    }));

    connection.release();

    res.json(productsWithImageUrls);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};


export const createProduct = async (req, res) => {
  const { name, price, images, categoria, descripcion, masvendidos, novedades, promociones } = req.body;
  try {
    console.log('Creating product with data:', req.body);

    const imagesJson = JSON.stringify(images);

    const [result] = await pool.query(
      "INSERT INTO products (name, price, images, categoria, descripcion, masvendidos, novedades, promociones) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [name, price, imagesJson, categoria, descripcion, masvendidos, novedades, promociones]
    );

    res.json({
      id: result.insertId,
      name,
      price,
      images: JSON.parse(imagesJson),
      categoria,
      descripcion,
      masvendidos,
      novedades,
      promociones
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, descripcion, images, categoria, accesorios, celulares, tecnologia, masvendidos, novedades, promociones } = req.body;
  try {
    console.log('Updating product with ID:', id);
    console.log('Data received:', req.body);
    console.log('Executing query with data:', [name, price, descripcion, JSON.stringify(images), categoria, accesorios, celulares, tecnologia, masvendidos, novedades, promociones, id]);

    await pool.query(
      "UPDATE products SET name = ?, price = ?, descripcion = ?, images = ?, categoria = ?, accesorios = ?, celulares = ?, tecnologia = ?, masvendidos = ?, novedades = ?, promociones = ? WHERE id = ?",
      [name, price, descripcion, JSON.stringify(images), categoria, accesorios, celulares, tecnologia, masvendidos, novedades, promociones, id]
    );

    res.json({ id, name, price, descripcion, images, categoria, accesorios, celulares, tecnologia, masvendidos, novedades, promociones });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM products WHERE id = ?", [id]);
    res.json({ message: "Product deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getCategorias = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT DISTINCT categoria FROM products WHERE categoria IS NOT NULL");

    // Obtener solo las categorías únicas utilizando un Set
    const categoriasSet = new Set();
    rows.forEach(row => categoriasSet.add(row.categoria));

    // Convertir el conjunto a un array
    const categorias = Array.from(categoriasSet);

    res.json(categorias);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: "Error fetching categories" });
  }
};

export const filterProductsByCategoria = async (req, res) => {
  try {
    const { categoria } = req.body; // Obtener la categoría del cuerpo de la solicitud

    // Verificar si la categoría es válida
    if (!categoria) {
      return res.status(400).json({ error: "Categoría no proporcionada" });
    }

    // Obtener productos filtrados por categoría
    const [rows] = await pool.query("SELECT * FROM products WHERE categoria = ?", [categoria]);

    // Transformar las imágenes de cada producto a un array antes de enviar la respuesta
    const productsWithArrayImages = rows.map(product => ({
      ...product,
      images: JSON.parse(product.images) // Convertir las imágenes en un array
    }));

    // Devolver los productos filtrados con imágenes en formato JSON
    res.json(productsWithArrayImages);
  } catch (error) {
    console.error('Error fetching filtered products:', error);
    res.status(500).json({ error: "Error fetching filtered products" });
  }
};

