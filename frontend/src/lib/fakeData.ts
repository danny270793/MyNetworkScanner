import { type Network, type Device } from './networks';

// Sample network names and descriptions
const networkNames = [
  'Home Network', 'Office LAN', 'Guest WiFi', 'IoT Network', 'Server Network',
  'Development Lab', 'Production Network', 'Backup Network', 'Security Cameras',
  'Smart Home', 'Gaming Network', 'Media Server', 'Work from Home', 'Test Lab'
];

const networkDescriptions = [
  'Main home network for all devices',
  'Corporate office local area network',
  'Guest access wireless network',
  'Internet of Things device network',
  'Internal server infrastructure',
  'Development and testing environment',
  'Production server network',
  'Backup and redundancy network',
  'Security camera monitoring network',
  'Smart home automation devices',
  'Gaming and entertainment network',
  'Media streaming and storage',
  'Remote work connectivity',
  'Testing and development lab'
];

const ipRanges = [
  '192.168.1.0/24', '192.168.0.0/24', '10.0.0.0/24', '172.16.0.0/24',
  '192.168.2.0/24', '10.0.1.0/24', '172.16.1.0/24', '192.168.10.0/24',
  '10.10.0.0/24', '172.20.0.0/24', '192.168.100.0/24', '10.1.0.0/24'
];

// Device brands and models
const deviceBrands = [
  'Apple', 'Samsung', 'Google', 'Microsoft', 'Dell', 'HP', 'Lenovo', 'ASUS',
  'Netgear', 'TP-Link', 'Linksys', 'Cisco', 'Ubiquiti', 'Aruba', 'Raspberry Pi',
  'Intel', 'AMD', 'NVIDIA', 'Sony', 'LG', 'Panasonic', 'Philips', 'Amazon',
  'Roku', 'Nest', 'Ring', 'Echo', 'Fire TV', 'Chromecast', 'Apple TV'
];

const deviceTypes = [
  'Laptop', 'Desktop', 'Phone', 'Tablet', 'Router', 'Switch', 'Access Point',
  'Printer', 'Scanner', 'Camera', 'Smart TV', 'Gaming Console', 'Smart Speaker',
  'Smart Home Hub', 'Security Camera', 'NAS', 'Server', 'Workstation',
  'Chromebook', 'iPad', 'iPhone', 'Android Phone', 'Smart Watch', 'IoT Device'
];

// Generate random MAC address
function generateMacAddress(): string {
  const hex = '0123456789ABCDEF';
  let mac = '';
  for (let i = 0; i < 6; i++) {
    if (i > 0) mac += ':';
    mac += hex[Math.floor(Math.random() * 16)];
    mac += hex[Math.floor(Math.random() * 16)];
  }
  return mac;
}

// Generate random IP address within a range
function generateIpAddress(ipRange: string): string {
  const [network, cidr] = ipRange.split('/');
  const [a, b, c] = network.split('.').map(Number);
  const hostBits = 32 - Number.parseInt(cidr, 10);
  const maxHosts = Math.pow(2, hostBits) - 2; // -2 for network and broadcast
  const randomHost = Math.floor(Math.random() * maxHosts) + 1;
  
  const d = (randomHost & 0xFF);
  return `${a}.${b}.${c}.${d}`;
}

// Generate random device name
function generateDeviceName(): string {
  const brand = deviceBrands[Math.floor(Math.random() * deviceBrands.length)];
  const deviceType = deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
  const model = Math.floor(Math.random() * 9999) + 1000;
  return `${brand} ${deviceType} ${model}`;
}

// Check if current user is fake user
export function isFakeUser(): boolean {
  if (globalThis.window === undefined) return false;
  
  // Check localStorage for fake user session
  const fakeUserSession = localStorage.getItem('fake-user-session');
  if (fakeUserSession === 'true') {
    return true;
  }
  
  // Also check if we can find the fake user ID in any auth token
  try {
    const authToken = localStorage.getItem('sb-supabase-auth-token');
    if (authToken) {
      const parsed = JSON.parse(authToken);
      return parsed?.user?.id === 'fake-user-id-12345';
    }
  } catch {
    // Ignore parsing errors
  }
  
  return false;
}

// Generate fake networks
export function generateFakeNetworks(): Network[] {
  const networks: Network[] = [];
  const numNetworks = Math.floor(Math.random() * 8) + 3; // 3-10 networks
  
  for (let i = 0; i < numNetworks; i++) {
    const name = networkNames[Math.floor(Math.random() * networkNames.length)];
    const description = networkDescriptions[Math.floor(Math.random() * networkDescriptions.length)];
    const ipRange = ipRanges[Math.floor(Math.random() * ipRanges.length)];
    
    networks.push({
      id: `fake-network-${i + 1}`,
      user_id: 'fake-user-id-12345',
      name: `${name} ${i > 0 ? i + 1 : ''}`,
      description,
      ip_range: ipRange,
      created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    });
  }
  
  return networks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

// Generate fake devices for a network
export function generateFakeDevices(networkId: string, ipRange?: string): Device[] {
  const devices: Device[] = [];
  const numDevices = Math.floor(Math.random() * 25) + 5; // 5-29 devices
  
  for (let i = 0; i < numDevices; i++) {
    const brand = deviceBrands[Math.floor(Math.random() * deviceBrands.length)];
    const name = Math.random() > 0.3 ? generateDeviceName() : undefined; // 70% chance of having a name
    const state = Math.random() > 0.2 ? 'online' : 'offline'; // 80% chance of being online
    const mac = generateMacAddress();
    const ip = ipRange ? generateIpAddress(ipRange) : `192.168.1.${i + 10}`;
    
    devices.push({
      id: `fake-device-${networkId}-${i + 1}`,
      network_id: networkId,
      ip,
      mac,
      name,
      brand: Math.random() > 0.4 ? brand : undefined, // 60% chance of having brand
      state,
      last_seen: state === 'online' ? new Date().toISOString() : undefined,
      created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    });
  }
  
  return devices.toSorted((a, b) => {
    // Sort by IP address numerically
    const ipToNumber = (ip: string) => {
      return ip.split('.').reduce((acc, octet) => (acc << 8) + Number.parseInt(octet, 10), 0);
    };
    return ipToNumber(a.ip) - ipToNumber(b.ip);
  });
}

// Generate fake data for testing
export function generateAllFakeData(): { networks: Network[], devices: { [networkId: string]: Device[] } } {
  const networks = generateFakeNetworks();
  const devices: { [networkId: string]: Device[] } = {};
  
  for (const network of networks) {
    devices[network.id] = generateFakeDevices(network.id, network.ip_range);
  }
  
  return { networks, devices };
}
