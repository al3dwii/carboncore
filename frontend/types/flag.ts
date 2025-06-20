export type FlagName =
  | "budget"
  | "router"
  | "scheduler"
  | "offsets"
  | "pulse";

export interface Flag {
  key: string;
  name: FlagName;
  enabled: boolean;
}

