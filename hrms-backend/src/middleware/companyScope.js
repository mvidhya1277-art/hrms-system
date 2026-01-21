export const companyScope = (req, res, next) => {
  // Super admin can access everything
  if (req.user.role === "super_admin") {
    req.companyFilter = {}; // no restriction
    return next();
  }

  // All others restricted to their company
  req.companyFilter = {
    companyId: req.user.companyId,
  };

  next();
};