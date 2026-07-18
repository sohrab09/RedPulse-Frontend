import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateContactRequestMutation } from "../redux/features/auth/authApiSlice";
import { rateLimitStorage } from "../utils/rateLimitStorage";

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

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const reasons = [
  { value: "Surgery", label: "Surgery (অপারেশন)" },
  { value: "C-Section", label: "C-Section (সিজার)" },
  { value: "Accident", label: "Accident (দুর্ঘটনা)" },
  { value: "Fracture", label: "Fracture (হাড় ভাঙা)" },
  { value: "Cancer", label: "Cancer (ক্যান্সার)" },
  { value: "Thalassemia", label: "Thalassemia (থ্যালাসেমিয়া)" },
  { value: "Anemia", label: "Anemia (রক্তস্বল্পতা)" },
  { value: "Childbirth", label: "Childbirth (প্রসব)" },
  { value: "Other", label: "Other (অন্যান্য)" },
];
const urgencies = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "CRITICAL", label: "Critical" },
];

function formatLastSeen(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function BlockTimer({ onExpire }) {
  const [timeLeft, setTimeLeft] = useState(() => rateLimitStorage.getFormattedRemainingTime());

  useEffect(() => {
    if (rateLimitStorage.getRemainingTime() <= 0) {
      onExpire();
      return;
    }

    const interval = setInterval(() => {
      const remaining = rateLimitStorage.getRemainingTime();
      if (remaining <= 0) {
        clearInterval(interval);
        onExpire();
        return;
      }
      setTimeLeft(rateLimitStorage.getFormattedRemainingTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [onExpire]);

  return <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Retry in {timeLeft}</span>;
}

export default function DonorCard({ donor }) {
  const navigate = useNavigate();
  const [contacted, setContacted] = useState(false);
  const [isBlocked, setIsBlocked] = useState(rateLimitStorage.isBlocked());
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [createContactRequest, { isLoading: isSending }] = useCreateContactRequestMutation();

  const [form, setForm] = useState({
    message: "",
    hospitalName: "",
    hospitalAddress: "",
    bloodGroupNeeded: donor.blood || "O+",
    unitsNeeded: 1,
    urgency: "MEDIUM",
    patientName: "",
    patientAge: "",
    patientGender: "",
    reason: "Surgery",
    reasonOther: "",
    requiredDate: "",
    contactNumber: "",
    additionalNotes: "",
  });

  const color = bloodColors[donor.blood] || bloodColors["A+"];

  useEffect(() => {
    const checkBlock = () => {
      const blocked = rateLimitStorage.isBlocked();
      setIsBlocked(blocked);
      if (!blocked) setError(null);
    };
    checkBlock();
    const interval = setInterval(checkBlock, 1000);
    return () => clearInterval(interval);
  }, []);

  // ✅ FIX: isBlocked true হলে Modal auto-close
  useEffect(() => {
    if (isBlocked && showModal) {
      setShowModal(false);
    }
  }, [isBlocked, showModal]);

  const handleBlockExpire = useCallback(() => {
    setIsBlocked(false);
    setError(null);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanValue = (val) => val === "" ? null : val;

    if (rateLimitStorage.isBlocked()) {
      setError(`Please wait ${rateLimitStorage.getFormattedRemainingTime()} before sending another request.`);
      return;
    }

    try {
      setError(null);
      await createContactRequest({
        receiverId: donor.id,
        message: cleanValue(form.message),
        hospitalName: cleanValue(form.hospitalName),
        hospitalAddress: cleanValue(form.hospitalAddress),
        bloodGroupNeeded: form.bloodGroupNeeded,
        unitsNeeded: Number(form.unitsNeeded),
        urgency: form.urgency,
        patientName: cleanValue(form.patientName),
        patientAge: form.patientAge ? Number(form.patientAge) : null,
        patientGender: cleanValue(form.patientGender),
        reason: form.reason,
        reasonOther: form.reason === "Other" ? cleanValue(form.reasonOther) : null,
        requiredDate: form.requiredDate || null,
        contactNumber: cleanValue(form.contactNumber),
        additionalNotes: cleanValue(form.additionalNotes),
      }).unwrap();

      setContacted(true);
      setShowModal(false);
      setError(null);
    } catch (err) {
      if (err.status === 429) {
        rateLimitStorage.setBlock();
        setIsBlocked(true);
        setError(`Too many requests! Blocked for ${rateLimitStorage.getFormattedRemainingTime()}.`);
      } else if (err.status === 401) {
        setError("Please login to send contact requests.");
      } else {
        setError(err?.data?.message || "Failed to send request");
      }
    }
  };

  const isButtonDisabled = !donor.available || contacted || isSending || isBlocked;

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 card-hover relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold text-lg font-display shadow-md">
              {donor.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-gray-900 dark:text-white text-base leading-tight">{donor.name}</h3>
                {donor.isEmailVerified && (
                  <span title="Email Verified" className="text-blue-500">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {donor.location || "Location not shared"}
              </p>
            </div>
          </div>
          <span className={`px-3 py-1.5 rounded-full text-sm font-bold border ${color.bg} ${color.text} ${color.border} font-display`}>
            {donor.blood}
          </span>
        </div>

        {/* Availability & Age */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${donor.available ? "bg-green-400" : "bg-gray-300"} ${donor.available ? "animate-pulse" : ""}`} />
            <span className={`text-xs font-medium ${donor.available ? "text-green-600 dark:text-green-400" : "text-gray-400"}`}>
              {donor.available ? "Available Now" : "Unavailable"}
            </span>
          </div>
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

        {/* Last seen */}
        <div className="text-xs text-gray-400 dark:text-gray-500 mb-4 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {donor.lastSeen ? (
            <span>Last seen: <span className="font-medium">{formatLastSeen(donor.lastSeen)}</span></span>
          ) : "Recently joined"}
        </div>

        {/* ✅ Error — শুধু Modal বন্ধ থাকলে কার্ডে দেখাও */}
        {error && !showModal && (
          <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 dark:text-amber-400 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="font-semibold">Rate Limit Reached</span>
            </div>
            {error}
            {isBlocked && <div className="mt-2 pt-2 border-t border-amber-200"><BlockTimer onExpire={handleBlockExpire} /></div>}
          </div>
        )}

        {/* Contact Button */}
        {!isBlocked && (
          <button
            onClick={() => setShowModal(true)}
            disabled={isButtonDisabled}
            className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
              ${contacted
                ? "bg-green-50 text-green-600 border border-green-200 cursor-default"
                : donor.available
                  ? "bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md hover:shadow-red-500/25 cursor-pointer"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 dark:bg-gray-700 dark:border-gray-600"
              }`}
          >
            {contacted ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Request Sent!
              </span>
            ) : donor.available ? "Contact Donor" : "Unavailable"}
          </button>
        )}

        {isBlocked && (
          <div className="w-full py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-sm font-medium">Temporarily Blocked</span>
            </div>
            <p className="text-xs text-gray-400 mt-1"><BlockTimer onExpire={handleBlockExpire} /></p>
          </div>
        )}
      </div>

      {/* ✅ MODAL — isBlocked হলে auto-close হবে effect দিয়ে */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 p-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Request Blood Donation</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">To: {donor.name} • {donor.blood}</p>
              </div>
              <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* ✅ Error Alert — Modal এর ভিতরে */}
            {error && (
              <div className="mx-5 mt-4 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-red-600 dark:text-red-400">{error}</p>
                    {isBlocked && (
                      <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                        <BlockTimer onExpire={handleBlockExpire} />
                      </p>
                    )}
                    {error.includes("login") && (
                      <button
                        onClick={() => { setShowModal(false); navigate('/login'); }}
                        className="mt-2 text-xs font-semibold text-red-600 hover:text-red-700 underline"
                      >
                        Login for unlimited requests →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Blood Group Needed */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase">Blood Group Needed *</label>
                <select name="bloodGroupNeeded" value={form.bloodGroupNeeded} onChange={handleChange} required
                  className="w-full px-3 py-2.5 text-sm border rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:border-red-500 focus:outline-none">
                  {bloodGroups.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              {/* Units & Urgency */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase">Units Needed *</label>
                  <input type="number" name="unitsNeeded" min="1" max="10" value={form.unitsNeeded} onChange={handleChange} required
                    className="w-full px-3 py-2.5 text-sm border rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:border-red-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase">Urgency *</label>
                  <select name="urgency" value={form.urgency} onChange={handleChange} required
                    className="w-full px-3 py-2.5 text-sm border rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:border-red-500 focus:outline-none">
                    {urgencies.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase">Reason *</label>
                <select name="reason" value={form.reason} onChange={handleChange} required
                  className="w-full px-3 py-2.5 text-sm border rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:border-red-500 focus:outline-none">
                  <option value="">Select reason</option>
                  {reasons.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>

              {/* Reason Other */}
              {form.reason === "Other" && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase">Specify Reason *</label>
                  <input type="text" name="reasonOther" value={form.reasonOther} onChange={handleChange} required
                    placeholder="Enter reason"
                    className="w-full px-3 py-2.5 text-sm border rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:border-red-500 focus:outline-none" />
                </div>
              )}

              {/* Patient Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase">Patient Name</label>
                  <input type="text" name="patientName" value={form.patientName} onChange={handleChange}
                    placeholder="Patient name"
                    className="w-full px-3 py-2.5 text-sm border rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:border-red-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase">Patient Age</label>
                  <input type="number" name="patientAge" value={form.patientAge} onChange={handleChange}
                    placeholder="Age"
                    className="w-full px-3 py-2.5 text-sm border rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:border-red-500 focus:outline-none" />
                </div>
              </div>

              {/* Patient Gender */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase">Patient Gender</label>
                <select name="patientGender" value={form.patientGender} onChange={handleChange}
                  className="w-full px-3 py-2.5 text-sm border rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:border-red-500 focus:outline-none">
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              {/* Hospital Info */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase">Hospital Name</label>
                <input type="text" name="hospitalName" value={form.hospitalName} onChange={handleChange}
                  placeholder="Hospital name"
                  className="w-full px-3 py-2.5 text-sm border rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:border-red-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase">Hospital Address</label>
                <input type="text" name="hospitalAddress" value={form.hospitalAddress} onChange={handleChange}
                  placeholder="Hospital address"
                  className="w-full px-3 py-2.5 text-sm border rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:border-red-500 focus:outline-none" />
              </div>

              {/* Required Date */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase">Required Date</label>
                <input type="datetime-local" name="requiredDate" value={form.requiredDate} onChange={handleChange}
                  className="w-full px-3 py-2.5 text-sm border rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:border-red-500 focus:outline-none" />
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase">Your Contact Number *</label>
                <input type="tel" name="contactNumber" value={form.contactNumber} onChange={handleChange} required
                  placeholder="01XXXXXXXXX"
                  className="w-full px-3 py-2.5 text-sm border rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:border-red-500 focus:outline-none" />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase">Message</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={3}
                  placeholder="Write a short message to the donor..."
                  className="w-full px-3 py-2.5 text-sm border rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:border-red-500 focus:outline-none resize-none" />
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase">Additional Notes</label>
                <textarea name="additionalNotes" value={form.additionalNotes} onChange={handleChange} rows={2}
                  placeholder="Any additional information..."
                  className="w-full px-3 py-2.5 text-sm border rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:border-red-500 focus:outline-none resize-none" />
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={handleCloseModal}
                  className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  Cancel
                </button>
                <button type="submit" disabled={isSending}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-semibold transition">
                  {isSending ? "Sending..." : "Send Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}