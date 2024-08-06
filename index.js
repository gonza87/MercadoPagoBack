import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MercadoPagoConfig, Preference } from 'mercadopago';

dotenv.config();
// Agrega credenciales
const client = new MercadoPagoConfig({ accessToken: process.env.ACCESS_TOKEN });

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Soy el server");
});

app.post("/create_preference", async (req, res) => {
    try {
        const { items } = req.body;  // Extrae los ítems del cuerpo de la solicitud
        console.log(items)
        const body = {
            items: items.map(item => ({
                title: item.title,
                quantity: Number(item.quantity),
                unit_price: Number(item.unit_price),
                currency_id: "UYU",
            })),
            back_urls: {
                success: "https://mercado-pago-front-lac.vercel.app/",
                failure: "https://mercado-pago-front-lac.vercel.app/",
                pending: "https://mercado-pago-front-lac.vercel.app/",
            },
            auto_return: "approved",
        };

        const preference = new Preference(client);
        const result = await preference.create({ body });
        res.json({
            id: result.id,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Error al crear la preferencia",
        });
    }
});

app.listen(port, () => {
    console.log(`El servidor esta corriendo en el puerto ${port}`);
});
