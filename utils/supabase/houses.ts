import { createClient } from "@/utils/supabase/server"
import type { HouseData, HouseFormValues } from "@/app/(dashboard)/houses/hooks/useFormSchema"

export async function getHousesData(): Promise<HouseData[]> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("houses").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching houses:", error)
    return []
  }

  return data.map((house) => ({
    id: house.id,
    name: house.name,
    location: house.location,
    createdAt: house.created_at,
    owner: house.owner,
    contact: house.contact,
    email: house.email,
    status: house.status,
    last_collection: house.last_collection,
    payment_status: house.payment_status,
  }))
}

export async function deleteHouse(houseId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("houses").delete().eq("id", houseId)

  if (error) {
    console.error("Error deleting house:", error)
    return { success: false, error }
  }

  return { success: true }
}

export async function createHouse(data: HouseFormValues) {
  const supabase = await createClient()

  const { data: newHouse, error } = await supabase
    .from("houses")
    .insert({
      ...data,
      created_at: new Date().toISOString(),
      last_collection: null,
      payment_status: "Pending",
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating house:", error)
    return {
      success: false,
      data: null,
      error: "Failed to create house in Supabase",
    }
  }

  return {
    success: true,
    data: { id: newHouse.id },
    error: null,
  }
}

export async function updatedHouse(houseId: string, data: HouseFormValues) {
  const supabase = await createClient()

  const { data: updatedHouse, error } = await supabase
    .from("houses")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", houseId)
    .select()
    .single()

  if (error) {
    console.error("Error updating house:", error)
    return { success: false, error }
  }

  return {
    success: true,
    data: updatedHouse,
  }
}

export async function getHouseById(houseId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("houses").select("*").eq("id", houseId).single()

  if (error) {
    console.error("Error getting house by ID:", error)
    return null
  }

  return data
}
