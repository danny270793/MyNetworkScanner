import { supabase } from './supabase';
import { isFakeUser, generateFakeNetworks } from './fakeData';

export interface Network {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  ip_range?: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateNetworkDto {
  name: string;
  description?: string;
  ip_range?: string;
}

export interface UpdateNetworkDto {
  name?: string;
  description?: string;
  ip_range?: string;
}

// Get all networks for the current user
export async function getNetworks(): Promise<Network[]> {
  // Check if using fake user
  if (isFakeUser()) {
    return generateFakeNetworks();
  }

  const { data, error } = await supabase
    .from('networks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

// Create a new network
export async function createNetwork(network: CreateNetworkDto): Promise<Network> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('networks')
    .insert([{
      ...network,
      user_id: user.id,
    }])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// Update an existing network
export async function updateNetwork(id: string, updates: UpdateNetworkDto): Promise<Network> {
  const { data, error } = await supabase
    .from('networks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// Delete a network
export async function deleteNetwork(id: string): Promise<void> {
  const { error } = await supabase
    .from('networks')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
}

