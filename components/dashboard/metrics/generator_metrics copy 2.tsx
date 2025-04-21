import React from 'react'
import { DashboardMetric } from '../DashboardMetric'
import {  AlertCircle, CalendarCheck, PieChart, Trash2 } from 'lucide-react'

const GeneratorMetrics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardMetric
        title="Total Waste Generated"
        value="3.2t"
        description="0.5t more than last period"
        trend={{ value: 18, isPositive: true }}
        icon={<Trash2 size={24} />} />
      <DashboardMetric
        title="Segregation Compliance"
        value="92%"
        description="Last 30 days"
        trend={{ value: -4, isPositive: false }}
        icon={<PieChart size={24} />} />
      <DashboardMetric
        title="Next Pickup"
        value="Apr 25, 2025"
        description="In 2 days"
        icon={<CalendarCheck size={24} />} />
      <DashboardMetric
        title="Contamination Alerts"
        value="3"
        description="Review required"
        trend={{ value: 3, isPositive: true }}
        icon={<AlertCircle size={24} />} />
    </div>
  )
}

export default GeneratorMetrics