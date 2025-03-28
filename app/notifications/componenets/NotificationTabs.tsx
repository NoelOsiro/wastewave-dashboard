import React from 'react'
interface NotificationTabsProps {
  activeTab: string
}

const NotificationTabs = (props:NotificationTabsProps) => {
  return (
    <div className="border-b">
          <div className="flex space-x-6">
            <a
              href="/notifications?tab=new"
              className={`py-3 border-b-2 font-medium text-sm ${
                props.activeTab === "new"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              New Notification
            </a>
            <a
              href="/notifications?tab=templates"
              className={`py-3 border-b-2 font-medium text-sm ${
                props.activeTab === "templates"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Templates
            </a>
            <a
              href="/notifications?tab=history"
              className={`py-3 border-b-2 font-medium text-sm ${
                props.activeTab === "history"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Notification History
            </a>
          </div>
        </div>
  )
}

export default NotificationTabs