import React from 'react';
import "../../Cart/CartSidebar.css"
const Button = ({ onClick, children }) => {
    return (
        <button className="add-to-cart-button" onClick={onClick}>
            {children}
        </button>
    );
};

export default Button;