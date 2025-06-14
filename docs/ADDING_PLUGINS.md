# Add a CarbonCore Plug-in

1. `plugins/your-id/manifest.{py,ts}` – declare routes, tasks, event types.
2. Export **React `<Page/>`** in an MF remote bundle.
3. Run  
   ```bash
   python scripts/gen_registry.py
   pnpm ts-node scripts/gen-registry.ts
```

4. Create a LaunchDarkly flag `${id}.enabled`.
5. Add docs + screenshots in `/docs/${id}.md`.

CI will block the PR if:

* manifest schema invalid
* duplicate plug-in id or flag
* Playwright & pytest fail
