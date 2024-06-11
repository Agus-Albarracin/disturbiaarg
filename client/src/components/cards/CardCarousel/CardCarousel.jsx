import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import Cards from '../Cards';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './cardcarousel.css';
import CardModal from '../CardModal/CardModal';

const CardCarousel = () => {
    const [masVendidos, setMasVendidos] = useState([]);
    const [novedades, setNovedades] = useState([]);
    const [promociones, setPromociones] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        fetchFilteredData('masvendidos', setMasVendidos);
        fetchFilteredData('novedades', setNovedades);
        fetchFilteredData('promociones', setPromociones);
    }, []);

    const fetchFilteredData = async (filterType, setState) => {
        try {
            const response = await axios.get(`https://disturbiaarg.com/api/products?filterType=${filterType}`);
            const { data } = response;
            setState(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
    };

    const openModal = (item) => {
        setSelectedItem(item);
    };

    const closeModal = () => {
        setSelectedItem(null);
    };

    return (
        <>
            <div className="slider-cont">
                <div className="title-container">
                    <h1 className="title">♥ Lo más vendido</h1>
                </div>
                <div className="carousel-container">
                    <Slider {...settings}>
                        {masVendidos.map((item, index) => (
                            <div key={index} className="cards-container" onClick={() => openModal(item)}>
                                <Cards images={item.images} name={item.name} price={item.price} />
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
            <div className="slider-cont">
                <div className="title-container">
                    <h1 className="title">♥ Novedades</h1>
                </div>
                <div className="carousel-container">
                    <Slider {...settings}>
                        {novedades.map((item, index) => (
                            <div key={index} className="cards-container" onClick={() => openModal(item)}>
                                <Cards images={item.images} name={item.name} price={item.price} />
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
            <div className="slider-cont">
                <div className="title-container">
                    <h1 className="title">♥ Promociones</h1>
                </div>
                <div className="carousel-container">
                    <Slider {...settings}>
                        {promociones.map((item, index) => (
                            <div key={index} className="cards-container" onClick={() => openModal(item)}>
                                <Cards images={item.images} name={item.name} price={item.price} />
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>

            {selectedItem && (
                <CardModal
                    onClose={closeModal}
                    images={selectedItem.images}
                    name={selectedItem.name}
                    price={selectedItem.price}
                    descripcion={selectedItem.descripcion}
                    id={selectedItem.id}
                />
            )}
        </>
    );
};

export default CardCarousel;



