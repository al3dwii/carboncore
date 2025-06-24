import "@testing-library/jest-dom";
import { server } from "./msw/server"; // handlers mimic the real API

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(()  => server.close());
