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
import { 
  format, 
  addDays, 
  startOfWeek, 
  addWeeks, 
  subWeeks,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  addDays as addDaysToDate,
  subDays
} from 'date-fns'
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
      date: new Date(2024, 0, 15), // Jan 15, 2024
      type: 'regular' as const,
      status: 'confirmed' as const
    },
    {
      id: '2',
      physician: 'Dr. Michael Chen',
      specialty: 'Emergency',
      startTime: '22:00',
      endTime: '06:00',
      date: new Date(2024, 0, 15), // Jan 15, 2024
      type: 'emergency' as const,
      status: 'scheduled' as const
    },
    {
      id: '3',
      physician: 'Dr. Emily Rodriguez',
      specialty: 'Surgery',
      startTime: '14:00',
      endTime: '20:00',
      date: new Date(2024, 0, 16), // Jan 16, 2024
      type: 'surgery' as const,
      status: 'confirmed' as const
    },
    {
      id: '4',
      physician: 'Dr. James Wilson',
      specialty: 'Pediatrics',
      startTime: '09:00',
      endTime: '17:00',
      date: new Date(2024, 0, 17), // Jan 17, 2024
      type: 'regular' as const,
      status: 'confirmed' as const
    },
    {
      id: '5',
      physician: 'Dr. Lisa Park',
      specialty: 'Neurology',
      startTime: '12:00',
      endTime: '20:00',
      date: new Date(2024, 0, 18), // Jan 18, 2024
      type: 'on-call' as const,
      status: 'scheduled' as const
    }
  ]

  const navigate = (direction: 'prev' | 'next') => {
    if (view === 'week') {
      setCurrentDate(direction === 'next' ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1))
    } else if (view === 'month') {
      setCurrentDate(direction === 'next' ? addMonths(currentDate, 1) : subMonths(currentDate, 1))
    } else if (view === 'day') {
      setCurrentDate(direction === 'next' ? addDaysToDate(currentDate, 1) : subDays(currentDate, 1))
    }
  }

  const getDateRangeText = () => {
    if (view === 'day') {
      return format(currentDate, 'EEEE, MMMM d, yyyy')
    } else if (view === 'week') {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
      return `${format(weekStart, 'MMM d')} - ${format(addDays(weekStart, 6), 'MMM d, yyyy')}`
    } else if (view === 'month') {
      return format(currentDate, 'MMMM yyyy')
    }
    return ''
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
                onClick={() => navigate('prev')}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <h2 className="text-lg font-semibold">
                {getDateRangeText()}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('next')}
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
          {/* Day View */}
          {view === 'day' && (
            <div className="space-y-4">
              <div className="text-center py-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900">
                  {format(currentDate, 'EEEE, MMMM d, yyyy')}
                </h3>
              </div>
              
              <div className="grid grid-cols-1 gap-px bg-gray-200 rounded-lg overflow-hidden">
                {timeSlots.map((time, timeIndex) => {
                  const timeHour = parseInt(time.split(':')[0])
                  const dayShifts = sampleShifts.filter(shift => 
                    format(shift.date, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd')
                  )
                  
                  const currentShift = dayShifts.find(shift => {
                    const startHour = parseInt(shift.startTime.split(':')[0])
                    return timeHour === startHour
                  })

                  return (
                    <div key={timeIndex} className="bg-white p-4 min-h-[60px] border-b border-gray-100 flex items-center hover:bg-gray-50 cursor-pointer">
                      <div className="w-16 text-sm text-gray-500 font-medium">
                        {time}
                      </div>
                      <div className="flex-1 ml-4">
                        {currentShift ? (
                          <div className={`p-3 rounded-lg border ${getShiftColor(currentShift.type)}`}>
                            <div className="font-medium">{currentShift.physician}</div>
                            <div className="text-sm opacity-75">{currentShift.specialty}</div>
                            <div className="text-sm opacity-75">
                              {currentShift.startTime} - {currentShift.endTime}
                            </div>
                            <Badge variant="outline" className="mt-2">
                              {currentShift.status}
                            </Badge>
                          </div>
                        ) : (
                          <div className="text-gray-400 text-sm">No shifts scheduled</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Week View */}
          {view === 'week' && (
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
                        const dayShifts = sampleShifts.filter(shift => 
                          format(shift.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
                        )
                        const timeHour = parseInt(time.split(':')[0])
                        
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
          )}

          {/* Month View */}
          {view === 'month' && (
            <div className="space-y-4">
              {(() => {
                const monthStart = startOfMonth(currentDate)
                const monthEnd = endOfMonth(currentDate)
                const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
                const calendarEnd = addDays(startOfWeek(monthEnd, { weekStartsOn: 1 }), 41) // 6 weeks
                const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

                return (
                  <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
                    {/* Day headers */}
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <div key={day} className="bg-gray-100 p-3 text-center text-sm font-medium text-gray-700">
                        {day}
                      </div>
                    ))}
                    
                    {/* Calendar days */}
                    {calendarDays.map((day, index) => {
                      const dayShifts = sampleShifts.filter(shift => 
                        format(shift.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
                      )
                      const isCurrentMonth = isSameMonth(day, currentDate)
                      const isCurrentDay = isToday(day)

                      return (
                        <div
                          key={index}
                          className={`bg-white p-2 min-h-[100px] border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                            !isCurrentMonth ? 'opacity-40' : ''
                          } ${isCurrentDay ? 'bg-blue-50' : ''}`}
                        >
                          <div className={`text-sm font-medium mb-2 ${
                            isCurrentDay ? 'text-blue-600' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                          }`}>
                            {format(day, 'd')}
                          </div>
                          
                          <div className="space-y-1">
                            {dayShifts.slice(0, 3).map((shift) => (
                              <div
                                key={shift.id}
                                className={`text-xs p-1 rounded border ${getShiftColor(shift.type)}`}
                              >
                                <div className="font-medium truncate">
                                  {shift.physician.split(' ').slice(-1)[0]}
                                </div>
                                <div className="opacity-75">
                                  {shift.startTime}
                                </div>
                              </div>
                            ))}
                            {dayShifts.length > 3 && (
                              <div className="text-xs text-gray-500 font-medium">
                                +{dayShifts.length - 3} more
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              })()}
            </div>
          )}
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