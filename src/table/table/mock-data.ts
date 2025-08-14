export interface MockedPerson {
  id: string
  firstName: string | null
  walletAddress: string
  isActive: boolean
  payment: number
  email: string
  status: 'active' | 'inactive'
  address: {
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
      addressLine1: '123 Main St',
      addressLine2: 'Apt 1',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
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
      addressLine1: '123 Main St',
      addressLine2: 'Apt 1',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
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
      addressLine1: '123 Main St',
      addressLine2: 'Apt 1',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
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
      addressLine1: '123 Main St',
      addressLine2: 'Apt 1',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
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
      addressLine1: '123 Main St',
      addressLine2: 'Apt 1',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
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
      addressLine1: '123 Main St',
      addressLine2: 'Apt 1',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
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
      addressLine1: '123 Main St',
      addressLine2: 'Apt 1',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
    },
  },
]
