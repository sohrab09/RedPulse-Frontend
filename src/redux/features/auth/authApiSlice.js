import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../app/https";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery,
    tagTypes: ["ContactRequest", "User"],
    endpoints: (builder) => ({
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
            providesTags: ["User"],
        }),

        createContactRequest: builder.mutation({
            query: (data) => ({  // ✅ Full data object
                url: "/contact-requests",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["ContactRequest"],
        }),

        getMyContactRequests: builder.query({
            query: () => "/contact-requests/incoming",
            providesTags: ["ContactRequest"],
        }),

        getMySentRequests: builder.query({
            query: () => "/contact-requests/sent",
            providesTags: ["ContactRequest"],
        }),

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
    useCreateContactRequestMutation,
    useGetMyContactRequestsQuery,
    useGetMySentRequestsQuery,
    useUpdateRequestStatusMutation,
} = authApi;