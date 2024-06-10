import express from "express";
import morgan from "morgan";
import cookieParser from 'cookie-parser';

import productsRoutes from "./routes/products.routes.js";
import navCarouselRoutes from "./routes/navcarousel.routes.js"
import footerRoutes from "./routes/footer.routes.js"
import btnnavRoutes from "./routes/btnnav.routes.js"
import shippingpricesRoutes from "./routes/sidebar.routes.js"
import usuarioRoutes from "./routes/usuario.routes.js"
import adminRoutes from "./routes/admin.routes.js"
import payRoutes from "./routes/paymethod.routes.js"
import ticketsRoutes from "./routes/tickets.routes.js"

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://http2.mlstatic.com https://*.mercadopago.com https://*.mercadopago.com.ar; " +
    "style-src 'self' 'unsafe-inline' https://http2.mlstatic.com https://*.mercadopago.com https://*.mercadopago.com.ar; " +
    "img-src 'self' data: https://http2.mlstatic.com https://*.mercadopago.com https://*.mercadopago.com.ar; " +
    "connect-src 'self' https://http2.mlstatic.com https://*.mercadopago.com https://*.mercadopago.com.ar; " +
    "frame-src 'self' https://*.mercadopago.com https://*.mercadopago.com.ar; " +
    "object-src 'none';"
  );
  next();
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Routes
app.use("/api", productsRoutes);
app.use("/api", navCarouselRoutes);
app.use("/api", footerRoutes);
app.use("/api", btnnavRoutes);
app.use("/api", shippingpricesRoutes);
app.use("/log", usuarioRoutes);
app.use("/api", adminRoutes);
app.use("/api", payRoutes);
app.use("/api", ticketsRoutes);
app.use((req, res, next) => {
  res.status(404).json({ message: "Not found" });
});

export default app;
