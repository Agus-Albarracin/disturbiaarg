import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TicketDetails.css'

const TicketDetails = () => {
    const { ticketId } = useParams();
    console.log(ticketId);

    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeSection, setActiveSection] = useState(() => {
        return localStorage.getItem('activeSection') || 'edit';
    });
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAdminPermission = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get('http://localhost:3000/api/admin', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setIsAdmin(true);
            } catch (error) {
                navigate("/");
            }
        };
        checkAdminPermission();
        const storedSection = localStorage.getItem('activeSection');
        setActiveSection(storedSection || 'edit');
    }, []);

    useEffect(() => {
        const fetchTicketDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/tickets/${ticketId}`);
                setTicket(response.data);
                setLoading(false);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching ticket details:', error);
                setError('Error fetching ticket details');
                setLoading(false);
            }
        };

        fetchTicketDetails();
    }, [ticketId]);

    if (loading) {
        return <p>Cargando...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!ticket) {
        return <p>No se encontraron detalles del ticket.</p>;
    }

    const cuentaMp = ticket.datos_cuenta_mp ? JSON.parse(ticket.datos_cuenta_mp) : {};
    const phoneMp = ticket.telefono_cuenta_mp ? JSON.parse(ticket.telefono_cuenta_mp) : {};

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        return date.toLocaleDateString('es-AR', options);
    };

    return (
        <div className="ticket-details">
            <h2>Detalles del Ticket #{ticket.ticket_id}</h2>
            <p>Monto Operación: {ticket.monto_operacion}</p>
            <p>Nombre: {ticket.nombre}</p>
            <p>Apellido: {ticket.apellido}</p>
            <p>Email: {ticket.email}</p>
            <p>Celular: {ticket.cel}</p>
            <p>DNI: {ticket.dni}</p>
            <p>Domicilio: {ticket.domicilio}</p>
            <p>Código Postal: {ticket.codigoPostal}</p>
            <p className='datoa'>Dato Adicional: {ticket.datosAdicional}</p>
            <p>Fecha de Creación: {formatDate(ticket.created_at)}</p>
            <p>Monto Neto Operación: {ticket.monto_neto_operacion}</p>
            <h3>Datos de la cuenta con la que abono</h3>
            <p>order id: {ticket.order_id}</p>
            <p>id del pago: {ticket.id_del_pago}</p>
            <p>Nombre titular: {ticket.first_name}</p>
            <p>Apellido titular: {ticket.last_name}</p>
            <p>Identificación: {cuentaMp.type || 'N/A'} - NUM: {cuentaMp.number || 'N/A'}</p>
            <p>email: {ticket.email_cuenta_mp}</p>
            <p>teléfono: {phoneMp.area_code || 'N/A'} - {phoneMp.extension || 'N/A'} - {phoneMp.number || 'N/A'}</p>

            <h3>Ítems del Ticket:</h3>
            <ul>
                {ticket.ticket_items.map((item) => (
                    <li key={item.item_id}>
                        <div className='ti-items-ti'>
                            <img src={item.image} width="100px" height="100px" alt={item.name} />
                            <div>
                                <p>{item.name} - ${item.price}</p>
                                <p>cantidad: {item.quantity}</p>
                                <p>total: {item.quantity * item.price}</p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            <p className='datoa'>Modo envio: {ticket.modoEnvio}</p>
            <p className='datoa'>Envio: ${ticket.totalEnvio}</p>
            <p className='datototal'>TOTAL ABONADO: ${ticket.monto_operacion}</p>
        </div>
    );
};

export default TicketDetails;
