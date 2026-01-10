export const APP_CONFIG = {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
    appName: import.meta.env.VITE_APP_NAME || 'AG Office',
    appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',

    // Token storage key
    tokenStorageKey: 'ag_office_token',

    // API endpoints
    endpoints: {
        auth: {
            login: '/auth/login',
            register: '/auth/register',
            me: '/auth/permissions/check',
        },
        suppliers: {
            list: '/suppliers',
            countries: '/suppliers/countries',
            byId: (id: string) => `/suppliers/${id}`,
            byCode: (code: string) => `/suppliers/code/${code}`,
            contractsBySupplier: (id: string) => `/suppliers/${id}/contracts`,
        },
        products: {
            list: '/products',
            bySupplier: (supplierId: string) => `/products/by-supplier/${supplierId}`,
            byId: (productId: string) => `/products/${productId}`,
            categoriesByProduct: (productId: string) =>
                `/products/${productId}/categories`,
        },
        media: {
            bySupplier: (supplierId: string) => `/media/supplier/${supplierId}`,
        },
        users: {
            list: '/users',
        },
        roles: {
            list: '/roles',
        },
        permissions: {
            list: '/permissions',
        },
        userProfiles: {
            me: '/user-profiles/me',
        },
        packages: {
            list: '/packages',
            byId: (id: string) => `/packages/${id}`,
            enhancedById: (id: string) => `/packages/${id}/enhanced`,
        },
    },
    // Pagination defaults
    pagination: {
        defaultPageSize: 10,
        pageSizeOptions: [10, 20, 50, 100],
    },
};