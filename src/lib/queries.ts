import { createClient } from '@/lib/supabase/server'
import type { Property } from './types'

export async function getProperties(filters?: {
  department?: string
  property_type?: string
  status?: string
}): Promise<Property[]> {
  const supabase = await createClient()
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

export async function getFeaturedProperties(): Promise<Property[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('status', 'funding')
    .order('created_at', { ascending: false })
    .limit(3)

  if (error) {
    console.error('Error fetching featured properties:', error)
    return []
  }

  return data as Property[]
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching property:', error)
    return null
  }

  return data as Property
}

export async function getAllProperties(): Promise<Property[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching properties:', error)
    return []
  }

  return data as Property[]
}
