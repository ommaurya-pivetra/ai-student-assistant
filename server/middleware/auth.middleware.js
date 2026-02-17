const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || '';

  if (!header.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: { message: 'Authorization token required' }
    });
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub };
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: { message: 'Invalid or expired token' }
    });
  }
};

module.exports = requireAuth;
