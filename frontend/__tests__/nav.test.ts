import { describe, expect, it } from "vitest";
import { NAV_BY_ROLE } from "@/lib/nav";

describe("NAV_BY_ROLE contract", () => {
  it("contains the four primary roles we expose in the UI", () => {
    expect(Object.keys(NAV_BY_ROLE)).toEqual(
      expect.arrayContaining([
        "developer",
        "finops",
        "sustainability",
        "admin",
      ]),
    );
  });

  it("every item has the minimal shape we rely on", () => {
    Object.values(NAV_BY_ROLE).flat().forEach((item) => {
      /**
       * We only assert on the parts the UI code depends on.
       * `href` must start with a single slash (orgId is prefixed later).
       */
      expect(item).toEqual(
        expect.objectContaining({
          label: expect.any(String),
          icon : expect.any(String),
          href : expect.stringMatching(/^\/[a-z0-9-]+/),
        }),
      );
    });
  });
});

