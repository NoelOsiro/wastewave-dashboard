/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useState, useEffect } from "react";
import { Menu, Bell, Moon, Sun, Search, Settings } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface TopbarProps {
  initialSidebarOpen: boolean
  user: any
}

interface PageLink {
  title: string;
  url: string;
  description: string;
}

export const Topbar: React.FC<TopbarProps> = ({ initialSidebarOpen, user }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(initialSidebarOpen)
  const [isMobile, setIsMobile] = useState(false)
  const { signOut } = useClerk();
  const router = useRouter();
  
  // Mobile detection (moved from Layout)
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      setSidebarOpen(mobile ? false : true) // Default based on screen size
    }
    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  // Page links for search suggestions
  const pageLinks: PageLink[] = [
    { title: "Dashboard", url: "/", description: "Overview of waste collection metrics" },
    { title: "Houses", url: "/houses", description: "Manage residential properties" },
    { title: "Schedule", url: "/schedule", description: "View and manage collection schedules" },
    { title: "Payments", url: "/payments", description: "Track and process payments" },
    { title: "Notifications", url: "/notifications", description: "System notifications and alerts" },
    { title: "Rewards", url: "/rewards", description: "Customer reward programs" },
    { title: "Settings", url: "/settings", description: "System configuration and preferences" },
    { title: "Profile", url: "/profile", description: "Your account information" }
  ];
  
  // Filtered page links based on search query
  const filteredLinks = pageLinks.filter(link => 
    link.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    link.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Check for user's preferred color scheme
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = localStorage.getItem('theme') === 'dark' || 
        ((!localStorage.getItem('theme')) && 
        window.matchMedia('(prefers-color-scheme: dark)').matches);
      
      setIsDarkMode(isDark);
      
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);
  
  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const markAllAsRead = () => {
    setUnreadNotifications(0);
  };

  

const handleLogout = async () => {
  try {
    await signOut();
    router.push('/sign-in');
  } catch (error) {
    console.error('Error logging out:', error);
    // Optionally show an error toast/notification
  }
};
  
  return (
    <header className="h-16 bg-background border-b border-border flex items-center px-4 z-10">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <button 
            className="p-2 rounded-full hover:bg-accent lg:hidden"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>
          
          {/* <div className="hidden md:flex flex-col ml-4">
            <span className="font-medium text-sm">{user.name}</span>
            <span className="text-xs text-muted-foreground">{user.role}</span>
          </div> */}
        </div>
        {/* Centered Search */}
        <div className="flex-1 max-w-md mx-auto relative">
          <Popover open={showSearchResults && searchQuery.length > 0} onOpenChange={setShowSearchResults}>
            <PopoverTrigger asChild>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search pages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSearchResults(true)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0" align="center">
              <Command>
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading="Pages">
                    {filteredLinks.map((link) => (
                      <CommandItem key={link.url} onSelect={() => {
                        window.location.href = link.url;
                        setShowSearchResults(false);
                        setSearchQuery("");
                      }}>
                        <div className="flex flex-col">
                          <span>{link.title}</span>
                          <span className="text-xs text-muted-foreground">{link.description}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:block text-sm text-muted-foreground">
            {formatDate(currentTime)}
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <button 
                className="p-2 rounded-full hover:bg-accent relative"
                aria-label="Notifications"
              >
                <Bell size={20} />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
              <div className="flex items-center justify-between p-4 border-b">
                <h4 className="font-medium">Notifications</h4>
                {unreadNotifications > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-xs text-primary hover:underline"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-[300px] overflow-auto">
                <div className="p-4 border-b bg-accent/40">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium text-sm">New payment received</p>
                    <span className="text-xs text-muted-foreground">2h ago</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Wilson Home sent a payment of $850</p>
                </div>
                <div className="p-4 border-b bg-accent/40">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium text-sm">House status updated</p>
                    <span className="text-xs text-muted-foreground">6h ago</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Patel Family status changed to Active</p>
                </div>
                <div className="p-4 border-b">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium text-sm">Collection scheduled</p>
                    <span className="text-xs text-muted-foreground">1d ago</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Collection scheduled for Garcia Residence tomorrow</p>
                </div>
              </div>
              <div className="p-3 border-t text-center">
                <a href="/notifications" className="text-sm text-primary hover:underline">
                  View all notifications
                </a>
              </div>
            </PopoverContent>
          </Popover>
          
          <button 
            className="p-2 rounded-full hover:bg-accent"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {/* Profile Avatar Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="focus:outline-none" aria-label="User profile">
                <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                  <AvatarImage src="" alt="Profile" />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">{user.user_metadata.name[0]}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center p-3">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src="" alt="Profile" />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">{user.user_metadata.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user.user_metadata.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Link href="/profile" className="flex items-center w-full">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Link href="/settings" className="flex items-center w-full">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-destructive" onClick={handleLogout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
