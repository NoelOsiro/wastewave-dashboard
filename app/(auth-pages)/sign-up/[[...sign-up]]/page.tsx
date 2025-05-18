"use client";
import { SignUp } from "@clerk/nextjs";

export default function Signup() {

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      {/* Left side - Form */}
      <div className="p-8 flex-1 flex flex-col justify-center items-center order-2 md:order-1">
      <div className="p-8 flex-1 flex flex-col justify-center items-center">
      <div className="w-full max-w-lg">
        <SignUp />
      </div>
      </div>
      </div>

      {/* Right side - Gradient Background */}
      <div className="bg-gradient-to-bl from-primary/10 to-primary/50 p-10 flex-1 flex flex-col items-center justify-center relative overflow-hidden order-1 md:order-2">
        <div className="z-10 max-w-md text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Join Our Community</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Create an account to access our waste management platform and start managing your collections efficiently.
          </p>
          <div className="hidden md:block">
            <div className="bg-background/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-3">Smart Waste Management</h3>
              <p className="text-sm opacity-80">
                Join as a homeowner, building manager, or waste collection company and experience our streamlined waste
                management solutions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}