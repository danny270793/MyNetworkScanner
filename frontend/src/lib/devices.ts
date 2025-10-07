import { supabase } from './supabase';

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
  const { data, error } = await supabase
    .from('devices')
    .select('*')
    .eq('network_id', networkId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
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

