import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || '';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader)

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];
  console.log(token)

  try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded.email !== ADMIN_EMAIL) {
          return res.status(403).json({ message: 'Access denied: Unauthorized email' });
      }
      req.user = decoded;
      next();
  } catch (err) {
      res.status(401).json({ message: 'Token is not valid' });
  }
};