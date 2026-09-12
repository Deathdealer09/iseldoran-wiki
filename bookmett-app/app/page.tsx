import { getStore } from "@/lib/db";
import { Landing } from "@/components/Landing";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const store = await getStore();
  return <Landing services={store.services} business={store.business} />;
}
