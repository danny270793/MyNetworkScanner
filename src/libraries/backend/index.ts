import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { NetworkDevice } from '../network-scanner.js';

export class Backend {
    private readonly supabase: SupabaseClient;

    constructor(url: string, key: string) {
        this.supabase = createClient(url, key);
    }

    async uploadDevices(devices: NetworkDevice[]) {
        const { data, error } = await this.supabase
            .from('devices')
            .insert(devices.map(device => ({
                ip: device.ip,
                mac_address: device.mac
            })));
        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
}
