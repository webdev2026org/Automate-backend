import { hasPermission } from "../services/permission.service.js";

export const requirePermission = (action) => (req, res, next) => {
  const role = req.user?.role ?? "guest";

  if (!hasPermission(role, action)) {
    return res
      .status(403)
      .json({ message: "Forbidden: insufficient permissions" });
  }

  next();
};
