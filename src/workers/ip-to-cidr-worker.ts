import { ipRangeToCIDR } from '../services/ip.service';
import { IPRecord } from '../services/parser.service';

addEventListener('message', (e) => {
  const { data }: { data: IPRecord[] } = e.data;
  
  postMessage({
    type: 'result',
    data: Array.from<string>(
      new Set<string>(
        data.map((record, index) => {
          postMessage({
            type: 'progress',
            data: Math.round(((index + 1) / data.length) * 100),
          });
          return ipRangeToCIDR(record.IP, record.IP);
        })
      )
    ),
  });
});
