import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button.jsx'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-20">
      <div className="text-center max-w-md">
        <div className="font-display text-9xl font-bold text-gradient mb-4">404</div>
        <div className="text-5xl mb-6">🩸</div>
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-3">Page Not Found</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          The page you're looking for doesn't exist. It may have been moved or deleted.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button size="lg">Go Home</Button>
          </Link>
          <Link to="/find-donor">
            <Button size="lg" variant="secondary">Find a Donor</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
