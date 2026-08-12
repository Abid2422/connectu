// TODO: implement session/JWT verification once the auth design is finalized.
// Should attach the authenticated user (or reject with 401) before protected
// routes run.
function requireAuth(req, res, next) {
  return res.status(501).json({ error: 'Auth middleware not yet implemented.' });
}

module.exports = { requireAuth };
