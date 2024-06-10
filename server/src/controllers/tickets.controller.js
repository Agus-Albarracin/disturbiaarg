import { pool } from "../db.js";

export const getTickets = async (req, res) => {
    try {
        const currentPage = req.query.page ? parseInt(req.query.page) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : 3;
        const offset = (currentPage - 1) * limit;
        const filter = req.query.filter ? req.query.filter : 'none';
        const search = req.query.search ? req.query.search.trim() : '';
        const searchDate = req.query.date ? req.query.date.trim() : '';

        const connection = await pool.getConnection();

        const [totalRows] = await connection.query(`
            SELECT COUNT(*) as total 
            FROM ticket 
            WHERE status = ? 
            AND (nombre LIKE ? OR apellido LIKE ? OR email LIKE ? OR dni LIKE ? OR cel LIKE ?)
            AND (DATE(created_at) = ? OR '' = ?)
        `, ['approved', `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, searchDate, searchDate]);

        const totalTickets = totalRows[0].total;
        const totalPages = Math.ceil(totalTickets / limit);

        let orderClause = 'ORDER BY t.ticket_id DESC'; // Orden por defecto
        if (filter === 'asc') {
            orderClause = 'ORDER BY t.monto_operacion ASC';
        } else if (filter === 'desc') {
            orderClause = 'ORDER BY t.monto_operacion DESC';
        }

        // Consulta para obtener los tickets paginados y ordenados
        const [rows] = await connection.query(`
            SELECT t.*, 
                   GROUP_CONCAT(JSON_OBJECT('item_id', ti.item_id, 
                                            'ticket_id', ti.ticket_id,
                                            'collector_id', ti.collector_id,
                                            'name', ti.name,
                                            'price', ti.price,
                                            'image', ti.image,
                                            'descripcion', ti.descripcion,
                                            'quantity', ti.quantity
                                          )) AS ticket_items
            FROM ticket t
            LEFT JOIN ticket_items ti ON t.ticket_id = ti.ticket_id
            WHERE t.status = 'approved' 
            AND (t.nombre LIKE ? OR t.apellido LIKE ? OR t.email LIKE ? OR t.dni LIKE ? OR t.cel LIKE ?)
            AND (DATE(t.created_at) = ? OR '' = ?)
            GROUP BY t.ticket_id
            ${orderClause}
            LIMIT ?, ?
        `, [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, searchDate, searchDate, offset, limit]);

        connection.release(); 

        // Procesa los resultados para convertir la columna ticket_items en un array de objetos
        const tickets = rows.map(row => ({
            ...row,
            ticket_items: row.ticket_items ? JSON.parse(`[${row.ticket_items}]`) : [] // Parsea la cadena JSON de ticket_items en un array de objetos
        }));

        res.status(200).json({ tickets, totalPages }); // Devuelve los tickets encontrados junto con el total de páginas
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ error: 'Error fetching tickets' });
    }
};

export const getTicketsSummary = async (req, res) => {
    try {
        const currentDate = new Date();
        const past30DaysDate = new Date();
        past30DaysDate.setDate(currentDate.getDate() - 30);

        const connection = await pool.getConnection();

        // Total de tickets
        const [totalTicketsResult] = await connection.query('SELECT COUNT(*) AS totalTickets FROM ticket WHERE status = ?', ['approved']);
        const totalTickets = totalTicketsResult[0].totalTickets;

        // Monto total
        const [totalAmountResult] = await connection.query('SELECT SUM(monto_operacion) AS totalAmount FROM ticket WHERE status = ?', ['approved']);
        const totalAmount = totalAmountResult[0].totalAmount || 0;

        // Monto neto total
        const [totalNetAmountResult] = await connection.query('SELECT SUM(monto_neto_operacion) AS totalNetAmount FROM ticket WHERE status = ?', ['approved']);
        const totalNetAmount = totalNetAmountResult[0].totalNetAmount || 0;

        // Total de tickets en los últimos 30 días
        const [last30DaysTicketsResult] = await connection.query('SELECT COUNT(*) AS last30DaysTickets FROM ticket WHERE created_at >= ? AND status = ?', [past30DaysDate, 'approved']);
        const last30DaysTickets = last30DaysTicketsResult[0].last30DaysTickets;

        // Monto total en los últimos 30 días
        const [last30DaysAmountResult] = await connection.query('SELECT SUM(monto_operacion) AS last30DaysAmount FROM ticket WHERE created_at >= ? AND status = ?', [past30DaysDate, 'approved']);
        const last30DaysAmount = last30DaysAmountResult[0].last30DaysAmount || 0;

        // Monto neto total en los últimos 30 días
        const [last30DaysNetAmountResult] = await connection.query('SELECT SUM(monto_neto_operacion) AS last30DaysNetAmount FROM ticket WHERE created_at >= ? AND status = ?', [past30DaysDate, 'approved']);
        const last30DaysNetAmount = last30DaysNetAmountResult[0].last30DaysNetAmount || 0;

        connection.release(); 

        const summary = {
            totalAmount,
            totalNetAmount,
            totalTickets,
            last30DaysAmount,
            last30DaysNetAmount,
            last30DaysTickets
        };

        res.json(summary);
    } catch (error) {
        console.error('Error fetching summary:', error);
        res.status(500).json({ error: 'Error fetching summary' });
    }
};

export const getTicketById = async (req, res) => {
    try {
        const {id} = req.params; 
        
        const connection = await pool.getConnection();
        
        const [rows] = await connection.query(`
            SELECT t.*, 
                   GROUP_CONCAT(JSON_OBJECT('item_id', ti.item_id, 
                                            'ticket_id', ti.ticket_id,
                                            'collector_id', ti.collector_id,
                                            'name', ti.name,
                                            'price', ti.price,
                                            'image', ti.image,
                                            'descripcion', ti.descripcion,
                                            'quantity', ti.quantity
                                          )) AS ticket_items
            FROM ticket t
            LEFT JOIN ticket_items ti ON t.ticket_id = ti.ticket_id
            WHERE t.ticket_id = ?
            GROUP BY t.ticket_id
        `, [id]);

        connection.release(); 
        
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        
        const ticket = {
            ...rows[0],
            ticket_items: rows[0].ticket_items ? JSON.parse(`[${rows[0].ticket_items}]`) : [] // Parsea la cadena JSON de ticket_items en un array de objetos
        };

        res.status(200).json(ticket);
    } catch (error) {
        console.error('Error fetching ticket details:', error);
        res.status(500).json({ error: 'Error fetching ticket details' });
    }
};

export const putTicketById = async (req, res) => {
    const { id } = req.params;
    const { estadoTicket } = req.body;

    try {
        const [result] = await pool.query('UPDATE ticket SET estadoTicket = ? WHERE ticket_id = ?', [estadoTicket, id]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Estado del ticket actualizado' });
        } else {
            res.status(404).json({ message: 'Ticket no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar el estado del ticket:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};