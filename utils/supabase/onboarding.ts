"use server"
import { cookies } from "next/headers"
import { createClient } from "./server"

// Types for onboarding data
export type License = {
  id?: string
  user_id?: string
  license_number: string
  issuing_date?: string
  expiry_date?: string
  license_type: string
  file_path?: string
  status?: string
  admin_notes?: string
}

export type Vehicle = {
  id?: string
  user_id?: string
  registration_number: string
  vehicle_type: string
  capacity?: string
  label_photo_path?: string
  sealing_photo_path?: string
  approved_routes: string
  status?: string
  admin_notes?: string
}

export type TrackingDocument = {
  id?: string
  user_id?: string
  vehicle_id?: string
  waste_type: string
  quantity: number
  container_count: number
  collection_point: string
  disposal_point: string
  collection_date: string
  status?: string
  verification_code?: string
  digital_signature?: string
}

// Client-side functions
export const createLicense = async (licenseData: License) => {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from("licenses")
    .insert({
      ...licenseData,
      user_id: userData.user?.id,
      status: "pending",
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export const updateLicense = async (id: string, licenseData: Partial<License>) => {
  const supabase = await createClient()

  const { data, error } = await supabase.from("licenses").update(licenseData).eq("id", id).select().single()

  if (error) throw error
  return data
}

export const createVehicle = async (vehicleData: Vehicle) => {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from("vehicles")
    .insert({
      ...vehicleData,
      user_id: userData.user?.id,
      status: "pending",
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export const updateVehicle = async (id: string, vehicleData: Partial<Vehicle>) => {
  const supabase = await createClient()

  const { data, error } = await supabase.from("vehicles").update(vehicleData).eq("id", id).select().single()

  if (error) throw error
  return data
}

export const createTrackingDocument = async (trackingData: TrackingDocument) => {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()

  // Generate a verification code
  const verificationCode = `WM-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}-NEMA`

  const { data, error } = await supabase
    .from("tracking_documents")
    .insert({
      ...trackingData,
      user_id: userData.user?.id,
      status: "active",
      verification_code: verificationCode,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export const updateOnboardingStatus = async (step: string, completed = false) => {
  const supabase = await createClient()

  const { error } = await supabase
    .from("profiles")
    .update({
      onboarding_step: step,
      onboarding_completed: completed,
    })
    .eq("id", (await supabase.auth.getUser()).data.user?.id)

  if (error) throw error
  return { success: true }
}

// Server-side functions
export const getUserLicenses = async () => {
  const supabase = await createClient()
  const { data: session } = await supabase.auth.getSession()

  if (!session.session) return { licenses: [] }

  const { data: licenses, error } = await supabase
    .from("licenses")
    .select("*")
    .eq("user_id", session.session.user.id)
    .order("created_at", { ascending: false })

  if (error) throw error
  return { licenses }
}

export const getUserVehicles = async () => {
  const supabase = await createClient()
  const { data: session } = await supabase.auth.getSession()

  if (!session.session) return { vehicles: [] }

  const { data: vehicles, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("user_id", session.session.user.id)
    .order("created_at", { ascending: false })

  if (error) throw error
  return { vehicles }
}

export const getUserTrackingDocuments = async () => {
  const supabase = await createClient()
  const { data: session } = await supabase.auth.getSession()

  if (!session.session) return { documents: [] }

  const { data: documents, error } = await supabase
    .from("tracking_documents")
    .select("*, vehicles(registration_number)")
    .eq("user_id", session.session.user.id)
    .order("created_at", { ascending: false })

  if (error) throw error
  return { documents }
}

export const getOnboardingStatus = async () => {
  const supabase = await createClient()
  const { data: session } = await supabase.auth.getSession()

  if (!session.session) return { step: null, completed: false }

  const { data, error } = await supabase
    .from("profiles")
    .select("onboarding_step, onboarding_completed, role")
    .eq("id", session.session.user.id)
    .single()

  if (error) throw error
  return {
    step: data.onboarding_step,
    completed: data.onboarding_completed,
    role: data.role,
  }
}

export const uploadFile = async (bucket: string, filePath: string, file: File) => {
  const supabase = await createClient()

  const { data, error } = await supabase.storage.from(bucket).upload(filePath, file)

  if (error) throw error

  return data
}
