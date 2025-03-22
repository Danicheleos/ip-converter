/* eslint-disable @typescript-eslint/no-wrapper-object-types */
import { Address4, Address6 } from 'ip-address';

// Function to convert IP range to CIDR notation
export function ipRangeToCIDR(startIp: string, endIp: string): string {
  const startIsIPv4 = Address4.isValid(startIp);
  const endIsIPv4 = Address4.isValid(endIp);
  const startIsIPv6 = Address6.isValid(startIp);
  const endIsIPv6 = Address6.isValid(endIp);

  if (startIsIPv4 && endIsIPv4) {
    return rangeToCIDR(startIp, endIp, 32);
  } else if (startIsIPv6 && endIsIPv6) {
    return rangeToCIDR(startIp, endIp, 128);
  } else {
    throw new Error('IP versions do not match or are invalid');
  }
}

// Function to compute single CIDR block from IP range
export function rangeToCIDR(startIp: string, endIp: string, maxBits: number): string {
  const start = ipToBigInt(startIp);
  const end = ipToBigInt(endIp);
  let bitMask = 0;
  
  while ((start >> BigInt(bitMask)) !== (end >> BigInt(bitMask))) {
      bitMask++;
  }
  
  const prefixLength = maxBits - bitMask;
  const ip = bigIntToIP(start, maxBits).split('.');
  ip[ip.length - 1] = '0';
  return ip.join('.') + "/" + Math.min(prefixLength, 24);
}

// Convert IP to BigInt
export function ipToBigInt(ip: string): bigint {
  if (Address4.isValid(ip)) {
    return BigInt(new Address4(ip).bigInt().toString());
  } else if (Address6.isValid(ip)) {
    return BigInt(new Address6(ip).bigInt().toString());
  }
  throw new Error('Invalid IP Address');
}

// Convert BigInt back to IP string
function bigIntToIP(ip: bigint, maxBits: number): string {
  if (maxBits === 32) {
    return Address4.fromBigInt(ip).correctForm();
  } else if (maxBits === 128) {
    return Address6.fromBigInt(ip).correctForm();
  }
  throw new Error('Invalid maxBits value');
}