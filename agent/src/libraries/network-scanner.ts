import * as os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';
import arp from 'node-arp';

export interface NetworkDevice {
    ip: string;
    mac: string;
}

export interface NetworkInfo {
    interface: string;
    ip: string;
    netmask: string;
    cidr: string;
}

export interface NetworkRange {
    start: string;
    end: string;
    total: number;
}

const execAsync = promisify(exec);
const arpGetMAC = promisify(arp.getMAC);

export class NetworkScanner {
    static async getMACAddress(ip: string): Promise<string | null> {
        try {
            return await arpGetMAC(ip);
        } catch {
            return null;
        }
    }
    static async pingIP(ip: string): Promise<boolean> {
        try {
            // Use -c 1 for one ping, -W 1000 for 1 second timeout
            await execAsync(`ping -c 1 -W 1000 ${ip}`, { timeout: 2000 });
            return true;
        } catch {
            return false;
        }
    }
    static generateIPRange(start: string, end: string): string[] {
        const startParts = start.split('.').map(Number);
        const endParts = end.split('.').map(Number);
        const ips: string[] = [];
        
        const addIPIfValid = (ip: string) => {
            if (ip !== start && ip !== end) {
                ips.push(ip);
            }
        };
        
        for (let a = startParts[0]; a <= endParts[0]; a++) {
            for (let b = startParts[1]; b <= endParts[1]; b++) {
                for (let c = startParts[2]; c <= endParts[2]; c++) {
                    for (let d = startParts[3]; d <= endParts[3]; d++) {
                        addIPIfValid(`${a}.${b}.${c}.${d}`);
                    }
                }
            }
        }
        
        return ips;
    }
    static getNetworkRange(ip: string, netmask: string): NetworkRange {
        const ipParts = ip.split('.').map(Number);
        const maskParts = netmask.split('.').map(Number);
        
        const networkParts = ipParts.map((part, i) => part & maskParts[i]);
        const broadcastParts = ipParts.map((part, i) => part | (~maskParts[i] & 255));
        
        const start = networkParts.join('.');
        const end = broadcastParts.join('.');
        
        // Calculate total number of hosts
        const total = maskParts.reduce((acc, part) => acc * (256 - part), 1) - 2; // -2 for network and broadcast
        
        return { start, end, total };
    }
    static calculateCIDR(netmask: string): number {
        return netmask.split('.').map(octet => {
            return (parseInt(octet) >>> 0).toString(2).split('1').length - 1;
        }).reduce((a, b) => a + b, 0);
    }
    static getLocalNetworkInfo(): NetworkInfo {
        const interfaces = os.networkInterfaces();
        
        for (const [name, addrs] of Object.entries(interfaces)) {
            if (!addrs) continue;
            
            for (const addr of addrs) {
                // Skip internal (loopback) and non-IPv4 addresses
                if (addr.family === 'IPv4' && !addr.internal) {
                    const ip = addr.address;
                    const netmask = addr.netmask;
                    const cidr = addr.cidr || `${ip}/${NetworkScanner.calculateCIDR(netmask)}`;
                    
                    return {
                        interface: name,
                        ip,
                        netmask,
                        cidr
                    };
                }
            }
        }
        
        throw new Error('Could not determine local network information')
    }
    static async scanNetwork(): Promise<NetworkDevice[]> {
        console.log('🔍 Starting network scan...\n');
        
        // Get local network info
        let networkInfo: NetworkInfo = NetworkScanner.getLocalNetworkInfo();
        
        console.log(`📡 Network Information:`);
        console.log(`   Interface: ${networkInfo.interface}`);
        console.log(`   Local IP: ${networkInfo.ip}`);
        console.log(`   Netmask: ${networkInfo.netmask}`);
        console.log(`   CIDR: ${networkInfo.cidr}\n`);

        // Check if TARGET_NETWORK_IP environment variable is set
        const targetNetworkIp = process.env.TARGET_NETWORK_IP;
        if (targetNetworkIp) {
            console.log(`🎯 Using target network IP from environment: ${targetNetworkIp}`);
            networkInfo.ip = targetNetworkIp;
            // Keep the detected netmask or use default
            if (!process.env.TARGET_NETWORK_MASK) {
                networkInfo.netmask = '255.255.255.0'; // Default /24 subnet
            } else {
                networkInfo.netmask = process.env.TARGET_NETWORK_MASK;
            }
            // Recalculate CIDR
            networkInfo.cidr = `${networkInfo.ip}/${NetworkScanner.calculateCIDR(networkInfo.netmask)}`;
        }
        
        // Calculate network range
        const range: NetworkRange = NetworkScanner.getNetworkRange(networkInfo.ip, networkInfo.netmask);
        console.log(`🌐 Network Range: ${range.start} - ${range.end}`);
        console.log(`   Scanning ${range.total} possible hosts...\n`);
        
        // Generate IP range
        const ips: string[] = NetworkScanner.generateIPRange(range.start, range.end);
        
        // Ping all IPs in parallel (in batches to avoid overwhelming the system)
        const batchSize: number = 50;
        const devices: NetworkDevice[] = [];
        
        console.log('⏳ Pinging hosts...');
        for (let i = 0; i < ips.length; i += batchSize) {
            const batch = ips.slice(i, i + batchSize);
            const results = await Promise.all(
                batch.map(async (ip) => {
                    const isAlive = await NetworkScanner.pingIP(ip);
                    return { ip, isAlive };
                })
            );
            
            // For alive hosts, get MAC addresses
            for (const { ip, isAlive } of results) {
                if (isAlive) {
                    const mac = await NetworkScanner.getMACAddress(ip);
                    if (mac) {
                        devices.push({ ip, mac });
                        process.stdout.write('.');
                    }
                }
            }
        }
        
        console.log('\n\n✅ Scan complete!\n');

        return devices;
    }
}