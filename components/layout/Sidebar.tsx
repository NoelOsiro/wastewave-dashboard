"use client"
import React, { useState } from "react";
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Users, 
  Calendar, 
  CreditCard, 
  Bell, 
  Award, 
  Settings, 
  X,
  ChevronRight
} from "lucide-react";



interface SidebarProps {
  initialSidebarOpen: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any // Adjust type
}

export const Sidebar: React.FC<SidebarProps> = ({ initialSidebarOpen, user}) => {
  const [open, setOpen] = useState(initialSidebarOpen)
  const pathname = usePathname();
  
  const sidebarLinks = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/",
    },
    {
      title: "Houses",
      icon: Users,
      href: "/houses",
    },
    {
      title: "Schedule",
      icon: Calendar,
      href: "/schedule",
    },
    {
      title: "Payments",
      icon: CreditCard,
      href: "/payments",
    },
    {
      title: "Notifications",
      icon: Bell,
      href: "/notifications",
    },
    {
      title: "Rewards",
      icon: Award,
      href: "/rewards",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/settings",
    },
  ];
  
  const isCurrentPath = (path: string) => {
    return pathname === path;
  };
  
  return (
    <>
      {/* Mobile sidebar backdrop */}
      {open && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden" 
          onClick={() => setOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-30 h-full w-64 transform transition-all duration-300 ease-in-out bg-sidebar border-r border-sidebar-border lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-eco-500 flex items-center justify-center">
                <span className="text-white font-bold">WW</span>
              </div>
              <span className="text-lg font-semibold">WasteWave</span>
            </Link>
            <button 
              className="p-1 rounded-full hover:bg-sidebar-accent lg:hidden"
              onClick={() => setOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Navigation links */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {sidebarLinks.map((link) => {
              const isActive = isCurrentPath(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center px-3 py-2 rounded-lg transition-all group ${
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  }`}
                >
                  <link.icon size={20} className="mr-3" />
                  <span className="flex-1">{link.title}</span>
                  {isActive && <ChevronRight size={16} />}
                </Link>
              );
            })}
          </nav>
          
          {/* Sidebar footer */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-eco-100 flex items-center justify-center text-eco-700">
                <span className="font-semibold">WA</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Waste Admin</p>
                <p className="text-xs text-sidebar-foreground/70">admin@wastewave.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
