import { IPRecord } from '../services/parser.service';

addEventListener('message', (e) => {
  const { data, minValue, maxValue }: { data: IPRecord[], minValue: number, maxValue: number } = e.data;

  function filterDepostedUsers(ips: IPRecord[]): string[] {
    postMessage({
      type: 'progress',
      data: 0,
    });
    console.log(data, minValue, maxValue)
    return ips.filter((value, index) => {
      postMessage({
        type: 'progress',
        data: Math.round(((index + 1) / data.length) * 100),
      });
      return +value['CONVERTED_AMOUNT'] >= minValue && +value['CONVERTED_AMOUNT'] <= maxValue;
    }).map(value => value.IP);
  }

  postMessage({
    type: 'result',
    data: filterDepostedUsers(data),
  });
});
