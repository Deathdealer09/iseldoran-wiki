import { getStore } from "@/lib/db";
import { Dashboard } from "@/components/Dashboard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const store = await getStore();
  return <Dashboard services={store.services} />;
}
