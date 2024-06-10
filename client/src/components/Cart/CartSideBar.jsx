import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import cart from "../../assets/cart.svg";
import quit from "../../assets/exit.svg";
import tacho from "../../assets/delete.svg";
import pagos from "../../assets/mediospagos.png";
import envios from "../../assets/mediosenvios.png";
import wspp from "../../assets/wspp.svg";
import ig from "../../assets/ig.svg";
import ShippingOptions from '../Cart/ShippingOptions/ShippingOptions'
import { AppContext } from '../../Context/AppContext';
import { useCarrito } from '../../Context/CartContext';


const CartSidebar = () => {

    const { btnnavLink } = useContext(AppContext);
    const { 
         isOpen, setIsOpen,
         cartItems, setCartItems,
         selectedShippingOption, updateShippingOption,
         handleQuantityChange,
         handleRemoveItem,
         calculateTotal } = useCarrito();


         const handleShippingChange = (option) => {
            updateShippingOption(option);
          };

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };


    const truncateDescription = (description) => {
        if (!description) return
        return description.length > 40 ? `${description.slice(0, 40)}...` : description;
    };

    return (
            <div className={`sidebar ${isOpen ? 'overlay' : "out"}`}>
            <button onClick={toggleSidebar} className="cart-button">
                <img src={cart} alt="carrito"></img>
            </button>

            <div className={`sidebar ${isOpen ? 'show' : ""}`}>

            <div className={`sidebar ${isOpen ? 'open' : ''}`}>

                <button onClick={toggleSidebar} className="close-button">
                    <img src={quit} alt="quit"></img>
                </button>

                <div className="cart-items">
                    {cartItems.map((item, index) => (
                        <div key={index} className="cart-item">
                            <img className="image-detail" src={item.image} alt={item.name} />
                            <div className="item-details">
                                <div className='item-name-row'>
                                    <p className="item-name">{item.name}</p>
                                    <p className="price">${item.price * item.quantity}</p>
                                </div>
                                <div className='item-descrip'>
                                    <p className='pdescrip'>{truncateDescription(item.descripcion)}</p>
                                </div>
                                <div className="btn-quantity-tacho">
                                    <div className="quantity-control">
                                        <button className="quantity-btn" onClick={() => handleQuantityChange(index, -1)}>-</button>
                                        <span className="quantity">{item.quantity}</span>
                                        <button className="quantity-btn-mas" onClick={() => handleQuantityChange(index, 1)}>+</button>
                                    </div>
                                    <button className="delete-btn" onClick={() => handleRemoveItem(index)}>
                                        <img src={tacho} alt="tacho" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
                <div className='div-envio'>

                    <ShippingOptions onShippingChange={handleShippingChange} />
                </div>

                {cartItems.map((item, index) => (
                    <div className="total-box-item" key={index}>
                        <h2>Producto: {item.name}</h2>
                        <h2><em><h5>{item.quantity}x&nbsp;</h5></em>${(item.price * item.quantity)}</h2>
                    </div>
                ))}


                <div className='total-box-item'>
                    <h2>Envío:</h2>
                    <h2>${selectedShippingOption}</h2>
                </div>

                <div className="total-box">
                    <h2>Total:</h2>
                    <h2>${calculateTotal()}</h2>
                </div>

                <div className="embox">
                    <em>Podrás abonar en cuotas a través de Mercado Pago. Inicia la compra y entérate de las diversas opciones!</em>
                </div>
                <hr></hr>
                <div className='contactobox'>
                    <p className='pinfomedios'>
                        Si necesitas aclarar tus dudas, no dudes más y háblanos haciendo click!
                    </p>
                </div>
                <div className='contactobox'>
                    <img src={wspp} className='embox' alt="WhatsApp"></img>
                    <a href={btnnavLink} target="_blank" rel="noopener noreferrer" className='cart-link'>
                        <h3>Chat de Whatsapp</h3>
                    </a>
                </div>
                <div className='contactobox'>
                    <img src={ig} alt="ig" className='embox' />
                    <a href="https://www.instagram.com/disturbiaarg" target="_blank" rel="noopener noreferrer" className='cart-link'>
                        <h3>Disturbiaarg</h3>
                    </a>
                </div>
                <div className='medios-box'>
                    <img className='mediosimg' src={pagos} alt="Pagos"></img>
                    <img className='mediosimg' src={envios} alt="Envíos"></img>
                </div>
                {selectedShippingOption ?
                    <div className='pay-btn'>
                        <Link to="/compra" className="sub-navbar-link">
                            <button onClick={() => setIsOpen(!isOpen)} className="checkout-button">Iniciar compra</button>
                        </Link>
                    </div> : null
                }

            </div>
            </div>
        </div>
    );
};

export default CartSidebar;