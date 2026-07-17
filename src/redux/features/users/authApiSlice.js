import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../../app/https";

const baseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("redpulse_token");
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery,
    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (data) => ({
                url: "/users",
                method: "POST",
                body: data,
            }),
        }),
        getUsers: builder.query({
            query: () => "/users",
        }),

        loginUser: builder.mutation({
            query: (data) => ({
                url: "/users/login",
                method: "POST",
                body: data,
            }),
        })
    }),
});

export const { useRegisterUserMutation, useGetUsersQuery, useLoginUserMutation } = authApi;