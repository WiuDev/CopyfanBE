const {verify} = require('jsonwebtoken');
const {JWT_SECRET} = process.env;

function isAuthenticated(req, res, next) {
   const authToken = req.headers.authorization;
    if (!authToken) {
        return res.status(401).json({message: 'No token provided'});
    }
    if(!JWT_SECRET){
        console.error("JWT_SECRET is not defined");
        return res.status(500).json({message: 'Internal server error'});
    }
    const token = authToken.split(' ')[1];
    try {
        const decoded = verify(token, JWT_SECRET);
        const {id} = decoded;
        req.userId = id;
        next();
    } catch (error) {
        return res.status(401).json({error: 'Token invalid or expired'});
    }
}

module.exports = isAuthenticated;