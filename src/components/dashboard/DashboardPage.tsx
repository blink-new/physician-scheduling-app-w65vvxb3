import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Calendar, 
  Users, 
  Clock, 
  AlertTriangle,
  Plus,
  TrendingUp
} from 'lucide-react'

export function DashboardPage() {
  const stats = [
    {
      title: 'Total Physicians',
      value: '24',
      change: '+2 this month',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Scheduled Shifts',
      value: '156',
      change: '+12 this week',
      icon: Calendar,
      color: 'text-green-600'
    },
    {
      title: 'Hours Scheduled',
      value: '1,248',
      change: '+8% from last month',
      icon: Clock,
      color: 'text-purple-600'
    },
    {
      title: 'Conflicts',
      value: '3',
      change: '-2 resolved today',
      icon: AlertTriangle,
      color: 'text-red-600'
    }
  ]

  const recentShifts = [
    {
      id: '1',
      physician: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      shift: 'Morning Shift',
      time: '8:00 AM - 4:00 PM',
      date: 'Today',
      status: 'confirmed'
    },
    {
      id: '2',
      physician: 'Dr. Michael Chen',
      specialty: 'Emergency',
      shift: 'Night Shift',
      time: '10:00 PM - 6:00 AM',
      date: 'Today',
      status: 'scheduled'
    },
    {
      id: '3',
      physician: 'Dr. Emily Rodriguez',
      specialty: 'Surgery',
      shift: 'Surgery Block',
      time: '2:00 PM - 8:00 PM',
      date: 'Tomorrow',
      status: 'confirmed'
    }
  ]

  const conflicts = [
    {
      id: '1',
      physician: 'Dr. James Wilson',
      issue: 'Double-booked for surgery',
      time: '2:00 PM - 4:00 PM',
      priority: 'high'
    },
    {
      id: '2',
      physician: 'Dr. Lisa Park',
      issue: 'Unavailable during scheduled shift',
      time: '6:00 AM - 2:00 PM',
      priority: 'medium'
    }
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of physician scheduling</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Quick Schedule
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Shifts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Shifts</span>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentShifts.map((shift) => (
                <div key={shift.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {shift.physician.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{shift.physician}</p>
                        <p className="text-sm text-gray-500">{shift.specialty}</p>
                      </div>
                    </div>
                    <div className="mt-2 ml-13">
                      <p className="text-sm font-medium text-gray-700">{shift.shift}</p>
                      <p className="text-xs text-gray-500">{shift.time} • {shift.date}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={shift.status === 'confirmed' ? 'default' : 'secondary'}
                    className={shift.status === 'confirmed' ? 'bg-green-100 text-green-800' : ''}
                  >
                    {shift.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Scheduling Conflicts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                Scheduling Conflicts
              </span>
              <Button variant="ghost" size="sm">
                Resolve All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conflicts.map((conflict) => (
                <div key={conflict.id} className="p-4 border border-red-200 bg-red-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{conflict.physician}</p>
                      <p className="text-sm text-gray-700 mt-1">{conflict.issue}</p>
                      <p className="text-xs text-gray-500 mt-1">{conflict.time}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="destructive"
                        className={conflict.priority === 'high' ? 'bg-red-600' : 'bg-orange-500'}
                      >
                        {conflict.priority}
                      </Badge>
                      <Button size="sm" variant="outline">
                        Resolve
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {conflicts.length === 0 && (
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p className="text-gray-500">No scheduling conflicts!</p>
                  <p className="text-sm text-gray-400">All shifts are properly scheduled</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}