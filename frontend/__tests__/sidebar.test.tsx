// __tests__/sidebar.test.tsx
import { Sidebar } from "@/components/Sidebar";
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
test("shows Advisor item when flag true", () => {
  const qc=new QueryClient();
  const { getByText } = render(
    <QueryClientProvider client={qc}><Sidebar/></QueryClientProvider>
  );
  expect(getByText("IaC Advisor")).toBeInTheDocument();
});
