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
}

module.exports = UserService;