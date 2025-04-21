import React from 'react'
import { DashboardMetric } from '../DashboardMetric'
import { HomeIcon, Truck, CreditCard, Award } from 'lucide-react'

const RecyclerMetrics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <DashboardMetric
      title="Inbound Tonnage"
      value="128"
      description="8 new this month"
      trend={{ value: 12, isPositive: true }}
      icon={<HomeIcon size={24} />} />
    <DashboardMetric
      title="Recovery Yields"
      value="94%"
      description="Last 30 days"
      trend={{ value: 3, isPositive: true }}
      icon={<Truck size={24} />} />
    <DashboardMetric
      title="Monthly Revenue"
      value="$5,248"
      description="$642 more than last month"
      trend={{ value: 14, isPositive: true }}
      icon={<CreditCard size={24} />} />
    <DashboardMetric
      title="Active Rewards"
      value="86"
      description="65% participation rate"
      trend={{ value: 5, isPositive: true }}
      icon={<Award size={24} />} />
  </div>
  )
}

export default RecyclerMetrics