import { useState, useEffect } from 'react'
import { blink } from '@/blink/client'
import { Sidebar } from '@/components/layout/Sidebar'
import { DashboardPage } from '@/components/dashboard/DashboardPage'
import { SchedulePage } from '@/components/schedule/SchedulePage'
import { PhysiciansPage } from '@/components/physicians/PhysiciansPage'
import { ShiftsPage } from '@/components/shifts/ShiftsPage'
import { AvailabilityPage } from '@/components/availability/AvailabilityPage'
import { Toaster } from '@/components/ui/toaster'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState('dashboard')

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Loading MedSchedule...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10m6-10v10m-6-4h6" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">MedSchedule</h1>
          <p className="text-gray-600 mb-8">
            Professional physician scheduling and management system
          </p>
          <button
            onClick={() => blink.auth.login()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Sign In to Continue
          </button>
        </div>
      </div>
    )
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />
      case 'schedule':
        return <SchedulePage />
      case 'physicians':
        return <PhysiciansPage />
      case 'shifts':
        return <ShiftsPage />
      case 'availability':
        return <AvailabilityPage />
      default:
        return <DashboardPage />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      
      <div className="lg:pl-64">
        <main className="min-h-screen">
          {renderCurrentPage()}
        </main>
      </div>
      
      <Toaster />
    </div>
  )
}

export default App