import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../app/https";

export const usersApi = createApi({
    reducerPath: "usersApi",
    baseQuery,
    tagTypes: ["User"],
    endpoints: (builder) => ({

        getUserProfile: builder.query({
            query: () => "/users/me/profile",
            providesTags: ["User"],
        }),

        updateAvailability: builder.mutation({
            query: (isAvailable) => ({
                url: "/users/me/availability",
                method: "PATCH",
                body: { isAvailable },
            }),
            invalidatesTags: ["User"],
        }),

        // ✅ NEW: Send verification code
        sendVerificationEmail: builder.mutation({
            query: () => ({
                url: "/users/me/send-verification",
                method: "POST",
            }),
            invalidatesTags: ["User"],
        }),

        // ✅ NEW: Verify email with code
        verifyEmail: builder.mutation({
            query: (code) => ({
                url: "/users/me/verify-email",
                method: "POST",
                body: { code },
            }),
            invalidatesTags: ["User"],
        }),

        updateUserProfile: builder.mutation({
            query: (data) => ({
                url: `/users/${data.id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["User"],
        }),
    }),
});

export const {
    useGetUserProfileQuery,
    useUpdateAvailabilityMutation,
    useSendVerificationEmailMutation,  // ✅
    useVerifyEmailMutation,              // ✅
    useUpdateUserProfileMutation,
} = usersApi;