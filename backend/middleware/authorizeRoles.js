// Middleware to authorize based on user roles
function authorizeRoles(...roles) {
    return (req, res, next) => {
      // Check if the user object exists in the request (set by auth middleware)
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ msg: 'Access denied: insufficient permissions' });
      }
      next();
    };
  }
  
  export default authorizeRoles;
  