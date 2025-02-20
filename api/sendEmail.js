const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método no permitido" });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.EMAIL_TO) {
        return res.status(500).json({ error: "Faltan credenciales en las variables de entorno." });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_TO,
            subject: "Nueva Encuesta de Graduados",
            text: `Datos del formulario:\n${JSON.stringify(req.body, null, 2)}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Correo enviado con éxito ✅" });
    } catch (error) {
        console.error("Error al enviar el correo:", error);
        res.status(500).json({ error: "Error al enviar el correo ❌" });
    }
};
