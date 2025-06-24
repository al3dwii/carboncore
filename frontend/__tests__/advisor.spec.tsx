import { render } from "@testing-library/react";
import { EventTable } from "../components/advisor/EventTable";

test("renders one row",()=>{
  const { getByText } = render(<EventTable rows={[{id:1,project_id:"p",feature:"f",sku_id:"x",region:"AE",kwh:0,co2:1,usd:2,created_at:"2025-06-22"}]} />)
  expect(getByText("p")).toBeTruthy()
})
