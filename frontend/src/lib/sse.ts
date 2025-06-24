import { NextResponse } from "next/server";

export function sse(
  handler: (send: (data: any) => void) => void | (() => void | Promise<void>),
) {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      const send = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };
      let cleanup: void | (() => void | Promise<void>);
      Promise.resolve(handler(send)).then((fn) => {
        cleanup = fn;
      });
      return () => cleanup && cleanup();
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
