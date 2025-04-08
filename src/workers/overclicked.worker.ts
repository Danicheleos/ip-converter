import { IPRecord } from '../services/parser.service';

addEventListener('message', (e) => {
  const { data, minValue }: { data: IPRecord[], minValue: number } = e.data;

  function filterOverclickedUsers(ips: IPRecord[]): string[] {
    const ipMap = new Map<string, number>();
    ips.forEach((ip, index) => {
      postMessage({
        type: 'progress',
        data: Math.round(((index + 1) / data.length) * 100),
      });

      if (!ip['EVENT_TYPE']) return;

      const existedValue = ipMap.get(ip.IP);
      if (existedValue) {
        ipMap.set(ip.IP, existedValue + 1);
      } else {
        ipMap.set(ip.IP, 1);
      }
    });

    postMessage({
      type: 'progress',
      data: 0,
    });
  
    return Array.from(ipMap.keys()).filter((key, index) => {
      postMessage({
        type: 'progress',
        data: Math.round(((index + 1) / data.length) * 100),
      });
      const value = ipMap.get(key);
      if (value) {
        return value >= minValue 
      }
      return false;
    });
  }

  postMessage({
    type: 'result',
    data: filterOverclickedUsers(data),
  });
});
