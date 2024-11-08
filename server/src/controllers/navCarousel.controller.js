import { pool } from "../db.js";
import { v4 as uuidv4 } from 'uuid';

export const getNavCarousel = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT original FROM carousel_images");
        const carouselImages = rows.map(row => ({ original: row.original }));
        res.json(carouselImages);
    } catch (error) {
        console.error('Error fetching carousel images:', error);
        res.status(500).json({ error: "Error fetching carousel images" });
    }
};

export const postNavCarousel = async (req, res) => {
    try {
        const { original } = req.body;
        const img_key = uuidv4();  // Genera una clave única para la imagen
        const [result] = await pool.query("INSERT INTO carousel_images (original, img_key) VALUES (?, ?)", [original, img_key]);
        res.status(201).json({ id: result.insertId, original, img_key });
    } catch (error) {
        console.error('Error adding new carousel image:', error);
        res.status(500).json({ error: "Error adding new carousel image" });
    }
};

export const removeNavCarousel = async (req, res) => {
    try {
        const { img_key } = req.params;
        const [result] = await pool.query("DELETE FROM carousel_images WHERE img_key = ?", [img_key]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Image deleted successfully" });
        } else {
            res.status(404).json({ error: "Image not found" });
        }
    } catch (error) {
        console.error('Error deleting carousel image:', error);
        res.status(500).json({ error: "Error deleting carousel image" });
    }
};