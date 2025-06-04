import http from 'k6/http';
import { check } from 'k6';

export const options = { thresholds: { http_req_failed: ['rate<0.05'] } };

export default function () {
  const res = http.get('https://carboncore-staging.fly.dev/carbon?zone=DE');
  check(res, { '200|307|502': (r) => [200,307,502].includes(r.status) });
}
