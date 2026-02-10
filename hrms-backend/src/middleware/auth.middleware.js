  import jwt from "jsonwebtoken";

  export const protect = (req, res, next) => {
    let token;

    // 1️⃣ From header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 2️⃣ From query (for PDF download)
    if (!token && req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };


  // ONLY SUPER ADMIN
  export const superAdminOnly = (req, res, next) => {
    if (req.user.role !== "super_admin") {
      return res.status(403).json({ message: "Super admin only" });
    }
    next();
  };

  // HR ADMIN + SUPER ADMIN
  export const hrAdminOnly = (req, res, next) => {
    if (!["super_admin", "hr_admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "HR admin access only" });
    }
    next();
  };

