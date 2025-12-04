const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * 
 * @param {string} userEmail
 * @param {string} resetToken
 */
async function sendPasswordResetEmail(userEmail, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const msg = {
        to: userEmail,
        from: process.env.SENDGRID_SENDER_EMAIL,
        subject: 'Recuperação de Senha - Copyfan',
        html: `<p>Clique no link abaixo para prosseguir: <a href="${resetUrl}">Redefinir Senha</a></p>`,
    };

    try {
        await sgMail.send(msg); 
    } catch (error) {
        console.error('Falha no SendGrid:', error.response.body);
        throw new Error("Falha no serviço de envio de e-mail.");
    }
}
module.exports = { sendPasswordResetEmail };
    