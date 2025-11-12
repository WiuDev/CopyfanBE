const UserService = require("../services/UserService");

class UserController {
  static async createUser(req, res) {
    try {
      const { name, email, password, role, course_id } = req.body;
      const user = await UserService.createUser({
        name,
        email,
        password,
        role,
        course_id,
      });
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  static async updateUser(req, res) {
    try {
      const userId = req.userId;
      const data = req.body;
      const updatedUser = await UserService.updateUser(userId, data);
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  static async getUser(req, res) {
    try {
      const userId = req.user.id;
      const user = await UserService.getUserById(userId);
      return res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  static async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = UserController;
