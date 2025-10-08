import { config } from 'dotenv';
import { Backend } from "./libraries/backend/index.js";
import { NetworkScanner, type NetworkDevice } from "./libraries/network-scanner.js";

// Load environment variables from .env file
config();

const supabaseUrl: string|undefined = process.env.SUPABASE_URL;
const supabaseKey: string|undefined = process.env.SUPABASE_KEY;
const networkName: string|undefined = process.env.NETWORK_NAME;
    
async function main() {
    try {
        if (supabaseUrl === undefined || supabaseKey === undefined || networkName === undefined) {
            throw new Error('❌ Error: SUPABASE_URL and SUPABASE_KEY and NETWORK_NAME environment variables are required');
        }
        const backend: Backend = new Backend(supabaseUrl, supabaseKey, networkName);

        const devices: NetworkDevice[] = await NetworkScanner.scanNetwork();
        
        console.log(`\n📊 Found ${devices.length} device(s)\n`);
        
        if (devices.length > 0) {
            const result = await backend.uploadDevices(devices);
            
            console.log('\n' + '─'.repeat(50));
            console.log('📊 SCAN SUMMARY');
            console.log('─'.repeat(50));
            console.log(`📡 Devices discovered: ${devices.length}`);
            console.log(`✅ Devices updated: ${result.updated}`);
            console.log(`➕ New devices added: ${result.added}`);
            console.log(`⚫ Devices set offline: ${result.setOffline}`);
            console.log('─'.repeat(50));
            
            console.log('\n📱 DISCOVERED DEVICES:');
            console.log('─'.repeat(70));
            console.log(
                'IP Address'.padEnd(18) + 
                'MAC Address'.padEnd(20) +
                'Name'.padEnd(40)
            );
            console.log('─'.repeat(70));

            const networkDevices = await backend.getDevices();
            
            for (const device of devices) {
                const networkDevice = networkDevices.find(d => d.mac === device.mac);
                console.log(
                    device.ip.padEnd(18) +
                    device.mac.padEnd(20) +
                    (networkDevice?.name ?? 'NA').padEnd(40)
                );
            }
            
            console.log('─'.repeat(70));
        } else {
            console.log('\n⚠️  No devices discovered in this scan');
        }
        console.log(`Scan completed at ${new Date().toISOString()}`);
        
    } catch (error) {
        console.error('❌ Error:', error instanceof Error ? error.message : error);
    }
}

function minutes(minutes: number) {
    return minutes * 60 * 1000;
}

const minutesIntervalString: string|undefined = process.env.MINUTES_INTERVAL || '5';
const minutesInterval: number = parseInt(minutesIntervalString)

setInterval(() => {
    main().catch(console.error);
}, minutes(minutesInterval));
