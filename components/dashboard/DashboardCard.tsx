
import React from "react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  children,
  className,
  footer,
}) => {
  return (
    <div className={cn("dashboard-card animate-scale-in", className)}>
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
      )}
      <div>{children}</div>
      {footer && <div className="mt-4 pt-4 border-t">{footer}</div>}
    </div>
  );
};
