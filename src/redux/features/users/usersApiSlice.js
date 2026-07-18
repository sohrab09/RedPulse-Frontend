import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../../app/https";

export const usersApi = createApi({
    reducerPath: "usersApi",
    baseQuery,
    endpoints: (builder) => ({

        getUserProfile: builder.query({
            query: () => "/users/me/profile",
        }),

        updateAvailability: builder.mutation({
            query: (isAvailable) => ({
                url: "/users/me/availability",
                method: "PATCH",
                body: {
                    isAvailable,
                },
            }),
        }),
    }),
});

export const { useGetUserProfileQuery, useUpdateAvailabilityMutation } = usersApi;