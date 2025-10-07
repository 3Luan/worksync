import { ROLE } from '@/constants';
import { ENTRY_URL } from '@/constants/url';
import { UserRole } from '@/types/model';

export const getUser = () => {
  return JSON.parse(localStorage.getItem('user') || 'null');
};

/**
 * Check if the user has a specific role.
 * @param userRole The role of the user.
 * @param role The role to check against.
 * @returns True if the user has the role, false otherwise.
 * @example
 * hasRole('admin', 'admin'); // true
 * hasRole('user', 'admin'); // false
 */
export const hasRole = (userRole: UserRole | null | undefined, role: UserRole) => {
  if (userRole === role) return true;
  return false;
};

/** * Check if the user has an admin role.
 * @param userRole The role of the user.
 * @returns True if the user is an admin, false otherwise.
 * @example
 * isAdminRole('admin'); // true
 * isAdminRole('user'); // false
 */
export const isAdminRole = (userRole: UserRole | null | undefined) => {
  return hasRole(userRole, ROLE.ADMIN);
};

/** Check if the user has a leader role.
 * @param userRole The role of the user.
 * @returns True if the user is a leader, false otherwise.
 * @example
 * isLeaderRole('leader'); // true
 * isLeaderRole('user'); // false
 */
export const isLeaderRole = (userRole: UserRole | null | undefined) => {
  return hasRole(userRole, ROLE.LEADER);
};

/** Check if the user has an accountant role.
 * @param userRole The role of the user.
 * @returns True if the user is an accountant, false otherwise.
 * @example
 * isAccountantRole('accountant'); // true
 * isAccountantRole('user'); // false
 */
export const isAccountantRole = (userRole: UserRole | null | undefined) => {
  return hasRole(userRole, ROLE.ACCOUNTANT);
};

/** Check if the user has a staff role.
 * @param userRole The role of the user.
 * @returns True if the user is a staff member, false otherwise.
 * @example
 * isStaffRole('staff'); // true
 * isStaffRole('user'); // false
 */
export const isStaffRole = (userRole: UserRole | null | undefined) => {
  return hasRole(userRole, ROLE.STAFF);
};

/**
 *
 * @param fullPath The full path of the URL.
 * @returns True if the path is an admin path, false otherwise.
 * @example
 * isAdminPath('/admin'); // true
 * isAdminPath('/user'); // false
 */
export const isAdminPath = (fullPath: string) => {
  return fullPath.startsWith(ENTRY_URL.ADMIN);
};

/**
 * Check if the path is a user path.
 * @param fullPath The full path of the URL.
 * @returns True if the path is a user path, false otherwise.
 * @example
 * isUserPath('/user'); // true
 * isUserPath('/admin'); // false
 */
export const isUserPath = (fullPath: string) => {
  return fullPath.startsWith(ENTRY_URL.USER) || !isAdminPath(fullPath);
};

export const rootRedirect = () => {
  const user = getUser();
  if (user) {
    if (isAdminRole(user.role)) {
      return ENTRY_URL.ADMIN;
    } else if (isAccountantRole(user.role)) {
      return ENTRY_URL.DASHBOARD;
    } else {
      return ENTRY_URL.USER;
    }
  }
  return ENTRY_URL.AUTH;
};
