// FormularioCompra.js
import React, { useState } from 'react';
import './formularioCompra.css'


const FormularioCompra = ({ onFinalizarCompra }) => {
  const [datosCompra, setDatosCompra] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    email: '',
    codigoPostal: '',
    cel: '',
    domicilio: '',
    datosAdicional: ''
  });

  const handleChange = (e) => {
    setDatosCompra({ ...datosCompra, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFinalizarCompra(datosCompra);
  };

  const [isLoading, setIsLoading] = useState(false); 


  const handleLoading = () => {
    setIsLoading(true); 
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  return (
    <div className="compra-container">
      <form className="compra-formContainer" onSubmit={handleSubmit}>
        <p className='p-formCompra'>Datos del Comprador</p>

        <div className='inputs-formCont'>
          <input className='input-formData' type="text" name="nombre" placeholder="Nombre" value={datosCompra.nombre} onChange={handleChange} required />
          <input className='input-formData' type="text" name="apellido" placeholder="Apellido" value={datosCompra.apellido} onChange={handleChange} required />
          <input className='input-formData' type="text" name="dni" placeholder="DNI" value={datosCompra.dni} onChange={handleChange} required />
          <input className='input-formData' type="email" name="email" placeholder="Email" value={datosCompra.email} onChange={handleChange} required />
        </div>

        <div className='inputs-formCont'>
          <input className='input-formData' type="text" name="codigoPostal" placeholder="Código Postal" value={datosCompra.codigoPostal} onChange={handleChange} required />
          <input className='input-formData' type="text" name="cel" placeholder="celular" value={datosCompra.cel} onChange={handleChange} required />
          <textarea className='input-formData-amp' type="text" name="domicilio" placeholder="Ingrese su domicilio y referencias sobre el lugar" value={datosCompra.domicilio} onChange={handleChange} required />
          <textarea className='input-formData-amp' type="text" name="datosAdicional" placeholder="Datos adicional del producto/s a comprar, (puede volver a clarar colores o dudas en este bloque)" value={datosCompra.datosAdicional} onChange={handleChange} required />
        </div>

        <button
          className={`btn-fomrCompra ${isLoading ? 'loading' : 'btn-fomrCompra'}`} 
          onClick={handleLoading} 
          type="submit"
        >
          {isLoading ? 'Cargando...' : 'Ir a Pagar'}
        </button> 

      </form>
    </div>
  );
};

export default FormularioCompra;