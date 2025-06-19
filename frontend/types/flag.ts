export type FlagName =
  | "budget"
  | "router"
  | "scheduler"
  | "offsets"
  | "pulse";

export interface Flag {
  name: FlagName;
  enabled: boolean;
}

