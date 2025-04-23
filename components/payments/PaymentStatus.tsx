import { Card, CardContent } from "@/components/ui/card";
import { BreakdownItem } from "@/lib/types";


type PaymentStatusProps = {
  paymentStatusBreakdown: BreakdownItem[];
};

export const PaymentStatus = ({ paymentStatusBreakdown }: PaymentStatusProps) => {
  const totalPayments = paymentStatusBreakdown.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="border shadow-sm">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Payment Status</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {paymentStatusBreakdown.map((item, index) => {
            const percentage = totalPayments > 0 ? ((item.value / totalPayments) * 100).toFixed(1) : 0;
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  item.name === "Completed"
                    ? "bg-status-success/5 border-status-success/20"
                    : item.name === "Pending"
                    ? "bg-status-warning/5 border-status-warning/20"
                    : "bg-status-error/5 border-status-error/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p
                    className={`text-sm font-medium ${
                      item.name === "Completed"
                        ? "text-status-success"
                        : item.name === "Pending"
                        ? "text-status-warning"
                        : "text-status-error"
                    }`}
                  >
                    {item.name}
                  </p>
                  <p className="text-2xl font-bold">{percentage}%</p>
                </div>
                <div className="w-full bg-muted/50 rounded-full h-2 mt-3">
                  <div
                    className={`h-2 rounded-full ${
                      item.name === "Completed"
                        ? "bg-status-success"
                        : item.name === "Pending"
                        ? "bg-status-warning"
                        : "bg-status-error"
                    }`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{item.value} payments</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};