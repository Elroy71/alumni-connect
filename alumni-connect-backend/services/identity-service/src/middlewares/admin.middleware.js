// Admin Authorization Middleware

export const requireSuperAdmin = (context) => {
    if (!context.user) {
        throw new Error('Authentication required');
    }

    if (context.user.role !== 'SUPER_ADMIN') {
        throw new Error('Unauthorized: Super Admin access required');
    }

    return true;
};

export const requireAlumni = (context) => {
    if (!context.user) {
        throw new Error('Authentication required');
    }

    if (context.user.role !== 'ALUMNI') {
        throw new Error('Unauthorized: Alumni access required');
    }

    return true;
};

export const requireAuthenticated = (context) => {
    if (!context.user) {
        throw new Error('Authentication required');
    }

    return true;
};

// Check if user is Super Admin (doesn't throw, just returns boolean)
export const isSuperAdmin = (context) => {
    return context.user && context.user.role === 'SUPER_ADMIN';
};

// Check if user is Alumni
export const isAlumni = (context) => {
    return context.user && context.user.role === 'ALUMNI';
};
