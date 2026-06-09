
import React, { useState, useMemo } from 'react'
import Input from '../components/Input.jsx'
import Button from '../components/Button.jsx'
import Toast from '../components/Toast.jsx'
import { bloodGroups } from '../data/mockData.js'
import {
  useGetDivisionsQuery,
  useGetDistrictsQuery,
  useGetUpazilasQuery,
  useGetUnionsQuery,
} from "../redux/features/geo/geoApi";

// ─── constants ────────────────────────────────────────────────────────────────

const ELIGIBILITY = [
  { icon: '🩸', label: 'Age 18–65' },
  { icon: '⚖️', label: 'Weight ≥ 50 kg' },
  { icon: '💊', label: 'No active illness' },
];

const TRUST_BADGES = [
  { icon: '🔒', title: 'Private', desc: 'Info never sold' },
  { icon: '⚡', title: 'Instant', desc: 'Live immediately' },
  { icon: '💛', title: 'Free', desc: 'Always free' },
];

const INITIAL_FORM = {
  name: '',
  age: '',
  blood: '',
  divisionId: '',
  districtId: '',
  upazilaId: '',
  unionId: '',
  phone: '',
  agree: false,
};

// ─── validation ───────────────────────────────────────────────────────────────

function validate(form) {
  const errs = {};

  if (!form.name.trim())
    errs.name = 'Full name is required';
  else if (form.name.trim().length < 3)
    errs.name = 'Name must be at least 3 characters';

  if (!form.age)
    errs.age = 'Age is required';
  else if (Number(form.age) < 18 || Number(form.age) > 65)
    errs.age = 'Age must be between 18 and 65';

  if (!form.blood)
    errs.blood = 'Please select your blood group';

  if (!form.divisionId) errs.divisionId = 'Please select a division';
  if (!form.districtId) errs.districtId = 'Please select a district';
  if (!form.upazilaId) errs.upazilaId = 'Please select an upazila';
  if (!form.unionId) errs.unionId = 'Please select a union';

  if (!form.phone.trim())
    errs.phone = 'Phone number is required';
  else if (!/^01[3-9]\d{8}$/.test(form.phone.replace(/\D/g, '')))
    errs.phone = 'Enter a valid Bangladeshi mobile number';

  if (!form.agree)
    errs.agree = 'You must agree to the terms';

  return errs;
}

// ─── component ────────────────────────────────────────────────────────────────

export default function Register() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // ── geo queries ─────────────────────────────────────────────────────────────

  const { data: divisionsData } = useGetDivisionsQuery();
  const { data: districtsData } = useGetDistrictsQuery(form.divisionId, { skip: !form.divisionId });
  const { data: upazilasData } = useGetUpazilasQuery(form.districtId, { skip: !form.districtId });
  const { data: unionsData } = useGetUnionsQuery(form.upazilaId, { skip: !form.upazilaId });

  const divisions = divisionsData?.data || [];
  const districts = districtsData?.data || [];
  const upazilas = upazilasData?.data || [];
  const unions = unionsData?.data || [];

  // ── derived display names (strict equality — IDs from API are numbers) ──────
  const resolvedLocation = useMemo(() => {
    const division = divisions.find(d => d.id === Number(form.divisionId));
    const district = districts.find(d => d.id === Number(form.districtId));
    return [division?.name, district?.name].filter(Boolean).join(', ') || '—';
  }, [divisions, districts, form.divisionId, form.districtId]);

  // ── handlers ─────────────────────────────────────────────────────────────────

  const clearError = (name) => {
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Cascading resets: clear downstream fields AND their errors
    if (name === 'divisionId') {
      setForm(prev => ({ ...prev, divisionId: value, districtId: '', upazilaId: '', unionId: '' }));
      setErrors(prev => ({ ...prev, divisionId: '', districtId: '', upazilaId: '', unionId: '' }));
      return;
    }
    if (name === 'districtId') {
      setForm(prev => ({ ...prev, districtId: value, upazilaId: '', unionId: '' }));
      setErrors(prev => ({ ...prev, districtId: '', upazilaId: '', unionId: '' }));
      return;
    }
    if (name === 'upazilaId') {
      setForm(prev => ({ ...prev, upazilaId: value, unionId: '' }));
      setErrors(prev => ({ ...prev, upazilaId: '', unionId: '' }));
      return;
    }

    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    clearError(name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 1400)); // replace with real API call
    setLoading(false);
    setSubmitted(true);
    setToast({ message: 'Registration successful! Welcome to RedPulse 🩸', type: 'success' });
    console.log("form", form);

    // reset form
    setForm(INITIAL_FORM);
    setErrors({});
    setToast(null);

    // TODO: replace with real API call and handle errors
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setSubmitted(false);
    setToast(null);
  };

  // ── geo select options ───────────────────────────────────────────────────────

  const geoOptions = (items, placeholder) => [
    { value: '', label: placeholder },
    ...items.map(i => ({ value: i.id, label: i.name })),
  ];

  // ─────────────────────────────────────────────────────────────────────────────
  // Success screen
  // ─────────────────────────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center py-16 px-4">
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}

        <div className="bg-white dark:bg-gray-900 rounded-3xl p-10 sm:p-14 text-center max-w-md w-full border border-gray-100 dark:border-gray-800 shadow-2xl shadow-red-100/40 dark:shadow-none animate-slide-up">
          {/* Icon */}
          <div className="relative inline-flex mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-200 dark:shadow-green-900/30">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="absolute -top-1 -right-1 text-2xl animate-bounce">🩸</span>
          </div>

          <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-2">
            You're a Hero!
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-1">
            Welcome to RedPulse,{' '}
            <span className="font-semibold text-gray-900 dark:text-white">{form.name}</span>!
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
            Registered as a{' '}
            <span className="inline-flex items-center gap-1 bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 font-bold px-2 py-0.5 rounded-lg">
              {form.blood}
            </span>{' '}
            donor.
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mb-10">
            📍 {resolvedLocation}
          </p>

          {/* Stat row */}
          <div className="grid grid-cols-3 gap-3 mb-8 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
            {[
              { value: '1', label: 'Life saved' },
              { value: '3', label: 'People helped' },
              { value: '∞', label: 'Impact' },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-2xl font-bold text-red-500">{value}</div>
                <div className="text-xs text-gray-400 mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <Button onClick={handleReset} variant="secondary" fullWidth>
              Register Another Donor
            </Button>
            <Button variant="ghost" fullWidth>
              View My Profile
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Registration form
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-14">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">

          {/* ── Page header ─────────────────────────────────────────────────── */}
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 border border-red-100 dark:border-red-900">
              🩸 Join Our Network
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
              Register as{' '}
              <span className="text-red-500">Donor</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
              Your information is kept private and only shared with verified seekers.
            </p>
          </div>

          {/* ── Eligibility strip ───────────────────────────────────────────── */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {ELIGIBILITY.map(({ icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl px-3 py-3 text-sm text-gray-700 dark:text-gray-300 font-medium shadow-sm"
              >
                <span className="text-base flex-shrink-0">{icon}</span>
                <span className="text-xs leading-tight">{label}</span>
              </div>
            ))}
          </div>

          {/* ── Form card ───────────────────────────────────────────────────── */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-100/60 dark:shadow-none overflow-hidden">

            {/* Card top accent */}
            <div className="h-1.5 bg-gradient-to-r from-red-400 via-rose-500 to-red-600" />

            <div className="p-7 sm:p-10">
              <form onSubmit={handleSubmit} noValidate className="space-y-7">

                {/* ── Section: Personal ─────────────────────────────────────── */}
                <fieldset>
                  <legend className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 dark:bg-red-950/50 text-red-500 flex items-center justify-center text-[10px] font-bold">1</span>
                    Personal information
                  </legend>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <Input
                        label="Full Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g. Rahim Uddin"
                        error={errors.name}
                        required
                      />
                    </div>
                    <Input
                      label="Age"
                      name="age"
                      type="number"
                      value={form.age}
                      onChange={handleChange}
                      placeholder="e.g. 28"
                      error={errors.age}
                      required
                    />
                    <Input
                      label="Blood Group"
                      name="blood"
                      as="select"
                      value={form.blood}
                      onChange={handleChange}
                      error={errors.blood}
                      required
                      options={[
                        { value: '', label: 'Select blood group' },
                        ...bloodGroups.filter(g => g !== 'All').map(g => ({ value: g, label: g })),
                      ]}
                    />
                  </div>
                </fieldset>

                {/* ── Divider ───────────────────────────────────────────────── */}
                <div className="border-t border-dashed border-gray-100 dark:border-gray-800" />

                {/* ── Section: Location ─────────────────────────────────────── */}
                <fieldset>
                  <legend className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 dark:bg-red-950/50 text-red-500 flex items-center justify-center text-[10px] font-bold">2</span>
                    Location
                  </legend>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Division"
                      name="divisionId"
                      as="select"
                      value={form.divisionId}
                      onChange={handleChange}
                      error={errors.divisionId}
                      options={geoOptions(divisions, 'Select division')}
                    />
                    <Input
                      label="District"
                      name="districtId"
                      as="select"
                      value={form.districtId}
                      onChange={handleChange}
                      error={errors.districtId}
                      disabled={!form.divisionId}
                      options={geoOptions(districts, form.divisionId ? 'Select district' : 'Select division first')}
                    />
                    <Input
                      label="Upazila"
                      name="upazilaId"
                      as="select"
                      value={form.upazilaId}
                      onChange={handleChange}
                      error={errors.upazilaId}
                      disabled={!form.districtId}
                      options={geoOptions(upazilas, form.districtId ? 'Select upazila' : 'Select district first')}
                    />
                    <Input
                      label="Union"
                      name="unionId"
                      as="select"
                      value={form.unionId}
                      onChange={handleChange}
                      error={errors.unionId}
                      disabled={!form.upazilaId}
                      options={geoOptions(unions, form.upazilaId ? 'Select union' : 'Select upazila first')}
                    />
                  </div>
                </fieldset>

                {/* ── Divider ───────────────────────────────────────────────── */}
                <div className="border-t border-dashed border-gray-100 dark:border-gray-800" />

                {/* ── Section: Contact ──────────────────────────────────────── */}
                <fieldset>
                  <legend className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 dark:bg-red-950/50 text-red-500 flex items-center justify-center text-[10px] font-bold">3</span>
                    Contact
                  </legend>

                  <Input
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="e.g. 01712345678"
                    error={errors.phone}
                    required
                  />
                </fieldset>

                {/* ── Agreement ─────────────────────────────────────────────── */}
                <div className={`rounded-2xl border p-4 transition-colors ${errors.agree
                  ? 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20'
                  : 'border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/30'
                  }`}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agree"
                      checked={form.agree}
                      onChange={handleChange}
                      className="mt-0.5 w-4 h-4 accent-red-500 cursor-pointer flex-shrink-0"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      I confirm I meet the eligibility criteria and agree to RedPulse's{' '}
                      <a href="#" className="text-red-500 hover:underline font-medium">Terms of Service</a>{' '}
                      and{' '}
                      <a href="#" className="text-red-500 hover:underline font-medium">Privacy Policy</a>.
                    </span>
                  </label>
                  {errors.agree && (
                    <p className="text-xs text-red-500 mt-2 ml-7 font-medium">{errors.agree}</p>
                  )}
                </div>

                {/* ── Submit ────────────────────────────────────────────────── */}
                <Button type="submit" fullWidth size="lg" loading={loading}>
                  {loading ? 'Registering...' : 'Register as Donor 🩸'}
                </Button>

              </form>
            </div>
          </div>

          {/* ── Trust badges ────────────────────────────────────────────────── */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            {TRUST_BADGES.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-white dark:bg-gray-900 rounded-2xl p-4 text-center border border-gray-100 dark:border-gray-800 shadow-sm"
              >
                <div className="text-xl mb-1">{icon}</div>
                <div className="text-sm font-semibold text-gray-800 dark:text-white">{title}</div>
                <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

