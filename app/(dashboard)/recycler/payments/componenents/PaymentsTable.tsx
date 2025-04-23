"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  CreditCard,
  Check,
  X,
  AlertCircle,
  MoreHorizontal,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Payment } from "@/lib/types";



type PaymentsTableProps = {
  initialPayments: Payment[];
};

export const PaymentsTable = ({ initialPayments }: PaymentsTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 5;

  const filteredPayments = initialPayments.filter(
    (payment) =>
      searchQuery === "" ||
      payment.house.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.transaction_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
        <div className="relative w-full sm:w-80">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search payments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <button className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors">
            <Filter size={16} className="mr-2" />
            Filter
          </button>
          <button className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors">
            <Download size={16} className="mr-2" />
            Export
          </button>
        </div>
      </div>
      <Card className="border shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-4 font-medium">Invoice</th>
                  <th className="text-left py-4 px-4 font-medium">House</th>
                  <th className="text-left py-4 px-4 font-medium">Amount</th>
                  <th className="text-left py-4 px-4 font-medium">Method</th>
                  <th className="text-left py-4 px-4 font-medium">Date</th>
                  <th className="text-left py-4 px-4 font-medium">Status</th>
                  <th className="text-right py-4 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b last:border-0 hover:bg-muted/50"
                  >
                    <td className="py-4 px-4 font-medium">{payment.id}</td>
                    <td className="py-4 px-4">
                      <div>{payment.house}</div>
                      <div className="text-xs text-muted-foreground">{payment.owner}</div>
                    </td>
                    <td className="py-4 px-4 font-medium">${payment.amount}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <CreditCard size={14} className="mr-1 text-muted-foreground" />
                        <span>{payment.method}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {payment.transaction_id}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">{payment.date}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          payment.status === "Paid"
                            ? "bg-status-success/10 text-status-success"
                            : payment.status === "Pending"
                            ? "bg-status-warning/10 text-status-warning"
                            : "bg-status-error/10 text-status-error"
                        }`}
                      >
                        {payment.status === "Paid" && <Check size={12} className="mr-1" />}
                        {payment.status === "Pending" && (
                          <AlertCircle size={12} className="mr-1" />
                        )}
                        {payment.status === "Overdue" && <X size={12} className="mr-1" />}
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button className="p-1 rounded-md hover:bg-accent">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between p-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, filteredPayments.length)} of{" "}
              {filteredPayments.length} payments
            </p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={handlePrevPage}
                    className={
                      currentPage === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                    }
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={currentPage === i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={handleNextPage}
                    className={
                      currentPage === totalPages
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};