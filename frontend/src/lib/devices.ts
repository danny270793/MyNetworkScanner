import { supabase } from './supabase';
import { isFakeUser, generateFakeDevices } from './fakeData';

export interface Device {
  id: string;
  network_id: string;
  ip: string;
  mac: string;
  name?: string;
  brand?: string;
  state: 'online' | 'offline';
  last_seen?: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateDeviceDto {
  network_id: string;
  ip: string;
  mac: string;
  name?: string;
  brand?: string;
  state?: 'online' | 'offline';
  last_seen?: string;
}

export interface UpdateDeviceDto {
  ip?: string;
  mac?: string;
  name?: string;
  brand?: string;
  state?: 'online' | 'offline';
  last_seen?: string;
}

// Get all devices for a specific network
export async function getDevicesByNetwork(networkId: string): Promise<Device[]> {
  // Check if using fake user
  if (isFakeUser()) {
    return generateFakeDevices(networkId);
  }

  const { data, error } = await supabase
    .from('devices')
    .select('*')
    .eq('network_id', networkId);

  if (error) {
    throw new Error(error.message);
  }

  // Sort devices by IP address numerically
  const sortedData = data?.toSorted((a, b) => {
    if (!a.ip || !b.ip) return 0;
    
    // Convert IP addresses to numbers for proper sorting
    const ipToNumber = (ip: string) => {
      return ip.split('.').reduce((acc, octet) => (acc << 8) + Number.parseInt(octet, 10), 0);
    };
    
    return ipToNumber(a.ip) - ipToNumber(b.ip);
  }) || [];

  return sortedData;
}

// Create a new device
export async function createDevice(device: CreateDeviceDto): Promise<Device> {
  const { data, error } = await supabase
    .from('devices')
    .insert([device])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// Update an existing device
export async function updateDevice(id: string, updates: UpdateDeviceDto): Promise<Device> {
  const { data, error } = await supabase
    .from('devices')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// Delete a device
export async function deleteDevice(id: string): Promise<void> {
  const { error } = await supabase
    .from('devices')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
}

// Update device state (online/offline)
export async function updateDeviceState(id: string, state: 'online' | 'offline'): Promise<Device> {
  const { data, error } = await supabase
    .from('devices')
    .update({ 
      state,
      last_seen: state === 'online' ? new Date().toISOString() : undefined
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

