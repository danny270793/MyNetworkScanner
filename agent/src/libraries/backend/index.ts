import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { NetworkDevice } from '../network-scanner.js';

export class Backend {
    private readonly supabase: SupabaseClient;
    private readonly networkName: string;

    constructor(url: string, key: string, networkName: string) {
        this.networkName = networkName;
        this.supabase = createClient(url, key);
    }

    async uploadDevices(devices: NetworkDevice[]) {
        // Get network ID
        const networkResult = await this.supabase
            .from('networks')
            .select('id')
            .eq('name', this.networkName)
            .single();
        
        if (networkResult.error) {
            throw new Error(`Network (${this.networkName}) not found: ${networkResult.error.message}`);
        }
        
        const networkId = networkResult.data.id;

        // Get all existing devices for this network
        const existingDevicesResult = await this.supabase
            .from('devices')
            .select('id, mac, ip, state')
            .eq('network_id', networkId);
        
        if (existingDevicesResult.error) {
            throw new Error(`Failed to fetch existing devices: ${existingDevicesResult.error.message}`);
        }

        const existingDevices = existingDevicesResult.data || [];
        const discoveredMacs = new Set(devices.map(d => d.mac));
        const existingMacs = new Set(existingDevices.map(d => d.mac));

        console.log(`\n🔄 Processing device states...`);
        console.log(`📡 Discovered: ${devices.length} devices`);
        console.log(`💾 Existing: ${existingDevices.length} devices`);

        // 1. Update existing devices that were detected (set to online and update IP)
        const devicesToUpdate = devices.filter(device => existingMacs.has(device.mac));
        if (devicesToUpdate.length > 0) {
            console.log(`\n✅ Updating ${devicesToUpdate.length} existing devices to online...`);
            
            for (const device of devicesToUpdate) {
                const existingDevice = existingDevices.find(d => d.mac === device.mac);
                if (existingDevice) {
                    const updateResult = await this.supabase
                        .from('devices')
                        .update({
                            ip: device.ip,
                            state: 'online',
                            last_seen: new Date().toISOString()
                        })
                        .eq('id', existingDevice.id);
                    
                    if (updateResult.error) {
                        console.error(`❌ Failed to update device ${device.mac}:`, updateResult.error.message);
                    } else {
                        console.log(`   📱 ${device.mac} (${device.ip}) - Updated to online`);
                    }
                }
            }
        }

        // 2. Add new devices that were detected but don't exist in Supabase
        const newDevices = devices.filter(device => !existingMacs.has(device.mac));
        if (newDevices.length > 0) {
            console.log(`\n➕ Adding ${newDevices.length} new devices...`);
            
            const insertResult = await this.supabase
                .from('devices')
                .insert(newDevices.map(device => ({
                    network_id: networkId,
                    ip: device.ip,
                    mac: device.mac,
                    state: 'online',
                    last_seen: new Date().toISOString()
                })));
            
            if (insertResult.error) {
                console.error(`❌ Failed to insert new devices:`, insertResult.error.message);
            } else {
                newDevices.forEach(device => {
                    console.log(`   📱 ${device.mac} (${device.ip}) - Added as online`);
                });
            }
        }

        // 3. Set existing devices that were not detected to offline (set IP to null)
        const devicesToOffline = existingDevices.filter(device => !discoveredMacs.has(device.mac));
        if (devicesToOffline.length > 0) {
            console.log(`\n⚫ Setting ${devicesToOffline.length} devices to offline...`);
            
            for (const device of devicesToOffline) {
                const updateResult = await this.supabase
                    .from('devices')
                    .update({
                        ip: null,
                        state: 'offline'
                    })
                    .eq('id', device.id);
                
                if (updateResult.error) {
                    console.error(`❌ Failed to set device ${device.mac} offline:`, updateResult.error.message);
                } else {
                    console.log(`   📱 ${device.mac} - Set to offline`);
                }
            }
        }

        console.log(`\n✅ Device state management completed!`);
        return {
            updated: devicesToUpdate.length,
            added: newDevices.length,
            setOffline: devicesToOffline.length
        };
    }
}
