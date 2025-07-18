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
  physicianId: string
  title: string
  startTime: string
  endTime: string
  date: string
  type: 'regular' | 'emergency' | 'on-call' | 'surgery'
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled'
  location: string
  notes?: string
  createdAt: string
  userId: string
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