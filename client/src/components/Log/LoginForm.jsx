import React, { useEffect, useState } from 'react';
import {Link} from "react-router-dom"
import { GoogleLogin } from '@react-oauth/google';
import xpicker from 'google-cactus/cli'
import './loginForm.css'
import enter from "../../assets/admin.svg"
import enterhover from "../../assets/adminh.svg"

const GoogleLoginComponent = () => {
    const [isLogin, setIsLogin] = useState(false);
    const [token, setToken] = useState("");
    const [pic, setPic] = useState("");

    useEffect(() => {
        const getLocal = () => {
            // Recuperar la URL de la imagen y el estado de login del almacenamiento local
            const storedPic = localStorage.getItem('picture');
            const storedLogin = localStorage.getItem('logged') === 'true'; // Convertir a booleano
            const storedToken = localStorage.getItem('authToken');
            if (storedPic) {
                setPic(storedPic);
            }
            if (storedToken) {
                setToken(storedToken);
            }
            setIsLogin(storedLogin);
        };
        getLocal();
    }, []);

    const onSuccess = async (credentialResponse) => {
        const res = await xpicker("https://disturbiaarg.com/log/usuario", credentialResponse);

        if (res && res.user) {
            const picUrl = res.user.picture;
            const newToken = res.token;

            localStorage.setItem('authToken', newToken); // O usa document.cookie para guardar en una cookie
            localStorage.setItem('picture', picUrl);
            localStorage.setItem("logged", "true");


            setToken(newToken);
            setPic(picUrl);
            setIsLogin(true);
        } else {
            console.log("Hubo un error al cargar la imagen");
        }
    };

    const onError = () => {
        console.log('Login Failed');
    };

    const handleLogOut = () => {
        localStorage.setItem("logged", "false");
        localStorage.setItem("authToken", "");
        localStorage.setItem("picture", "");
        setIsLogin(false);
        setToken("");
        setPic("");
    };

    // Monitorear cambios en el estado para re-renderizar el componente
    useEffect(() => {
        if (isLogin && !pic) {
            setPic(localStorage.getItem('picture'));
        }
    }, [isLogin, pic]);

    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
      setIsHovered(true);
    };
  
    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    return (
        <>
            {isLogin ? (
                <div className='user-cont'>
                    <div className='user-cont-img'>
                        <img src={pic} className='user-img' onClick={handleLogOut} alt="user" />
                    </div>
                         
                    {token ? (
                        <Link to="/admin">
                            <div className='user-cont-img-admin'>
                                <img
        src={isHovered ? enterhover : enter}
        alt="admin"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
                            </div>
                        </Link>
                    ) : null}
                </div>
            ) : (
                <div className='google-cont'>
                    <GoogleLogin
                        onSuccess={onSuccess}
                        onError={onError}
                        useOneTap={true}
                        type='standard'
                        theme='filled_black'
                        size='medium'
                        text='continue_with'
                        shape='pill'
                        logo_alignment='left'
                        width='200px'
                        locale='es'
                        use_fedcm_for_prompt={true}
                    />
                </div>
            )}
        </>
    );
};

export default GoogleLoginComponent;