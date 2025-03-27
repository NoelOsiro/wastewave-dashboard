
import React from "react";
import { DashboardCard } from "./DashboardCard";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";

interface DashboardMetricProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  className?: string;
}

export const DashboardMetric: React.FC<DashboardMetricProps> = ({
  title,
  value,
  description,
  trend,
  icon,
  className,
}) => {
  return (
    <DashboardCard className={cn("h-full", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          
          {trend && (
            <div className="flex items-center mt-2">
              <span
                className={cn(
                  "inline-flex items-center text-xs font-medium",
                  trend.isPositive ? "text-status-success" : "text-status-error"
                )}
              >
                {trend.isPositive ? (
                  <ArrowUp size={14} className="mr-1" />
                ) : (
                  <ArrowDown size={14} className="mr-1" />
                )}
                {Math.abs(trend.value)}%
              </span>
              {description && (
                <span className="text-xs text-muted-foreground ml-2">
                  {description}
                </span>
              )}
            </div>
          )}
          
          {!trend && description && (
            <p className="text-sm text-muted-foreground mt-2">{description}</p>
          )}
        </div>
        
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
    </DashboardCard>
  );
};
