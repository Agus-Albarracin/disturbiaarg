import React, { useState, useEffect, useContext } from 'react';
import './ShippingOptions.css';
import { AppContext } from '../../../Context/AppContext'; 
const ShippingOptions = ({ onShippingChange }) => {
    const { shippingPrices, setModoEnvio } = useContext(AppContext); 

    const [selectedOption, setSelectedOption] = useState(() => {
        return localStorage.getItem("selectedShippingOption") || 0;
    });

    useEffect(() => {
        if (selectedOption) {
            const price = shippingPrices[selectedOption];
            onShippingChange(price);
            localStorage.setItem("selectedShippingOption", selectedOption);
            localStorage.setItem("selectedShippingPrice", price);
        } else {
            onShippingChange(0);
        }
    }, [selectedOption, onShippingChange, shippingPrices]);

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
        setModoEnvio(event.target.value)
    };

    return (
        <div className="shipping-options">
            <h3>Opciones de Envío:</h3>
            {Object.entries(shippingPrices).map(([option, price]) => (
                <label key={option}>
                    <input
                        type="radio"
                        value={option}
                        checked={selectedOption === option}
                        onChange={handleOptionChange}
                    />
                        {option} - <h4> ${price}</h4>
                </label>
            ))}
        </div>
    );
};

export default ShippingOptions;