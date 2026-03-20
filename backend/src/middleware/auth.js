export function requireAuth(req, res, next) {
  if (!req.session?.user) {
    res.status(403).json({ message: "Authentication required" });
    return;
  }

  next();
}
