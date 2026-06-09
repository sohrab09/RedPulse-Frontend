import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const geoApi = createApi({
    reducerPath: "geoApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://bdapis.pro.bd",
    }),

    tagTypes: ["Geo"],

    endpoints: (builder) => ({
        getDivisions: builder.query({
            query: () => "/geo/v2.0/divisions",
            providesTags: ["Geo"],
        }),

        getDistricts: builder.query({
            query: (divisionId) =>
                divisionId
                    ? `/geo/v2.0/districts/${divisionId}`
                    : "/geo/v2.0/districts",

            providesTags: ["Geo"],
        }),

        getUpazilas: builder.query({
            query: (districtId) =>
                `/geo/v2.0/upazilas/${districtId}`,

            providesTags: ["Geo"],
        }),

        getUnions: builder.query({
            query: (upazilaId) =>
                `/geo/v2.0/unions/${upazilaId}`,

            providesTags: ["Geo"],
        }),
    }),
});

export const {
    useGetDivisionsQuery,
    useGetDistrictsQuery,
    useGetUpazilasQuery,
    useGetUnionsQuery,
} = geoApi;