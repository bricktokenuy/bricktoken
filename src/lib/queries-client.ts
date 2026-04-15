import { createClient } from '@/lib/supabase/client'
import type { Property } from './types'

export async function getPropertiesClient(filters?: {
  department?: string
  property_type?: string
  status?: string
}): Promise<Property[]> {
  const supabase = createClient()
  let query = supabase.from('properties').select('*')

  if (filters?.department && filters.department !== 'all') {
    query = query.eq('department', filters.department)
  }
  if (filters?.property_type && filters.property_type !== 'all') {
    query = query.eq('property_type', filters.property_type)
  }
  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching properties:', error)
    return []
  }

  return data as Property[]
}
