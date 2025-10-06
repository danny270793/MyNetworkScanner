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
        const networkId = await this.supabase.from('networks').select('id').eq('name', this.networkName).single();
        if(networkId.error) {
            throw new Error(networkId.error.message);
        }

        const devicesInserted = await this.supabase
            .from('devices')
            .insert(devices.map(device => ({
                ip: device.ip,
                mac: device.mac,
                network_id: networkId.data?.id
            })));
        if (devicesInserted.error) {
            throw new Error(devicesInserted.error.message);
        }
        return devicesInserted.data;
    }
}
