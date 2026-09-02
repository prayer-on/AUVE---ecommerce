const isAdmin = (req, res, next) => {
  
  if (!req.user) {
    return res.status(401).json({ message: "Access denied. Authentication required." });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Access denied. You do not have Administrator permissions." });
  }

  next();
};

module.exports = isAdmin;
