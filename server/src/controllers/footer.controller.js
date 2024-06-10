import { pool } from "../db.js";

export const getFooterInfo = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM footer LIMIT 1");
        if (rows.length > 0) {
            const footerInfos = {
                address: rows[0].ubi,
                email: rows[0].email,
                phoneNumber: rows[0].wspp
            };
            res.json(footerInfos);
        } else {
            res.status(404).json({ message: "No footer information found" });
        }
    } catch (error) {
        console.error("Error retrieving footer information:", error);
        res.status(500).json({ message: "Error retrieving footer information", error });
    }
};

export const updateFooterInfo = async (req, res) => {
    const { address, email, phoneNumber } = req.body;
    if (!address || !email || !phoneNumber) {
        return res.status(400).json({ message: "Address, email, and phone number are required" });
    }

    try {
        const [result] = await pool.query("UPDATE footer SET ubi = ?, email = ?, wspp = ? WHERE id = 1", [address, email, phoneNumber]);
        if (result.affectedRows > 0) {
            res.json({ message: "Footer information updated successfully" });
        } else {
            res.status(404).json({ message: "No footer information found to update" });
        }
    } catch (error) {
        console.error("Error updating footer information:", error);
        res.status(500).json({ message: "Error updating footer information", error });
    }
};