import React, { createContext, useState, useContext, useEffect } from 'react';

const CarritoContext = createContext();

export const useCarrito = () => useContext(CarritoContext);

export const CarritoProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedShippingOption, setSelectedShippingOption] = useState(null);

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(storedCartItems);
    const storedShippingOption = localStorage.getItem('selectedShippingOption')|| 0;
    setSelectedShippingOption(storedShippingOption)

  }, [isOpen, setCartItems]);

  const agregarProducto = (producto) => {
    const updatedCartItems = [...cartItems, { ...producto, quantity: 1 }];
    setCartItems(updatedCartItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
  };

  const limpiarCarrito = () => {
    setCartItems([]);
    setSelectedShippingOption(null);
    localStorage.removeItem('cartItems'); 
  };

  const handleQuantityChange = (index, delta) => {
    const updatedCartItems = cartItems.map((item, i) => {
      if (i === index) {
        const newQuantity = item.quantity + delta;
        return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
      }
      return item;
    });

    setCartItems(updatedCartItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
  };

  const updateShippingOption = (option) => {
    setSelectedShippingOption(option);
    localStorage.setItem('selectedShippingOption', JSON.stringify(option));
  };

  const handleRemoveItem = (index) => {
    const updatedCartItems = [...cartItems];
    updatedCartItems.splice(index, 1);
    setCartItems(updatedCartItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
  };

  const calculateTotal = () => {
    const itemsTotal = cartItems.reduce((total, item, index) => total + item.price * item.quantity, 0);
    return itemsTotal + (selectedShippingOption || 0);
  }

  return (
    <CarritoContext.Provider
      value={{
        isOpen, setIsOpen,
        cartItems, setCartItems,
        selectedShippingOption, setSelectedShippingOption, updateShippingOption,
        agregarProducto,
        limpiarCarrito,
        handleQuantityChange,
        handleRemoveItem,
        calculateTotal,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};