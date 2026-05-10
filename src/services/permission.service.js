// Role hierarchy: higher index = more access
const ROLE_HIERARCHY = ["guest", "user", "admin"];

// Define what each role can do
const PERMISSIONS = {
  guest:  ["product:read"],
  user:   ["product:read", "product:create"],
  admin:  ["product:read", "product:create", "product:update", "product:delete", "user:read"],
};

export const hasPermission = (role, action) => {
  const allowed = PERMISSIONS[role] ?? [];
  return allowed.includes(action);
};

export const hasMinimumRole = (userRole, minimumRole) => {
  return ROLE_HIERARCHY.indexOf(userRole) >= ROLE_HIERARCHY.indexOf(minimumRole);
};