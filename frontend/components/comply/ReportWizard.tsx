"use client";
import { useState } from "react";
import { generateReport, pollStatus } from "@/lib/reports-api";
import { ProgressBar } from "./ProgressBar";
import { Button } from "@/components/ui/Button";

export function ReportWizard() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [fy, setFY] = useState<string>("");
  const [jobId, setJobId] = useState<string | undefined>();
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState<{ fmt: string; url: string; md5: string }[]>([]);

  async function handleGenerate() {
    const { jobId } = await generateReport({ fy });
    setJobId(jobId);
    setStep(2);
    const done = await pollStatus(jobId, (pct) => setProgress(pct));
    setFiles(done.files);
    setStep(3);
  }

  return (
    <div className="max-w-xl mx-auto">
      {step === 1 && (
        <>
          <h2 className="text-xl font-semibold mb-4">Step 1 · Choose fiscal year</h2>
          <select value={fy} onChange={(e) => setFY(e.target.value)} className="mb-4">
            <option value="">— select —</option>
            {['2023', '2024', '2025'].map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
          <Button disabled={!fy} onClick={handleGenerate}>
            Generate report
          </Button>
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="text-xl font-semibold mb-4">Step 2 · Generating…</h2>
          <ProgressBar value={progress} />
        </>
      )}

      {step === 3 && (
        <>
          <h2 className="text-xl font-semibold mb-4">Step 3 · Download</h2>
          <ul className="space-y-2">
            {files.map((f) => (
              <li
                key={f.fmt}
                className="flex justify-between items-center bg-white/5 px-4 py-2 rounded"
              >
                <span>{f.fmt.toUpperCase()}</span>
                <a href={f.url} download className="underline">
                  Download
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
