import { pool } from "../db.js";
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const JWT_SECRET = process.env.JWT_SECRET || '';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";
const client = new OAuth2Client(CLIENT_ID);

export const logIn = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error('Token payload is undefined');
    }

    const { email, sub, name, picture, given_name } = payload;
    const [rows] = await pool.query('SELECT * FROM usuario WHERE email = ?', [email]);

    let user;
    if (rows.length === 0) {
      // Si el usuario no existe, crea uno nuevo
      await pool.query(
        'INSERT INTO usuario ( googleId, email, name_user, picture, given_name) VALUES (?, ?, ?, ?, ?)',
        [ sub, email, name, picture, given_name]
      );
      // Obtener el usuario recién creado
      const [newUserRows] = await pool.query('SELECT * FROM usuario WHERE email = ?', [email]);
      user = newUserRows[0];
    } else {
      // Si el usuario existe, usar el existente
      user = rows[0];
    }

    // Genera un token JWT
    if(user.email === ADMIN_EMAIL){
    
    const jwtToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    // Configura la cookie segura
    res.cookie('authToken', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000, // 1 hora
    });
    return res.status(200).json({message:'Sign-in successful, palermo de mitad', user, token: jwtToken })
} else {

    return res.status(200).json({ user, message: 'Sign-in successful', user});
}

  } catch (error) {
    console.error('\x1b[31m', '\n 🚨 The controller received an error in the parameters', error);
    res.status(500).json({ error: 'Internal server error when tried to search users' });
  }
};

export const logOut = async (req, res) => {
try{
    res.status(200).json({message: "Se cerro sesión exitosamente"})
}catch(error){
    res.status(500).json({message: 'Error al deslogear el servidor'})
}
}
