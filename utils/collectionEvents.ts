import { CollectionEvent } from "@/lib/types";
import { prisma } from "@/lib/prisma";

export async function getCollectionEvents(): Promise<CollectionEvent[]> {
  try {
    const events = await prisma.collectionRequest.findMany({
      orderBy: {
        requestedTime: "desc",
      },
      select: {
        id: true,
        title: true,
        generatorId: true,
        location: true,
        status: true,
        wasteType: true,
        amount: true,
        requestedTime: true,
        collector:true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return events.map(event => ({
      ...event,
      requestedTime: event.requestedTime.toISOString(),
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching collection events:", error);
    return [];
  }
}

export async function getHouseCollection(generatorId: string): Promise<CollectionEvent[]> {
  try {
    const events = await prisma.collectionRequest.findMany({
      where: {
        generatorId, // Changed from house_id to generatorId
      },
      orderBy: {
        requestedTime: "desc", // Changed from date to requestedTime
      },
      select: {
        id: true,
        title: true,
        generatorId: true,
        location: true,
        status: true,
        wasteType: true,
        amount: true,
        requestedTime: true,
        createdAt: true,
        updatedAt: true,
        collector:true,
      },
    });
    return events.map(event => ({
      ...event,
      requestedTime: event.requestedTime.toISOString(),
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching house collection:", error);
    return [];
  }
}

export async function getCollectionEventById(id: string): Promise<CollectionEvent | null> {
  try {
    const event = await prisma.collectionRequest.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        title: true,
        generatorId: true,
        location: true,
        status: true,
        wasteType: true,
        amount: true,
        requestedTime: true,
        createdAt: true,
        updatedAt: true,
        collector:true,
      },
    });
    if (!event) return null;
    return {
      ...event,
      requestedTime: event.requestedTime.toISOString(),
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error("Error getting collection event by id:", error);
    return null;
  }
}

export async function createCollectionEvent(data: {
  title: string;
  generatorId: string;
  location: string;
  status: "Active" | "Inactive"|"Scheduled";
  wasteType: string;
  amount: number;
}) {
  try {
    const newEvent = await prisma.collectionRequest.create({
      data: {
        title: data.title,
        generatorId: data.generatorId,
        location: data.location,
        status: data.status,
        wasteType: data.wasteType,
        amount: data.amount,
        requestedTime: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      select: {
        id: true,
      },
    });
    return {
      success: true,
      data: { id: newEvent.id },
      error: null,
    };
  } catch (error) {
    console.error("Error creating collection event:", error);
    return {
      success: false,
      data: null,
      error: "Failed to create collection event",
    };
  }
}

export async function updateCollectionEvent(id: string, data: Partial<CollectionEvent>) {
  try {
    const updatedEvent = await prisma.collectionRequest.update({
      where: {
        id,
      },
      data: {
        title: data.title,
        generatorId: data.generatorId,
        location: data.location,
        status: data.status,
        wasteType: data.wasteType,
        amount: data.amount,
        requestedTime: data.requestedTime ? new Date(data.requestedTime) : undefined,
        updatedAt: new Date(),
      },
      select: {
        id: true,
      },
    });
    return {
      success: true,
      data: updatedEvent,
    };
  } catch (error) {
    console.error("Error updating collection event:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteCollectionEvent(id: string) {
  try {
    await prisma.collectionRequest.delete({
      where: {
        id,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting collection event:", error);
    return { success: false, error: (error as Error).message };
  }
}