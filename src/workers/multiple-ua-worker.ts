import { IPRecord } from '../services/parser.service';

addEventListener('message', (e) => {
  const { data, minValue }: { data: IPRecord[], minValue: number } = e.data;

  function filterWithMultipleUA(ips: IPRecord[], minValue: number): string[] {
    const ipMap = new Map<string, Set<string>>();
    ips.forEach((ip, index) => {
      postMessage({
        type: 'progress',
        data: Math.round(((index + 1) / data.length) * 100),
      });
      const existedValue = ipMap.get(ip.IP);
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
      const value = ipMap.get(key);
      if (value) {
        return value.size >= minValue 
      }
      return false;
    });
  }

  postMessage({
    type: 'result',
    data: filterWithMultipleUA(data, minValue)
  });
});
