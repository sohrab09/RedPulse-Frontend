import { configureStore } from "@reduxjs/toolkit";
import { geoApi } from "../redux/features/geo/geoApi";
import { usersApi } from "../redux/features/users/usersApiSlice";
import { authApi } from "../redux/features/auth/authApiSlice";

export const store = configureStore({
    reducer: {
        [geoApi.reducerPath]: geoApi.reducer,
        [usersApi.reducerPath]: usersApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware(
            {
                immutableCheck: false,
                serializableCheck: false,
            }
        )
            .concat(geoApi.middleware)
            .concat(usersApi.middleware)
            .concat(authApi.middleware)
});