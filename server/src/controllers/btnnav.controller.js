import { pool } from "../db.js";


export const getbtnnavInfo = async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM btnlink");
      res.json(rows[0]);
    } catch (error) {
      return res.status(500).json({ message: "Something goes wrong" });
    }
  };

export const updatebtnnavInfo = async (req, res) => {
    const { link } = req.body;
    try {
        const [result] = await pool.query('UPDATE btnlink SET link = ? WHERE id = 1', [link]);
        if (result.affectedRows > 0) {
            res.json({ message: "Button link updated successfully" });
        } else {
            res.status(404).json({ message: "Button link not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating button link", error });
    }
};