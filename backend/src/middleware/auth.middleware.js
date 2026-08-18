const authService = require('../services/auth.service');

function requireAuth(req, res, next) {
  const token = req.cookies?.[authService.SESSION_COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }

  try {
    req.user = authService.verifySessionToken(token);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired session.' });
  }
}

module.exports = { requireAuth };
