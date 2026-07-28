import React from 'react'

export default function CourseDetailLoading() {
  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-brand-accent border-t-transparent" />
          <p className="mt-4 text-brand-body">
            Loading course details...
          </p>
        </div>
      </div>
  )
}
