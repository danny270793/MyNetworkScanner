declare module 'node-arp' {
    export function getMAC(ip: string, callback: (err: Error | null, mac: string) => void): void;
    export function table(callback: (err: Error | null, data: Array<{ ip: string; mac: string }>) => void): void;
}

