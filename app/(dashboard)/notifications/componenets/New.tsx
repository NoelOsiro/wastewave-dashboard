import { DashboardCard } from '@/components/dashboard/DashboardCard'
import React from 'react'
import { sendNotification } from '../actions'
import { Mail, MessageSquare, Send } from 'lucide-react'

const New = () => {
  return (
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardCard>
            <h3 className="text-lg font-medium mb-6">Create New Notification</h3>
            <form action={sendNotification} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="title">
                  Notification Title
                </label>
                <input id="title" name="title" type="text" className="glass-input w-full px-3 py-2 rounded-md" placeholder="Enter notification title" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="type">
                  Notification Type
                </label>
                <select id="type" name="type" className="glass-input w-full px-3 py-2 rounded-md">
                  <option value="sms">SMS</option>
                  <option value="email">Email</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="recipients">
                  Recipients
                </label>
                <select id="recipients" name="recipients" className="glass-input w-full px-3 py-2 rounded-md">
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
                <label className="block text-sm font-medium mb-1" htmlFor="message">
                  Message
                </label>
                <textarea id="message" name="message" rows={6} className="glass-input w-full px-3 py-2 rounded-md" placeholder="Enter your message here" required />
              </div>
              <div className="pt-4 flex justify-end">
                <button type="submit" className="glass-button inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium">
                  <Send size={16} className="mr-2" />
                  Send Notification
                </button>
              </div>
            </form>
          </DashboardCard>
        </div>
        <div>
          <DashboardCard>
            <h3 className="text-lg font-medium mb-6">Notification Preview</h3>
            {
              /* Static preview since no dynamic state */
            }
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
                    [WasteWave] Your garbage collection is scheduled for tomorrow at 9:00 AM.
                    Please ensure your waste is properly sorted and placed outside. Thank you!
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
                  <p className="text-sm mb-3">Dear Resident,</p>
                  <p className="text-sm mb-3">
                    This is a reminder that your garbage collection is scheduled for tomorrow at
                    9:00 AM.
                  </p>
                  <p className="text-sm mb-3">
                    Please ensure your waste is properly sorted and placed outside for
                    collection.
                  </p>
                  <p className="text-sm mb-1">Thank you for your cooperation!</p>
                  <p className="text-sm font-medium">WasteWave Team</p>
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>
      </div>
  )
}

export default New