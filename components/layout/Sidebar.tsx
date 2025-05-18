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
  ChevronRight,
  User2Icon,
  Building2,
  ClipboardList,
  FileBarChart,
  HelpCircle,
  MapPin,
  Truck
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { SerializedUser } from "@/lib/types";




interface SidebarProps {
  initialSidebarOpen: boolean
}
const getNavItems = (role:string) => {
  const commonLinks = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/dashboard",
    },
    {
      title: "Profile",
      icon: User2Icon,
      href: "/profile",
    },
  ]

  switch (role) {
    case "generator":
      return [
        ...commonLinks,
        {
          title: "Waste Log",
          icon: ClipboardList,
          href: "/generator/waste-log",
        },
        {
          title: "Schedule",
          icon: Calendar,
          href: "/generator/schedule",
        },
        {
          title: "Payments",
          icon: CreditCard,
          href: "/generator/payments",
        },
        {
          title: "Rewards",
          icon: Award,
          href: "/generator/rewards",
        },
        {
          title: "Help",
          icon: HelpCircle,
          href: "/help",
        },
      ]

    case "transporter":
      return [
        ...commonLinks,
        {
          title: "Routes",
          icon: MapPin,
          href: "/transporter/routes",
        },
        {
          title: "Live Tracking",
          icon: Truck,
          href: "/transporter/tracking",
        },
        {
          title: "Schedule",
          icon: Calendar,
          href: "/transporter/schedule",
        },
        {
          title: "Documents",
          icon: FileBarChart,
          href: "/transporter/documents",
        },
        {
          title: "Notifications",
          icon: Bell,
          href: "/notifications",
        },
        {
          title: "Help",
          icon: HelpCircle,
          href: "/help",
        },
      ]

    case "recycler":
      return [
        ...commonLinks,
        {
          title: "Inbound Waste",
          icon: ClipboardList,
          href: "/recycler/inbound",
        },
        {
          title: "Processing Stats",
          icon: FileBarChart,
          href: "/recycler/processing",
        },
        {
          title: "Schedule",
          icon: Calendar,
          href: "/schedule",
        },
        {
          title: "Payments",
          icon: CreditCard,
          href: "/recycler/payments",
        },
        {
          title: "Notifications",
          icon: Bell,
          href: "/notifications",
        },
        {
          title: "Settings",
          icon: Settings,
          href: "/settings",
        },
      ]

    case "disposer":
      return [
        ...commonLinks,
        {
          title: "Intake Records",
          icon: ClipboardList,
          href: "/disposer/intake",
        },
        {
          title: "Monitoring",
          icon: FileBarChart,
          href: "/disposer/monitoring",
        },
        {
          title: "Environmental Logs",
          icon: Building2,
          href: "/disposer/environment",
        },
        {
          title: "Compliance",
          icon: Settings,
          href: "/disposer/compliance",
        },
        {
          title: "Help",
          icon: HelpCircle,
          href: "/help",
        },
      ]
    case "admin":
      return [
        ...commonLinks,
        {
          title: "Users",
          icon: Users,
          href: "/admin/users",
        },
        {
          title: "Roles",
          icon: Award,
          href: "/admin/roles",
        },
        {
          title: "Settings",
          icon: Settings,
          href: "/admin/settings",
        },
      ]

    default:
      return commonLinks
  }
}
export const Sidebar: React.FC<SidebarProps> = ({ initialSidebarOpen}) => {
  const [open, setOpen] = useState(initialSidebarOpen)
  const pathname = usePathname();
  const { user } = useUser();
  const serializedUser: SerializedUser | null = user
    ? {
        id: user.id,
        email: user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress || null,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.publicMetadata.role as string | null,
        imageUrl: user.imageUrl,
      }
    : null;
  const sidebarLinks = getNavItems(serializedUser?.role as string);
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
