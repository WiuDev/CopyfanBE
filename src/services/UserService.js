const User = require("../models/Users");
const bcrypt = require("bcryptjs");
const { Op, Sequelize} = require("sequelize");
const EmailService = require("./EmailService");
const crypto = require("crypto");

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
    const user = await User.create({
      name,
      email,
      password: passwordHash,
      role: role || "user",
      course_id,
    });
    if (!user) {
      throw new Error("User creation failed");
    }
    const userObject = user.get({ plain: true });
    delete userObject.password;
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

  /**
   * @param {string} search - Termo de busca (nome ou email).
   * @returns {Promise<Array<User>>} Lista de usuários.
   */

  static async getAllUsers(search = "") {
    let whereClause = {};
    if (search) {
      whereClause = {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
        ],
      };
    }
    const users = await User.findAll({
      where: whereClause,
      attributes: ["id", "name", "email", "role", "createdAt"],
    });
    return users;
  }
  /**
   * @param {UUID} userId
   * @param {string} newRole
   * @returns {Promise<User>}
   */
  static async updateUserRole(userId, newRole) {
    if(!["user", "admin", "professor"].includes(newRole)) {
      throw new Error("Invalid role. Allowed roles are 'user', 'admin', 'professor'.");
    }
    const [updatedRows] = await User.update(
      { role: newRole },
      { where: { id: userId } }
    );
    if (updatedRows === 0) {
      throw new Error("User not found or role not updated");
    }
    const updatedUser = await User.findByPk(userId, {
      attributes: ["id", "name", "email", "role"],
    });
    return updatedUser;
  }
  /**
     *
     * @param {string} email
     */
    static async forgotPassword(email) {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            console.warn(`Tentativa de recuperação de senha para e-mail não encontrado: ${email}`);
            return { message: "Se o e-mail estiver cadastrado, um link de redefinição será enviado." };
        }
        const OTP_CODE = Math.floor(100000 + Math.random() * 900000).toString();
        const resetExpires = new Date(Date.now() + 3600000); 
        await user.update({
            resetPasswordToken: OTP_CODE,
            resetPasswordExpires: resetExpires,
        });
        try {
            await EmailService.sendPasswordResetEmail(user.email, OTP_CODE);
            return { message: "Um código de redefinição de 6 dígitos foi enviado para o seu e-mail." };
        } catch (error) {
            console.error('Erro ao enviar e-mail de redefinição:', error);
            throw new Error('Falha no envio do e-mail. Tente novamente mais tarde.');
        }
    } 
    /**
     * 
     * @param {string} code
     * @param {string} newPassword
     */
    static async resetPassword(code, newPassword) {
        if (!code || !newPassword) {
            throw new Error('400: Código de redefinição e nova senha são obrigatórios.');
        }
        const user = await User.findOne({
            where: {
                resetPasswordToken: code,
                resetPasswordExpires: { [Op.gt]: new Date() } 
            }
        });

        if (!user) {
            throw new Error('400: Token inválido ou expirado.');
        }

        const newPasswordHash = await bcrypt.hash(newPassword, 10);
        
        await user.update({
            password: newPasswordHash,
          
            resetPasswordToken: null, 
            resetPasswordExpires: null,
        });

        return { message: "Sua senha foi redefinida com sucesso. Faça login." };
    }
}

module.exports = UserService;
