import RouterView from "@/components/router/RouterView";
import { request }  from "@/lib/api";

export default async function RouterPage({ params:{orgId} }) {
  const data = await request("/org/{orgId}/router", "get",{orgId});
  return <RouterView initial={data} orgId={orgId} />;
}
