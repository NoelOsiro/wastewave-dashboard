import type React from "react"
import { TooltipProvider } from "@radix-ui/react-tooltip"
import { Topbar } from "@/components/layout/Topbar"
import { Sidebar } from "@/components/layout/Sidebar"
import { redirect } from "next/navigation"
import { Toaster } from "sonner"
import { currentUser } from "@clerk/nextjs/server"

interface LayoutProps {
  children: React.ReactNode
  initialSidebarOpen?: boolean
}

export default async function Layout({ children, initialSidebarOpen = true }: LayoutProps) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in")
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <TooltipProvider delayDuration={200}>
        <Topbar initialSidebarOpen={initialSidebarOpen} user={user} />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar initialSidebarOpen={initialSidebarOpen} user={user} />

          <main
            className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out bg-background ${
              initialSidebarOpen ? "lg:ml-64" : "ml-0"
            }`}
          >
            <div className="container mx-auto py-6 px-4 md:px-6 animate-fade-in text-foreground">{children}</div>
          </main>
        </div>
      </TooltipProvider>
      <Toaster richColors position="top-right" />
    </div>
  )
}
