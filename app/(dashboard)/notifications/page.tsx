import { Layout } from "@/components/layout/Layout";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { DashboardMetric } from "@/components/dashboard/DashboardMetric";
import {
  Bell,
  Send,
  MessageSquare,
  Mail,
  Calendar,
  Users,
  Plus,
  Search,
  Filter,
  Check,
} from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { sendNotification, createTemplate } from "./actions";
import NotificationMetrics from "./componenets/NotificationMetrics";
import NotificationTabs from "./componenets/NotificationTabs";
import New from "./componenets/New";
import History from "./componenets/History";
import Templates from "./componenets/Templates";
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

// Fetch data from Supabase
async function fetchNotificationData() {
  const supabase = await createClient();

  const { data: templates } = await supabase.from("notification_templates").select("*");
  const { data: history } = await supabase.from("notifications").select("*").order("date", { ascending: false });
  const { data: metrics } = await supabase.rpc("get_notification_metrics"); // Assuming a custom RPC function

  return {
    templates: templates || [],
    history: history || [],
    metrics: metrics || { total_sent: 0, sms_sent: 0, email_sent: 0, delivery_rate: "0%" },
  };
}
interface NotificationsPageProps {
  
  searchParams: Promise<{tab?: string; error?: string }>;
}

function Header(props: { error: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) {
  return (<div>
    <h1 className="font-semibold tracking-tight">Notifications</h1>
    <p className="text-muted-foreground mt-1">Send and manage notifications to houses.</p>
    {props.error && <p className="text-red-500 mt-2">{props.error}</p>}
  </div>);
}


export default async function NotificationsPage({ searchParams }: NotificationsPageProps) {
  const resolvedParams = await searchParams;
  const activeTab = resolvedParams.tab || "new";
  const error = resolvedParams.error;
  const { templates, history, metrics } = await fetchNotificationData();

  return (
      <div className="space-y-8">
        <Header error={error}></Header>

        {/* Metrics */}
        <NotificationMetrics metrics={metrics} />

        {/* Tabs */}
        <NotificationTabs activeTab={activeTab} />

        {/* New Notification */}
        {activeTab === "new" && (
          <New />
        )}

        {/* Templates */}
        {activeTab === "templates" && (
          <Templates templates={templates} />
        )}

        {/* Notification History */}
        {activeTab === "history" && (
          <History history={history} />
        )}
      </div>
  );
}