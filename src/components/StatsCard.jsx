import React from 'react'

export default function StatsCard({ stat, index }) {
  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center card-hover border border-gray-100 dark:border-gray-700 animate-slide-up"
      style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
    >
      <div className="text-4xl mb-3">{stat.icon}</div>
      <div className="text-3xl font-bold font-display text-gradient mb-1">
        {stat.value}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
        {stat.label}
      </div>
    </div>
  )
}
