import { Backend } from "./libraries/backend/index.js";
import { NetworkScanner, type NetworkDevice } from "./libraries/network-scanner.js";

const supabaseUrl: string|undefined = process.env.SUPABASE_URL;
const supabaseKey: string|undefined = process.env.SUPABASE_KEY;
    
async function main() {
    try {
        if (supabaseUrl === undefined || supabaseKey === undefined) {
            throw new Error('❌ Error: SUPABASE_URL and SUPABASE_KEY environment variables are required');
        }
        const backend: Backend = new Backend(supabaseUrl, supabaseKey);

        const devices: NetworkDevice[] = await NetworkScanner.scanNetwork();
        
        console.log(`\n📊 Found ${devices.length} device(s)\n`);
        
        if (devices.length > 0) {
            await backend.uploadDevices(devices);
            
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
        }
        
    } catch (error) {
        console.error('❌ Error:', error instanceof Error ? error.message : error);
    }
}

main().catch(console.error);
