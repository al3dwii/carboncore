export function sse(
  streamFn: (
    send: (data: any) => void,
    close: () => void,
  ) => void | (() => void) | Promise<() => void>,
) {
  let cleanup: (() => void) | void;

  return new Response(
    new ReadableStream({
      async start(controller) {
        let open = true;

        /** safe writer – ignores pushes after close */
        const send = (data: any) => {
          if (!open) return;
          try {
            controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
          } catch {
            /* controller already closed – ignore */
          }
        };

        /** caller can close proactively */
        const close = () => {
          if (!open) return;
          open = false;
          controller.close();
          cleanup?.();
        };

        cleanup = await streamFn(send, close);

        // when the client disconnects (browser tab closed / nav away)
        this.signal?.addEventListener("abort", close);
      },

      cancel() {
        cleanup?.();
      },
    }),
    {
      headers: {
        "Content-Type": "text/event-stream",
        Connection: "keep-alive",
        "Cache-Control": "no-cache",
      },
    },
  );
}
