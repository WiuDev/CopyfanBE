const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
});

/**
 * 
 * @param {string} userEmail
 * @param {string} resetToken
 */
async function sendPasswordResetEmail(userEmail, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    try {
        await transporter.sendMail({
            to: userEmail,
            from: 'lighttechltda@gmail.com',
            subject: 'Recuperação de Senha - Copyfan',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2>Solicitação de Redefinição de Senha</h2>
                    <p>Você solicitou a redefinição de senha para sua conta Copyfan.</p>
                    <p>Clique no link abaixo para prosseguir com a redefinição:</p>
                    <p style="margin: 20px 0;">
                        <a href="${resetUrl}" style="background-color: #5D82FB; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                            Redefinir Senha
                        </a>
                    </p>
                    <p>O link expira em 1 hora.</p>
                    <p>Se você não solicitou isso, ignore este e-mail.</p>
                </div>
            `,
        });
    } catch (error) {
        console.error(`Falha ao enviar e-mail para ${userEmail}:`, error.message);
        throw new Error("Falha no serviço de envio de e-mail.");
    }
}

module.exports = { sendPasswordResetEmail };