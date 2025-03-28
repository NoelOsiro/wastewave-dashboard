import { DashboardMetric } from '@/components/dashboard/DashboardMetric'
import { Bell, MessageSquare, Check, Mail } from 'lucide-react'
import React from 'react'

interface NotificationMetricsProps {
    metrics: {
        total_sent: number
        sms_sent: number
        email_sent: number
        delivery_rate: string
    }
    }

const NotificationMetrics = (props:NotificationMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardMetric
            title="Total Sent"
            value={props.metrics.total_sent.toString()}
            description="Last 30 days"
            icon={<Bell size={24} />}
          />
          <DashboardMetric
            title="SMS Sent"
            value={props.metrics.sms_sent.toString()}
            description="Last 30 days"
            icon={<MessageSquare size={24} />}
          />
          <DashboardMetric
            title="Email Sent"
            value={props.metrics.email_sent.toString()}
            description="Last 30 days"
            icon={<Mail size={24} />}
          />
          <DashboardMetric
            title="Delivery Rate"
            value={props.metrics.delivery_rate}
            description="Across all channels"
            icon={<Check size={24} />}
          />
        </div>
  )
}

export default NotificationMetrics