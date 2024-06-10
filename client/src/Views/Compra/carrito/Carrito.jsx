import React from 'react';
import { useCarrito } from '../../../Context/CartContext';
import './carrito.css'

const Carrito = () => {
  const { cartItems, selectedShippingOption} = useCarrito(); 
  
  const calcularTotal = () => {
    return cartItems.reduce((total, producto, index) => total + (producto.price * producto.quantity), 0);
  };
  
  return (
    <div className='carrito-cont'>
      <h2>Carrito de Compras</h2>
      <div>
        {cartItems.map((producto, index) => (
          <div className="productos-cont" key={index}>
            <img className="carrito-img" src={producto.image} alt={producto.name}/>
            <p className='p-carrito'>{producto.name}</p>
            <p className='p-carrito-descrip'>{producto.descripcion}</p>
            <p className='p-carrito'>${producto.price}</p>
            <p className='p-carrito'>X {producto.quantity}</p>
          </div>
        ))}
      </div>
      <p className='p-carrito'>Envio: ${selectedShippingOption}</p>
      <p className='p-carrito'>Total: ${calcularTotal() + selectedShippingOption}</p>
    </div>
  );
};

export default Carrito;