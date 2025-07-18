import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { 
  Plus,
  Clock,
  Calendar,
  Settings,
  Save
} from 'lucide-react'

export function AvailabilityPage() {
  const [selectedPhysician, setSelectedPhysician] = useState('1')

  const physicians = [
    { id: '1', name: 'Dr. Sarah Johnson', specialty: 'Cardiology' },
    { id: '2', name: 'Dr. Michael Chen', specialty: 'Emergency Medicine' },
    { id: '3', name: 'Dr. Emily Rodriguez', specialty: 'General Surgery' },
    { id: '4', name: 'Dr. James Wilson', specialty: 'Orthopedics' },
    { id: '5', name: 'Dr. Lisa Park', specialty: 'Pediatrics' }
  ]

  const daysOfWeek = [
    { id: 0, name: 'Sunday', short: 'Sun' },
    { id: 1, name: 'Monday', short: 'Mon' },
    { id: 2, name: 'Tuesday', short: 'Tue' },
    { id: 3, name: 'Wednesday', short: 'Wed' },
    { id: 4, name: 'Thursday', short: 'Thu' },
    { id: 5, name: 'Friday', short: 'Fri' },
    { id: 6, name: 'Saturday', short: 'Sat' }
  ]

  const [availability, setAvailability] = useState({
    1: { isAvailable: true, startTime: '08:00', endTime: '17:00' },
    2: { isAvailable: true, startTime: '08:00', endTime: '17:00' },
    3: { isAvailable: true, startTime: '08:00', endTime: '17:00' },
    4: { isAvailable: true, startTime: '08:00', endTime: '17:00' },
    5: { isAvailable: true, startTime: '08:00', endTime: '17:00' },
    0: { isAvailable: false, startTime: '08:00', endTime: '17:00' },
    6: { isAvailable: false, startTime: '08:00', endTime: '17:00' }
  })

  const updateAvailability = (dayId: number, field: string, value: any) => {
    setAvailability(prev => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        [field]: value
      }
    }))
  }

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0')
    return `${hour}:00`
  })

  const selectedPhysicianData = physicians.find(p => p.id === selectedPhysician)

  const templates = [
    {
      id: 'standard',
      name: 'Standard Weekdays',
      description: 'Monday-Friday, 8 AM - 5 PM',
      schedule: {
        1: { isAvailable: true, startTime: '08:00', endTime: '17:00' },
        2: { isAvailable: true, startTime: '08:00', endTime: '17:00' },
        3: { isAvailable: true, startTime: '08:00', endTime: '17:00' },
        4: { isAvailable: true, startTime: '08:00', endTime: '17:00' },
        5: { isAvailable: true, startTime: '08:00', endTime: '17:00' },
        0: { isAvailable: false, startTime: '08:00', endTime: '17:00' },
        6: { isAvailable: false, startTime: '08:00', endTime: '17:00' }
      }
    },
    {
      id: 'extended',
      name: 'Extended Hours',
      description: 'Monday-Saturday, 7 AM - 7 PM',
      schedule: {
        1: { isAvailable: true, startTime: '07:00', endTime: '19:00' },
        2: { isAvailable: true, startTime: '07:00', endTime: '19:00' },
        3: { isAvailable: true, startTime: '07:00', endTime: '19:00' },
        4: { isAvailable: true, startTime: '07:00', endTime: '19:00' },
        5: { isAvailable: true, startTime: '07:00', endTime: '19:00' },
        6: { isAvailable: true, startTime: '07:00', endTime: '19:00' },
        0: { isAvailable: false, startTime: '07:00', endTime: '19:00' }
      }
    },
    {
      id: 'emergency',
      name: 'Emergency Coverage',
      description: 'All days, 24/7 availability',
      schedule: {
        0: { isAvailable: true, startTime: '00:00', endTime: '23:59' },
        1: { isAvailable: true, startTime: '00:00', endTime: '23:59' },
        2: { isAvailable: true, startTime: '00:00', endTime: '23:59' },
        3: { isAvailable: true, startTime: '00:00', endTime: '23:59' },
        4: { isAvailable: true, startTime: '00:00', endTime: '23:59' },
        5: { isAvailable: true, startTime: '00:00', endTime: '23:59' },
        6: { isAvailable: true, startTime: '00:00', endTime: '23:59' }
      }
    }
  ]

  const applyTemplate = (template: any) => {
    setAvailability(template.schedule)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Availability Settings</h1>
          <p className="text-gray-600">Manage physician availability and working hours</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Physician Selection */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Select Physician</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {physicians.map((physician) => (
              <button
                key={physician.id}
                onClick={() => setSelectedPhysician(physician.id)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedPhysician === physician.id
                    ? 'bg-blue-50 border-blue-200 text-blue-900'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">{physician.name}</div>
                <div className="text-sm text-gray-500">{physician.specialty}</div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Availability Configuration */}
        <div className="lg:col-span-3 space-y-6">
          {/* Templates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Quick Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors"
                    onClick={() => applyTemplate(template)}
                  >
                    <h4 className="font-medium text-gray-900 mb-1">{template.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      Apply Template
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Weekly Schedule - {selectedPhysicianData?.name}
                </span>
                <Badge variant="outline">{selectedPhysicianData?.specialty}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {daysOfWeek.map((day) => (
                  <div key={day.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-20">
                      <div className="font-medium text-gray-900">{day.short}</div>
                      <div className="text-sm text-gray-500">{day.name}</div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Switch
                        checked={availability[day.id]?.isAvailable || false}
                        onCheckedChange={(checked) => updateAvailability(day.id, 'isAvailable', checked)}
                      />
                      <span className="text-sm text-gray-600 w-16">
                        {availability[day.id]?.isAvailable ? 'Available' : 'Off'}
                      </span>
                    </div>

                    {availability[day.id]?.isAvailable && (
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <select
                            value={availability[day.id]?.startTime || '08:00'}
                            onChange={(e) => updateAvailability(day.id, 'startTime', e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {timeSlots.map((time) => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </select>
                        </div>
                        
                        <span className="text-gray-400">to</span>
                        
                        <div className="flex items-center space-x-2">
                          <select
                            value={availability[day.id]?.endTime || '17:00'}
                            onChange={(e) => updateAvailability(day.id, 'endTime', e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {timeSlots.map((time) => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </select>
                        </div>

                        <div className="text-sm text-gray-500 ml-4">
                          {(() => {
                            const start = parseInt(availability[day.id]?.startTime?.split(':')[0] || '8')
                            const end = parseInt(availability[day.id]?.endTime?.split(':')[0] || '17')
                            const hours = end > start ? end - start : (24 - start) + end
                            return `${hours} hours`
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {Object.values(availability).filter(day => day.isAvailable).length}
                  </div>
                  <div className="text-sm text-gray-600">Available Days</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {Object.values(availability).reduce((total, day) => {
                      if (!day.isAvailable) return total
                      const start = parseInt(day.startTime.split(':')[0])
                      const end = parseInt(day.endTime.split(':')[0])
                      const hours = end > start ? end - start : (24 - start) + end
                      return total + hours
                    }, 0)}h
                  </div>
                  <div className="text-sm text-gray-600">Total Hours</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(Object.values(availability).reduce((total, day) => {
                      if (!day.isAvailable) return total
                      const start = parseInt(day.startTime.split(':')[0])
                      const end = parseInt(day.endTime.split(':')[0])
                      const hours = end > start ? end - start : (24 - start) + end
                      return total + hours
                    }, 0) / Object.values(availability).filter(day => day.isAvailable).length || 0)}h
                  </div>
                  <div className="text-sm text-gray-600">Avg per Day</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {7 - Object.values(availability).filter(day => day.isAvailable).length}
                  </div>
                  <div className="text-sm text-gray-600">Days Off</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}