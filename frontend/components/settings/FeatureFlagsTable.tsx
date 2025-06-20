"use client";
import { useFlags } from "@/lib/useFlags";
import { useOrg } from "@/lib/useOrg";
import { patchFlag } from "@/lib/flags-api";
import { Switch } from "@/components/ui/Switch";
import { toastSuccess, toastError } from "@/lib/toast";

const FLAG_META = [
  { key: "scheduler", label: "EcoShift Scheduler", role: "developer" },
  { key: "router", label: "EcoEdge Router", role: "developer" },
  { key: "budget", label: "Carbon Budget Copilot", role: "finops" }
] as const;

export function FeatureFlagsTable() {
  const { id } = useOrg();
  const { data: flagList = [] } = useFlags(id);
  const flags = Object.fromEntries(flagList.map(f => [f.key, f.enabled])) as Record<string, boolean>;

  async function toggle(key: string, enabled: boolean) {
    try {
      await patchFlag(key, enabled);
      toastSuccess("Flag updated");
    } catch {
      toastError("Update failed");
    }
  }

  return (
    <table className="text-sm w-full">
      <thead>
        <tr className="text-left text-white/60">
          <th className="py-2">Feature</th>
          <th>Role</th>
          <th>Enabled</th>
        </tr>
      </thead>
      <tbody>
        {FLAG_META.map((f) => (
          <tr key={f.key} className="border-t border-white/10">
            <td className="py-2">{f.label}</td>
            <td>{f.role}</td>
            <td>
              <Switch
                checked={flags[f.key]}
                onCheckedChange={(v) => toggle(f.key, v)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
