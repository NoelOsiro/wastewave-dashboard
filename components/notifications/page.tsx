
import NotificationMetrics from "./NotificationMetrics";
import NotificationTabs from "./NotificationTabs";
import New from "./New";
import History from "./History";
import Templates from "./Templates";
import { fetchNotificationHistory, fetchNotificationMetrics, fetchNotificationTemplates } from "@/utils/notifications";

// Fetch data from Backend
async function fetchNotificationData() {

  const templates = await fetchNotificationTemplates();
  const history = await fetchNotificationHistory();
  const metrics = await fetchNotificationMetrics();

  return {
    templates: templates || [],
    history: history || [],
    metrics: metrics || { total_sent: 0, sms_sent: 0, email_sent: 0, delivery_rate: "0%" },
  };
}
interface NotificationsPageProps {
  
  searchParams: Promise<{tab?: string; error?: string }>;
}

function Header(props: { error: string | undefined }) {
  return (<div>
    <h1 className="font-semibold tracking-tight">Notifications</h1>
    <p className="text-muted-foreground mt-1">Send and manage notifications.</p>
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