import { z } from "zod";

export const ReportFile = z.object({
  fmt: z.string(),
  url: z.string(),
  md5: z.string()
});
export type ReportFile = z.infer<typeof ReportFile>;

export const ReportJob = z.object({
  jobId: z.string(),
  files: z.array(ReportFile)
});
export type ReportJob = z.infer<typeof ReportJob>;
