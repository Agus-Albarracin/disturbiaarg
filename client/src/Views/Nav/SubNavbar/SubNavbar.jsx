import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Subnavbar.css';
import xbuton from "../../../assets/xbuttonmodal.svg"
import logonavbar from "../../../assets/logonavbarblack.png";
import Log from "../../../components/Log/LoginForm"


const SubNavbar = () => {
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (modalName) => {
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
  };



  return (
    <div className='nav-cont-div'>
      <nav className="sub-navbar">

        <ul className="sub-navbar-list">
        <div className="logo">
        <Link to="/" className="sub-navbar-link">
            <img className="imglogo" src={logonavbar} alt="Logo" height="50px"/>
            </Link>
        </div>
          <li className="sub-navbar-item">
            <button className="sub-navbar-link">
              <Link to="/" className="sub-navbar-link">
              <h2>Inicio</h2>
            </Link>
            </button>
          </li>
          <li className="sub-navbar-item">
            <button className="sub-navbar-link">
              <Link to="/catalogo" className="sub-navbar-link">
              <h2>Catálogo</h2>
            </Link>
            </button>
          </li>
          <li className="sub-navbar-item">
            <button onClick={() => openModal('como-comprar')} className="sub-navbar-link"><h2>¿Cómo comprar?</h2></button>
          </li>
          <li className="sub-navbar-item">
            <button onClick={() => openModal('envios')} className="sub-navbar-link"><h2>Envíos</h2></button>
          </li>
          <li className="sub-navbar-item-google">
            <Log />
          </li>
        </ul>
      </nav>

      {activeModal === 'catalogo' && <Modal 
      onClose={closeModal} 
      title="Catálogo"
 />}

      {activeModal === 'novedades' && <Modal 
      onClose={closeModal} 
      title="Novedades" />}

      {activeModal === 'como-comprar' && <Modal 
      onClose={closeModal} 
      title="¿Cómo comprar?"
      info={(<div className="modalnavinfo">
<h2>💳</h2>
<p className='titlepmini'>ACEPTAMOS TODOS LOS MEDIOS DE PAGO:</p>
<h3>•Transferencias</h3>
<h3>•Depósitos </h3>
<h3>•Código QR </h3>
<h3>•Link de pago</h3>
<br />
<h2>💰</h2>
<p className='titlepmini'>Y TODAS LAS FORMAS DE PAGO:</p>
<h3>•Efectivo</h3>
<h3>•Débito</h3>
<h3>•Crédito</h3>
<br />
<br />
<h3>Gracias a mercado pago trabajamos con TODAS LAS TARJETAS 😁</h3>
<br />
<h3>No dudes en escribirnos y consultanos por tu forma y medio  de pago ❤</h3>

      </div>)}
      />}

      {activeModal === 'envios' && <Modal 
      onClose={closeModal} 
      title="Envíos"
      info={(
        <div className="modalnavinfo">
<p className='titlepmini'>⚠️</p><p className='titlepmini'> TE LO LLEVAMOS A DONDE ESTES</p>
<br />
<p className='titlepmini'>EN DISTURBIA ❤</p><h4> Nos encargamos de mostrarte lo que nos pidas, pautamos forma de pago y de envío; y solo te queda esperar que Disturbia llegue a tu puerta</h4>
<br />
<p className='titlepmini'>CADETE PROPIO ALREDEDOR 🛵</p><h4> Tenemos nuestro cadete propio, que se encarga de llevar tu pedido a donde estés: tu casa, a tu trabajo, al gim y casa de tus amigos</h4>
<br />
<p className='titlepmini'>CORREO ARGENTINO 🚚</p><h4> Y CORREO ARGENTINO se encarga de llevar tu pedido hasta la puerta de casa si no vivís en rosario</h4>
<br />
<br />

      </div>)}/>}
    </div>
  );
}

const Modal = ({ onClose, title, info }) => {
  return (
    <div className="modal-nav-overlay">
      <div className="modal-nav">
        <div className="modal-nav-header">
          <p className='titlep'>{title}</p>
          <button onClick={onClose} className="modal-nav-close-button"><img src={xbuton}></img></button>
        </div>
        <div className="modal-nav-content">
          <>{info}</>
        </div>
      </div>
    </div>
  );
};

export default SubNavbar;
