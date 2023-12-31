import type { BaseQueryFn, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { FetchArgs, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    credentials: 'include',
});

const baseQueryWithReAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    const result = await baseQuery(args, api, extraOptions);

    if (result.error) {
        if ('originalStatus' in result.error && result.error.originalStatus === 403) {
            localStorage.removeItem('userId');
        }
    }

    return result;
};

export const api = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReAuth,
    endpoints: () => ({}),
    tagTypes: ['User', 'Order', 'Product', 'Cart'],
});
