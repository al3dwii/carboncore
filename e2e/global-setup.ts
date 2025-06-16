import { request } from '@playwright/test';

export default async () => {
  const api = await request.newContext();
  await api.post('http://localhost:8000/test/reset');
};
