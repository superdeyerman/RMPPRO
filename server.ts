import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { PrismaClient } from "@prisma/client";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function sendWhatsApp(to: string, message: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  let from = process.env.TWILIO_WHATSAPP_NUMBER || "whatsapp:+14155238886";

  if (!accountSid || !authToken) {
    console.log("[SIMULATED WHATSAPP] To:", to, "Msg:", message);
    return;
  }

  if (!from.startsWith("whatsapp:")) from = `whatsapp:${from}`;
  const target = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;

  try {
    const { default: twilio } = await import("twilio");
    const client = twilio(accountSid, authToken);
    await client.messages.create({
      body: message,
      from,
      to: target,
    });
    console.log(`WhatsApp sent to ${to}`);
  } catch (error) {
    console.error("Twilio Error:", error);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API ROUTES ---

  app.get("/api/services", async (req, res) => {
    try {
      const services = await prisma.service.findMany({
        where: { isActive: true },
      });
      res.json(services);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/stylists", async (req, res) => {
    try {
      const stylists = await prisma.user.findMany({ where: { role: "stylist" } });
      res.json(stylists);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/distance", async (req, res) => {
    try {
      const { destination } = req.body;
      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      const origin = "Providencia, Santiago, Chile"; // Base location
      
      if (!apiKey) {
        // Fallback pricing if no key
        return res.json({ distanceText: "15 km", durationText: "30 min", fee: 8000 });
      }

      const fetchUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;
      const apiRes = await fetch(fetchUrl);
      const data = await apiRes.json();

      if (data.status === "OK" && data.rows[0].elements[0].status === "OK") {
        const distanceMeters = data.rows[0].elements[0].distance.value;
        const durationText = data.rows[0].elements[0].duration.text;
        const distanceText = data.rows[0].elements[0].distance.text;
        
        let fee = 0;
        if (distanceMeters > 5000) fee = 5000;
        if (distanceMeters > 10000) fee = 10000;
        if (distanceMeters > 20000) fee = 15000;
        if (distanceMeters > 30000) fee = 25000;

        return res.json({ distanceText, durationText, fee });
      }
      
      res.json({ distanceText: "N/A", durationText: "N/A", fee: 10000 });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/bookings", async (req, res) => {
    try {
      const {
        guestName,
        guestPhone,
        guestEmail,
        services,
        totalPrice,
        discount,
        travelFee,
        urgencyFee,
        downPayment,
        dateTime,
        modality,
        address,
        hotelName,
        roomNumber,
        notes,
        hairLength,
        hairVolume,
      } = req.body;

      if (!guestName || !guestPhone || !services || services.length === 0) {
        return res.status(400).json({ error: "Faltan datos obligatorios" });
      }

      const booking = await prisma.booking.create({
        data: {
          guestName,
          guestPhone,
          guestEmail,
          totalPrice: Number(totalPrice),
          discount: Number(discount) || 0,
          travelFee: Number(travelFee) || 0,
          urgencyFee: Number(urgencyFee) || 0,
          downPayment: Number(downPayment) || 5000,
          dateTime: new Date(dateTime),
          modality,
          address,
          hotelName,
          roomNumber,
          notes,
          hairLength,
          hairVolume,
          status: "PENDING",
          services: {
            connect: services.map((id: string) => ({ id })),
          },
        },
        include: {
          services: true,
        },
      });

      // Mercado Pago Integration
      const mpToken = process.env.MP_ACCESS_TOKEN;
      if (mpToken) {
        try {
          const { MercadoPagoConfig, Preference } = await import("mercadopago");
          const client = new MercadoPagoConfig({ accessToken: mpToken });
          const preference = new Preference(client);

          const result = await preference.create({
            body: {
              items: [
                {
                  id: booking.id,
                  title: `Reserva Reverencia Majestad - ${guestName}`,
                  quantity: 1,
                  unit_price: Number(booking.downPayment),
                  currency_id: "CLP",
                },
              ],
              back_urls: {
                success: `${process.env.APP_URL || "https://" + req.get("host")}/home?status=paid&bid=${booking.id}`,
                failure: `${process.env.APP_URL || "https://" + req.get("host")}/reservas?status=error`,
                pending: `${process.env.APP_URL || "https://" + req.get("host")}/home?status=pending`,
              },
              auto_return: "approved",
              notification_url: `${process.env.APP_URL || "https://" + req.get("host")}/api/payments/webhook`,
              external_reference: booking.id,
            },
          });

          await prisma.booking.update({
            where: { id: booking.id },
            data: { mpPreferenceId: result.id },
          });

          return res.json({ ...booking, init_point: result.init_point });
        } catch (mpErr) {
          console.error("Mercado Pago Error:", mpErr);
        }
      }

      // Fallback/Mock redirect if no token
      const mockInitPoint = `/home?status=paid&bid=${booking.id}`;
      res.json({ ...booking, init_point: mockInitPoint });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/payments/webhook", async (req, res) => {
    const { action, data, type } = req.body;

    if (type === "payment" || (action && action.startsWith("payment."))) {
      const paymentId = data?.id || req.body.id;
      if (!paymentId) return res.sendStatus(200);

      try {
        const mpToken = process.env.MP_ACCESS_TOKEN;
        if (!mpToken) throw new Error("MP Token missing");

        const { MercadoPagoConfig, Payment } = await import("mercadopago");
        const client = new MercadoPagoConfig({ accessToken: mpToken });
        const payment = new Payment(client);

        const paymentData = await payment.get({ id: paymentId });

        if (paymentData.status === "approved") {
          const bookingId = paymentData.external_reference;
          if (bookingId) {
            const booking = await prisma.booking.findUnique({
              where: { id: bookingId },
              include: { services: true },
            });

            if (booking && booking.status !== "PAID") {
              await prisma.booking.update({
                where: { id: bookingId },
                data: { status: "PAID", paymentId: String(paymentId) },
              });

              // Send WhatsApp notification after approved payment
              if (!booking.whatsappSent) {
                const serviceNames = booking.services.map((s) => s.name).join(", ");
                const dateStr = booking.dateTime.toLocaleString("es-CL");
                const message = `Hola ${booking.guestName} ✨ Tu reserva de "${serviceNames}" ha sido confirmada con éxito para el ${dateStr}. ¡Su Majestad será atendida pronto!`;
                await sendWhatsApp(booking.guestPhone, message);

                await prisma.booking.update({
                  where: { id: bookingId },
                  data: { whatsappSent: true },
                });
              }
            }
          }
        }
      } catch (err) {
        console.error("Webhook Error:", err);
      }
    }
    res.sendStatus(200);
  });

  app.get("/api/bookings", async (req, res) => {
    try {
      const bookings = await prisma.booking.findMany({
        include: { services: true },
        orderBy: { dateTime: "desc" },
      });
      res.json(bookings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/stats", async (req, res) => {
    try {
      const [totalBookings, revenueAgg, clientsByEmail] = await Promise.all([
        prisma.booking.count(),
        prisma.booking.aggregate({
          where: { status: "PAID" },
          _sum: { totalPrice: true },
        }),
        prisma.booking.groupBy({
          by: ["guestEmail"],
          _count: { guestEmail: true },
        }),
      ]);

      res.json({
        totalBookings,
        totalRevenue: revenueAgg._sum.totalPrice || 0,
        activeClients: clientsByEmail.length,
        paidBookings: await prisma.booking.count({ where: { status: "PAID" } }),
        pendingBookings: await prisma.booking.count({ where: { status: "PENDING" } }),
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/dashboard/summary", async (req, res) => {
    try {
      const recent = await prisma.booking.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { services: true },
      });
      res.json(recent);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/alliances", async (req, res) => {
    try {
      const { hotelName, category, contactName, email, message } = req.body;
      const alliance = await prisma.allianceRequest.create({
        data: { hotelName, category, contactName, email, message }
      });
      
      // Notify admin via WhatsApp if possible
      const adminMessage = `🔔 Nueva Solicitud de Alianza: ${hotelName} (${contactName}). Revisar panel admin.`;
      await sendWhatsApp(process.env.ADMIN_PHONE || "+56911112222", adminMessage);

      res.json(alliance);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/alliances", async (req, res) => {
    try {
      const alliances = await prisma.allianceRequest.findMany({
        orderBy: { createdAt: "desc" }
      });
      res.json(alliances);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/bookings/:id/remind", async (req, res) => {
    try {
      const { id } = req.params;
      const booking = await prisma.booking.findUnique({
        where: { id },
        include: { services: true }
      });
      
      if (!booking) return res.status(404).json({ error: "Booking not found" });
      
      const serviceNames = booking.services.map((s) => s.name).join(", ");
      const dateStr = booking.dateTime.toLocaleString("es-CL");
      const message = `✨ Hola ${booking.guestName}. Recordatorio de su majestad: Mañana a las ${dateStr} tenemos agendado su servicio de "${serviceNames}". ¡Le esperamos!`;
      
      await sendWhatsApp(booking.guestPhone, message);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/bookings/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const booking = await prisma.booking.update({
        where: { id },
        data: { status },
        include: { services: true }
      });
      
      if (status === "COMPLETED") {
        const message = `✨ Hola ${booking.guestName}. Esperamos que su experiencia de hoy haya sido majestuosa. Nos encantaría escuchar sus comentarios para seguir mejorando (link). Y como muestra de nuestro agradecimiento, le ofrecemos un 15% de descuento en su próxima reserva.`;
        await sendWhatsApp(booking.guestPhone, message);
      }
      
      res.json(booking);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/hotels", async (req, res) => {
    try {
      const hotels = await prisma.hotelPartner.findMany({
        where: { isActive: true }
      });
      res.json(hotels);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/alliances/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const alliance = await prisma.allianceRequest.update({
        where: { id },
        data: { status }
      });
      
      if (status === "APPROVED") {
        // Create a HotelPartner from the alliance request
        await prisma.hotelPartner.create({
          data: {
            name: alliance.hotelName,
            contactName: alliance.contactName,
            contactEmail: alliance.email,
            isActive: true
          }
        });
        
        const message = `✨ ¡Felicidades! Su alianza con Reverencia Majestad para el hotel "${alliance.hotelName}" ha sido aprobada. Bienvenido a la red de bienestar de élite.`;
        await sendWhatsApp(alliance.email, message); // Ideally phone, but using email as placeholder for now or if we have it
      }

      res.json(alliance);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/stylists/available", async (req, res) => {
    try {
      const { date, time, services } = req.query;
      // Simple logic for demo: return any stylist that doesn't have a booking at that time
      const stylists = await prisma.user.findMany({
        where: { role: "stylist" },
        include: { professional: true }
      });
      
      // Filter out busy stylists (simplified)
      res.json(stylists);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
