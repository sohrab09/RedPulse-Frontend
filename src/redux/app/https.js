import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const baseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL,

    prepareHeaders: (headers) => {

        if (!token) return;

        const token = localStorage.getItem("redpulse_token");

        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }

        return headers;
    },
});

export { API_BASE_URL, baseQuery };