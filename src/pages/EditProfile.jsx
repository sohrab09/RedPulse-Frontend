import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    useGetDivisionsQuery,
    useGetDistrictsQuery,
    useGetUpazilasQuery,
    useGetUnionsQuery,
} from "../redux/features/geo/geoApi";
import { useGetUserProfileQuery } from '../redux/features/users/authApiSlice'

// ==================== ICONS ====================
const IconArrowLeft = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const IconUser = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" />
    </svg>
);

const IconDroplet = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0L12 2.69z" />
    </svg>
);

const IconMapPin = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const IconPhone = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
);

const IconCheck = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
);

const IconCamera = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

// ==================== SKELETON ====================
const SkeletonPulse = ({ className = "" }) => (
    <div className={`animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700 ${className}`} />
);

const EditProfileSkeleton = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
            <SkeletonPulse className="h-8 w-48 mb-8" />
            <div className="space-y-6">
                <SkeletonPulse className="h-40 rounded-2xl" />
                <SkeletonPulse className="h-80 rounded-2xl" />
            </div>
        </div>
    </div>
);

// ==================== FORM INPUT COMPONENT ====================
const FormInput = ({ label, name, type = 'text', value, onChange, error, placeholder, required, as = 'input', options = [], disabled = false }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        {as === 'select' ? (
            <select
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`w-full rounded-xl border bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white transition focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed ${error ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-700'}`}
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        ) : (
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={`w-full rounded-xl border bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white transition focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed ${error ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-700'}`}
            />
        )}
        {error && <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>}
    </div>
);

// ==================== SECTION HEADER ====================
const SectionHeader = ({ number, title, icon: Icon }) => (
    <div className="flex items-center gap-3 mb-6">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-500 flex items-center justify-center">
            <Icon className="w-5 h-5" />
        </div>
        <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-red-500">Step {number}</p>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
    </div>
);

// ==================== MAIN EDIT PROFILE ====================
const EditProfile = () => {
    const navigate = useNavigate();
    const { data: user, isLoading: isUserLoading } = useGetUserProfileQuery();

    // Geo Queries
    const { data: divisionsData } = useGetDivisionsQuery();
    const [form, setForm] = useState({
        fullName: '',
        phoneNumber: '',
        age: '',
        gender: '',
        bloodGroup: '',
        divisionId: '',
        districtId: '',
        upazilaId: '',
        unionId: '',
    });
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [savedSuccess, setSavedSuccess] = useState(false);

    const { data: districtsData } = useGetDistrictsQuery(form.divisionId, { skip: !form.divisionId });
    const { data: upazilasData } = useGetUpazilasQuery(form.districtId, { skip: !form.districtId });
    const { data: unionsData } = useGetUnionsQuery(form.upazilaId, { skip: !form.upazilaId });

    const divisions = divisionsData?.data || [];
    const districts = districtsData?.data || [];
    const upazilas = upazilasData?.data || [];
    const unions = unionsData?.data || [];

    // Helpers
    const findIdByName = (items, name) => {
        if (!name || !items.length) return '';
        const found = items.find(item => item.name === name);
        return found ? String(found.id) : '';
    };

    const findNameById = (items, id) => {
        if (!id || !items.length) return '';
        const found = items.find(item => String(item.id) === String(id));
        return found ? found.name : '';
    };

    // Initialize form from user data
    useEffect(() => {
        if (user?.data && divisions.length > 0) {
            const divisionId = findIdByName(divisions, user.data.division);
            setForm({
                fullName: user.data.fullName || '',
                phoneNumber: user.data.phoneNumber || '',
                age: user.data.age || '',
                gender: user.data.gender || '',
                bloodGroup: user.data.bloodGroup || '',
                divisionId: divisionId,
                districtId: '',
                upazilaId: '',
                unionId: '',
            });
        }
    }, [user, divisions.length]);

    // Cascade effects
    useEffect(() => {
        if (form.divisionId && districts.length > 0 && user?.data?.district) {
            const districtId = findIdByName(districts, user.data.district);
            if (districtId && districtId !== form.districtId) {
                setForm(prev => ({ ...prev, districtId }));
            }
        }
    }, [districts, form.divisionId, user?.data?.district]);

    useEffect(() => {
        if (form.districtId && upazilas.length > 0 && user?.data?.upazila) {
            const upazilaId = findIdByName(upazilas, user.data.upazila);
            if (upazilaId && upazilaId !== form.upazilaId) {
                setForm(prev => ({ ...prev, upazilaId }));
            }
        }
    }, [upazilas, form.districtId, user?.data?.upazila]);

    useEffect(() => {
        if (form.upazilaId && unions.length > 0 && user?.data?.union) {
            const unionId = findIdByName(unions, user.data.union);
            if (unionId && unionId !== form.unionId) {
                setForm(prev => ({ ...prev, unionId }));
            }
        }
    }, [unions, form.upazilaId, user?.data?.union]);

    if (isUserLoading) return <EditProfileSkeleton />;

    const userData = user?.data;
    const initials = userData?.fullName?.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() || 'U';

    const clearError = (name) => {
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

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

        setForm(prev => ({ ...prev, [name]: value }));
        clearError(name);
    };

    const validate = () => {
        const errs = {};
        if (!form.fullName.trim()) errs.fullName = 'Full name is required';
        else if (form.fullName.trim().length < 3) errs.fullName = 'Name must be at least 3 characters';

        if (!form.age) errs.age = 'Age is required';
        else if (Number(form.age) < 18 || Number(form.age) > 65) errs.age = 'Age must be between 18 and 65';

        if (!form.gender) errs.gender = 'Please select your gender';
        if (!form.bloodGroup) errs.bloodGroup = 'Please select your blood group';
        if (!form.phoneNumber.trim()) errs.phoneNumber = 'Phone number is required';
        else if (!/^01[3-9]\d{8}$/.test(form.phoneNumber.replace(/\D/g, ''))) errs.phoneNumber = 'Enter a valid Bangladeshi mobile number';

        if (!form.divisionId) errs.divisionId = 'Please select a division';
        if (!form.districtId) errs.districtId = 'Please select a district';
        if (!form.upazilaId) errs.upazilaId = 'Please select an upazila';
        if (!form.unionId) errs.unionId = 'Please select a union';

        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) {
            setErrors(errs);
            return;
        }

        setIsSaving(true);

        const payload = {
            fullName: form.fullName.trim(),
            age: Number(form.age),
            gender: form.gender,
            bloodGroup: form.bloodGroup,
            phoneNumber: form.phoneNumber.replace(/\D/g, ''),
            division: findNameById(divisions, form.divisionId),
            district: findNameById(districts, form.districtId),
            upazila: findNameById(upazilas, form.upazilaId),
            union: findNameById(unions, form.unionId),
        };

        try {
            // TODO: Replace with actual API call
            // await updateProfile(payload).unwrap();
            await new Promise(resolve => setTimeout(resolve, 1500));

            setSavedSuccess(true);
            setTimeout(() => {
                setSavedSuccess(false);
                navigate('/dashboard');
            }, 2000);
        } catch (err) {
            setErrors(prev => ({ ...prev, submit: err?.data?.message || 'Failed to update profile' }));
        } finally {
            setIsSaving(false);
        }
    };

    const geoOptions = (items, placeholder) => [
        { value: '', label: placeholder },
        ...items.map(i => ({ value: String(i.id), label: i.name })),
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
            {/* Success Overlay */}
            {savedSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 text-center shadow-2xl animate-bounce-in">
                        <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center mx-auto mb-4">
                            <IconCheck className="w-10 h-10 text-emerald-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Profile Updated!</h3>
                        <p className="text-gray-500 dark:text-gray-400">Redirecting to dashboard...</p>
                    </div>
                </div>
            )}

            <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="p-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:text-red-500 hover:border-red-300 dark:hover:border-red-800 transition shadow-sm"
                    >
                        <IconArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Edit Profile</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Update your personal information</p>
                    </div>
                </div>

                {/* Profile Preview Card */}
                <div className="rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 p-6 mb-8 shadow-lg shadow-red-500/20 dark:shadow-red-900/20">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center">
                                <span className="text-2xl font-bold text-white">{initials}</span>
                            </div>
                            <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:text-red-500 transition shadow-sm">
                                <IconCamera className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="text-white">
                            <h3 className="text-lg font-semibold">{userData?.fullName}</h3>
                            <p className="text-sm text-red-100">{userData?.bloodGroup} Donor • {userData?.gender}</p>
                            <p className="text-xs text-red-200 mt-1">{userData?.phoneNumber}</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} noValidate className="space-y-8">
                    {/* Section 1: Personal */}
                    <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 sm:p-8 shadow-sm">
                        <SectionHeader number="1" title="Personal Information" icon={IconUser} />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                                <FormInput
                                    label="Full Name"
                                    name="fullName"
                                    value={form.fullName}
                                    onChange={handleChange}
                                    placeholder="e.g. Mohammad Sohrab Hossain"
                                    error={errors.fullName}
                                    required
                                />
                            </div>
                            <FormInput
                                label="Age"
                                name="age"
                                type="number"
                                value={form.age}
                                onChange={handleChange}
                                placeholder="e.g. 25"
                                error={errors.age}
                                required
                            />
                            <FormInput
                                label="Blood Group"
                                name="bloodGroup"
                                as="select"
                                value={form.bloodGroup}
                                onChange={handleChange}
                                error={errors.bloodGroup}
                                required
                                options={[
                                    { value: '', label: 'Select blood group' },
                                    { value: 'A+', label: 'A+' },
                                    { value: 'A-', label: 'A-' },
                                    { value: 'B+', label: 'B+' },
                                    { value: 'B-', label: 'B-' },
                                    { value: 'AB+', label: 'AB+' },
                                    { value: 'AB-', label: 'AB-' },
                                    { value: 'O+', label: 'O+' },
                                    { value: 'O-', label: 'O-' },
                                ]}
                            />
                        </div>
                        <div className="mt-4">
                            <FormInput
                                label="Gender"
                                name="gender"
                                as="select"
                                value={form.gender}
                                onChange={handleChange}
                                error={errors.gender}
                                required
                                options={[
                                    { value: '', label: 'Select gender' },
                                    { value: 'Male', label: 'Male' },
                                    { value: 'Female', label: 'Female' },
                                    { value: 'Others', label: 'Others' },
                                ]}
                            />
                        </div>
                    </div>

                    {/* Section 2: Location */}
                    <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 sm:p-8 shadow-sm">
                        <SectionHeader number="2" title="Location" icon={IconMapPin} />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormInput
                                label="Division"
                                name="divisionId"
                                as="select"
                                value={form.divisionId}
                                onChange={handleChange}
                                error={errors.divisionId}
                                required
                                options={geoOptions(divisions, 'Select division')}
                            />
                            <FormInput
                                label="District"
                                name="districtId"
                                as="select"
                                value={form.districtId}
                                onChange={handleChange}
                                error={errors.districtId}
                                disabled={!form.divisionId}
                                required
                                options={geoOptions(districts, form.divisionId ? 'Select district' : 'Select division first')}
                            />
                            <FormInput
                                label="Upazila"
                                name="upazilaId"
                                as="select"
                                value={form.upazilaId}
                                onChange={handleChange}
                                error={errors.upazilaId}
                                disabled={!form.districtId}
                                required
                                options={geoOptions(upazilas, form.districtId ? 'Select upazila' : 'Select district first')}
                            />
                            <FormInput
                                label="Union"
                                name="unionId"
                                as="select"
                                value={form.unionId}
                                onChange={handleChange}
                                error={errors.unionId}
                                disabled={!form.upazilaId}
                                required
                                options={geoOptions(unions, form.upazilaId ? 'Select union' : 'Select upazila first')}
                            />
                        </div>
                    </div>

                    {/* Section 3: Contact */}
                    <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 sm:p-8 shadow-sm">
                        <SectionHeader number="3" title="Contact Information" icon={IconPhone} />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormInput
                                label="Phone Number"
                                name="phoneNumber"
                                type="tel"
                                value={form.phoneNumber}
                                onChange={handleChange}
                                placeholder="e.g. 01712345678"
                                error={errors.phoneNumber}
                                required
                            />
                        </div>
                    </div>

                    {/* Submit Error */}
                    {errors.submit && (
                        <div className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-4 text-sm text-red-600 dark:text-red-400">
                            {errors.submit}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pb-12">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="flex-1 rounded-xl border border-gray-300 dark:border-gray-700 px-6 py-3.5 text-sm font-semibold text-gray-700 dark:text-gray-300 transition hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex-1 rounded-xl bg-red-500 hover:bg-red-600 px-6 py-3.5 text-sm font-semibold text-white transition shadow-lg shadow-red-500/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSaving ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Saving Changes...
                                </>
                            ) : (
                                <>
                                    <IconDroplet className="w-4 h-4" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;