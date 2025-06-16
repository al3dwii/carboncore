import '@testing-library/jest-dom';
import { server } from './tests/msw/server';
import 'jest-axe/extend-expect';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
