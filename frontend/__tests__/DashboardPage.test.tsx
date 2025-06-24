import { render } from "@testing-library/react";
import DashboardPage from "@/app/org/[orgId]/dashboard/page";

it("renders dashboard with mocked data", async () => {
  const { findByText } = render(
    // @ts-expect-error – we ignore params in test
    <DashboardPage params={{ orgId: "1" }} />,
  );
  expect(await findByText(/Remaining monthly budget/i)).toBeInTheDocument();
});
