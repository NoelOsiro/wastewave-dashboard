import { DashboardCard } from '@/components/dashboard/DashboardCard'
import { Filter, Search } from 'lucide-react'
import React from 'react'
interface HistoryProps {
    history: {
        id: string
        title: string
        recipients: string
        type: string
        date: string
        status: string
        delivery_rate: string
    }[]
    }
const History = (props:HistoryProps) => {
  return (
    <div>
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
      <div className="relative w-full sm:w-80">
        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <input type="text" placeholder="Search history..." className="glass-input w-full pl-10 pr-4 py-2 rounded-md" />
      </div>
      <div className="flex gap-2 w-full sm:w-auto justify-end">
        <button className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors">
          <Filter size={16} className="mr-2" />
          Filter
        </button>
      </div>
    </div>
    <DashboardCard>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-medium">Title</th>
              <th className="text-left py-3 px-4 font-medium">Recipients</th>
              <th className="text-left py-3 px-4 font-medium">Type</th>
              <th className="text-left py-3 px-4 font-medium">Date</th>
              <th className="text-left py-3 px-4 font-medium">Status</th>
              <th className="text-left py-3 px-4 font-medium">Delivery</th>
            </tr>
          </thead>
          <tbody>
            {props.history.map(notification => <tr key={notification.id} className="border-b last:border-0 hover:bg-muted/50">
              <td className="py-3 px-4 font-medium">{notification.title}</td>
              <td className="py-3 px-4 text-muted-foreground">{notification.recipients}</td>
              <td className="py-3 px-4">
                <span className={`status-badge ${notification.type === "SMS" ? "status-badge-info" : "status-badge-warning"}`}>
                  {notification.type}
                </span>
              </td>
              <td className="py-3 px-4 text-muted-foreground">
                {new Date(notification.date).toLocaleDateString()}
              </td>
              <td className="py-3 px-4">
                <span className={`status-badge ${notification.status === "Delivered" ? "status-badge-success" : "status-badge-error"}`}>
                  {notification.status}
                </span>
              </td>
              <td className="py-3 px-4">{notification.delivery_rate}</td>
            </tr>)}
          </tbody>
        </table>
      </div>
      {
        /* Pagination (static for now) */
      }
      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-muted-foreground">
          Showing 1-{props.history.length} of {props.history.length} notifications
        </p>
        <div className="flex items-center space-x-2">
          <button className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors">
            Previous
          </button>
          <button className="glass-button inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium">
            Next
          </button>
        </div>
      </div>
    </DashboardCard>
  </div>
  )
}

export default History


