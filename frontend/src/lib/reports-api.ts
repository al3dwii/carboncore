import { request } from "@/lib/api";

export async function generateReport(body: { fy: string }) {
  return request("/reports/generate", "post", {}, body);
}

export async function pollStatus(jobId: string, onProgress: (pct: number) => void) {
  return new Promise<{ files: any[] }>((resolve, reject) => {
    const es = new EventSource(`/api/reports/stream/${jobId}`);
    es.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      onProgress(msg.percent);
      if (msg.state === "done") {
        es.close();
        resolve(msg);
      }
      if (msg.state === "error") {
        es.close();
        reject(new Error("Report error"));
      }
    };
  });
}
