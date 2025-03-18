/* eslint-disable @typescript-eslint/no-explicit-any */
import { Address6 } from 'ip-address';
import { ipToBigInt } from './ip.sevice';

export interface IPRecord {
  [key: string]: string;
}

export function parseCSV(rawCSV: string): IPRecord[] {
  const csv = rawCSV;

  const rows = csv.split('\n');
  const headers = rows[0].split(';');

  const regex = new RegExp(`\\s*(")?(.*?)\\1\\s*(?:;|$)`, 'gs');

  const match = (line: any) =>
    [...line.matchAll(regex)].map((m) => m[2]).slice(0, -1);

  let lines = csv.split('\n');
  const heads = headers ?? match(lines.shift());
  lines = lines.slice(1);

  const result = lines.map((line) => {
    return match(line).reduce((acc, cur, i) => {
      const val = cur.length <= 0 ? null : Number(cur) || cur;
      const key = heads[i] ?? `${i}`;
      return { ...acc, [key.trim()]: val };
    }, {});
  });

  const sortedIps = result
    .filter((value) => value.IP)
    .sort((a, b) => (ipToBigInt(a.IP) < ipToBigInt(b.IP) ? -1 : 1));

  return sortedIps;
}

function calculatePrefix(ip: string): string {
  const isIPv6 = Address6.isValid(ip);
  if (isIPv6) {
    return ip.split(':').slice(0, -1).join();
  } else {
    return ip.split('.').slice(0, -1).join();
  }
}

export function filterWithUniqUA(ips: IPRecord[]): string[] {
  const ipMap = new Map<string, Set<string>>();
  ips.forEach((ip) => {
    const existedValue = ipMap.get(ip.IP);
    if (existedValue) {
      existedValue.add(ip['User Agent']);
      ipMap.set(ip.IP, existedValue);
    } else {
      ipMap.set(ip.IP, new Set([ip['User Agent']]));
    }
  });
  return Array.from(ipMap.keys()).filter((key) => ipMap.get(key)?.size === 1);
}

export function filterWithMultipleUA(ips: IPRecord[], minUA: number): string[] {
  const ipMap = new Map<string, Set<string>>();
  ips.forEach((ip) => {
    const existedValue = ipMap.get(ip.IP);
    if (existedValue) {
      existedValue.add(ip['User Agent']);
      ipMap.set(ip.IP, existedValue);
    } else {
      ipMap.set(ip.IP, new Set([ip['User Agent']]));
    }
  });

  return Array.from(ipMap.keys()).filter((key) => {
    const value = ipMap.get(key);
    if (value) {
      return value.size >= minUA 
    }
    return false;
  });
}

export function filterWithPairs(ips: IPRecord[]): IPRecord[] {
  const pairsIps = new Array<IPRecord>();
  let pairs = new Array<IPRecord>();

  for (const ip of ips) {
    if (pairs.length === 0) {
      pairs.push(ip);
      continue;
    }
    const rootPrefix = calculatePrefix(pairs[0].IP);
    const currentPrefix = calculatePrefix(ip.IP);

    if (rootPrefix === currentPrefix) {
      pairs.push(ip);
    } else {
      if (pairs.length > 1) {
        pairsIps.push(pairs[0]);
        pairsIps.push(pairs[pairs.length - 1]);
      }
      pairs = [];
    }
  }

  return pairsIps;
}

export function saveFile(fileName: string, text: string): void {
  const hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:attachment/text,' + encodeURI(text);
  hiddenElement.target = '_blank';
  hiddenElement.download = fileName + '_result.txt';
  hiddenElement.click();
}