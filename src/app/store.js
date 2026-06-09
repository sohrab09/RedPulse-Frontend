import { configureStore } from "@reduxjs/toolkit";
import { geoApi } from "../redux/features/geo/geoApi";


export const store = configureStore({
    reducer: {
        [geoApi.reducerPath]: geoApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware(
            {
                immutableCheck: false,
                serializableCheck: false,
            }
        )
            .concat(geoApi.middleware),
});