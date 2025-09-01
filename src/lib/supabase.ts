import { createClient } from '@supabase/supabase-js'

// Use environment variables for production deployment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oqwlelnvdrproefwrowm.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xd2xlbG52ZHJwcm9lZndyb3dtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4OTg4NjEsImV4cCI6MjA3MDQ3NDg2MX0.K0EK7ItF1Qh-4v8JahVtboc0YVUIgYnhMO7nXyP29wY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helper functions
export const supabaseAuth = {
  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password })
  },
  
  signOut: async () => {
    return await supabase.auth.signOut()
  },
  
  getUser: async () => {
    return await supabase.auth.getUser()
  },
  
  getSession: async () => {
    return await supabase.auth.getSession()
  }
}

// Database types
export interface ContactInfo {
  id: number
  icon: string
  title: string
  details: string
  link?: string
  created_at: string
  updated_at: string
}

export interface SocialLink {
  id: number
  platform: string
  url: string
  created_at: string
  updated_at: string
}

export interface PartnerCategory {
  id: string
  name: string
  original_path?: string
  created_at: string
  updated_at: string
}

export interface PartnerLogo {
  id: string
  category_id: string
  alt: string
  image_path: string
  url?: string
  created_at: string
  updated_at: string
}

export interface JobOpening {
  id: string
  icon_name: string
  title: string
  short_description: string
  is_remote: boolean
  is_tr: boolean
  slug: string
  full_title: string
  description: string
  what_you_will_do: string[]
  what_were_looking_for: string[]
  why_join_us: string[]
  apply_link?: string
  created_at: string
  updated_at: string
}

export interface JobApplication {
  id: string
  job_id: string
  job_title: string
  full_name: string
  email: string
  phone: string
  message?: string
  cv_file_path?: string
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
  created_at: string
  updated_at: string
}

export interface NewsletterSubscriber {
  id: number
  email: string
  subscribed_at: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface InteractiveMasthead {
  id: string
  category: string
  brand: string
  title: string
  image: string
  popup_html_path: string
  popup_title: string
  popup_description?: string
  banner_size?: string
  banner_platforms?: string
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  name: string
  description: string
  folder_name: string
  icon: string
  image_url: string
  created_at: string
  updated_at: string
}

export interface Application {
  id: number
  title: string
  description: string
  image: string
  features: string[]
  platforms: string
  created_at: string
  updated_at: string
}

export interface Game {
  id: number
  title: string
  description: string
  image: string
  features: string[]
  platforms: string
  project_url?: string
  created_at: string
  updated_at: string
}

export interface DigitalMarketing {
  id: number
  title: string
  client: string
  description: string
  image: string
  services: string[]
  project_url?: string
  created_at: string
  updated_at: string
}

export interface WebPortal {
  id: number
  title: string
  client: string
  description: string
  image: string
  project_url?: string
  created_at: string
  updated_at: string
}

export interface TopBanner {
  id: number
  title: string
  subtitle?: string
  description?: string
  button_text?: string
  button_link?: string
  background_image?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface TeamMember {
  id: number
  name: string
  position: string
  image: string
  bio?: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}
