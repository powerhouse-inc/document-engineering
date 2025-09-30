export interface MockedPerson {
  id: string
  firstName: string | null
  walletAddress: string
  isActive: boolean
  payment: number
  email: string
  status: 'active' | 'inactive'
  address: {
    country: string
    addressLine1: string
    addressLine2: string
    city: string
    state: string
    zip: string
  }
}

export const mockData: MockedPerson[] = [
  {
    id: '1',
    firstName: 'Alice',
    walletAddress: '0x1234567890abcdef',
    isActive: true,
    payment: 100,
    email: 'alice@example.com',
    status: 'active',
    address: {
      country: 'US',
      addressLine1: '123 Main St',
      addressLine2: 'Apt 1',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
    },
  },
  {
    id: '2',
    firstName: 'Bob',
    walletAddress: '0x1234567890abcdef',
    isActive: false,
    payment: 1065460,
    email: 'bob@example.com',
    status: 'inactive',
    address: {
      country: 'CA',
      addressLine1: '456 Queen St',
      addressLine2: 'Suite 200',
      city: 'Toronto',
      state: 'ON',
      zip: 'M5H 2M9',
    },
  },
  {
    id: '3',
    firstName: null,
    walletAddress: '0x1234567890abcdef',
    isActive: true,
    payment: 14522,
    email: 'charlie@example.com',
    status: 'active',
    address: {
      country: 'ES',
      addressLine1: 'Calle Gran Vía 123',
      addressLine2: '3º B',
      city: 'Madrid',
      state: 'Madrid',
      zip: '28013',
    },
  },
  {
    id: '4',
    firstName: 'Diana',
    walletAddress: '0x1234567890abcdef',
    isActive: false,
    payment: 11231200,
    email: 'diana@example.com',
    status: 'inactive',
    address: {
      country: 'GB',
      addressLine1: '10 Downing Street',
      addressLine2: 'Westminster',
      city: 'London',
      state: 'England',
      zip: 'SW1A 2AA',
    },
  },
  {
    id: '5',
    firstName: null,
    walletAddress: '0x1234567890abcdef',
    isActive: true,
    payment: 10234234230,
    email: 'edward@example.com',
    status: 'active',
    address: {
      country: 'DE',
      addressLine1: 'Unter den Linden 1',
      addressLine2: 'Haus 2',
      city: 'Berlin',
      state: 'Berlin',
      zip: '10117',
    },
  },
  {
    id: '6',
    firstName: 'Fiona',
    walletAddress: '0x1234567890abcdef',
    isActive: true,
    payment: 0,
    email: 'fiona@example.com',
    status: 'inactive',
    address: {
      country: 'FR',
      addressLine1: '123 Avenue des Champs-Élysées',
      addressLine2: 'Appartement 4B',
      city: 'Paris',
      state: 'Île-de-France',
      zip: '75008',
    },
  },
  {
    id: '7',
    firstName: 'Alex',
    walletAddress: '0x1234567890abcdef',
    isActive: true,
    payment: 15,
    email: 'alex@example.com',
    status: 'inactive',
    address: {
      country: 'JP',
      addressLine1: '1-1-1 Shibuya',
      addressLine2: 'Shibuya Sky 15F',
      city: 'Tokyo',
      state: 'Tokyo',
      zip: '150-0002',
    },
  },
]
