    import React, { useState } from 'react';
    import xbutton from '../../../assets/xbuttonmodal.svg';
    import truck from "../../../assets/truck.svg";
    import wspp from "../../../assets/wspp.svg";
    import ig from "../../../assets/ig.svg";
    import ButtonCart from '../buttonModal/buttonCart';
    import { Toaster, toast } from 'sonner';
    import { BsFillCartCheckFill } from "react-icons/bs";
    import "./cardModal.css"

    const CardModal = ({ onClose, images, name, price, id, descripcion }) => {
        const [selectedImage, setSelectedImage] = useState(images[0]);

        const handleImageClick = (newImage) => {
            setSelectedImage(newImage);
        };
        console.log(selectedImage )
        const handleAddToCart = () => {
            const product = { id, name, price, image: selectedImage, descripcion, quantity: 1}; 
            console.log("is producto inside",product)
            let cartItems = JSON.parse(localStorage.getItem('cartItems')) || []; 
            cartItems.push(product); 
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            toast('Listo!', {
                className: 'my-classname',
                description: `Se ha añadido ${product.name} al carrito`,
                duration: 2000,
                icon:<BsFillCartCheckFill style={{fontSize: 20}}/>
             })
        };

        const smallImages = images.slice(0, 5);

        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <button onClick={onClose} className="modal-close-button">
                        <img src={xbutton} alt="Cerrar" />
                    </button>
                    <div className="modal-body">
                        <div className="modal-images">
                            <div className="small-images">
                                {smallImages.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`small-${index}`}
                                        onClick={() => handleImageClick(img)}
                                        className="small-image"
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="image-selected">
                            <img src={selectedImage} alt="selected" className="large-image" />
                        </div>
                        <div className="modal-details">
                            <p className='modal-name-price'>{name}</p>
                            <p>{descripcion}</p>
                            <div className='block-info-modal'>
                                <div className='divs-block-info-modal'>
                                    <img src={truck} alt="envio" /><span><h3>Envíos en Rosario!</h3></span>
                                </div>
                                <div className='divs-block-info-modal'>
                                    <img src={wspp} alt="wspp" /><span>
                                        <a href="https://wa.me/543416661590" target="_blank" className='modal-link-details'>
                                            <h3>+54 34 1666-1590</h3></a>
                                    </span>
                                </div>
                                <div className='divs-block-info-modal'>
                                    <img src={ig} alt="ig" /><span>
                                        <a href="https://www.instagram.com/disturbiaarg" target="_blank" className='modal-link-details'>
                                            <h3>Disturbiaarg</h3></a>
                                    </span>
                                </div>
                            </div>

                            <p className='modal-name-price'>$ {price}</p>
                            <p style={{color:"black"}}><em>SELECCIONE el modelo que desea comprar</em></p>
                            <ButtonCart onClick={handleAddToCart}>Añadir al carrito</ButtonCart>
                        </div>
                    </div>
                </div>
                <Toaster />
            </div>
        );
    };

    export default CardModal;