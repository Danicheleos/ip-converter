import { ipRangeToCIDR } from '../services/ip.service';
import { calculatePrefix, IPRecord } from '../services/parser.service';

addEventListener('message', (e) => {
  const { data }: { data: IPRecord[] } = e.data;

  function filterWithPairs(ips: IPRecord[]): string[] {
    const ipMap = new Map<string, string>();
    const resultSet = new Map<string, string>();

    ips.forEach((value, index) => {
      postMessage({
        type: 'progress',
        data: Math.round(((index + 1) / data.length) * 100),
      });

      const rootPrefix = calculatePrefix(value.IP);
      const existedValue = ipMap.get(rootPrefix);
      if (existedValue) {
        const existInResult = resultSet.get(rootPrefix);
        if (!existInResult) {
          resultSet.set(rootPrefix, ipRangeToCIDR(value.IP, value.IP));
        }
      } else {
        ipMap.set(rootPrefix, value.IP);
      }
    });

    return Array.from(resultSet.values());
  }
  
  postMessage({
    type: 'result',
    data: filterWithPairs(data),
  });
});
