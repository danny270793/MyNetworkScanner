import { NetworkScanner, type NetworkDevice } from "./libraries/network-scanner.js";

async function main() {
    try {
        const devices: NetworkDevice[] = await NetworkScanner.scanNetwork();
        
        console.log(`\n📊 Found ${devices.length} device(s):\n`);
        console.log('─'.repeat(40));
        console.log(
            'IP Address'.padEnd(18) + 
            'MAC Address'.padEnd(20)
        );
        console.log('─'.repeat(40));
        
        for (const device of devices) {
            console.log(
                device.ip.padEnd(18) +
                device.mac.padEnd(20)
            );
        }
        
        console.log('─'.repeat(40));
        
    } catch (error) {
        console.error('❌ Error:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
}

main().catch(console.error);
