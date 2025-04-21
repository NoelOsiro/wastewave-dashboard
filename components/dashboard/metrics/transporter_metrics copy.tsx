import React from 'react'
import { DashboardMetric } from '../DashboardMetric'
import { Truck, Clock, MapPin, FileText } from 'lucide-react'

const TransporterMetrics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <DashboardMetric
      title="Active Vehicles"
      value="14"
      description="2 added this month"
      trend={{ value: 2, isPositive: true }}
      icon={<Truck size={24} />} />
    <DashboardMetric
      title="On-Time Pickups"
      value="88%"
      description="Last 30 days"
      trend={{ value: 5, isPositive: true }}
      icon={<Clock size={24} />} />
    <DashboardMetric
      title="Average Route Time"
      value="1h 24m"
      description="–5m vs last week"
      trend={{ value: -5, isPositive: true }}
      icon={<MapPin size={24} />} />
    <DashboardMetric
      title="Pending Manifests"
      value="7"
      description="Awaiting signatures"
      icon={<FileText size={24} />} />
  </div>
  )
}

export default TransporterMetrics