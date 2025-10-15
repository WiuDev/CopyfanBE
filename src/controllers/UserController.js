const express = require('express');
const UserService = require('../services/UserService');

class UserController {
    static async createUser(req, res) {
        try {
            const { name, email, password, role, course_id } = req.body;
            const user = await UserService.createUser({ name, email, password, role, course_id });
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = UserController;