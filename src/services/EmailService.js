const sgMail = require("@sendgrid/mail");
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
    subject: "Recuperação de Senha - Copyfan",
    html: `
    <p>Olá,</p>
    <p>Clique no botão abaixo para redefinir sua senha:</p>
    <a href="${resetUrl}" style="
      background-color: #007bff; 
      color: white; 
      padding: 10px 20px; 
      text-align: center; 
      text-decoration: none; 
      display: inline-block; 
      border-radius: 5px;
      font-weight: bold;
    ">
      Redefinir Senha
    </a>
    <p>Se o botão não funcionar, copie e cole este link no seu navegador:</p>
    <p>${resetUrl}</p>
  `,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error("Falha no SendGrid:", error.response.body);
    throw new Error("Falha no serviço de envio de e-mail.");
  }
}
module.exports = { sendPasswordResetEmail };
