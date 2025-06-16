import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 5000,
  duration: '60s',
  thresholds: { http_req_failed: ['rate<0.01'] }
};

export default function () {
  const res = http.get('http://carboncore-preview/org/acme/api/ledger/stream', {
    headers: { Accept: 'text/event-stream' }
  });
  check(res, { 'status 200': (r) => r.status === 200 });
  sleep(1);
}
