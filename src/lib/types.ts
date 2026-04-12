export type PropertyStatus = 'coming_soon' | 'funding' | 'funded' | 'renting' | 'closed'
export type PropertyType = 'apartment' | 'house' | 'land' | 'commercial'
export type KycStatus = 'pending' | 'verified' | 'rejected'
export type TransactionType = 'buy' | 'sell' | 'yield'
export type TransactionStatus = 'pending' | 'confirmed' | 'failed'
export type HoldingStatus = 'active' | 'sold' | 'pending'
export type DistributionStatus = 'pending' | 'distributed'

export interface Property {
  id: string
  name: string
  slug: string
  description: string
  location: string
  department: string
  address: string
  latitude: number | null
  longitude: number | null
  total_value: number
  token_price: number
  total_tokens: number
  tokens_sold: number
  annual_yield_pct: number
  status: PropertyStatus
  property_type: PropertyType
  bedrooms: number | null
  bathrooms: number | null
  area_m2: number
  images: string[]
  documents: { name: string; url: string; type: string }[]
  fideicomiso_number: string | null
  created_at: string
  updated_at: string
}

export interface Investor {
  id: string
  full_name: string
  email: string
  phone: string | null
  document_type: 'CI' | 'Pasaporte' | 'DNI'
  document_number: string
  country: string
  wallet_address: string | null
  kyc_status: KycStatus
  accredited: boolean
  created_at: string
}

export interface Holding {
  id: string
  investor_id: string
  property_id: string
  tokens: number
  purchase_price: number
  purchased_at: string
  tx_signature: string | null
  status: HoldingStatus
  property?: Property
}

export interface Distribution {
  id: string
  property_id: string
  period: string
  total_amount: number
  per_token_amount: number
  distributed_at: string | null
  status: DistributionStatus
}

export interface Transaction {
  id: string
  investor_id: string
  property_id: string
  type: TransactionType
  tokens: number
  amount: number
  fee: number
  tx_signature: string | null
  status: TransactionStatus
  created_at: string
  property?: Property
}
