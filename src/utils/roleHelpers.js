import { ROLES, BUS_EMPLOYEE_SUBROLES, ROLE_HIERARCHY } from '../config/config';

/**
 * Get human-readable role name
 */
export const getRoleLabel = (role) => {
  const roleLabels = {
    [ROLES.MASTER_ADMIN]: 'Master Admin',
    [ROLES.BUS_OWNER]: 'Bus Owner',
    [ROLES.BUS_ADMIN]: 'Bus Admin',
    [ROLES.BOOKING_MAN]: 'Booking Manager',
    [ROLES.BUS_EMPLOYEE]: 'Bus Employee',
    [ROLES.CUSTOMER]: 'Customer',
  };
  return roleLabels[role] || role;
};

/**
 * Get human-readable subrole name
 */
export const getSubroleLabel = (subrole) => {
  const subroleLabels = {
    [BUS_EMPLOYEE_SUBROLES.DRIVER]: 'Driver',
    [BUS_EMPLOYEE_SUBROLES.HELPER]: 'Helper',
  };
  return subroleLabels[subrole] || subrole;
};

/**
 * Get role badge color classes
 */
export const getRoleBadgeColor = (role) => {
  const colors = {
    [ROLES.MASTER_ADMIN]: 'bg-red-100 text-red-800',
    [ROLES.BUS_OWNER]: 'bg-blue-100 text-blue-800',
    [ROLES.BUS_ADMIN]: 'bg-green-100 text-green-800',
    [ROLES.BOOKING_MAN]: 'bg-purple-100 text-purple-800',
    [ROLES.BUS_EMPLOYEE]: 'bg-orange-100 text-orange-800',
    [ROLES.CUSTOMER]: 'bg-gray-100 text-gray-800',
  };
  return colors[role] || 'bg-gray-100 text-gray-800';
};

/**
 * Get roles that current user can create
 */
export const getCreatableRoles = (userRole) => {
  return ROLE_HIERARCHY[userRole] || [];
};

/**
 * Check if a role can create another role
 */
export const canCreateRole = (creatorRole, targetRole) => {
  const creatableRoles = getCreatableRoles(creatorRole);
  return creatableRoles.includes(targetRole);
};

/**
 * Check if a role requires subrole
 */
export const requiresSubrole = (role) => {
  return role === ROLES.BUS_EMPLOYEE;
};

/**
 * Get all available subroles for a role
 */
export const getAvailableSubroles = (role) => {
  if (role === ROLES.BUS_EMPLOYEE) {
    return Object.values(BUS_EMPLOYEE_SUBROLES);
  }
  return [];
};

/**
 * Format full role display (role + subrole if applicable)
 */
export const getFullRoleDisplay = (role, subrole) => {
  const roleLabel = getRoleLabel(role);
  if (subrole && requiresSubrole(role)) {
    return `${roleLabel} - ${getSubroleLabel(subrole)}`;
  }
  return roleLabel;
};

/**
 * Get all role options for dropdowns
 */
export const getAllRoleOptions = () => {
  return Object.entries(ROLES).map(([key, value]) => ({
    value: value,
    label: getRoleLabel(value),
  }));
};

/**
 * Get subrole options for dropdowns
 */
export const getSubroleOptions = (role) => {
  const subroles = getAvailableSubroles(role);
  return subroles.map(subrole => ({
    value: subrole,
    label: getSubroleLabel(subrole),
  }));
};

