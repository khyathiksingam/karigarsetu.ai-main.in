import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export const RoleGuard = ({
  children,
  allowedRole,
  allowedRoles,
  requireAuth = true,
}) => {
  const { currentUser, currentRole, isAuthenticated } = useApp();
  const location = useLocation();

  if (requireAuth && (!isAuthenticated || !currentUser)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const effectiveRole = currentRole || currentUser?.role || null;
  const userRoles = Array.isArray(currentUser?.roles)
    ? currentUser.roles
    : currentUser?.role
      ? [currentUser.role]
      : [];

  const permittedRoles = allowedRoles || (allowedRole ? [allowedRole] : null);
  const hasPermission = !permittedRoles || permittedRoles.some(
    (role) => role === effectiveRole || userRoles.includes(role)
  );

  if (permittedRoles && !hasPermission) {
    if (userRoles.includes('admin') || effectiveRole === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (userRoles.includes('seller') || effectiveRole === 'seller') {
      return <Navigate to="/seller/dashboard" replace />;
    }
    return <Navigate to="/buyer/dashboard" replace />;
  }

  return <>{children}</>;
};
