"use client"
import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { DashboardMetric } from "@/components/dashboard/DashboardMetric";
import { Bell, Send, MessageSquare, Mail, Calendar, Users, Trash, Plus, Search, Filter, ArrowRight, Check, X } from "lucide-react";

const notificationTemplates = [
  {
    id: 1,
    title: "Collection Reminder",
    description: "Reminder for upcoming waste collection",
    type: "SMS",
    lastSent: "2 days ago",
  },
  {
    id: 2,
    title: "Payment Due",
    description: "Reminder for due payments",
    type: "Email",
    lastSent: "1 week ago",
  },
  {
    id: 3,
    title: "Waste Separation Guide",
    description: "Information on proper waste separation",
    type: "Email",
    lastSent: "2 weeks ago",
  },
  {
    id: 4,
    title: "New Schedule Alert",
    description: "Alert for new collection schedule",
    type: "SMS",
    lastSent: "1 month ago",
  },
];

const notificationHistory = [
  {
    id: 1,
    title: "Collection Reminder",
    recipients: "Green Valley Estate (18 houses)",
    date: "Feb 24, 2023",
    type: "SMS",
    status: "Delivered",
    deliveryRate: "100%",
  },
  {
    id: 2,
    title: "Payment Due Reminder",
    recipients: "All Pending Payments (28 houses)",
    date: "Feb 22, 2023",
    type: "Email",
    status: "Delivered",
    deliveryRate: "96%",
  },
  {
    id: 3,
    title: "Waste Separation Guide",
    recipients: "New Users (12 houses)",
    date: "Feb 20, 2023",
    type: "Email",
    status: "Delivered",
    deliveryRate: "92%",
  },
  {
    id: 4,
    title: "Schedule Change Alert",
    recipients: "Sunset Apartments (42 houses)",
    date: "Feb 18, 2023",
    type: "SMS",
    status: "Delivered",
    deliveryRate: "100%",
  },
  {
    id: 5,
    title: "Service Interruption",
    recipients: "All Houses (128 houses)",
    date: "Feb 15, 2023",
    type: "Email",
    status: "Delivered",
    deliveryRate: "94%",
  },
];

const Notifications = () => {
  const [activeTab, setActiveTab] = useState("new");
  
  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="font-semibold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-1">Send and manage notifications to houses.</p>
        </div>
        
        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardMetric
            title="Total Sent"
            value="1,248"
            description="Last 30 days"
            icon={<Bell size={24} />}
          />
          <DashboardMetric
            title="SMS Sent"
            value="864"
            description="Last 30 days"
            icon={<MessageSquare size={24} />}
          />
          <DashboardMetric
            title="Email Sent"
            value="384"
            description="Last 30 days"
            icon={<Mail size={24} />}
          />
          <DashboardMetric
            title="Delivery Rate"
            value="97.5%"
            description="Across all channels"
            icon={<Check size={24} />}
          />
        </div>
        
        {/* Tabs */}
        <div className="border-b">
          <div className="flex space-x-6">
            <button
              className={`py-3 border-b-2 font-medium text-sm ${
                activeTab === "new"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("new")}
            >
              New Notification
            </button>
            <button
              className={`py-3 border-b-2 font-medium text-sm ${
                activeTab === "templates"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("templates")}
            >
              Templates
            </button>
            <button
              className={`py-3 border-b-2 font-medium text-sm ${
                activeTab === "history"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("history")}
            >
              Notification History
            </button>
          </div>
        </div>
        
        {/* New Notification */}
        {activeTab === "new" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <DashboardCard>
                <h3 className="text-lg font-medium mb-6">Create New Notification</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="title">Notification Title</label>
                    <input
                      id="title"
                      type="text"
                      className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter notification title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="type">Notification Type</label>
                    <select
                      id="type"
                      className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="sms">SMS</option>
                      <option value="email">Email</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="recipients">Recipients</label>
                    <select
                      id="recipients"
                      className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="all">All Houses</option>
                      <option value="green_valley">Green Valley Estate</option>
                      <option value="sunset">Sunset Apartments</option>
                      <option value="riverside">Riverside Heights</option>
                      <option value="mountain">Mountain View Homes</option>
                      <option value="golden">Golden Gate Residences</option>
                      <option value="custom">Custom Selection</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      rows={6}
                      className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter your message here"
                    ></textarea>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md bg-background border border-input hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <Calendar size={14} className="mr-1" />
                      Schedule
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md bg-background border border-input hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <Users size={14} className="mr-1" />
                      Custom Recipients
                    </button>
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <button className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                      <Send size={16} className="mr-2" />
                      Send Notification
                    </button>
                  </div>
                </div>
              </DashboardCard>
            </div>
            
            <div>
              <DashboardCard>
                <h3 className="text-lg font-medium mb-6">Notification Preview</h3>
                
                <div className="space-y-6">
                  <div className="border rounded-lg p-4 bg-accent/20">
                    <div className="flex justify-between items-start">
                      <div className="flex space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <MessageSquare size={20} />
                        </div>
                        <div>
                          <h4 className="font-medium">SMS Preview</h4>
                          <p className="text-sm text-muted-foreground">How it will appear on phones</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 border rounded-md bg-background">
                      <p className="text-sm">
                        [WasteWave] Your garbage collection is scheduled for tomorrow at 9:00 AM. Please ensure your waste is properly sorted and placed outside. Thank you!
                      </p>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-accent/20">
                    <div className="flex justify-between items-start">
                      <div className="flex space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <Mail size={20} />
                        </div>
                        <div>
                          <h4 className="font-medium">Email Preview</h4>
                          <p className="text-sm text-muted-foreground">How it will appear in inboxes</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 border rounded-md bg-background">
                      <p className="text-sm font-medium mb-2">Garbage Collection Reminder</p>
                      <p className="text-sm mb-3">
                        Dear Resident,
                      </p>
                      <p className="text-sm mb-3">
                        This is a reminder that your garbage collection is scheduled for tomorrow at 9:00 AM.
                      </p>
                      <p className="text-sm mb-3">
                        Please ensure your waste is properly sorted and placed outside for collection.
                      </p>
                      <p className="text-sm mb-1">
                        Thank you for your cooperation!
                      </p>
                      <p className="text-sm font-medium">
                        WasteWave Team
                      </p>
                    </div>
                  </div>
                </div>
              </DashboardCard>
            </div>
          </div>
        )}
        
        {/* Templates */}
        {activeTab === "templates" && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="relative w-full sm:w-80">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  className="w-full pl-10 pr-4 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <button className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                <Plus size={16} className="mr-2" />
                Create Template
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notificationTemplates.map((template) => (
                <DashboardCard key={template.id} className="h-full">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{template.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                    </div>
                    <span
                      className={`status-badge whitespace-nowrap ${
                        template.type === "SMS"
                          ? "status-badge-info"
                          : "status-badge-warning"
                      }`}
                    >
                      {template.type}
                    </span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-4">Last sent: {template.lastSent}</p>
                  
                  <div className="flex justify-between mt-6 pt-4 border-t">
                    <button className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors">
                      Edit
                    </button>
                    <button className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                      Use Template
                    </button>
                  </div>
                </DashboardCard>
              ))}
            </div>
          </div>
        )}
        
        {/* Notification History */}
        {activeTab === "history" && (
          <div>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
              <div className="relative w-full sm:w-80">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search history..."
                  className="w-full pl-10 pr-4 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
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
                    {notificationHistory.map((notification) => (
                      <tr key={notification.id} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{notification.title}</td>
                        <td className="py-3 px-4 text-muted-foreground">{notification.recipients}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`status-badge ${
                              notification.type === "SMS"
                                ? "status-badge-info"
                                : "status-badge-warning"
                            }`}
                          >
                            {notification.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{notification.date}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`status-badge ${
                              notification.status === "Delivered"
                                ? "status-badge-success"
                                : "status-badge-error"
                            }`}
                          >
                            {notification.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">{notification.deliveryRate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-muted-foreground">Showing 1-5 of 24 notifications</p>
                <div className="flex items-center space-x-2">
                  <button className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors">
                    Previous
                  </button>
                  <button className="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                    Next
                  </button>
                </div>
              </div>
            </DashboardCard>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Notifications;
