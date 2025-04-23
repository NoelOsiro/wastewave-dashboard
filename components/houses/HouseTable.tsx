"use client";

import { useState } from "react";
import {
  Search, SlidersHorizontal, Download, MoreHorizontal,
  MapPin, Phone, Eye, Edit, Trash
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DashboardCard } from "@/components/dashboard/DashboardCard";

import Link from "next/link";
import { HouseData } from "@/lib/types";

type HouseTableProps = {
  initialHouses: HouseData[];
  onView: (house: HouseData) => void;
  onEdit: (house: HouseData) => void;
  onDelete: (house: HouseData) => void;
};

export const HouseTable = ({ initialHouses, onView, onEdit, onDelete }: HouseTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredHouses = initialHouses.filter((house) =>
    searchQuery === "" ||
    house.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    house.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    house.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardCard>
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
        <div className="relative w-full sm:w-80">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <Button variant="outline" size="sm">
            <SlidersHorizontal size={16} className="mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <Download size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>House Name</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Last Collection</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHouses.map((house) => (
              <TableRow key={house.id}>
                <TableCell>{house.name}</TableCell>
                <TableCell>
                  <div>{house.owner}</div>
                  <div className="text-xs text-muted-foreground flex items-center mt-1">
                    <Phone size={12} className="mr-1" />
                    {house.contact}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <MapPin size={14} className="mr-1 text-muted-foreground" />
                    <span className="text-sm truncate max-w-[200px]">{house.location}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${house.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {house.status}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${house.payment_status === "Paid" ? "bg-green-100 text-green-800" : house.payment_status === "Pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>
                    {house.payment_status}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">{house.last_collection}</TableCell>
                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal size={16} />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40 p-0">
                      <div className="p-1">
                        <Link href={`/houses/${house.id}`} >
                        <Button variant="ghost" className="w-full justify-start text-sm">
                          <Eye size={14} className="mr-2" /> View
                        </Button>
                        </Link>
                        <Link href={`/houses/edit/${house.id}`} >
                        <Button variant="ghost" className="w-full justify-start text-sm">
                        <Edit size={14} className="mr-2" /> Edit
                        </Button>
                        </Link>
                        <Link href={`/houses/collection/${house.id}`} >
                        <Button variant="ghost" className="w-full justify-start text-sm">
                        <SlidersHorizontal size={14} className="mr-2" /> Collection
                        </Button>
                        </Link>
                        <Button variant="ghost" className="w-full justify-start text-sm text-destructive" onClick={() => onDelete(house)}>
                          <Trash size={14} className="mr-2" /> Delete
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-muted-foreground">
          Showing {filteredHouses.length} of {initialHouses.length} houses
        </p>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">Previous</Button>
          <Button size="sm">Next</Button>
        </div>
      </div>
    </DashboardCard>
  );
};