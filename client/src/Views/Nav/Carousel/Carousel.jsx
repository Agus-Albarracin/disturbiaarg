import React, { useContext } from 'react';
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import error from "../../../assets/error404.png";
import "./carousel.css";
import { AppContext } from '../../../Context/AppContext';

const Carousel = () => {
    const { carouselImages } = useContext(AppContext);

    return (
        <div className='gallery-cont'>
        <ImageGallery
            items={carouselImages}
            showPlayButton={false}
            showFullscreenButton={false}
            showBullets={true}
            autoPlay={true}
            slideInterval={4000}
            onErrorImageURL={error}
            />
        </div>
    );
};

export default Carousel;
