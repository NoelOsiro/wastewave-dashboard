
import React from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import PaymentConfig from "@/components/dashboard/PaymentsConfig";





const Settings = () => {

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your application settings and configuration.
          </p>
        </div>
        <Separator />
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="config">Payment Config</TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure your general application settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" defaultValue="WasteWave Management" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="America/New_York">
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select defaultValue="MM/DD/YYYY">
                    <SelectTrigger>
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save changes</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Email Settings</CardTitle>
                <CardDescription>
                  Configure your email notification settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications for important events.
                    </p>
                  </div>
                  <Switch id="emailNotifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketingEmails">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive marketing and promotional emails.
                    </p>
                  </div>
                  <Switch id="marketingEmails" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize the appearance of your dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Button variant="outline" className="justify-start">
                      <span className="h-4 w-4 rounded-full bg-primary mr-2"></span>
                      Light
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <span className="h-4 w-4 rounded-full bg-slate-900 mr-2"></span>
                      Dark
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <span className="h-4 w-4 rounded-full bg-[conic-gradient(from_0deg,white_0%,white_50%,black_50%,black_100%)] mr-2"></span>
                      System
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Accent Color</Label>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-6">
                    <div className="flex items-center justify-center p-2 border border-gray-200 rounded-md">
                      <span className="w-8 h-8 rounded-full bg-blue-500"></span>
                    </div>
                    <div className="flex items-center justify-center p-2 border border-gray-200 rounded-md">
                      <span className="w-8 h-8 rounded-full bg-green-500"></span>
                    </div>
                    <div className="flex items-center justify-center p-2 border border-gray-200 rounded-md">
                      <span className="w-8 h-8 rounded-full bg-purple-500"></span>
                    </div>
                    <div className="flex items-center justify-center p-2 border border-gray-200 rounded-md">
                      <span className="w-8 h-8 rounded-full bg-red-500"></span>
                    </div>
                    <div className="flex items-center justify-center p-2 border border-gray-200 rounded-md">
                      <span className="w-8 h-8 rounded-full bg-yellow-500"></span>
                    </div>
                    <div className="flex items-center justify-center p-2 border border-gray-200 rounded-md">
                      <span className="w-8 h-8 rounded-full bg-pink-500"></span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure how you receive notifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="pushNotifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications in your browser.
                    </p>
                  </div>
                  <Switch id="pushNotifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="smsNotifications">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive important notifications via SMS.
                    </p>
                  </div>
                  <Switch id="smsNotifications" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="soundAlerts">Sound Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Play sound when notifications arrive.
                    </p>
                  </div>
                  <Switch id="soundAlerts" defaultChecked />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
                <CardDescription>
                  View system information and performance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium">Application Version</p>
                      <p className="text-sm text-muted-foreground">v1.0.0</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Last Updated</p>
                      <p className="text-sm text-muted-foreground">July 14, 2023</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Database Status</p>
                      <p className="text-sm text-green-500">Connected</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Server Status</p>
                      <p className="text-sm text-green-500">Online</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Check for Updates</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="config" className="space-y-4">
            <PaymentConfig />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
