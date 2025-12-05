const LoginService = require("../services/LoginService");
const UserService = require("../services/UserService");

class LoginController {
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const loginService = new LoginService();
      const auth = await loginService.login({ email, password });
      res.status(200).json(auth);
    } catch (error) {
      res.status(400).json({ message: "Login ou senha incorretos" });
    }
  }
  static async forgotPassword(req, res) {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "O e-mail é obrigatório." });
    }
    try {
      const result = await UserService.forgotPassword(email);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Erro no Forgot Password:", error.message);
      return res.status(500).json({ error: "Erro ao processar a solicitação." });
    }
  }
  static async resetPassword(req, res) {
    const { token, newPassword } = req.body;

    try {
      const result = await UserService.resetPassword(token, newPassword);
      return res.status(200).json(result);
    } catch (error) {
      const [statusCode, message] = error.message.includes(":")
        ? error.message.split(":")
        : ["500", error.message];

      return res
        .status(parseInt(statusCode) || 500)
        .json({ error: message.trim() });
    }
  }
}

module.exports = LoginController;
