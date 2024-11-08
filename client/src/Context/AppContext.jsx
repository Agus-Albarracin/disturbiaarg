// src/AppContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {

    // NAVBAR
    const [btnnavLink, setBtnnavLink] = useState('');
    useEffect(() => {
        fetchBtnnavLink();
        fetchImages();
        fetchShippingPrices();
        fetchFooterInfo();
    }, []);

    const fetchBtnnavLink = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/btnnav');
            const { data } = response;
            setBtnnavLink(data.link)
        } catch (error) {
            console.error('Error fetching btnnav link:', error);
        }
    };

    const updateBtnnavLink = async (newLink) => {
        try {
            const response = await axios.post('http://localhost:3000/api/btnnav', { link: newLink });
            setBtnnavLink(newLink);
        } catch (error) {
            console.error('Error updating btnnav link:', error);
        }
    };

    // NAV BAR CAROUSEL

    const [carouselImages, setCarouselImages] = useState([]);

    const fetchImages = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/carousel');
            setCarouselImages(response.data);
        } catch (error) {   
            console.error('Error fetching carousel images:', error);
        }
    };


    const addImage = async (imageUrl) => {
        try {
            const response = await axios.post('http://localhost:3000/api/carousel', { original: imageUrl });
            setCarouselImages([...carouselImages, response.data]);
        } catch (error) {
            console.error('Error adding image:', error);
        }
    };

    const removeImage = async (img_key) => {
        try {
            await axios.delete(`http://localhost:3000/api/carousel/${img_key}`);
            const updatedImages = carouselImages.filter(image => image.img_key !== img_key);
            setCarouselImages(updatedImages);
        } catch (error) {
            console.error('Error removing image:', error);
        }
    };

    // SIDEBAR 

    const fetchShippingPrices = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/shipping');
            const { data } = response
            setShippingPrices(data);
        } catch (error) {
            console.error('Error fetching shipping prices:', error);
        }
    };

    const [shippingPrices, setShippingPrices] = useState({
        "Correo Argentino": 4200,
        "Correo Argentino Express": 8200,
        "Envío de la empresa": 5000,
    });
    const [modoEnvio, setModoEnvio] = useState("")

    const updateShippingPrices = async (newShippingPrices) => {
        try {
            await axios.post('http://localhost:3000/api/shipping', newShippingPrices);
            setShippingPrices(newShippingPrices);
        } catch (error) {
            console.error('Error updating shipping prices:', error);
        }
    };

    // FOOTER
    const [footerInfo, setFooterInfo] = useState({
        address: '',
        email: '',
        phoneNumber: ''
    });

    const fetchFooterInfo = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/footer');
            setFooterInfo(response.data);
        } catch (error) {
            console.error('Error fetching footer info:', error);
        }
    };

    const updateFooterInfo = async (newInfo) => {
        try {
            await axios.post('http://localhost:3000/api/footer', newInfo);
            setFooterInfo(newInfo); 

        } catch (error) {
            console.error('Error updating footer info:', error);
        }
    };

    const handleFooterChange = (e) => {
        const { name, value } = e.target;
        setFooterInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <AppContext.Provider value={{
            // BTN NAV BAR
            btnnavLink, updateBtnnavLink,
            // SIDE BAR
            shippingPrices, updateShippingPrices, setShippingPrices, modoEnvio, setModoEnvio,
            // IMAGE GALLERY
            carouselImages, addImage, removeImage,
            //FOOTER
            footerInfo, updateFooterInfo, handleFooterChange
        }}>
            {children}
        </AppContext.Provider>
    );
};
