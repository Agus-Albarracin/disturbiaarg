import React from 'react';
import './card.css';

const Card = ({ images, name, price, descripcion }) => {
    const image = images && images.length > 0 ? images[0] : null;

    return (
        <div className="card">
            <img src={image} alt={name} style={{ width: '1080px', height: '1920px' }}/>
            <div className="card-info">
                <h3>{name}</h3>
                <p>${price}</p>
                <p>{descripcion}</p>
            </div>
        </div>
    );
};

export default Card;