import React from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { currentUser } from "@clerk/nextjs/server";
interface LayoutProps {
  children: React.ReactNode;
  initialSidebarOpen?: boolean
}

export async function Layout({ children, initialSidebarOpen = true }: LayoutProps) {
  
  const user = await currentUser()

  return (

      <div className="h-screen flex flex-col overflow-hidden">
        <TooltipProvider delayDuration={200}>
          <div className="fixed inset-0 bg-background z-10" />        
          <Topbar initialSidebarOpen={initialSidebarOpen}  />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar initialSidebarOpen={initialSidebarOpen}/>

          <main className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out bg-background ${initialSidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
            <div className="container mx-auto py-6 px-4 md:px-6 animate-fade-in">
              {children}
            </div>
          </main>
        </div>
      </TooltipProvider>
      </div>
  );
};
