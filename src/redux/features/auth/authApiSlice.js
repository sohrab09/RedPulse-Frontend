import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../app/https";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery,
    tagTypes: ["ContactRequest"], // NEW: for cache invalidation
    endpoints: (builder) => ({
        // ========== EXISTING ENDPOINTS ==========
        registerUser: builder.mutation({
            query: (data) => ({
                url: "/auth/register",
                method: "POST",
                body: data,
            }),
        }),

        loginUser: builder.mutation({
            query: (data) => ({
                url: "/auth/login",
                method: "POST",
                body: data,
            }),
        }),

        getUsers: builder.query({
            query: () => "/public/donors",
        }),

        // ========== NEW: CONTACT REQUEST ENDPOINTS ==========

        // Send contact request to a donor
        createContactRequest: builder.mutation({
            query: ({ receiverId, message }) => ({
                url: "/contact-requests",
                method: "POST",
                body: { receiverId, message },
            }),
            invalidatesTags: ["ContactRequest"],
        }),

        // Get incoming requests (notifications for donor)
        getMyContactRequests: builder.query({
            query: () => "/contact-requests/incoming",
            providesTags: ["ContactRequest"],
        }),

        // Get sent requests
        getMySentRequests: builder.query({
            query: () => "/contact-requests/sent",
            providesTags: ["ContactRequest"],
        }),

        // Update request status (accept/reject)
        updateRequestStatus: builder.mutation({
            query: ({ requestId, status }) => ({
                url: `/contact-requests/${requestId}/status`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: ["ContactRequest"],
        }),
    }),
});

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useGetUsersQuery,
    useCreateContactRequestMutation,      // NEW
    useGetMyContactRequestsQuery,          // NEW
    useGetMySentRequestsQuery,           // NEW
    useUpdateRequestStatusMutation,      // NEW
} = authApi;