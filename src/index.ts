import { exec } from 'child_process';
import { promisify } from 'util';
import * as os from 'os';
import arp from 'node-arp';

const execAsync = promisify(exec);
const arpGetMAC = promisify(arp.getMAC);

interface NetworkDevice {
    ip: string;
    mac: string;
    hostname?: string;
}

interface NetworkInfo {
    interface: string;
    ip: string;
    netmask: string;
    cidr: string;
}

/**
 * Get the current network information (interface, IP, netmask)
 */
function getLocalNetworkInfo(): NetworkInfo | null {
    const interfaces = os.networkInterfaces();
    
    for (const [name, addrs] of Object.entries(interfaces)) {
        if (!addrs) continue;
        
        for (const addr of addrs) {
            // Skip internal (loopback) and non-IPv4 addresses
            if (addr.family === 'IPv4' && !addr.internal) {
                const ip = addr.address;
                const netmask = addr.netmask;
                const cidr = addr.cidr || `${ip}/${calculateCIDR(netmask)}`;
                
                return {
                    interface: name,
                    ip,
                    netmask,
                    cidr
                };
            }
        }
    }
    
    return null;
}

/**
 * Calculate CIDR notation from netmask
 */
function calculateCIDR(netmask: string): number {
    return netmask.split('.').map(octet => {
        return (parseInt(octet) >>> 0).toString(2).split('1').length - 1;
    }).reduce((a, b) => a + b, 0);
}

/**
 * Calculate network range from IP and netmask
 */
function getNetworkRange(ip: string, netmask: string): { start: string, end: string, total: number } {
    const ipParts = ip.split('.').map(Number);
    const maskParts = netmask.split('.').map(Number);
    
    const networkParts = ipParts.map((part, i) => part & maskParts[i]!);
    const broadcastParts = ipParts.map((part, i) => part | (~maskParts[i]! & 255));
    
    const start = networkParts.join('.');
    const end = broadcastParts.join('.');
    
    // Calculate total number of hosts
    const total = maskParts.reduce((acc, part) => acc * (256 - part), 1) - 2; // -2 for network and broadcast
    
    return { start, end, total };
}

/**
 * Generate all IPs in the network range
 */
function generateIPRange(start: string, end: string): string[] {
    const startParts = start.split('.').map(Number);
    const endParts = end.split('.').map(Number);
    const ips: string[] = [];
    
    const addIPIfValid = (ip: string) => {
        if (ip !== start && ip !== end) {
            ips.push(ip);
        }
    };
    
    for (let a = startParts[0]!; a <= endParts[0]!; a++) {
        for (let b = startParts[1]!; b <= endParts[1]!; b++) {
            for (let c = startParts[2]!; c <= endParts[2]!; c++) {
                for (let d = startParts[3]!; d <= endParts[3]!; d++) {
                    addIPIfValid(`${a}.${b}.${c}.${d}`);
                }
            }
        }
    }
    
    return ips;
}

/**
 * Ping an IP address to populate ARP table
 */
async function pingIP(ip: string): Promise<boolean> {
    try {
        // Use -c 1 for one ping, -W 1000 for 1 second timeout
        await execAsync(`ping -c 1 -W 1000 ${ip}`, { timeout: 2000 });
        return true;
    } catch {
        return false;
    }
}

/**
 * Get MAC address for an IP using ARP
 */
async function getMACAddress(ip: string): Promise<string | null> {
    try {
        const mac = await arpGetMAC(ip);
        return mac;
    } catch {
        return null;
    }
}

/**
 * Get hostname for an IP address
 */
async function getHostname(ip: string): Promise<string | undefined> {
    try {
        const { stdout } = await execAsync(`host ${ip}`, { timeout: 2000 });
        const match = stdout.match(/pointer\s+(.+)\./);
        return match ? match[1] : undefined;
    } catch {
        return undefined;
    }
}

/**
 * Scan the network for devices
 */
async function scanNetwork(): Promise<NetworkDevice[]> {
    console.log('🔍 Starting network scan...\n');
    
    // Get local network info
    const networkInfo = getLocalNetworkInfo();
    if (!networkInfo) {
        throw new Error('Could not determine local network information');
    }
    
    console.log(`📡 Network Information:`);
    console.log(`   Interface: ${networkInfo.interface}`);
    console.log(`   Local IP: ${networkInfo.ip}`);
    console.log(`   Netmask: ${networkInfo.netmask}`);
    console.log(`   CIDR: ${networkInfo.cidr}\n`);
    
    // Calculate network range
    const range = getNetworkRange(networkInfo.ip, networkInfo.netmask);
    console.log(`🌐 Network Range: ${range.start} - ${range.end}`);
    console.log(`   Scanning ${range.total} possible hosts...\n`);
    
    // Generate IP range
    const ips = generateIPRange(range.start, range.end);
    
    // Ping all IPs in parallel (in batches to avoid overwhelming the system)
    const batchSize = 50;
    const devices: NetworkDevice[] = [];
    
    console.log('⏳ Pinging hosts...');
    for (let i = 0; i < ips.length; i += batchSize) {
        const batch = ips.slice(i, i + batchSize);
        const results = await Promise.all(
            batch.map(async (ip) => {
                const isAlive = await pingIP(ip);
                return { ip, isAlive };
            })
        );
        
        // For alive hosts, get MAC addresses
        for (const { ip, isAlive } of results) {
            if (isAlive) {
                const mac = await getMACAddress(ip);
                if (mac) {
                    devices.push({ ip, mac });
                    process.stdout.write('.');
                }
            }
        }
    }
    
    console.log('\n\n✅ Scan complete!\n');
    
    // Try to get hostnames for discovered devices
    console.log('🔎 Resolving hostnames...\n');
    for (const device of devices) {
        const hostname = await getHostname(device.ip);
        if (hostname !== undefined) {
            device.hostname = hostname;
        }
    }
    
    return devices;
}

/**
 * Main function
 */
async function main() {
    try {
        const devices = await scanNetwork();
        
        console.log(`\n📊 Found ${devices.length} device(s):\n`);
        console.log('─'.repeat(80));
        console.log(
            'IP Address'.padEnd(18) + 
            'MAC Address'.padEnd(20) + 
            'Hostname'
        );
        console.log('─'.repeat(80));
        
        for (const device of devices) {
            console.log(
                device.ip.padEnd(18) +
                device.mac.padEnd(20) +
                (device.hostname || 'N/A')
            );
        }
        
        console.log('─'.repeat(80));
        
    } catch (error) {
        console.error('❌ Error:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
}

main().catch(console.error);
