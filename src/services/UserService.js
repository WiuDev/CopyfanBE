const User = require('../models/Users');
const bcrypt = require('bcryptjs');

class UserService {
    static async createUser({ name, email, password, role, course_id }) {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new Error('Email already in use');
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: passwordHash, role, course_id });
        await user.save();
        return user;
    }
    static async updateUser(userId, { name, email, password, role, course_id }) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ where: { email } });
            if (emailExists) {
                throw new Error('Email already in use');
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
        return { name: user.name, email: user.email, role: user.role, course_id: user.course_id };
    }
    static async getUserById(userId) {
        if (!userId) {
            throw new Error('Invalid user ID');
        }
        const user = await User.findByPk(userId, { attributes: ['id', 'name', 'email', 'role', 'course_id'] });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
}

module.exports = UserService;