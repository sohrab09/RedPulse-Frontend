import { configureStore } from "@reduxjs/toolkit";
import { geoApi } from "../redux/features/geo/geoApi";
import { authApi } from "../redux/features/users/authApiSlice";

export const store = configureStore({
    reducer: {
        [geoApi.reducerPath]: geoApi.reducer,
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
            .concat(authApi.middleware),
});