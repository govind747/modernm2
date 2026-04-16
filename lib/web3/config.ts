import { sepolia } from 'wagmi/chains'

// Smart Contract Addresses (Replace with actual deployed addresses)
export const MBONE_TOKEN_ADDRESS = "0x4c612CcA508c45cca9ed0d647be4bf37303942f5" as `0x${string}` // Replace with actual MBONE token address
export const PAYMENT_PROCESSOR_ADDRESS = "0x27a7d36A85CE3FAc70FECD4DA0Bb510892Afa4C5" as `0x${string}` // Replace with actual payment processor address

// Contract ABIs
export const PROCESSOR_ABI = [
  {
    name: 'createOrder',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'orderHash', type: 'bytes32' },
      { name: 'buyer',     type: 'address' },
      { name: 'amount',    type: 'uint256' },
    ],
    outputs: [],
  },
  {
    name: 'payOrder',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'orderHash', type: 'bytes32' },   // ← MUST be bytes32, not string
      { name: 'invoiceId', type: 'string'  },
    ],
    outputs: [],
  },
  {
    name: 'getOrder',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'orderHash', type: 'bytes32' },
    ],
    outputs: [
      {
        name: '',           // ← struct returned as tuple with NAMED components
        type: 'tuple',
        components: [
          { name: 'buyer',  type: 'address' },
          { name: 'amount', type: 'uint256' },
          { name: 'paid',   type: 'bool'    },
        ],
      },
    ],
  },
] as const
 
export const ERC20_ABI = [
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount',  type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner',   type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const

// Convert USD to MBONE amount (with 18 decimals) using dynamic price
export const usdToMBONE = (usdAmount: number, mbonePriceUsd: number): bigint => {
  const mboneAmount = usdAmount / mbonePriceUsd
  return BigInt(Math.floor(mboneAmount * 1e18))
}

// Convert MBONE to USD
export const mboneToUSD = (mboneAmount: bigint, mbonePriceUsd: number): number => {
  return (Number(mboneAmount) / 1e18) * mbonePriceUsd
}

// Generate invoice ID from order ID
export const generateInvoiceId = (orderId: string | undefined | null): string => {
  if (!orderId) {
    console.error('generateInvoiceId called with undefined orderId')
    // Fallback to a random ID if orderId is not provided
    return `ORD-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
  }
  return `ORD-${orderId.slice(0, 8)}`
}

// Get the current chain
export const currentChain = sepolia