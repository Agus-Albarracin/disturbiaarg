import React, { useEffect, useContext } from 'react';
import Carrito from './carrito/Carrito';
import FormularioCompra from './FormularioCompra/FormularioCompra';
import { useCarrito } from '../../Context/CartContext';
import { AppContext } from '../../Context/AppContext';
import axios from 'axios';

const Compra = () => {
  const { cartItems, selectedShippingOption} = useCarrito();
  const { modoEnvio } = useContext(AppContext);


  const calcularTotal = () => {
    return cartItems.reduce((total, producto) => total + (producto.price * producto.quantity), 0); 
  };

  useEffect(() => {
  }, [modoEnvio]);

  
  const handleFinalizarCompra = async (datosCompra) => {
    try {
      const response = await axios.post('http://localhost:3000/api/createOrder',{
        data : datosCompra,
        cart: cartItems,
        totalEnvio: selectedShippingOption,
        modoEnvio: modoEnvio
    });
    const { point } = response.data
      window.location.href = point;
      
    } catch (error) {
      console.error('Error al iniciar la compra:', error);
    }
  };


  return (
    <div >
      <Carrito />
      <FormularioCompra onFinalizarCompra={handleFinalizarCompra} />
    </div>
  );
};

export default Compra;