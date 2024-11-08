// Footer.js
import React, { useState, useEffect } from 'react';
import './footer.css';
import ubi from "../../assets/ubi.svg";
import wspp from "../../assets/wspp.svg";
import email from "../../assets/email.svg";
import axios from 'axios';

const Footer = () => {
    const [footerInfo, setFooterInfo] = useState(null);

    useEffect(() => {
        fetchFooterInfo();
    }, []);

    const fetchFooterInfo = async () => {
        try {
            const response = await axios.get('https://disturbiaarg.com/api/footer');
            setFooterInfo(response.data);
        } catch (error) {
            console.error('Error fetching footer info:', error);
        }
    };

    if (!footerInfo) {
        return <div>Loading...</div>;
    }

    return (
        <footer className="footer">
            <div className="footer-section">
                <h3>DiSTURBIA ♥</h3>
                <p className='name-icons'>
                    <img src={ubi} className='footer-icons' />
                    {footerInfo.address}
                </p>
                <p className='name-icons'>
                    <img src={email} className='footer-icons' />
                    {footerInfo.email}
                </p>
                <p className='name-icons'>
                    <img src={wspp} className='footer-icons' />
                    {footerInfo.phoneNumber}
                </p>
            <p><em>Desde 2024 Disturbia Ⓡ Todos los derechos reservados.</em></p>
            </div>
        </footer>
    );
};

export default Footer;