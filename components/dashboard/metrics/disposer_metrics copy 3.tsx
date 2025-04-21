import React from 'react'
import { DashboardMetric } from '../DashboardMetric'
import { BarChart, Droplet, CalendarCheck, Layers } from 'lucide-react'

const DisposerMetrics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <DashboardMetric
      title="Site Capacity"
      value="72%"
      description="Current fill level"
      trend={{ value: 2, isPositive: false }}
      icon={<Layers size={24} />} />
    <DashboardMetric
      title="Daily Intake"
      value="48t"
      description="+6t vs yesterday"
      trend={{ value: 6, isPositive: true }}
      icon={<BarChart size={24} />} />
    <DashboardMetric
      title="Leachate Volume"
      value="12m³"
      description="Within limits"
      icon={<Droplet size={24} />} />
    <DashboardMetric
      title="Compliance Audits"
      value="1 due"
      description="Next on May 5"
      icon={<CalendarCheck size={24} />} />
  </div>
  )
}

export default DisposerMetrics