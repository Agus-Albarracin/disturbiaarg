import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './AdminTickets.css';

const AdminTickets = () => {
    const [filter, setFilter] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchDate, setSearchDate] = useState('');
    const [tickets, setTickets] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const ticketsPerPage = 10;
    const [summary, setSummary] = useState({
        totalAmount: 0,
        totalNetAmount: 0,
        totalTickets: 0,
        last30DaysAmount: 0,
        last30DaysNetAmount: 0,
        last30DaysTickets: 0
    });

    useEffect(() => {
        fetchTickets();
        fetchSummary();
    }, [currentPage, filter, searchQuery, searchDate]);

    const fetchTickets = async () => {
        try {
            console.log("Sending request to server...");
            const response = await axios.get(`https://disturbiaarg.com/api/tickets?page=${currentPage}&limit=${ticketsPerPage}&filter=${filter}&search=${searchQuery}&date=${searchDate}`);
            console.log("Response received:", response.data);
            setTickets(response.data.tickets);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching tickets:', error);
            if (error.response) {
                console.error('Server responded with:', error.response.data);
            }
        }
    };
    

    const fetchSummary = async () => {
        try {
            const response = await axios.get('https://disturbiaarg.com/api/tickets/summary');
            setSummary(response.data);
        } catch (error) {
            console.error('Error fetching summary:', error);
        }
    };

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleEstadoChange = async (ticketId, currentEstado) => {
        const newEstado = currentEstado === 'En espera' ? 'Chequeado' : 'En espera';

        try {
            await axios.put(`https://disturbiaarg.com/api/ticketstatus/${ticketId}`, { estadoTicket: newEstado });
            setTickets(tickets.map(ticket =>
                ticket.ticket_id === ticketId ? { ...ticket, estadoTicket: newEstado } : ticket
            ));
        } catch (error) {
            console.error('Error updating ticket status:', error);
        }
    };
    

    const handleFilterChange = (filterType) => {
        setFilter(filterType);
    }

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
        <div className="admin-panel">
            <div className="cards-container-ticket">
                <div className="card-ti ti">
                    <p className='ti-title'>Tickets Generados</p>
                    <p className='ti-sum'>Total: {summary.totalTickets}</p>
                    <p className='ti-sum'>Últimos 30 días: {summary.last30DaysTickets}</p>
                </div>
                <div className="card-ti mo">
                    <p className='ti-title'>Monto Generado</p>
                    <p className='ti-sum'>Total: ${summary.totalAmount}</p>
                    <p className='ti-sum'>Últimos 30 días: ${summary.last30DaysAmount}</p>
                </div>
                <div className="card-ti mone">
                    <p className='ti-title'>Monto Neto Generado</p>
                    <p className='ti-sum'>Total: ${summary.totalNetAmount}</p>
                    <p className='ti-sum'>Últimos 30 días: ${summary.last30DaysNetAmount}</p>
                </div>
            </div>
            <p className='ptitleti'>Administrar Tickets</p>
            <div className='kit-bars'>

                    <input
                    className='search-data'
                        type="text"
                        placeholder="Buscar por nombre, apellido, email, dni o teléfono"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                <div>
                <input
                    className='search-date'
                        type="date"
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                    />
                </div>

                <div className="filter-buttons">
                    <button onClick={() => handleFilterChange('asc')} className="filter-btn">Precio: Menor a Mayor</button>
                    <button onClick={() => handleFilterChange('desc')} className="filter-btn">Precio: Mayor a Menor</button>
                </div>
            </div>
            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Ticket ID</th>
                            <th>Estado del ticket</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Cel</th>
                            <th>Email</th>
                            <th>DNI</th>
                            <th>Código Postal</th>
                            <th>Domicilio</th>
                            <th>Dato Adicional</th>
                            <th>Fecha de Creación</th>
                            <th>Monto Operación</th>
                            <th>Monto Neto Operación</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets?.map(ticket => (
                            <React.Fragment key={ticket.ticket_id}>
                                <tr>
                                    <td>
                                        <Link to={`/ticket/${ticket.ticket_id}`} target={"_blank"} className="tilink">
                                            Ver ticket {ticket.ticket_id}
                                        </Link>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleEstadoChange(ticket.ticket_id, ticket.estadoTicket)}
                                            className={ticket.estadoTicket === 'En espera' ? 'button-en-espera' : 'button-chequeado'}
                                        >
                                            {ticket.estadoTicket}
                                        </button>
                                    </td>
                                    <td>{ticket.nombre}</td>
                                    <td>{ticket.apellido}</td>
                                    <td>{ticket.cel}</td>
                                    <td>{ticket.email}</td>
                                    <td>{ticket.dni}</td>
                                    <td>{ticket.codigoPostal}</td>
                                    <td>{ticket.domicilio}</td>
                                    <td className="ticket-item">{ticket.datosAdicional}</td>
                                    <td className="ticket-item">{formatDate(ticket.created_at)}</td>
                                    <td className="ticket-item">{ticket.monto_operacion}</td>
                                    <td className="ticket-item">{ticket.monto_neto_operacion}</td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="pagination">
                <button onClick={prevPage} disabled={currentPage === 1}>Anterior</button>
                <span>Página {currentPage} de {totalPages}</span>
                <button onClick={nextPage} disabled={currentPage === totalPages}>Siguiente</button>
            </div>
        </div>
    );
};

export default AdminTickets;



