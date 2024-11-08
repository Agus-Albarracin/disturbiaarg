import React, { useContext, useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';

import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../Context/AppContext';
import "./AdminPanel.css"
import AdminProducts from "./AdminProductos"
import AdminTickets from './AdminTickets';
import axios from "axios"

const AdminPanel = () => {
  const {
    //BTN NAVBAR
    btnnavLink, updateBtnnavLink,
    // CAROUSEL
    carouselImages, addImage, removeImage,
    // SIDE BAR
    shippingPrices, updateShippingPrices, setShippingPrices,
    // FOOTER
    footerInfo, updateFooterInfo, handleFooterChange
  } = useContext(AppContext);


  //ADMIN BUTTONS
  const [activeSection, setActiveSection] = useState(() => {
    return localStorage.getItem('activeSection') || 'edit';
  });

  // BTN NAVBAR
  const [newBtnnavLink, setNewBtnnavLink] = useState(btnnavLink);
  // CAROUSEL
  const [selectedImage, setSelectedImage] = useState(null);

  //ACCESS 
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminPermission = async () => {
      try {
        const token = localStorage.getItem('authToken');

        const response = await axios.get('http://localhost:4000/api/admin', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setIsAdmin(true);
      } catch (error) {
        navigate("/");
      }
    };
    checkAdminPermission();
    const storedSection = localStorage.getItem('activeSection');
    setActiveSection(storedSection || 'edit');
  }, [])

  // VIEWS
  const handleSectionChange = (section) => {
    setActiveSection(section);
    localStorage.setItem('activeSection', section);
  };

  // BTN NAVBAR
  const handleBtnnavLinkChange = (event) => {
    setNewBtnnavLink(event.target.value);
  };

  const handleUpdateBtnnavLink = () => {
    updateBtnnavLink(newBtnnavLink);
    toast.success("Se actualizo con éxito el link.");
  };

  // CAROUSEL
  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleAddImage = () => {
    if (selectedImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        uploadImageToCloudinary(reader.result);
      };
      reader.readAsDataURL(selectedImage);
    }
    toast.success("Se agrego una imagen al banner.")
  };

  const uploadImageToCloudinary = async (imageData) => {
    try {
      // Sube la imagen a Cloudinary
      const response = await axios.post('https://api.cloudinary.com/v1_1/dtw1galuw/image/upload', {
        file: imageData,
        upload_preset: 'w8qdkdel'
      });
      addImage(response.data.secure_url);
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
    }
  };

  const handleRemoveImage = async (img_key) => {
    try {
        await removeImage(img_key);
        toast.success("Imagen eliminada exitosamente.");
    } catch (error) {
        console.error('Error removing image:', error);
        toast.error("Error al eliminar la imagen.");
    }
};

  //SIDEBAR PRICE

  const handlePriceChange = (event, shippingOption) => {
    setShippingPrices({
      ...shippingPrices,
      [shippingOption]: event.target.value
    });
  };

  const handleUpdatePrices = async () => {
    try {
      await updateShippingPrices(shippingPrices);
      toast.success("Se actualizaron los precios.")
    } catch (error) {
      toast.error("Hubo un error al actualizar los precios.")
      console.error('Error updating shipping prices:', error);
    }
  };

  // FOOTER
  const handleFooterUpdate = () => {
    updateFooterInfo({
      address: footerInfo.address,
      email: footerInfo.email,
      phoneNumber: footerInfo.phoneNumber
    });
    toast.success("Se actualizaron los datos.")

  };

  return isAdmin ? (
    <>
      <Toaster />
      <nav className="admin-nav">
        <button className='admin-nav-btn' onClick={() => handleSectionChange('edit')}>Edición</button>
        <button className='admin-nav-btn' onClick={() => handleSectionChange('products')}>Productos</button>
        <button className='admin-nav-btn' onClick={() => handleSectionChange('ventas')}>Ventas</button>
        <button className='admin-nav-btn' onClick={() => navigate("/")}>Inicio</button>

      </nav>
      {activeSection === 'edit' && (
        <div className="admin-panel">
          <div className="flex-container">

            <div className="section">
              <h1>Editar link del botón wspp.</h1>
              <div className="flex-containernav">

                <label>
                  Enlace de WhatsApp:
                  <input type="text" value={newBtnnavLink} onChange={handleBtnnavLinkChange} />
                  <button onClick={handleUpdateBtnnavLink}>Actualizar Enlace</button>
                </label>
              </div>

            </div>

            <div className="section">
              <h1>Editar Carrusel</h1>
              <h5><em>IMPORTANTE: Para una mejor ilustración de los banners, utiliza 1080x300.</em></h5>
              <h5><em>Maximo: 5 imagenes, para buena perfomance.</em></h5>
              <div className="flex-container-car">
                <input type="file" onChange={handleImageChange} />
                <button onClick={handleAddImage}>Agregar Imagen</button>
              </div>
              <ul>
              {carouselImages.map((image, index) => (
  <li key={index} className='flex-container-car'>
    <img className="flex-container-car-img" loading="lazy" src={image.original} alt={`carousel ${index}`} width="300" />
    <button onClick={() => handleRemoveImage(image.img_key)}>Eliminar</button>
  </li>
))}
              </ul>
            </div>
          </div>


          <div className="flex-container">
            <div className="section">
              <h1>Editar precios de envío</h1>
              {Object.entries(shippingPrices).map(([option, price]) => (
                <div key={option} className="price-input">
                  <label>
                    {option} - $
                    <input
                      type="number"
                      value={price}
                      onChange={(event) => handlePriceChange(event, option)}
                    />
                  </label>
                </div>
              ))}
              <button onClick={handleUpdatePrices}>Actualizar Precios de Envío</button>
            </div>

            <div className="section">
              <h1>Editar pie de página</h1>
              <label>
                Dirección:
                <input type="text" name="address" value={footerInfo.address} onChange={handleFooterChange} />
              </label>
              <label>
                Correo electrónico:
                <input type="email" name="email" value={footerInfo.email} onChange={handleFooterChange} />
              </label>
              <label>
                Número de teléfono:
                <input type="tel" name="phoneNumber" value={footerInfo.phoneNumber} onChange={handleFooterChange} />
              </label>
              <button onClick={handleFooterUpdate}>Actualizar Footer</button>
            </div>
          </div>
        </div>
      )}
      {activeSection === 'products' && (
        <AdminProducts />
      )}
      {activeSection === 'ventas' && (
        <AdminTickets />
      )}
    </>
  ) :
    <h1> No tiene acceso a esta página.</h1>
};

export default AdminPanel;


