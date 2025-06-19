import { EdgeMap } from "@/components/router/Map";
import { PolicySlider } from "@/components/router/PolicySlider";
import { fetchPolicy } from "@/lib/policy-api";

export const dynamic = "force-dynamic";

export default async function RouterPage() {
  const { weight } = await fetchPolicy();
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">EcoEdge Router</h1>
      <PolicySlider initial={weight} />
      <EdgeMap />
    </section>
  );
}
