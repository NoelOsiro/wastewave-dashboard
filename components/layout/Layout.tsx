import React from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
// import { TooltipProvider } from "@radix-ui/react-tooltip";
// import { createClient } from "@/lib/server";

interface LayoutProps {
  children: React.ReactNode;
  initialSidebarOpen?: boolean
}

export async function Layout({ children, initialSidebarOpen = true }: LayoutProps) {
  // const supabase = await createClient()
  // const { data: userData } = await supabase.from('users').select('*').single()
  const userData = {
    name: "Waste Admin",
    email: "admin@wastewave.com",
    role: "house",
    image: "https://images.unsplash.com/photo-1502685104226-e9b3c4f2e0a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  }
  return (

      <div className="h-screen flex flex-col overflow-hidden">
        <Topbar initialSidebarOpen={initialSidebarOpen} user={userData} />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar initialSidebarOpen={initialSidebarOpen} user={userData} />

          <main className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out bg-background ${initialSidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
            <div className="container mx-auto py-6 px-4 md:px-6 animate-fade-in">
              {children}
            </div>
          </main>
        </div>
      </div>
  );
};
