const LoginService = require('../services/LoginService');

class LoginController {
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const loginService = new LoginService();
            const auth = await loginService.login({ email, password });
            res.status(200).json(auth);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = LoginController;