import { IPRecord } from '../services/parser.service';

addEventListener('message', (e) => {
  const { data }: { data: IPRecord[] } = e.data;

  function filterWithUniqUA(ips: IPRecord[]): string[] {
    const ipMap = new Map<string, Set<string>>();
    ips.forEach((ip, index) => {
      const existedValue = ipMap.get(ip.IP);
      postMessage({
        type: 'progress',
        data: Math.round(((index + 1) / data.length) * 100),
      });

      if (existedValue) {
        existedValue.add(ip['USER_AGENT']);
        ipMap.set(ip.IP, existedValue);
      } else {
        ipMap.set(ip.IP, new Set([ip['USER_AGENT']]));
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
      return ipMap.get(key)?.size === 1
  });
  }

  postMessage({
    type: 'result',
    data: filterWithUniqUA(data),
  });
});
