const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - JWT verification middleware
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_hackathon_2026');

      // Get user from token (exclude password)
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized', message: 'User belonging to token no longer exists' });
      }

      next();
    } catch (error) {
      console.error('[Auth Middleware Error]', error.message);
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid or expired authentication token' });
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized', message: 'No authorization token provided in request header' });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `User role '${req.user ? req.user.role : 'unauthenticated'}' is not authorized to access this resource`,
      });
    }
    next();
  };
};
