import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  MoreVertical
} from 'lucide-react'
import { format } from 'date-fns'

export function ShiftsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const shifts = [
    {
      id: '1',
      title: 'Morning Cardiology Rounds',
      physician: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      date: '2024-01-18',
      startTime: '08:00',
      endTime: '16:00',
      type: 'regular',
      status: 'confirmed',
      location: 'Cardiology Ward',
      notes: 'Regular morning rounds and consultations'
    },
    {
      id: '2',
      title: 'Emergency Night Shift',
      physician: 'Dr. Michael Chen',
      specialty: 'Emergency Medicine',
      date: '2024-01-18',
      startTime: '22:00',
      endTime: '06:00',
      type: 'emergency',
      status: 'scheduled',
      location: 'Emergency Department',
      notes: 'Night coverage for emergency cases'
    },
    {
      id: '3',
      title: 'Surgical Block',
      physician: 'Dr. Emily Rodriguez',
      specialty: 'General Surgery',
      date: '2024-01-19',
      startTime: '14:00',
      endTime: '20:00',
      type: 'surgery',
      status: 'confirmed',
      location: 'OR Complex',
      notes: 'Scheduled surgeries and procedures'
    },
    {
      id: '4',
      title: 'Orthopedic Clinic',
      physician: 'Dr. James Wilson',
      specialty: 'Orthopedics',
      date: '2024-01-19',
      startTime: '09:00',
      endTime: '17:00',
      type: 'regular',
      status: 'cancelled',
      location: 'Orthopedic Clinic',
      notes: 'Cancelled due to physician unavailability'
    },
    {
      id: '5',
      title: 'Pediatric On-Call',
      physician: 'Dr. Lisa Park',
      specialty: 'Pediatrics',
      date: '2024-01-20',
      startTime: '18:00',
      endTime: '08:00',
      type: 'on-call',
      status: 'scheduled',
      location: 'Pediatric Ward',
      notes: 'On-call coverage for pediatric emergencies'
    },
    {
      id: '6',
      title: 'Radiology Reading',
      physician: 'Dr. Robert Kim',
      specialty: 'Radiology',
      date: '2024-01-20',
      startTime: '10:00',
      endTime: '18:00',
      type: 'regular',
      status: 'completed',
      location: 'Imaging Center',
      notes: 'Image interpretation and reporting'
    }
  ]

  const filteredShifts = shifts.filter(shift => {
    const matchesSearch = 
      shift.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shift.physician.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shift.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || shift.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'regular': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'emergency': return 'bg-red-50 text-red-700 border-red-200'
      case 'surgery': return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'on-call': return 'bg-orange-50 text-orange-700 border-orange-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const statusOptions = [
    { value: 'all', label: 'All Shifts' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shift Management</h1>
          <p className="text-gray-600">Manage and track physician shifts</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Shift
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search shifts by title, physician, or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              {statusOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={filterStatus === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus(option.value)}
                  className={filterStatus === option.value ? 'bg-blue-600 hover:bg-blue-700' : ''}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shifts List */}
      <div className="space-y-4">
        {filteredShifts.map((shift) => (
          <Card key={shift.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start space-x-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{shift.title}</h3>
                        <Badge className={getTypeColor(shift.type)}>
                          {shift.type}
                        </Badge>
                        <Badge className={getStatusColor(shift.status)}>
                          {shift.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-xs font-medium text-blue-600">
                              {shift.physician.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{shift.physician}</div>
                            <div className="text-xs text-gray-500">{shift.specialty}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <div>
                            <div className="font-medium text-gray-900">
                              {format(new Date(shift.date), 'MMM d, yyyy')}
                            </div>
                            <div className="text-xs text-gray-500">
                              {format(new Date(shift.date), 'EEEE')}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          <div>
                            <div className="font-medium text-gray-900">
                              {shift.startTime} - {shift.endTime}
                            </div>
                            <div className="text-xs text-gray-500">
                              {(() => {
                                const start = parseInt(shift.startTime.split(':')[0])
                                const end = parseInt(shift.endTime.split(':')[0])
                                const duration = end > start ? end - start : (24 - start) + end
                                return `${duration} hours`
                              })()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          <div>
                            <div className="font-medium text-gray-900">{shift.location}</div>
                          </div>
                        </div>
                      </div>
                      
                      {shift.notes && (
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                          {shift.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredShifts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Clock className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No shifts found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Create your first shift to get started.'
              }
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Shift
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}