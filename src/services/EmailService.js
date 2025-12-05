const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 *
 * @param {string} userEmail
 * @param {string} otpCode
 */
async function sendPasswordResetEmail(userEmail, otpCode) {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${otpCode}`;
  const msg = {
    to: userEmail,
    from: process.env.SENDGRID_SENDER_EMAIL,
    subject: "Recuperação de Senha - Copyfan",
    html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; text-align: center;">
        <h2 style="color: #FF9C55;">Redefinição de Senha Solicitada</h2>
        <p>Você solicitou um código de redefinição para sua conta Copyfan.</p>
        
        <p style="font-size: 18px; font-weight: bold; margin: 30px 0;">
            Seu código de 6 dígitos é:
        </p>
        
        <div style="background-color: #5D82FB; color: white; padding: 20px; border-radius: 8px; font-size: 36px; font-weight: bold; display: inline-block;">
            ${otpCode} 
        </div>
        
        <p style="margin-top: 30px;">
            Insira este código no aplicativo para continuar.
        </p>
      </div>
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
