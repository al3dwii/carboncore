import { manifest as schema } from "../../src/plugin-schema";
export const manifest = schema.parse({
 id:"budget-copilot",
 sidebar:"Budget Copilot",
 icon:"TrendingDown",
 routes:[{id:"budget-copilot",path:"/tool/budget",component:"BudgetPage"}]
});
