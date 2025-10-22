const User = require("../models/Users");
const bcrypt = require("bcryptjs");

class UserService {
  /**
   * @private
   */

  static isStrongPassword(password) {
    if (password.length < 8) {
      return {
        valid: false,
        message: "A senha deve ter no mínimo 8 caracteres.",
      };
    }
    if (!/\d/.test(password)) {
      return {
        valid: false,
        message: "A senha deve conter pelo menos um número.",
      };
    }
    if (!/[a-z]/.test(password)) {
      return {
        valid: false,
        message: "A senha deve conter pelo menos uma letra minúscula.",
      };
    }
    if (!/[A-Z]/.test(password)) {
      return {
        valid: false,
        message: "A senha deve conter pelo menos uma letra maiúscula.",
      };
    }
    return { valid: true, message: "Senha forte." };
  }
  static async createUser({ name, email, password, role, course_id }) {
    const existingUser = await User.findOne({ where: { email } });
    const name_regex = /^[A-Za-z\u00C0-\u017F\s]+$/;
    if (name === undefined || name.length < 3) {
      throw new Error(`Name must be provided and have at least 3 characters`);
    }
    if (!name_regex.test(name)) {
      throw new Error(
        "Name contains invalid characters. Only letters, accented letters, and spaces are allowed."
      );
    }
    if (existingUser) {
      throw new Error("Email already in use");
    }
    if (!password) {
      throw new Error("Password must be provided");
    }
    if (email === undefined || !email.includes("@")) {
      throw new Error("A valid email must be provided");
    }
    const passwordValidation = this.isStrongPassword(password);
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.message);
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = User.create({
      name,
      email,
      password: passwordHash,
      role: role || "user",
      course_id,
    });
    const createdUser = await User.findOne({ where: { email }, attributes: { exclude: ['password'] } });
    if (!createdUser) {
      throw new Error("Error creating user");
    }
    const userObject = createdUser.get({ plain: true });
    return userObject;
  }
  static async updateUser(userId, { name, email, password, role, course_id }) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) {
        throw new Error("Email already in use");
      }
    }
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (role !== undefined) user.role = role;
    if (course_id !== undefined) user.course_id = course_id;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    await user.save();
    return {
      name: user.name,
      email: user.email,
      role: user.role,
      course_id: user.course_id,
    };
  }
  static async getUserById(userId) {
    if (!userId) {
      throw new Error("Invalid user ID");
    }
    const user = await User.findByPk(userId, {
      attributes: ["id", "name", "email", "role", "course_id"],
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
}

module.exports = UserService;
