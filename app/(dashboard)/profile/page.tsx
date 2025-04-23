"use client"
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import { Profile as Profiletype } from "@/lib/types";
import { Loader } from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const [profile, setProfile] = useState<Profiletype | null>()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [isSubmittting, setIsSubmittting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const supabase = createClient();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single()
      setProfile(profile)
    }
    fetchProfile()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittting(true)
    if (!firstName || !lastName || !phone) {
      setErrorMessage("Please fill in all required fields")
      setIsSubmittting(false)
      return
    }
    try {
      // Upload file to Supabase Storage
      const { data, error } = await supabase.from("profiles").update({
        name: `${firstName} ${lastName}`,
        phone: phone
      }).eq("id", profile?.id).select().single()
      if (data) {
        toast.success("Profile updated")
      }
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to update")
      toast.error("Profile update failed")
    } finally {
      setIsSubmittting(false)
    }
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <Separator />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-8 lg:space-y-0">
        <aside className="lg:w-1/4">
          <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src="" alt="Profile" />
              <AvatarFallback className="text-2xl bg-primary/10 text-primary font-medium">WA</AvatarFallback>
            </Avatar>
            <div className="space-y-1 text-center">
              <h3 className="font-medium text-lg">{profile?.email}</h3>
              <p className="text-sm text-muted-foreground">Administrator</p>
            </div>
          </div>
        </aside>
        <div className="flex-1 lg:max-w-3xl">
          <Tabs defaultValue="general">
            <TabsList className="w-full">
              <TabsTrigger value="general" className="flex-1">General</TabsTrigger>
              <TabsTrigger value="password" className="flex-1">Password</TabsTrigger>
              <TabsTrigger value="notifications" className="flex-1">Notifications</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>General Information</CardTitle>
                  <CardDescription>
                    Update your account information.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input
                          id="first-name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="e.g. Waste"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input
                          id="last-name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="e.g. Wave"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile?.email}
                          placeholder="e.g. Waste"
                          readOnly
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. Waste"
                          required
                        />
                      </div>
                    </div>
                    <Button onClick={handleSubmit} disabled={isSubmittting}  >
                      {isSubmittting ? (
                        <>
                          <Loader className="animate-spin h-4 w-4 mr-2" /> Uploading...
                        </>
                      ) : ("Update profile")}</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="password" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to a secure one.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                  </div>
                  <Button>Change password</Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="notifications" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Manage how you receive notifications.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Notification preferences will be implemented in a future update.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
