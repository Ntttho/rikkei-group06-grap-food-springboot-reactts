export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
  },
  RESTAURANTS: {
    LIST: '/restaurants',
    DETAIL: (id: string) => `/restaurants/${id}`,
  },
  FOODS: {
    LIST: '/foods',
    DETAIL: (id: string) => `/foods/${id}`,
  },
  ORDERS: {
    CREATE: '/orders',
    LIST: '/orders',
    STATUS: (id: string) => `/orders/${id}/status`,
  },
  DRIVERS: {
    FEED: '/drivers/feed',
    LOCATION: (id: string) => `/drivers/${id}/location`,
  },
} as const;
