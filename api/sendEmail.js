const nodemailer = require("nodemailer");

module.exports = async function (req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método no permitido" });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.EMAIL_TO) {
        return res.status(500).json({ error: "Faltan credenciales en las variables de entorno." });
    }

    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `"Encuesta UG" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_TO,
            subject: "Nueva Encuesta de Graduados",
            text: JSON.stringify(req.body, null, 2),
        });

        res.status(200).json({ message: "Correo enviado con éxito ✅" });
    } catch (error) {
        console.error("Error al enviar el correo:", error);
        res.status(500).json({ error: "Error al enviar el correo ❌" });
    }
};
