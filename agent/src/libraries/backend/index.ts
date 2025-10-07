import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { NetworkDevice } from '../network-scanner.js';

export class Backend {
    private readonly supabase: SupabaseClient;
    private readonly networkName: string;

    constructor(url: string, key: string, networkName: string) {
        this.networkName = networkName;
        this.supabase = createClient(url, key);
    }

    async findDeviceByMac(mac: string): Promise<{ name: string | null; brand: string | null } | null> {
        try {
            const result = await this.supabase
                .from('devices')
                .select('name, brand')
                .eq('mac', mac)
                .not('name', 'is', null)
                .limit(1)
                .single();
            
            if (result.error) {
                // No device found with this MAC, or no name set
                return null;
            }
            
            return {
                name: result.data.name,
                brand: result.data.brand
            };
        } catch {
            // No device found with this MAC address
            return null;
        }
    }

    private async getNetworkId(): Promise<string> {
        const networkResult = await this.supabase
            .from('networks')
            .select('id')
            .eq('name', this.networkName)
            .single();
        
        if (networkResult.error) {
            throw new Error(`Network (${this.networkName}) not found: ${networkResult.error.message}`);
        }
        
        return networkResult.data.id;
    }

    private async getExistingDevices(networkId: string) {
        const existingDevicesResult = await this.supabase
            .from('devices')
            .select('id, mac, ip, state')
            .eq('network_id', networkId);
        
        if (existingDevicesResult.error) {
            throw new Error(`Failed to fetch existing devices: ${existingDevicesResult.error.message}`);
        }

        return existingDevicesResult.data || [];
    }

    private async updateExistingDevices(devices: NetworkDevice[], existingDevices: any[], devicesToUpdate: NetworkDevice[]) {
        if (devicesToUpdate.length === 0) return 0;

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

        return devicesToUpdate.length;
    }

    private async addNewDevices(devices: NetworkDevice[], networkId: string, existingMacs: Set<string>) {
        const newDevices = devices.filter(device => !existingMacs.has(device.mac));
        if (newDevices.length === 0) return 0;

        console.log(`\n➕ Adding ${newDevices.length} new devices...`);
        
        // Check for existing device names across all networks
        const devicesWithNames = [];
        for (const device of newDevices) {
            const existingDevice = await this.findDeviceByMac(device.mac);
            if (existingDevice) {
                console.log(`   🔍 Found existing device: ${device.mac} -> "${existingDevice.name}" (${existingDevice.brand || 'Unknown brand'})`);
                devicesWithNames.push({
                    network_id: networkId,
                    ip: device.ip,
                    mac: device.mac,
                    name: existingDevice.name,
                    brand: existingDevice.brand,
                    state: 'online',
                    last_seen: new Date().toISOString()
                });
            } else {
                devicesWithNames.push({
                    network_id: networkId,
                    ip: device.ip,
                    mac: device.mac,
                    state: 'online',
                    last_seen: new Date().toISOString()
                });
            }
        }
        
        const insertResult = await this.supabase
            .from('devices')
            .insert(devicesWithNames);
        
        if (insertResult.error) {
            console.error(`❌ Failed to insert new devices:`, insertResult.error.message);
        } else {
            newDevices.forEach(device => {
                const deviceWithName = devicesWithNames.find(d => d.mac === device.mac);
                const nameInfo = deviceWithName?.name ? ` (${deviceWithName.name})` : '';
                console.log(`   📱 ${device.mac} (${device.ip})${nameInfo} - Added as online`);
            });
        }

        return newDevices.length;
    }

    private async setDevicesOffline(existingDevices: any[], discoveredMacs: Set<string>) {
        const devicesToOffline = existingDevices.filter(device => !discoveredMacs.has(device.mac));
        if (devicesToOffline.length === 0) return 0;

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

        return devicesToOffline.length;
    }

    async uploadDevices(devices: NetworkDevice[]) {
        const networkId = await this.getNetworkId();
        const existingDevices = await this.getExistingDevices(networkId);
        
        const discoveredMacs = new Set(devices.map(d => d.mac));
        const existingMacs = new Set(existingDevices.map(d => d.mac));

        console.log(`\n🔄 Processing device states...`);
        console.log(`📡 Discovered: ${devices.length} devices`);
        console.log(`💾 Existing: ${existingDevices.length} devices`);

        // Process devices
        const devicesToUpdate = devices.filter(device => existingMacs.has(device.mac));
        const updated = await this.updateExistingDevices(devices, existingDevices, devicesToUpdate);
        const added = await this.addNewDevices(devices, networkId, existingMacs);
        const setOffline = await this.setDevicesOffline(existingDevices, discoveredMacs);

        console.log(`\n✅ Device state management completed!`);
        return { updated, added, setOffline };
    }
}
