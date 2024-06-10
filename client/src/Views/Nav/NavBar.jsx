import React, { useState, useContext } from 'react';
import './Navbar.css';
import chat from "../../assets/chat.svg";
import xbutton from "../../assets/xbuttonmodal.svg";
import wspp from "../../assets/wspp.svg";
import { AppContext } from '../../Context/AppContext';
// Views
import CartSidebar from '../../components/Cart/CartSideBar.jsx';

const Navbar = () => {
    const { btnnavLink } = useContext(AppContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const handleChatClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const toggleCartSidebar = () => {
        setIsCartOpen(!isCartOpen);
    };

    return (
        <>
            {isModalOpen && (
                <Modal onClose={handleCloseModal} btnnavLink={btnnavLink} />
            )}
            
            <CartSidebar isOpen={isCartOpen} onClose={toggleCartSidebar} />
            <div className="menu">
                    <button className="help-btn" onClick={handleChatClick}><img src={chat} alt="Chat" /></button>
                </div>
        </>
    );
};

const Modal = ({ onClose, btnnavLink }) => {
    return (
        <div className="modal-nav-overlay">
            <div className="modal-nav">
                <div className="modal-nav-header">
                    <h2 className='help-h2'>¿Necesitas ayuda?</h2>
                    <button onClick={onClose} className="modal-nav-close-button"><img src={xbutton} alt="Cerrar" /></button>
                </div>
                <div className="modal-nav-content">
                    <p>Comunicate con nosotros:</p>
                    <div className='div-icon-link'>

                    <a href={btnnavLink} target="_blank" rel="noopener noreferrer" className='modal-help-link'>
                        <img src={wspp} width="50px" alt="WhatsApp" /><br />
                        <p className='modal-help-link-p'>Hacé click acá para ir a WhatsApp</p>
                    </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;