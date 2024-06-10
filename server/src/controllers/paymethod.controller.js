import { pool } from "../db.js";
import nodemailer from "nodemailer";
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago'
import dotenv from 'dotenv';
dotenv.config();
const MPTOKEN = process.env.MERCADOPAGO_TOKEN || "";
const ADgmail = process.env.ADMIN_GMAIL || "";
const ADpass = process.env.ADMIN_PASS || "";

const client = new MercadoPagoConfig({ accessToken: MPTOKEN });
const payment = new Payment(client)

async function saveOrderToDatabase(items, data, envio, modoEnvio, total, status, collector_id) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Insertar el ticket en la tabla `ticket`
    const [result] = await connection.query(
      `INSERT INTO ticket (collector_id, nombre, apellido, dni, email, codigoPostal, cel, domicilio, datosAdicional, totalEnvio, modoEnvio, total, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [collector_id, data.nombre, data.apellido, data.dni, data.email, data.codigoPostal, data.cel, data.domicilio, data.datosAdicional, envio, modoEnvio, total, status]
    );

    const ticketId = result.insertId;

    // Insertar los items en la tabla `ticket_items`
    for (const item of items) {
      await connection.query(
        `INSERT INTO ticket_items (ticket_id, collector_id, name, price, image, descripcion, quantity)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [ticketId, collector_id, item.name, item.price, item.image, item.descripcion, item.quantity]
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    console.log("Error saving order to database:", error);
    throw error;
  } finally {
    connection.release();
  }
}

async function updateOrderStatus(email, status) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Obtener el último registro con el email dado
    const [row] = await connection.query(
      `SELECT ticket_id FROM ticket WHERE email = ? ORDER BY ticket_id DESC LIMIT 1`,
      [email]
    );

    if (row.length > 0) {
      const ticketId = row[0].ticket_id;

      // Actualizar el estado del último registro encontrado
      await connection.query(
        `UPDATE ticket SET status = ? WHERE ticket_id = ?`,
        [status, ticketId]
      );

      await connection.commit();
    } else {
      console.log("No order found for email:", email);
    }
  } catch (error) {
    await connection.rollback();
    console.log("Error updating order status:", error);
    throw error;
  } finally {
    connection.release();
  }
}

export const createOrder = async (req, res) => {
  const cart = req.body.cart
  const dataUser = req.body.data
  const envio = req.body.totalEnvio
  const modoEnvio = req.body.modoEnvio
  console.log("se muestra el modo de envio", modoEnvio)


  const totalEntero = cart.reduce((acc, item) => {
    const itemTotal = item.price * item.quantity;
    return acc + itemTotal;
  }, 0) + envio;

  // Convertir el total a un número entero
  const total = Math.floor(totalEntero);

  try {
    if (!req.body.cart || !Array.isArray(cart)) { throw new Error("Cart is not defined or not an array") }

    const items = cart.map((ele) => {
      return {
        title: ele.name,
        quantity: ele.price,
        unit_price: ele.quantity,
        currency_id: "ARS",
        description: ele.descripcion,
        picture_url: ele.image,
      };
    });

    // Agrego el precio del envío como un nuevo item
    const totalEnvio = envio;
    items.push({
      title: "envio",
      quantity: 1,
      unit_price: Number(totalEnvio),
      currency_id: "ARS",
      description: dataUser.email
    });

    const body = {
      items,
      back_urls: {
        success: "http://localhost:5173/compra",
        failure: "http://localhost:5173/compra",
        pending: "http://localhost:5173/compra",
      },

      notification_url: "https://6366-2800-af0-103c-5727-f149-7d26-5c5f-b0d1.ngrok-free.app/api/webhook",
      additional_info: dataUser,
    }
    const preference = new Preference(client);
    const result = await preference.create({ body });

    await saveOrderToDatabase(cart, dataUser, envio, modoEnvio, total, 'pending', result.collector_id);

    const contenidoCorreo = `
    GRACIAS POR SU COMPRA!\n
    SE HA CONFIRMADO \n
    Y LA ESTAMOS PROCESANDO.\n
    \n
    Detalles del ticket de compra:
    \n
    Productos: ${cart.map((produ) => produ.name + " cantidad:"+ produ.quantity)}
    Usuario: ${dataUser.nombre} ${dataUser.apellido}
    Celular: ${dataUser.cel}
    Email: ${dataUser.email}
    DNI: ${dataUser.dni}
    Domicilio: ${dataUser.domicilio}
    Código Postal: ${dataUser.codigoPostal}
    \n
    Disturbia.
  `;

enviarCorreo(dataUser.email, "Gracias por su compra!", contenidoCorreo);




    res.json({ id: result.id, point: result.init_point });


  } catch (error) {
    res.status(500).json({ error: "Error al crear la preferencia", error });
  }
}

export const receiveWebhook = async (req, res) => {
  const query = req.query;
  const body = req.body;

  console.log("SE MUESTRA REQ QUERT", req.query)
  try {

    if (query.type && query.type === 'payment') {
      const paymentData = await payment.get({ id: query["data.id"] });
      // console.log("Se muestra lo de payment", paymentData);

      if (paymentData.status === 'approved') {

        console.log("Order status updated to approved");
        // paymentData.additional_info.items.forEach(item => {
        //   console.log("Item:", JSON.stringify(item, null, 2));
        // });

        //byemail.description contiene el email del comprador
        const itemEnvio = paymentData.additional_info.items.find(item => item.title === "envio");
        if (itemEnvio) {
        let byemail = itemEnvio.description
        console.log(itemEnvio.description)
        await updateOrderStatus(itemEnvio.description, 'approved');
        await updatePaymentDataInOrder(byemail, paymentData);

        await enviarCorreo(itemEnvio.description, "Gracias por su compra!", contenidoCorreo);
        
      } else {
        console.log("No se encontró el ítem de envío en los detalles de pago.");
      }

        // console.log(paymentData)
        // console.log("id del pago", paymentData.id)
        // console.log("order_id del pago", paymentData.order["id"])
        // console.log("Datos de la cuenta cliente DNI: ", "TYPE: " + paymentData.payer.identification['type'] + "     NUMBER :" + paymentData.payer.identification['number']  )
        // console.log("Numero de telefo", paymentData.payer.phone["number"])
        // console.log("email de la cuenta del pago", paymentData.payer.email)
        // console.log("Detalles de la transaction, monto: ", paymentData.transaction_details.total_paid_amount + "Monto neto recibido :" + paymentData.transaction_details.net_received_amount)


      }
    }

    res.sendStatus(204);
  } catch (error) {
    // console.log("Error handling webhook", error);
    return res.status(500).json({ message: error.message });
  }
}

async function updatePaymentDataInOrder(email, paymentData) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Obtener el último registro con el email dado
    const [row] = await connection.query(
      `SELECT ticket_id FROM ticket WHERE email = ? ORDER BY ticket_id DESC LIMIT 1`,
      [email]
    );

    if (row.length > 0) {
      const ticketId = row[0].ticket_id;

      // Actualizar los datos adicionales relacionados con el pago en el pedido
      await connection.query(
        `UPDATE ticket 
         SET id_del_pago = ?, 
             order_id = ?, 
             datos_cuenta_mp = ?, 
             telefono_cuenta_mp = ?, 
             email_cuenta_mp = ?, 
             monto_operacion = ?, 
             monto_neto_operacion = ?, 
             first_name = ?, 
             last_name = ? 
         WHERE ticket_id = ?`,
        [
          paymentData.id, 
          paymentData.order.id, 
          JSON.stringify(paymentData.payer.identification), 
          JSON.stringify(paymentData.payer.phone), 
          paymentData.payer.email, 
          paymentData.transaction_details.total_paid_amount, 
          paymentData.transaction_details.net_received_amount, 
          paymentData.payer.first_name, 
          paymentData.payer.last_name, 
          ticketId
        ]
      );

      await connection.commit();
      console.log("Payment data updated for ticketId:", ticketId);
    } else {
      console.log("No order found for email:", email);
    }
  } catch (error) {
    await connection.rollback();
    console.log("Error updating payment data in order:", error);
    throw error;
  } finally {
    connection.release();
  }
}


//Configuración de admin / transporter
const transporter = nodemailer.createTransport({
  service: "Outlook",
  auth: {
    user: ADgmail,
    pass: ADpass,
  },
});
async function enviarCorreo(destinatario, asunto, mensaje) {
  // Opciones del correo electrónico
  const mailOptions = {
    from: "disturbiaarg@outlook.com",
    to: destinatario,
    subject: asunto,
    text: mensaje,
  };

  // Enviar el correo electrónico
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Error al enviar el correo electrónico:", error);
    } else {
      console.log("Correo electrónico enviado:", info.response);
    }
  });
}


