import { useState } from 'react'
import { 
  Calendar, 
  Users, 
  Clock, 
  Settings, 
  BarChart3, 
  Bell,
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
}

const navigation = [
  { name: 'Dashboard', icon: BarChart3, id: 'dashboard' },
  { name: 'Schedule', icon: Calendar, id: 'schedule' },
  { name: 'Physicians', icon: Users, id: 'physicians' },
  { name: 'Shifts', icon: Clock, id: 'shifts' },
  { name: 'Availability', icon: Settings, id: 'availability' },
]

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">MedSchedule</h1>
            <p className="text-xs text-gray-500">Physician Scheduling</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => {
                onPageChange(item.id)
                setIsMobileOpen(false)
              }}
              className={cn(
                "w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                currentPage === item.id
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <Button variant="ghost" className="w-full justify-start" size="sm">
          <Bell className="w-4 h-4 mr-3" />
          Notifications
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="lg:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <SidebarContent />
      </div>

      {/* Mobile sidebar */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  )
}