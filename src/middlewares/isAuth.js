const { verify } = require("jsonwebtoken");
const User = require("../models/Users");

async function isAuthenticated(req, res, next) {
    const JWT_SECRET = process.env.JWT_SECRET; 
    const authToken = req.headers.authorization;

    if (!authToken) {

        return res.status(401).json({ message: "No token provided" });
    }

    
    if (!JWT_SECRET) {
        console.error("Server Configuration Error: JWT Secret is missing.");
        return next(new Error("JWT Secret is missing.")); 
    }
    
    const token = authToken.trim().split(" ")[1];
    try {
        const decoded = verify(token, JWT_SECRET); 
        const { id } = decoded;

        const userDB = await User.findByPk(id); 
        
        if (!userDB) {
            return res.status(401).json({ error: 'User not found in database' });
        }
        
        req.user = { id: userDB.id, role: userDB.role, email: userDB.email, name: userDB.name };
        
        return next();
        
    } catch (error) {
        console.error("Authentication failed:", error.message);
        return res.status(401).json({ error: "Token invalid or expired" });
    }
}

module.exports = isAuthenticated;