"use client";
import { Org } from "@/types/org";
import { Menu } from "@headlessui/react";
import { useRouter, usePathname } from "next/navigation";
import useSWR from "swr";

export function OrgSwitcher({ currentId }: { currentId: string }) {
  const { data: orgs = [] } = useSWR<Org[]>("/api/orgs", (u) => fetch(u).then((r) => r.json()));
  const router = useRouter();
  const path = usePathname();

  const newOrgPath = (id: string) => path!.replace(`/org/${currentId}`, `/org/${id}`);

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="px-3 py-1 rounded bg-white/10">
        {orgs.find(o => o.id === currentId)?.name}
      </Menu.Button>
      <Menu.Items className="absolute right-0 mt-2 bg-cc-base border border-white/10 rounded">
        {orgs.map((o) => (
          <Menu.Item key={o.id}>
            {({ active }) => (
              <button
                className={`block w-full text-left px-4 py-2 ${active ? "bg-white/10" : ""}`}
                onClick={() => router.replace(newOrgPath(o.id))}
              >
                {o.name}
              </button>
            )}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
}
