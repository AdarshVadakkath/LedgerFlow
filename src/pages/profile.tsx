import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin, Calendar, Building2, Briefcase, Camera, Shield, Bell } from "lucide-react";

export function Profile() {
  const user = {
    name: "Rahul Jain",
    role: "Audit Manager",
    email: "rahul.jain@example.com",
    phone: "+91 98765 43210",
    location: "Mumbai HQ",
    department: "Audit & Assurance",
    joined: "March 2021",
    initials: "RJ",
  };

  return (
    <div className="container max-w-5xl space-y-8 p-4 lg:p-6 pb-20">
       <div className="flex flex-col space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences.</p>
       </div>

       {/* Banner & Avatar section */}
       <div className="relative rounded-xl overflow-hidden border bg-background text-card-foreground shadow-sm">
         <div className="h-32 md:h-48 w-full bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-900/40 dark:to-indigo-900/40 relative">
            <Button size="sm" variant="secondary" className="absolute bottom-4 right-4 gap-2 text-xs">
              <Camera className="h-4 w-4" /> Change Cover
            </Button>
         </div>
         <div className="relative px-6 pb-6 pt-16 sm:pt-20">
           <Avatar className="absolute -top-12 sm:-top-16 left-6 h-24 w-24 sm:h-32 sm:w-32 ring-4 ring-background border-2 border-background">
             <AvatarImage src="" />
             <AvatarFallback className="text-3xl sm:text-5xl font-bold bg-primary/10 text-primary">{user.initials}</AvatarFallback>
           </Avatar>
           <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
             <div className="space-y-1 mt-2">
               <h2 className="text-2xl font-bold">{user.name}</h2>
               <p className="text-muted-foreground font-medium flex items-center gap-2">
                 <Briefcase className="h-4 w-4" /> {user.role}
               </p>
             </div>
             <div className="flex gap-2">
               <Button variant="outline">Share Profile</Button>
               <Button>Edit Profile</Button>
             </div>
           </div>
         </div>
       </div>

       {/* Tabs section */}
       <Tabs defaultValue="overview" className="space-y-6">
         <TabsList className="bg-muted/50 w-full justify-start rounded-lg border-b-0 h-10 p-1 overflow-x-auto">
           <TabsTrigger value="overview" className="rounded-md">Overview</TabsTrigger>
           <TabsTrigger value="security" className="rounded-md">Security</TabsTrigger>
           <TabsTrigger value="notifications" className="rounded-md">Notifications</TabsTrigger>
         </TabsList>

         <TabsContent value="overview" className="space-y-6">
           <div className="grid gap-6 md:grid-cols-2">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium leading-none">Email Address</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Phone className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium leading-none">Phone Number</p>
                      <p className="text-sm text-muted-foreground">{user.phone}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium leading-none">Location</p>
                      <p className="text-sm text-muted-foreground">{user.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Employment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Briefcase className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium leading-none">Job Title</p>
                      <p className="text-sm text-muted-foreground">{user.role}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium leading-none">Department</p>
                      <p className="text-sm text-muted-foreground">{user.department}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium leading-none">Date Joined</p>
                      <p className="text-sm text-muted-foreground">{user.joined}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
           </div>
         </TabsContent>

         <TabsContent value="security" className="space-y-6">
           <Card className="shadow-sm max-w-2xl">
             <CardHeader>
               <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /> Change Password</CardTitle>
               <CardDescription>Update your password to keep your account secure.</CardDescription>
             </CardHeader>
             <CardContent className="space-y-4">
               <div className="space-y-2">
                 <Label htmlFor="current-password">Current Password</Label>
                 <Input id="current-password" type="password" />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="new-password">New Password</Label>
                 <Input id="new-password" type="password" />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="confirm-password">Confirm Password</Label>
                 <Input id="confirm-password" type="password" />
               </div>
             </CardContent>
             <CardFooter>
                <Button>Update Password</Button>
             </CardFooter>
           </Card>
         </TabsContent>

         <TabsContent value="notifications" className="space-y-6">
           <Card className="shadow-sm max-w-2xl">
             <CardHeader>
               <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary" /> Notification Preferences</CardTitle>
               <CardDescription>Choose what notifications you want to receive.</CardDescription>
             </CardHeader>
             <CardContent>
               <div className="space-y-4">
                 <div className="flex items-center justify-between rounded-lg border p-4">
                   <div className="space-y-0.5">
                     <Label className="text-base">Email Notifications</Label>
                     <p className="text-sm text-muted-foreground">Receive emails about new tasks and updates.</p>
                   </div>
                   <Button variant="secondary" size="sm" className="bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 border-none">Enabled</Button>
                 </div>
                 <div className="flex items-center justify-between rounded-lg border p-4">
                   <div className="space-y-0.5">
                     <Label className="text-base">Push Notifications</Label>
                     <p className="text-sm text-muted-foreground">Receive push notifications when someone mentions you.</p>
                   </div>
                   <Button variant="secondary" size="sm" className="bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 border-none">Enabled</Button>
                 </div>
               </div>
             </CardContent>
           </Card>
         </TabsContent>
       </Tabs>
    </div>
  );
}
