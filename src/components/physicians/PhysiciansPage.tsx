import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Plus,
  Search,
  Filter,
  MoreVertical,
  Phone,
  Mail,
  MapPin
} from 'lucide-react'

export function PhysiciansPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const physicians = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@hospital.com',
      phone: '+1 (555) 123-4567',
      specialty: 'Cardiology',
      department: 'Cardiovascular',
      isActive: true,
      avatar: 'SJ',
      location: 'Building A, Floor 3',
      shiftsThisWeek: 5,
      totalHours: 40
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      email: 'michael.chen@hospital.com',
      phone: '+1 (555) 234-5678',
      specialty: 'Emergency Medicine',
      department: 'Emergency',
      isActive: true,
      avatar: 'MC',
      location: 'Emergency Wing',
      shiftsThisWeek: 4,
      totalHours: 48
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      email: 'emily.rodriguez@hospital.com',
      phone: '+1 (555) 345-6789',
      specialty: 'General Surgery',
      department: 'Surgery',
      isActive: true,
      avatar: 'ER',
      location: 'OR Complex',
      shiftsThisWeek: 3,
      totalHours: 36
    },
    {
      id: '4',
      name: 'Dr. James Wilson',
      email: 'james.wilson@hospital.com',
      phone: '+1 (555) 456-7890',
      specialty: 'Orthopedics',
      department: 'Orthopedic Surgery',
      isActive: false,
      avatar: 'JW',
      location: 'Building B, Floor 2',
      shiftsThisWeek: 0,
      totalHours: 0
    },
    {
      id: '5',
      name: 'Dr. Lisa Park',
      email: 'lisa.park@hospital.com',
      phone: '+1 (555) 567-8901',
      specialty: 'Pediatrics',
      department: 'Children\'s Health',
      isActive: true,
      avatar: 'LP',
      location: 'Pediatric Wing',
      shiftsThisWeek: 5,
      totalHours: 42
    },
    {
      id: '6',
      name: 'Dr. Robert Kim',
      email: 'robert.kim@hospital.com',
      phone: '+1 (555) 678-9012',
      specialty: 'Radiology',
      department: 'Diagnostic Imaging',
      isActive: true,
      avatar: 'RK',
      location: 'Imaging Center',
      shiftsThisWeek: 4,
      totalHours: 38
    }
  ]

  const filteredPhysicians = physicians.filter(physician =>
    physician.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    physician.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    physician.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-red-500',
      'bg-yellow-500',
      'bg-indigo-500'
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Physicians</h1>
          <p className="text-gray-600">Manage physician profiles and information</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Physician
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search physicians by name, specialty, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Physicians Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhysicians.map((physician) => (
          <Card key={physician.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${getAvatarColor(physician.name)}`}>
                    {physician.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{physician.name}</h3>
                    <p className="text-sm text-gray-600">{physician.specialty}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={physician.isActive ? 'default' : 'secondary'}
                    className={physician.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}
                  >
                    {physician.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  {physician.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {physician.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {physician.location}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Department:</span>
                  <span className="font-medium text-gray-900">{physician.department}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{physician.shiftsThisWeek}</div>
                  <div className="text-xs text-gray-500">Shifts This Week</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{physician.totalHours}h</div>
                  <div className="text-xs text-gray-500">Total Hours</div>
                </div>
              </div>

              <div className="flex space-x-2 pt-3">
                <Button variant="outline" size="sm" className="flex-1">
                  View Schedule
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPhysicians.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No physicians found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or add a new physician.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Physician
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}