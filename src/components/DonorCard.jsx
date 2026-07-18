import React, { useState } from "react";
import { useCreateContactRequestMutation } from "../redux/features/auth/authApiSlice";

const bloodColors = {
  "A+": { bg: "bg-red-100", text: "text-red-700", border: "border-red-200" },
  "A-": { bg: "bg-rose-100", text: "text-rose-700", border: "border-rose-200" },
  "B+": { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200" },
  "B-": { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200" },
  "O+": { bg: "bg-red-50", text: "text-red-600", border: "border-red-100" },
  "O-": { bg: "bg-pink-100", text: "text-pink-700", border: "border-pink-200" },
  "AB+": { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200" },
  "AB-": { bg: "bg-indigo-100", text: "text-indigo-700", border: "border-indigo-200" },
};

export default function DonorCard({ donor }) {
  const [contacted, setContacted] = useState(false);
  const [createContactRequest, { isLoading: isSending }] = useCreateContactRequestMutation();
  const [error, setError] = useState(null);

  const color = bloodColors[donor.blood] || bloodColors["A+"];

  const lastDonatedLabel = donor.lastDonated
    ? new Date(donor.lastDonated).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    : "Recently joined";

  const handleContact = async () => {
    try {
      setError(null);
      await createContactRequest({
        receiverId: donor.id,
        message: `Hi ${donor.name}, I need blood donation help.`,
      }).unwrap();
      setContacted(true);
    } catch (err) {
      setError(err?.data?.message || "Failed to send request");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 card-hover relative overflow-hidden group">
      {/* Subtle top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-start justify-between mb-4">
        {/* Avatar */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold text-lg font-display shadow-md">
            {donor.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-base leading-tight">
              {donor.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {donor.location || "Location not shared"}
            </p>
          </div>
        </div>

        {/* Blood group badge */}
        <span className={`px-3 py-1.5 rounded-full text-sm font-bold border ${color.bg} ${color.text} ${color.border} font-display`}>
          {donor.blood}
        </span>
      </div>

      <div className="flex items-center justify-between mb-4">
        {/* Availability */}
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${donor.available ? "bg-green-400" : "bg-gray-300"} ${donor.available ? "animate-pulse" : ""}`} />
          <span className={`text-xs font-medium ${donor.available ? "text-green-600 dark:text-green-400" : "text-gray-400"}`}>
            {donor.available ? "Available Now" : "Unavailable"}
          </span>
        </div>

        {/* Age / Gender */}
        <div className="text-right">
          <span className="text-xs text-gray-400 block">Age {donor.age}</span>
          {donor.gender && (
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 inline-flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" />
              </svg>
              {donor.gender}
            </span>
          )}
        </div>
      </div>

      {/* Last donated */}
      <div className="text-xs text-gray-400 dark:text-gray-500 mb-4 flex items-center gap-1">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Last activity: {lastDonatedLabel}
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 text-center">
          {error}
        </div>
      )}

      {/* Contact button */}
      <button
        onClick={handleContact}
        disabled={!donor.available || contacted || isSending}
        className={`
          w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
          ${contacted
            ? "bg-green-50 text-green-600 border border-green-200 cursor-default"
            : donor.available
              ? isSending
                ? "bg-red-400 text-white cursor-wait"
                : "bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md hover:shadow-red-500/25 cursor-pointer"
              : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 dark:bg-gray-700 dark:border-gray-600"
          }
        `}
      >
        {isSending ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Sending...
          </span>
        ) : contacted ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Request Sent!
          </span>
        ) : donor.available ? (
          "Contact Donor"
        ) : (
          "Unavailable"
        )}
      </button>
    </div>
  );
}