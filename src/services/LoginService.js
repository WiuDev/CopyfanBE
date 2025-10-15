const { compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const User = require("../models/Users");
const { JWT_SECRET } = process.env;

class LoginService {
  /**
   * @param {object} credentials
   */
  async login(credentials) {
    const { email, password } = credentials;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("Invalid email or password");
    }
    const isValid = await compare(password, user.password);
    if (!isValid) {
      throw new Error("Invalid email or password");
    }
    const token = sign(
      { name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );
    return { id: user.id, name: user.name, email: user.email, role: user.role, token};
  }
}

module.exports = LoginService;
