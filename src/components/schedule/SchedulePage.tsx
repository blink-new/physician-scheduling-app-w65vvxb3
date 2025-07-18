import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Filter,
  Download
} from 'lucide-react'
import { format, addDays, startOfWeek, addWeeks, subWeeks } from 'date-fns'
import type { CalendarView } from '@/types'

export function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<CalendarView>('week')

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i
    return `${hour.toString().padStart(2, '0')}:00`
  })

  const sampleShifts = [
    {
      id: '1',
      physician: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      startTime: '08:00',
      endTime: '16:00',
      day: 1, // Monday
      type: 'regular' as const,
      status: 'confirmed' as const
    },
    {
      id: '2',
      physician: 'Dr. Michael Chen',
      specialty: 'Emergency',
      startTime: '22:00',
      endTime: '06:00',
      day: 1, // Monday
      type: 'emergency' as const,
      status: 'scheduled' as const
    },
    {
      id: '3',
      physician: 'Dr. Emily Rodriguez',
      specialty: 'Surgery',
      startTime: '14:00',
      endTime: '20:00',
      day: 2, // Tuesday
      type: 'surgery' as const,
      status: 'confirmed' as const
    }
  ]

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentDate(direction === 'next' ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1))
  }

  const getShiftColor = (type: string) => {
    switch (type) {
      case 'regular': return 'bg-blue-100 border-blue-300 text-blue-800'
      case 'emergency': return 'bg-red-100 border-red-300 text-red-800'
      case 'surgery': return 'bg-purple-100 border-purple-300 text-purple-800'
      case 'on-call': return 'bg-orange-100 border-orange-300 text-orange-800'
      default: return 'bg-gray-100 border-gray-300 text-gray-800'
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule Calendar</h1>
          <p className="text-gray-600">Manage physician schedules and shifts</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Shift
          </Button>
        </div>
      </div>

      {/* Calendar Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateWeek('prev')}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <h2 className="text-lg font-semibold">
                {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateWeek('next')}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              {(['day', 'week', 'month'] as CalendarView[]).map((viewType) => (
                <Button
                  key={viewType}
                  variant={view === viewType ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setView(viewType)}
                  className={view === viewType ? 'bg-blue-600 hover:bg-blue-700' : ''}
                >
                  {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Week View Calendar */}
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Header with days */}
              <div className="grid grid-cols-8 gap-px bg-gray-200 rounded-t-lg overflow-hidden">
                <div className="bg-white p-3 text-sm font-medium text-gray-500">
                  Time
                </div>
                {weekDays.map((day, index) => (
                  <div key={index} className="bg-white p-3 text-center">
                    <div className="text-sm font-medium text-gray-900">
                      {format(day, 'EEE')}
                    </div>
                    <div className="text-lg font-bold text-gray-700 mt-1">
                      {format(day, 'd')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Time slots grid */}
              <div className="grid grid-cols-8 gap-px bg-gray-200">
                {timeSlots.map((time, timeIndex) => (
                  <div key={timeIndex} className="contents">
                    {/* Time label */}
                    <div className="bg-white p-2 text-xs text-gray-500 border-r">
                      {time}
                    </div>
                    
                    {/* Day columns */}
                    {weekDays.map((day, dayIndex) => {
                      const dayShifts = sampleShifts.filter(shift => shift.day === dayIndex)
                      const timeHour = parseInt(time.split(':')[0])
                      const hasShift = dayShifts.some(shift => {
                        const startHour = parseInt(shift.startTime.split(':')[0])
                        const endHour = parseInt(shift.endTime.split(':')[0])
                        return timeHour >= startHour && timeHour < endHour
                      })
                      
                      const currentShift = dayShifts.find(shift => {
                        const startHour = parseInt(shift.startTime.split(':')[0])
                        return timeHour === startHour
                      })

                      return (
                        <div
                          key={`${timeIndex}-${dayIndex}`}
                          className="bg-white p-1 min-h-[40px] border-b border-gray-100 relative hover:bg-gray-50 cursor-pointer"
                        >
                          {currentShift && (
                            <div className={`absolute inset-1 rounded p-2 border ${getShiftColor(currentShift.type)}`}>
                              <div className="text-xs font-medium truncate">
                                {currentShift.physician}
                              </div>
                              <div className="text-xs opacity-75 truncate">
                                {currentShift.specialty}
                              </div>
                              <div className="text-xs opacity-75">
                                {currentShift.startTime}-{currentShift.endTime}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">Shift Types</h3>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
                <span className="text-sm text-gray-600">Regular</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
                <span className="text-sm text-gray-600">Emergency</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-100 border border-purple-300 rounded"></div>
                <span className="text-sm text-gray-600">Surgery</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-100 border border-orange-300 rounded"></div>
                <span className="text-sm text-gray-600">On-Call</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}