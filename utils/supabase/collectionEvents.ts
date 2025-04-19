import { CollectionEvent } from "@/lib/types"
import { createClient } from "@/utils/supabase/server"


export async function getCollectionEvents(): Promise<CollectionEvent[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("collection_events").select("*").order("date", { ascending: false })

  if (error) {
    console.error("Error fetching collection events:", error)
    return []
  }

  return data
}

export async function getHouseCollection(houseId: string): Promise<CollectionEvent[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("house_id", houseId)
    .order("date", { ascending: false })

  if (error) {
    console.error("Error fetching house collection:", error)
    throw error
  }

  return data
}

export async function getCollectionEventById(id: string): Promise<CollectionEvent | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("collections").select("*").eq("id", id).single()

  if (error) {
    console.error("Error getting collection event by id:", error)
    return null
  }

  return data
}

export async function createCollectionEvent(data: {
  title: string
  recipients: string
  location: string
  status: "Active" | "Inactive"
}) {
  const supabase = await createClient()

  const { data: newEvent, error } = await supabase
    .from("collection_events")
    .insert({
      title: data.title,
      house_id: data.recipients,
      location: data.location,
      status: data.status,
      time: "10:30 AM - 2:15 PM",
      created_at: new Date().toISOString(),
      date: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating collection event:", error)
    return {
      success: false,
      data: null,
      error: "Failed to create collection event",
    }
  }

  return {
    success: true,
    data: { id: newEvent.id },
    error: null,
  }
}

export async function updateCollectionEvent(id: string, data: Partial<CollectionEvent>) {
  const supabase = await createClient()

  const { data: updatedEvent, error } = await supabase
    .from("collections")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating collection event:", error)
    return { success: false, error }
  }

  return {
    success: true,
    data: updatedEvent,
  }
}

export async function deleteCollectionEvent(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("collections").delete().eq("id", id)

  if (error) {
    console.error("Error deleting collection event:", error)
    return { success: false, error }
  }

  return { success: true }
}
