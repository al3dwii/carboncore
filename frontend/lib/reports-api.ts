export async function generateReport(body: { fy: string }) {
  const r = await fetch("/api/reports/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!r.ok) throw new Error("Generate failed");
  return await r.json(); // { jobId: string }
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
