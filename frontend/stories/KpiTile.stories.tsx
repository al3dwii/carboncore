import type { Meta, StoryObj } from "@storybook/react";
import { KpiTile } from "@/components/kpi/KpiTile";

export default { component: KpiTile } satisfies Meta<typeof KpiTile>;

export const Default: StoryObj<typeof KpiTile> = {
  args: { label: "Projects", value: 24 },
};
