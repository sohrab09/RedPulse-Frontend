import React, { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import DonorCard from '../components/DonorCard.jsx'
import { bloodGroups, locations as mockLocations } from '../data/mockData.js'
import { useGetUsersQuery } from '../redux/features/users/authApiSlice.js';

export default function FindDonor() {
  const { data, isLoading, error } = useGetUsersQuery();
  const [searchParams] = useSearchParams()
  const [bloodFilter, setBloodFilter] = useState(searchParams.get('blood') || 'All')
  const [locationFilter, setLocationFilter] = useState('All')
  const [availableOnly, setAvailableOnly] = useState(false)
  const [search, setSearch] = useState('')

  const formattedDonors = useMemo(() => {
    return (data?.data?.users || []).map((user) => ({
      id: user.id,
      name: user.fullName || 'Unknown Donor',
      age: user.age || 'N/A',
      blood: user.bloodGroup || 'A+',
      division: user.division || '—',
      district: user.district || '—',
      upazila: user.upazila || '—',
      union: user.union || '—',
      location: [user.upazila, user.district].filter(Boolean).join(', ') || 'Location not shared',
      phone: user.phoneNumber || '—',
      email: user.email || '—',
      role: user.role || 'USER',
      gender: user.gender || 'Others',
      lastDonated: user.updatedAt || user.createdAt || null,
      available: user.isAvailable || false,
    }));
  }, [data]);

  const locationOptions = useMemo(() => {
    const uniqueLocations = new Set(
      formattedDonors
        .map((donor) => donor.location)
        .filter(Boolean)
    );

    const fallbackLocations = Array.isArray(mockLocations) ? mockLocations : [];
    fallbackLocations
      .filter((loc) => loc !== 'All')
      .forEach((loc) => uniqueLocations.add(loc));

    return ['All', ...Array.from(uniqueLocations)];
  }, [formattedDonors, mockLocations]);

  useEffect(() => {
    const b = searchParams.get('blood')
    if (b) {
      setBloodFilter(b)
    } else {
      setBloodFilter('All')
    }
  }, [searchParams])

  const filtered = useMemo(() => {
    return formattedDonors.filter((d) => {
      const matchBlood = bloodFilter === 'All' || d.blood === bloodFilter
      const matchLocation =
        locationFilter === 'All' ||
        d.location === locationFilter ||
        d.district === locationFilter ||
        d.upazila === locationFilter
      const matchAvail = !availableOnly || d.available
      const matchSearch =
        !search ||
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.phone.includes(search) ||
        d.district.toLowerCase().includes(search.toLowerCase()) ||
        d.upazila.toLowerCase().includes(search.toLowerCase()) ||
        d.union.toLowerCase().includes(search.toLowerCase()) ||
        d.email.toLowerCase().includes(search.toLowerCase())

      return matchBlood && matchLocation && matchAvail && matchSearch
    })
  }, [formattedDonors, bloodFilter, locationFilter, availableOnly, search])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <span className="inline-block bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">
            Donor Directory
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-3">
            Find a Donor
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            Search our verified donor network. Filter by blood group and location to find the right match.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 mb-8 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            {/* Search */}
            <div className="lg:col-span-1">
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Search</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by name or city..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-red-400 transition-colors"
                />
              </div>
            </div>

            {/* Blood group filter */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Blood Group</label>
              <select
                value={bloodFilter}
                onChange={e => setBloodFilter(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-red-400 transition-colors cursor-pointer"
              >
                {bloodGroups.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            {/* Location filter */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Location</label>
              <select
                value={locationFilter}
                onChange={e => setLocationFilter(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-red-400 transition-colors cursor-pointer"
              >
                {locationOptions.map((location) => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            {/* Available toggle */}
            <div className="flex items-center justify-between sm:justify-start gap-3">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer" htmlFor="avail-toggle">
                Available only
              </label>
              <button
                id="avail-toggle"
                onClick={() => setAvailableOnly(v => !v)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer focus:outline-none ${availableOnly ? 'bg-red-500' : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${availableOnly ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          {/* Blood group quick-filter pills */}
          <div className="mt-4 flex flex-wrap gap-2">
            {bloodGroups.map(g => (
              <button
                key={g}
                onClick={() => setBloodFilter(g)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer border
                  ${bloodFilter === g
                    ? 'bg-red-500 text-white border-red-500 shadow-sm'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-red-400 hover:text-red-500'
                  }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-bold text-gray-900 dark:text-white">{filtered.length}</span> donors
            {bloodFilter !== 'All' && <span className="ml-1">with blood group <span className="text-red-500 font-bold">{bloodFilter}</span></span>}
            {locationFilter !== 'All' && <span className="ml-1">in <span className="font-bold text-gray-700 dark:text-gray-300">{locationFilter}</span></span>}
          </p>
          <button
            onClick={() => { setBloodFilter('All'); setLocationFilter('All'); setAvailableOnly(false); setSearch('') }}
            className="text-xs text-red-500 hover:text-red-600 font-semibold transition-colors cursor-pointer"
          >
            Clear filters
          </button>
        </div>

        {/* Donor grid */}
        {isLoading ? (
          <div className="text-center py-20 text-gray-500 dark:text-gray-400">Loading donors...</div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="font-display text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">Unable to load donors</h3>
            <p className="text-gray-500 dark:text-gray-400">Please try again in a moment.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-display text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">No Donors Found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Try adjusting your filters or search term.</p>
            <button
              onClick={() => { setBloodFilter('All'); setLocationFilter('All'); setAvailableOnly(false); setSearch('') }}
              className="px-5 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-full hover:bg-red-600 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(donor => (
              <DonorCard key={donor.id} donor={donor} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
