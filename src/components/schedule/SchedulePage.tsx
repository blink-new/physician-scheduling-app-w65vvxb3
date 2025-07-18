import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Filter,
  Download,
  AlertTriangle,
  Clock,
  User,
  MapPin,
  Save,
  X
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
  subDays,
  parse,
  isAfter,
  isBefore,
  isEqual
} from 'date-fns'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import type { CalendarView, Shift } from '@/types'
import { blink } from '@/blink/client'

interface ShiftFormData {
  physicianId: string
  date: string
  startTime: string
  endTime: string
  type: 'regular' | 'emergency' | 'surgery' | 'on-call'
  location: string
  notes: string
}

interface ConflictInfo {
  type: 'overlap' | 'double-booking' | 'overtime'
  message: string
  shifts: string[]
}

// Draggable Shift Component
function DraggableShift({ shift, children }: { shift: Shift; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: shift.id,
    data: { shift }
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="cursor-move"
    >
      {children}
    </div>
  )
}

// Droppable Time Slot Component
function DroppableTimeSlot({ 
  id, 
  children, 
  onCreateShift 
}: { 
  id: string; 
  children: React.ReactNode;
  onCreateShift: (timeSlot: string, date: Date) => void;
}) {
  const { isOver, setNodeRef } = useDroppable({ id })
  const [timeSlot, dateStr] = id.split('_')
  const date = new Date(dateStr)

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[40px] border-b border-gray-100 relative hover:bg-gray-50 cursor-pointer transition-colors ${
        isOver ? 'bg-blue-50 border-blue-200' : ''
      }`}
      onClick={() => onCreateShift(timeSlot, date)}
    >
      {children}
    </div>
  )
}

export function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<CalendarView>('week')
  const [shifts, setShifts] = useState<Shift[]>([])
  const [physicians, setPhysicians] = useState<any[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ time: string; date: Date } | null>(null)
  const [draggedShift, setDraggedShift] = useState<Shift | null>(null)
  const [conflicts, setConflicts] = useState<ConflictInfo[]>([])
  const [formData, setFormData] = useState<ShiftFormData>({
    physicianId: '',
    date: '',
    startTime: '',
    endTime: '',
    type: 'regular',
    location: '',
    notes: ''
  })

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i
    return `${hour.toString().padStart(2, '0')}:00`
  })

  // Load data
  useEffect(() => {
    loadShifts()
    loadPhysicians()
  }, [])

  const loadShifts = async () => {
    try {
      const shiftsData = await blink.db.shifts.list({
        orderBy: { date: 'asc' }
      })
      setShifts(shiftsData)
    } catch (error) {
      console.error('Failed to load shifts:', error)
      // Use sample data as fallback
      setShifts([
        {
          id: '1',
          physician_id: '1',
          physician_name: 'Dr. Sarah Johnson',
          specialty: 'Cardiology',
          start_time: '08:00',
          end_time: '16:00',
          date: format(new Date(2024, 0, 15), 'yyyy-MM-dd'),
          type: 'regular',
          status: 'confirmed',
          location: 'Cardiology Wing',
          notes: ''
        },
        {
          id: '2',
          physician_id: '2',
          physician_name: 'Dr. Michael Chen',
          specialty: 'Emergency',
          start_time: '22:00',
          end_time: '06:00',
          date: format(new Date(2024, 0, 15), 'yyyy-MM-dd'),
          type: 'emergency',
          status: 'scheduled',
          location: 'Emergency Department',
          notes: 'Night shift coverage'
        },
        {
          id: '3',
          physician_id: '3',
          physician_name: 'Dr. Emily Rodriguez',
          specialty: 'Surgery',
          start_time: '14:00',
          end_time: '20:00',
          date: format(new Date(2024, 0, 16), 'yyyy-MM-dd'),
          type: 'surgery',
          status: 'confirmed',
          location: 'Operating Room 3',
          notes: 'Cardiac surgery scheduled'
        }
      ])
    }
  }

  const loadPhysicians = async () => {
    try {
      const physiciansData = await blink.db.physicians.list({
        orderBy: { name: 'asc' }
      })
      setPhysicians(physiciansData)
    } catch (error) {
      console.error('Failed to load physicians:', error)
      // Use sample data as fallback
      setPhysicians([
        { id: '1', name: 'Dr. Sarah Johnson', specialty: 'Cardiology', email: 'sarah.johnson@hospital.com' },
        { id: '2', name: 'Dr. Michael Chen', specialty: 'Emergency', email: 'michael.chen@hospital.com' },
        { id: '3', name: 'Dr. Emily Rodriguez', specialty: 'Surgery', email: 'emily.rodriguez@hospital.com' },
        { id: '4', name: 'Dr. James Wilson', specialty: 'Pediatrics', email: 'james.wilson@hospital.com' },
        { id: '5', name: 'Dr. Lisa Park', specialty: 'Neurology', email: 'lisa.park@hospital.com' }
      ])
    }
  }

  // Conflict detection
  const detectConflicts = (newShift: Shift, existingShifts: Shift[]): ConflictInfo[] => {
    const conflicts: ConflictInfo[] = []
    
    const newStart = parse(newShift.start_time, 'HH:mm', new Date())
    const newEnd = parse(newShift.end_time, 'HH:mm', new Date())
    
    existingShifts.forEach(shift => {
      if (shift.id === newShift.id) return
      
      const existingStart = parse(shift.start_time, 'HH:mm', new Date())
      const existingEnd = parse(shift.end_time, 'HH:mm', new Date())
      
      // Check for same physician double booking
      if (shift.physician_id === newShift.physician_id && shift.date === newShift.date) {
        if (
          (isAfter(newStart, existingStart) && isBefore(newStart, existingEnd)) ||
          (isAfter(newEnd, existingStart) && isBefore(newEnd, existingEnd)) ||
          (isBefore(newStart, existingStart) && isAfter(newEnd, existingEnd)) ||
          isEqual(newStart, existingStart) || isEqual(newEnd, existingEnd)
        ) {
          conflicts.push({
            type: 'double-booking',
            message: `${newShift.physician_name} is already scheduled during this time`,
            shifts: [shift.id, newShift.id]
          })
        }
      }
      
      // Check for location conflicts
      if (shift.location === newShift.location && shift.date === newShift.date) {
        if (
          (isAfter(newStart, existingStart) && isBefore(newStart, existingEnd)) ||
          (isAfter(newEnd, existingStart) && isBefore(newEnd, existingEnd)) ||
          (isBefore(newStart, existingStart) && isAfter(newEnd, existingEnd))
        ) {
          conflicts.push({
            type: 'overlap',
            message: `Location "${newShift.location}" is already occupied during this time`,
            shifts: [shift.id, newShift.id]
          })
        }
      }
    })
    
    return conflicts
  }

  // Drag and drop handlers
  const handleDragStart = (event: DragStartEvent) => {
    const shift = event.active.data.current?.shift
    if (shift) {
      setDraggedShift(shift)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setDraggedShift(null)

    if (!over) return

    const shift = active.data.current?.shift as Shift
    const [newTimeSlot, newDateStr] = over.id.toString().split('_')
    const newDate = new Date(newDateStr)

    if (shift) {
      const updatedShift = {
        ...shift,
        start_time: newTimeSlot,
        date: format(newDate, 'yyyy-MM-dd')
      }

      const newConflicts = detectConflicts(updatedShift, shifts.filter(s => s.id !== shift.id))
      setConflicts(newConflicts)

      if (newConflicts.length === 0) {
        updateShift(updatedShift)
      }
    }
  }

  const updateShift = async (updatedShift: Shift) => {
    try {
      await blink.db.shifts.update(updatedShift.id, {
        start_time: updatedShift.start_time,
        date: updatedShift.date
      })
      setShifts(prev => prev.map(s => s.id === updatedShift.id ? updatedShift : s))
    } catch (error) {
      console.error('Failed to update shift:', error)
      // Update locally for demo
      setShifts(prev => prev.map(s => s.id === updatedShift.id ? updatedShift : s))
    }
  }

  const handleCreateShift = (timeSlot: string, date: Date) => {
    setSelectedTimeSlot({ time: timeSlot, date })
    setFormData({
      ...formData,
      date: format(date, 'yyyy-MM-dd'),
      startTime: timeSlot,
      endTime: format(addDays(parse(timeSlot, 'HH:mm', new Date()), 0), 'HH:mm')
    })
    setIsCreateDialogOpen(true)
  }

  const handleSubmitShift = async () => {
    try {
      const selectedPhysician = physicians.find(p => p.id === formData.physicianId)
      
      const newShift: Shift = {
        id: Date.now().toString(),
        physician_id: formData.physicianId,
        physician_name: selectedPhysician?.name || '',
        specialty: selectedPhysician?.specialty || '',
        start_time: formData.startTime,
        end_time: formData.endTime,
        date: formData.date,
        type: formData.type,
        status: 'scheduled',
        location: formData.location,
        notes: formData.notes
      }

      const newConflicts = detectConflicts(newShift, shifts)
      setConflicts(newConflicts)

      if (newConflicts.length === 0) {
        await blink.db.shifts.create(newShift)
        setShifts(prev => [...prev, newShift])
        setIsCreateDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error('Failed to create shift:', error)
      // Add locally for demo
      const selectedPhysician = physicians.find(p => p.id === formData.physicianId)
      const newShift: Shift = {
        id: Date.now().toString(),
        physician_id: formData.physicianId,
        physician_name: selectedPhysician?.name || '',
        specialty: selectedPhysician?.specialty || '',
        start_time: formData.startTime,
        end_time: formData.endTime,
        date: formData.date,
        type: formData.type,
        status: 'scheduled',
        location: formData.location,
        notes: formData.notes
      }
      setShifts(prev => [...prev, newShift])
      setIsCreateDialogOpen(false)
      resetForm()
    }
  }

  const resetForm = () => {
    setFormData({
      physicianId: '',
      date: '',
      startTime: '',
      endTime: '',
      type: 'regular',
      location: '',
      notes: ''
    })
    setSelectedTimeSlot(null)
  }

  const exportCalendar = () => {
    const csvContent = [
      ['Date', 'Physician', 'Specialty', 'Start Time', 'End Time', 'Type', 'Location', 'Status'],
      ...shifts.map(shift => [
        shift.date,
        shift.physician_name,
        shift.specialty,
        shift.start_time,
        shift.end_time,
        shift.type,
        shift.location,
        shift.status
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `physician-schedule-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

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
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
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
            <Button variant="outline" size="sm" onClick={exportCalendar}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Shift
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Shift</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="physician">Physician</Label>
                    <Select value={formData.physicianId} onValueChange={(value) => setFormData({...formData, physicianId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select physician" />
                      </SelectTrigger>
                      <SelectContent>
                        {physicians.map(physician => (
                          <SelectItem key={physician.id} value={physician.id}>
                            {physician.name} - {physician.specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Select value={formData.type} onValueChange={(value: any) => setFormData({...formData, type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="regular">Regular</SelectItem>
                          <SelectItem value="emergency">Emergency</SelectItem>
                          <SelectItem value="surgery">Surgery</SelectItem>
                          <SelectItem value="on-call">On-Call</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      placeholder="e.g., Emergency Department, OR 3"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      placeholder="Additional notes..."
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSubmitShift}>
                      <Save className="w-4 h-4 mr-2" />
                      Create Shift
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Conflict Alerts */}
        {conflicts.length > 0 && (
          <div className="space-y-2">
            {conflicts.map((conflict, index) => (
              <Alert key={index} variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Scheduling Conflict:</strong> {conflict.message}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

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
                    const dayShifts = shifts.filter(shift => 
                      shift.date === format(currentDate, 'yyyy-MM-dd')
                    )
                    
                    const currentShift = dayShifts.find(shift => {
                      const startHour = parseInt(shift.start_time.split(':')[0])
                      return timeHour === startHour
                    })

                    const dropId = `${time}_${format(currentDate, 'yyyy-MM-dd')}`

                    return (
                      <DroppableTimeSlot 
                        key={timeIndex} 
                        id={dropId}
                        onCreateShift={handleCreateShift}
                      >
                        <div className="bg-white p-4 min-h-[60px] flex items-center">
                          <div className="w-16 text-sm text-gray-500 font-medium">
                            {time}
                          </div>
                          <div className="flex-1 ml-4">
                            {currentShift ? (
                              <DraggableShift shift={currentShift}>
                                <div className={`p-3 rounded-lg border ${getShiftColor(currentShift.type)}`}>
                                  <div className="font-medium">{currentShift.physician_name}</div>
                                  <div className="text-sm opacity-75">{currentShift.specialty}</div>
                                  <div className="text-sm opacity-75">
                                    {currentShift.start_time} - {currentShift.end_time}
                                  </div>
                                  <div className="flex items-center justify-between mt-2">
                                    <Badge variant="outline">
                                      {currentShift.status}
                                    </Badge>
                                    {currentShift.location && (
                                      <div className="flex items-center text-xs text-gray-500">
                                        <MapPin className="w-3 h-3 mr-1" />
                                        {currentShift.location}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </DraggableShift>
                            ) : (
                              <div className="text-gray-400 text-sm">Click to add shift</div>
                            )}
                          </div>
                        </div>
                      </DroppableTimeSlot>
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
                          const dayShifts = shifts.filter(shift => 
                            shift.date === format(day, 'yyyy-MM-dd')
                          )
                          const timeHour = parseInt(time.split(':')[0])
                          
                          const currentShift = dayShifts.find(shift => {
                            const startHour = parseInt(shift.start_time.split(':')[0])
                            return timeHour === startHour
                          })

                          const dropId = `${time}_${format(day, 'yyyy-MM-dd')}`

                          return (
                            <DroppableTimeSlot 
                              key={`${timeIndex}-${dayIndex}`}
                              id={dropId}
                              onCreateShift={handleCreateShift}
                            >
                              <div className="bg-white p-1 min-h-[40px] relative">
                                {currentShift && (
                                  <DraggableShift shift={currentShift}>
                                    <div className={`absolute inset-1 rounded p-2 border ${getShiftColor(currentShift.type)}`}>
                                      <div className="text-xs font-medium truncate">
                                        {currentShift.physician_name}
                                      </div>
                                      <div className="text-xs opacity-75 truncate">
                                        {currentShift.specialty}
                                      </div>
                                      <div className="text-xs opacity-75">
                                        {currentShift.start_time}-{currentShift.end_time}
                                      </div>
                                    </div>
                                  </DraggableShift>
                                )}
                              </div>
                            </DroppableTimeSlot>
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
                        const dayShifts = shifts.filter(shift => 
                          shift.date === format(day, 'yyyy-MM-dd')
                        )
                        const isCurrentMonth = isSameMonth(day, currentDate)
                        const isCurrentDay = isToday(day)

                        return (
                          <div
                            key={index}
                            className={`bg-white p-2 min-h-[100px] border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                              !isCurrentMonth ? 'opacity-40' : ''
                            } ${isCurrentDay ? 'bg-blue-50' : ''}`}
                            onClick={() => handleCreateShift('09:00', day)}
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
                                    {shift.physician_name.split(' ').slice(-1)[0]}
                                  </div>
                                  <div className="opacity-75">
                                    {shift.start_time}
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

        {/* Instructions */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">How to use the scheduler:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>Click</strong> on any time slot to create a new shift</li>
                  <li>• <strong>Drag and drop</strong> existing shifts to reschedule them</li>
                  <li>• <strong>Conflicts</strong> are automatically detected and highlighted</li>
                  <li>• <strong>Export</strong> your schedule to CSV for external use</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {draggedShift && (
          <div className={`p-3 rounded-lg border ${getShiftColor(draggedShift.type)} opacity-90 shadow-lg`}>
            <div className="font-medium">{draggedShift.physician_name}</div>
            <div className="text-sm opacity-75">{draggedShift.specialty}</div>
            <div className="text-sm opacity-75">
              {draggedShift.start_time} - {draggedShift.end_time}
            </div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}