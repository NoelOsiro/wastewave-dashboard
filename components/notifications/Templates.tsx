import { DashboardCard } from '@/components/dashboard/DashboardCard'
import { createTemplate } from '@/utils/notifications'
import { Plus, Search } from 'lucide-react'
import React from 'react'

interface TemplateProps {
  templates: {
    id: string
    title: string
    description: string
    type: string
    last_sent: string | null
  }[]
}

const Templates = (props:TemplateProps) => {
  return (
    <div>
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div className="relative w-full sm:w-80">
        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <input type="text" placeholder="Search templates..." className="glass-input w-full pl-10 pr-4 py-2 rounded-md" />
      </div>
      <form action={createTemplate}>
        <input type="text" name="title" value="New Template" />
        <input type="text" name="description" value="New template description" />
        <input type="text" name="type" value="SMS" />
        <button type="submit" className="glass-button inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium">
          <Plus size={16} className="mr-2" />
          Create Template
        </button>
      </form>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {props.templates.map(template => <DashboardCard key={template.id} className="h-full">
        <div className="flex justify-between">
          <div>
            <h3 className="font-medium">{template.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
          </div>
          <span className={`status-badge whitespace-nowrap ${template.type === "SMS" ? "status-badge-info" : "status-badge-warning"}`}>
            {template.type}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Last sent: {template.last_sent || "Never"}
        </p>
        <div className="flex justify-between mt-6 pt-4 border-t">
          <a href={`/notifications/edit-template/${template.id}`} className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors">
            Edit
          </a>
          <a href={`/notifications?tab=new&template=${template.id}`} className="glass-button inline-flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium">
            Use Template
          </a>
        </div>
      </DashboardCard>)}
    </div>
  </div>
  )
}

export default Templates