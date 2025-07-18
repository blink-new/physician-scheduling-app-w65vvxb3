export interface Physician {
  id: string
  name: string
  email: string
  specialty: string
  department: string
  phone: string
  avatar?: string
  isActive: boolean
  createdAt: string
  userId: string
}

export interface Shift {
  id: string
  physician_id: string
  physician_name: string
  specialty: string
  start_time: string
  end_time: string
  date: string
  type: 'regular' | 'emergency' | 'surgery' | 'on-call'
  status: 'scheduled' | 'confirmed' | 'cancelled'
  location: string
  notes: string
}

export interface Availability {
  id: string
  physicianId: string
  dayOfWeek: number // 0-6 (Sunday-Saturday)
  startTime: string
  endTime: string
  isAvailable: boolean
  createdAt: string
  userId: string
}

export type CalendarView = 'day' | 'week' | 'month'

export interface ScheduleConflict {
  id: string
  physicianId: string
  conflictType: 'overlap' | 'unavailable' | 'overbooked'
  description: string
  shifts: string[]
  resolved: boolean
}