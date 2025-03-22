/* eslint-disable @typescript-eslint/no-explicit-any */
import { Address4, Address6 } from 'ip-address';
import { ipRangeToCIDR } from './ip.service';

export interface IPRecord {
  [key: string]: string;
}

export function parseCSV(lines: string[], headers: string[], separator: string): IPRecord[] {
    
    const regex = new RegExp(`\\s*(")?(.*?)\\1\\s*(?:${separator}|$)`, 'gs');
  
    const match = (line: any) => [...line.matchAll(regex)].map((m) => m[2]).slice(0, -1);
  
    const heads = headers ?? match(lines.shift());
    lines = lines.slice(1);
  
    const result = lines.map((line) => {
      return match(line).reduce((acc, cur, i) => {
        const key = heads[i] ?? `${i}`;
        if (key !== 'USER_AGENT' && key !== 'IP') return acc;
  
        const val = cur.length <= 0 ? null : Number(cur) || cur;
        return { ...acc, [key.trim()]: val };
      }, {});
    });
    
    const sortedIps = result
      .filter((value) => Address4.isValid(value.IP))
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
      existedValue.add(ip['USER_AGENT']);
      ipMap.set(ip.IP, existedValue);
    } else {
      ipMap.set(ip.IP, new Set([ip['USER_AGENT']]));
    }
  });
  return Array.from(ipMap.keys()).filter((key) => ipMap.get(key)?.size === 1);
}

export function filterWithMultipleUA(ips: IPRecord[], minUA: number): string[] {
  const ipMap = new Map<string, Set<string>>();
  ips.forEach((ip) => {
    const existedValue = ipMap.get(ip.IP);
    if (existedValue) {
      existedValue.add(ip['USER_AGENT']);
      ipMap.set(ip.IP, existedValue);
    } else {
      ipMap.set(ip.IP, new Set([ip['USER_AGENT']]));
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

export function filterWithPairs(ips: IPRecord[]): string[] {

  const result = ips.reduce((acc, value) => {
    const rootPrefix = calculatePrefix(value.IP);
    return {...acc, [rootPrefix]: [...(acc[rootPrefix] || []), value.IP]};
  }, {} as any);
  
  return Object.values<string[]>(result).reduce((acc, value) => {
    if (value.length >= 2) {
      acc.push(ipRangeToCIDR(value[0], value[0]));
    }
    return acc;
  }, [] as string[]);
}

export function saveFile(fileName: string, text: string): void {
  const hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:attachment/text,' + encodeURI('IP\n'+text);
  hiddenElement.target = '_blank';
  hiddenElement.download = fileName.split('.')[0] + '_result.csv';
  hiddenElement.click();
}