import { pool } from "../db.js";

export const getShippingPrices = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT option_name, price FROM shipping_prices');
        const formattedShippingPrices = {};

        rows.forEach(({ option_name, price }) => {
            formattedShippingPrices[option_name] = parseFloat(price); 
        });

        res.json(formattedShippingPrices);
    } catch (error) {
        console.error('Error fetching shipping prices:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateShippingPricesInDB = async (newShippingPrices) => {
    try {
        for (const optionName in newShippingPrices) {
            const price = newShippingPrices[optionName];
            await pool.query('UPDATE shipping_prices SET price = ? WHERE option_name = ?', [price, optionName]);
        }
    } catch (error) {
        console.error('Error updating shipping prices in database:', error);
        throw error;
    }
};

export const updateShippingPrice = async (req, res) => {
    const newShippingPrices = req.body;
    
    try {
        await updateShippingPricesInDB(newShippingPrices);

        res.json({ message: 'Shipping prices updated successfully' });
    } catch (error) {
        console.error('Error updating shipping prices:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};