
"use client";

import { HouseData } from "../hooks/useFormSchema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Mail, Phone, MapPin, Home, User } from "lucide-react";
import Link from "next/link";

interface HouseDetailsCardProps {
  house: HouseData;
}

export function HouseDetailsCard({ house }: HouseDetailsCardProps) {
  return (
    <Card className="glass-card h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Home size={20} className="text-primary" />
            House Details
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            asChild
            className="text-muted-foreground hover:text-foreground"
          >
            <Link href={`/houses/edit/${house.id}`}>
              <Edit size={16} className="mr-2" />
              Edit
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Owner</h3>
                <p className="text-lg font-medium flex items-center gap-2">
                  <User size={16} className="text-primary" />
                  {house.owner}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Contact</h3>
                <p className="flex items-center gap-2">
                  <Phone size={16} className="text-primary" />
                  {house.contact}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Email</h3>
                <p className="flex items-center gap-2">
                  <Mail size={16} className="text-primary" />
                  {house.email}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Location</h3>
                <p className="flex items-center gap-2">
                  <MapPin size={16} className="text-primary" />
                  {house.location}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    house.status === "Active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                  }`}
                >
                  {house.status}
                </span>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Payment Status</h3>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    house.payment_status === "Paid"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      : house.payment_status === "Pending"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                  }`}
                >
                  {house.payment_status}
                </span>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Last Collection</h3>
                <p>{house.last_collection || "No collections yet"}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
