import { sse } from "@/lib/sse";

export async function GET() {
  return sse((send, close) => {
    let remaining = 100;        // fake starting value
    send({ remaining });

    const id = setInterval(() => {
      remaining -= 5;
      send({ remaining });

      // stop at -50 for demo
      if (remaining <= -50) close();
    }, 4_000);

    // cleanup when the stream ends
    return () => clearInterval(id);
  });
}
