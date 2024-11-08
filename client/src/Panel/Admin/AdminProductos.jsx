import React, { useState, useEffect } from 'react';

import { CSS } from '@dnd-kit/utilities';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {MouseSensor, TouchSensor, useSensor, useSensors} from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { arrayMoveImmutable } from 'array-move';

import { Toaster, toast } from 'sonner';



import axios from 'axios';
import './AdminProductos.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    descripcion: '',
    images: [],
    categoria: "",
    masvendidos: false,
    novedades: false,
    promociones: false
  });
  const [imagesPreview, setImagesPreview] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const limit = 3;
  const [options, setOptions] = useState([]);


  useEffect(() => {
    fetchProducts(1, filter, searchQuery, true);
  }, [filter, searchQuery, selectedCategory]);
  useEffect(() => {
  }, [newProduct]);
  useEffect(() => {
    obtenerCategorias();
  }, []);


  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    // Press delay of 250ms, with tolerance of 5px of movement
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });

  const sensors = useSensors(
    mouseSensor,
    touchSensor,
  );



  const fetchProducts = async (page, filter, search, reset = false) => {
    try {
      let params = {
        page,
        limit,
        filter,
        search
      };

      // Si hay una categoría seleccionada, agregarla a los parámetros de la solicitud
      if (selectedCategory) {
        params = {
          ...params,
          categoria: selectedCategory
        };
      }

      const response = await axios.get("https://disturbiaarg.com/api/productsadmin", {
        params
      });
      const productsData = response.data; 

      if (reset) {
        setProducts(productsData);
      } else {
        setProducts(prevProducts => [...prevProducts, ...productsData]);
      }

      if (productsData.length < limit) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const loadMoreProducts = () => {
    if (hasMore) {
      setPage(prevPage => {
        const newPage = prevPage + 1;
        fetchProducts(newPage, filter, searchQuery);
        return newPage;
      });
    }
  };

  const handleProductChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setNewProduct({ ...newProduct, [name]: newValue });
  };

  const handleUpdateProduct = async () => {
    if (selectedProduct) {
      try {
        // Guardar los datos originales
        const originalProductData = {
          name: newProduct.name,
          price: newProduct.price,
          descripcion: newProduct.descripcion,
          images: newProduct.images,
          categoria: newProduct.categoria,
          masvendidos: newProduct.masvendidos,
          novedades: newProduct.novedades,
          promociones: newProduct.promociones
        };

        // Obtener un array de solo las URLs de las imágenes
        const imagesUrls = newProduct.images.flatMap((image) => {
          // Verificar si la imagen es un objeto con una propiedad "url"
          if (typeof image === 'object' && image.url) {
            return image.url;
          } else {
            // Si la imagen es una URL directa, simplemente devolverla
            return image;
          }
        });


        // Reemplazar la propiedad "images" con el nuevo array de URLs

        const elproductoacualizado = { ...originalProductData, images: imagesUrls };

        toast.loading('Loading data');

        // Llamar a la función de actualización del producto con solo las URLs de las imágenes
        await updateProduct(selectedProduct.id, elproductoacualizado);


        // Limpiar los campos después de la actualización
        setSelectedProduct(null);
        setNewProduct({
          name: '',
          price: '',
          descripcion: '',
          images: [],
          categoria: "",
          masvendidos: false,
          novedades: false,
          promociones: false
        });

      } catch (error) {
        console.error('Error updating product:', error);
      }
    }
  };


  const updateProduct = async (productId, updatedProduct) => {

    try {
      const response = await axios.post(`https://disturbiaarg.com/api/objects/${productId}`, updatedProduct, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const updatedProducts = products.map(product => {
        if (product.id === productId) {
          return { ...product, ...updatedProduct };
        }
        return product;
      });
      setProducts(updatedProducts);
      toast.success("Se actualizo el producto")
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setNewProduct({
      name: product.name || '',
      price: product.price || '',
      descripcion: product.descripcion || '',
      images: product.images || [],
      categoria: product.categoria || '',
      masvendidos: product.masvendidos || false,
      novedades: product.novedades || false,
      promociones: product.promociones || false
    });
    setImagesPreview(product.images.map((image, index) => ({
      id: `image-${index}-${Date.now()}`,
      deleteId: `delete-${index}-${Date.now()}`, // Identificador para el borrado lógico
      url: image,
    })));
  };


  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`https://disturbiaarg.com/api/products/${productId}`);
      setProducts(products.filter(product => product.id !== productId));
      toast.success("Se elimino el producto con éxito.")
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };


  const handleCancelEdit = () => {
    setSelectedProduct(null)
    setNewProduct({
      name: '',
      price: '',
      descripcion: '',
      images: undefined,
      masvendidos: false,
      novedades: false,
      promociones: false
    })
    toast.success("Se cancelo la actualización")
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }


  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
    fetchProducts(1, filter, e.target.value, true);
    if (e.target.value.length === 0) {
      resetFilters()
    }
  };

  const filterByMasVendidos = () => {
    setPage(1);
    setSearchQuery('');
    fetchProducts(1, 'masVendidos', '', true);
  };

  const filterByNovedades = () => {
    setPage(1);
    setSearchQuery('');
    fetchProducts(1, 'novedades', '', true);
  };

  const filterByPromociones = () => {
    setPage(1);
    setSearchQuery('');
    fetchProducts(1, 'promociones', '', true);
  };

  const resetFilters = () => {
    setPage(1);
    setFilter('');
    setSearchQuery('');
    fetchProducts(1, '', '', true);
  };

  const handleCreateProduct = async () => {
    try {
        let imagesUrls = [];
        
        if (newProduct.images && newProduct.images.length > 0) {
            toast.loading('Cargando datos');
            console.log('Imágenes para subir:', newProduct.images); // Verificar imágenes
            imagesUrls = await uploadImages(newProduct.images);
            console.log('URLs de las imágenes subidas:', imagesUrls); // Verificar URLs subidas
        } else {
            console.error('No hay imágenes para subir o las imágenes no son válidas');
        }
        
        await createProductWithImages(imagesUrls);
    } catch (error) {
        console.error('Error al crear el producto:', error);
    }
};
  
const uploadImages = async (images) => {
  const imagesUrls = [];

  for (let i = 0; i < images.length; i++) {
      try {
          const data = new FormData();
          if (images[i].file) { // Verificar que el archivo está definido
              console.log('Archivo a subir:', images[i].file);
              data.append("file", images[i].file);
              data.append("upload_preset", "w8qdkdel");
              const cloudName = "dtw1galuw";

              const response = await axios.post(
                  `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                  data
              );

              imagesUrls.push(response.data.secure_url);
          } else {
              console.error('Archivo no definido para la imagen en el índice', i);
          }
      } catch (error) {
          console.log('Error al subir la imagen:', error);
      }
  }

  return imagesUrls;
};
  
  const createProductWithImages = async (imagesUrls) => {
    try {
      const productWithImages = {
        ...newProduct, 
           images: imagesUrls,
           categoria: newProduct.categoria || "Otros" };
           
        const response = await axios.post('https://disturbiaarg.com/api/products', productWithImages, {
            headers: {
                'Content-Type': 'application/json'
            }
        });


        setProducts([...products, response.data]);

        setNewProduct({
            name: '',
            price: '',
            descripcion: '',
            images: [],
            categoria: "",
            masvendidos: false,
            novedades: false,
            promociones: false
        });
        toast.success('Se creó el producto con éxito.');
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    } catch (error) {
        toast.error("Hubo un error al crear el producto.");
        console.error("hubo en error", error);
      }
    };
    
    
    const handleImageChange = (e) => {
      const filesArray = Array.from(e.target.files);
      const imageUrls = filesArray.map((file, index) => ({
          id: `image-${index}-${Date.now()}`,
          deleteId: `delete-${index}-${Date.now()}`, // Identificador para el borrado
          url: URL.createObjectURL(file),
          file: file
      }));
      setImagesPreview(imageUrls);
      setNewProduct({ ...newProduct, images: imageUrls }); // Ajuste aquí para mantener la estructura correcta
  };
  
  
    const handleRemoveImage = (deleteIdToRemove) => {
      console.log("hice click")
      // Filtrar la imagen con el deleteId correspondiente y eliminarla
      const updatedImagesPreview = imagesPreview.filter((image) => image.deleteId !== deleteIdToRemove);
    
      // Actualizar las imágenes previas en el estado
      setImagesPreview(updatedImagesPreview);
    
      // Actualizar el estado del nuevo producto con las URLs actualizadas
      setNewProduct((prevProduct) => {
        const updatedImages = updatedImagesPreview.map((image) => image.url);
        return { ...prevProduct, images: updatedImages };
      });
    };
  function SmallImage({ image }) {
    const { attributes, listeners, setNodeRef, transform } = useSortable({ id: image.id });
  
    const [isDragging, setIsDragging] = useState(false);
    const [isHovered, setIsHovered] = useState(false); // Nuevo estado para controlar el hover del botón
  
    const handleDragStart = () => {
      setIsDragging(true);
    };
  
    const handleDragEnd = () => {
      setIsDragging(false);
    };
  
    const handleMouseEnter = () => {
      setIsHovered(true);
    };
  
    const handleMouseLeave = () => {
      setIsHovered(false);
    };
  
    const handleRemoveImage = (deleteIdToRemove) => {
      const updatedImagesPreview = imagesPreview.filter((image) => image.deleteId !== deleteIdToRemove);
      
      setImagesPreview(updatedImagesPreview);
      
      const updatedNewProductImages = updatedImagesPreview.map((image) => ({
        url: image.url,  // Incluir la URL si es un objeto imagen ya subido
        file: image.file // Incluir el archivo si es un objeto nuevo para subir
      }));
      
      setNewProduct({ ...newProduct, images: updatedNewProductImages });
    };
  
    let imageUrl = '';
    if (typeof image === 'string') {
      imageUrl = image;
    } else if (typeof image === 'object' && image.url) {
      imageUrl = image.url;
    }
  
    const style = {
      transform: isHovered ? 'none' : (transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : 'none'),
      transition: isDragging ? 'none' : 'transform 0.3s', // Controla la transición basado en si se está arrastrando o no
      position: 'relative',
    };
  
    return (
      <div
        style={style}
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <img loading="lazy" className="image-item" src={imageUrl} alt="Preview" />
        <div className="quit-image-preview">
          <button
            className="quit-btn-small"
            onClick={() => handleRemoveImage(image.deleteId)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            aria-pressed={isHovered ? 'false' : 'true'} // Controla el aria-pressed
          >
            X
          </button>
        </div>
      </div>
    );
  }

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setImagesPreview((images) => {
        const oldIndex = images.findIndex((image) => image.id === active.id);
        const newIndex = images.findIndex((image) => image.id === over.id);
        const updatedImages = arrayMoveImmutable(images, oldIndex, newIndex);
        setNewProduct({ ...newProduct, images: updatedImages });
        return updatedImages;
      });
    }
  };



  const obtenerCategorias = async () => {
    try {
      const response = await axios.get("https://disturbiaarg.com/api/products/categorias");
      setOptions(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };



  const handleChangeOption = (event) => {
    setSelectedCategory(event.target.value);
  };



  return (
    <div className="admin-products-container">
      <p className='admin-p-ti'>Administrar Productos</p>
      <div className="product-form section">
        <input
          type="text"
          name="name"
          maxLength={45}
          placeholder="Nombre"
          value={newProduct.name}
          onChange={handleProductChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Precio"
          value={newProduct.price}
          onChange={handleProductChange}
        />
        <textarea
          className='admin-input-descrip'
          type="text"
          name="descripcion"
          placeholder="Descripción max 421 caracteres"
          maxLength={421}
          value={newProduct.descripcion}
          onChange={handleProductChange}
        />

        <input
          type="file"
          multiple
          onChange={handleImageChange}
        />
        <div className='divpdata'>
          <p className='pdata'><em>Máximo de 5 imágenes por producto.</em></p>
          <p className='pdata'><em>Arrastra para acomodar las imagenes.</em></p>
        </div>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <SortableContext
            items={imagesPreview}
            strategy={verticalListSortingStrategy}
          >
            <div className="image-preview">
              {imagesPreview.map((image, index) => (
                <SmallImage key={image.id} image={image} />
              ))}
            </div>
          </SortableContext>
        </DndContext>



        <div className='flex-cont-allchecks'>

          <div className="flex-container-check">
            <label className="label-check">
              <input
                type="checkbox"
                className='custom-checkbox'
                name="masvendidos"
                checked={newProduct.masvendidos}
                onChange={handleProductChange}
              />
              <div className='name-label'> Más&nbsp;vendidos: </div>

            </label>

            <label className="label-check">
              <input
                type="checkbox"
                className='custom-checkbox'
                name="novedades"
                checked={newProduct.novedades}
                onChange={handleProductChange}
              />
              <div className='name-label'>  Novedades: </div>

            </label>

            <label className="label-check">
              <input
                type="checkbox"
                className='custom-checkbox'
                name="promociones"
                checked={newProduct.promociones}
                onChange={handleProductChange}
              />
              <div className='name-label'>  Promociones: </div>

            </label>
          </div>
          <div className='flex-container-categories'>
            <select className='admin-select' value={newProduct.categoria} onChange={(e) => setNewProduct({ ...newProduct, categoria: e.target.value })}>
              <option value="">Selec...categoria</option>
              {options.map((option, index) => (
                <option className='admin-options' key={index} value={option} title={option}>{option}</option>
              ))}
            </select>
            <input
              type="text"
              className='admin-cat-input'
              value={newProduct.categoria}
              onChange={(e) => setNewProduct({ ...newProduct, categoria: e.target.value })}
              placeholder="Nueva categoria"
            />
          </div>
        </div>
        {selectedProduct ? (
          <div>
            <button className="section-button" onClick={handleUpdateProduct}>Actualizar Producto</button>
            <button className="section-button" onClick={handleCancelEdit}>Cancelar</button>
          </div>
        ) : (
          <button className="section-button" onClick={handleCreateProduct}>Crear Producto</button>
        )}
      </div>
      <p className='adm-p-btns-filts'>FILTRAR POR CATEGORIAS</p>
      <div className="filter-bar">
        <button className='adm-btn-filt' onClick={filterByMasVendidos}>Más Vendidos</button>
        <button className='adm-btn-filt' onClick={filterByNovedades}>Novedades</button>
        <button className='adm-btn-filt' onClick={filterByPromociones}>Promociones</button>
        <button className='adm-btn-filt' onClick={resetFilters}>Mostrar Todos</button>
      </div>
      <div className="filter-bar">
        <select value={selectedCategory} onChange={handleChangeOption}>
          <option value="">Selecciona una categoría</option>
          {options.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <div className="products-list flex-container">
        {products.map(product => (
          <div key={product.id} className="product-item section">
            <div className="img-edit">
              {product.images.map((image, index) => (
                <img loading="lazy" key={index} src={image} alt={`Product ${index}`} />
              ))}
            </div>
            <h4>{product.name}</h4>
            <h4>${product.price}</h4>
            <p>{product.descripcion}</p>
            <div className='div-button'>
              <button className="section-button" onClick={() => handleEditProduct(product)}>Editar</button>
              <button className="section-button" onClick={() => handleDeleteProduct(product.id)}>Borrar</button>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={loadMoreProducts}
        disabled={!hasMore}
        className={!hasMore ? 'button-disabled' : 'section-button'}
      >
        {hasMore ? 'Ver más' : 'Son todos los productos!  '}
      </button>
      <Toaster />
    </div>
  );
};

export default AdminProducts;