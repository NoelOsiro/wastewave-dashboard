import { prisma } from "@/lib/prisma";
import { HouseData, HouseFormValues, HouseStatus } from "@/lib/types";

export async function getHousesData(): Promise<HouseData[]> {
  try {
    const generators = await prisma.generator.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            username: true,
            paidTransactions: {
              select: {
                status: true,
              },
              orderBy: {
                transactionDate: "desc",
              },
              take: 1,
            },
          },
        },
        collectionRequests: {
          select: {
            requestedTime: true,
          },
          orderBy: {
            requestedTime: "desc",
          },
          take: 1,
        },
      },
    });

    return generators.map((generator) => ({
      id: generator.id,
      name: generator.user.name || generator.user.username || "Unknown",
      location: generator.address,
      createdAt: generator.createdAt.toISOString(),
      owner: generator.user.name || generator.user.username || "Unknown",
      contact: generator.user.username || "N/A",
      email: generator.user.email || "N/A",
      status: (generator.status === "Active" || generator.status === "Inactive" 
        ? generator.status 
        : "Inactive") as HouseStatus,  // Default to "Inactive" if status is invalid
      last_collection: generator.collectionRequests[0]?.requestedTime?.toISOString() || "",
      payment_status: generator.user.paidTransactions[0]?.status || "Pending",
    }));
  } catch (error) {
    console.error("Error fetching generators:", error);
    return [];
  }
}

export async function deleteHouse(houseId: string) {
  try {
    await prisma.generator.delete({
      where: { id: houseId },
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting generator:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function createHouse(data: HouseFormValues) {
  try {
    // Create or find user
    const user = await prisma.user.upsert({
      where: { email: data.email },
      update: {
        name: data.owner,
        username: data.contact, // Use contact as username or replace with phone
      },
      create: {
        email: data.email,
        name: data.owner,
        username: data.contact,
        role: "generator",
        password: "default-hashed-password", // Replace with proper password handling
      },
    });

    const newHouse = await prisma.generator.create({
      data: {
        userId: user.id,
        address: data.location,
        status: data.status || "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      select: {
        id: true,
      },
    });

    return {
      success: true,
      data: { id: newHouse.id },
      error: null,
    };
  } catch (error) {
    console.error("Error creating generator:", error);
    return {
      success: false,
      data: null,
      error: "Failed to create generator",
    };
  }
}

export async function updatedHouse(houseId: string, data: HouseFormValues) {
  try {
    // Update user if email or owner changes
    const generator = await prisma.generator.findUnique({
      where: { id: houseId },
      include: { user: true },
    });
    if (!generator) throw new Error("Generator not found");

    await prisma.user.update({
      where: { id: generator.userId },
      data: {
        name: data.owner,
        email: data.email,
        username: data.contact, // Use contact as username or replace with phone
      },
    });

    const updatedHouse = await prisma.generator.update({
      where: { id: houseId },
      data: {
        address: data.location,
        status: data.status,
        updatedAt: new Date(),
      },
      select: {
        id: true,
      },
    });

    return {
      success: true,
      data: updatedHouse,
    };
  } catch (error) {
    console.error("Error updating generator:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function getHouseById(houseId: string) {
  try {
    const generator = await prisma.generator.findUnique({
      where: { id: houseId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            username: true,
            paidTransactions: {
              select: {
                status: true,
              },
              orderBy: {
                transactionDate: "desc",
              },
              take: 1,
            },
          },
        },
        collectionRequests: {
          select: {
            requestedTime: true,
          },
          orderBy: {
            requestedTime: "desc",
          },
          take: 1,
        },
      },
    });

    if (!generator) return null;

    return {
      id: generator.id,
      name: generator.user.name || generator.user.username || "Unknown",
      location: generator.address,
      createdAt: generator.createdAt.toISOString(),
      owner: generator.user.name || generator.user.username || "Unknown",
      contact: generator.user.username || "N/A",
      email: generator.user.email || "N/A",
      status: generator.status,
      last_collection: generator.collectionRequests[0]?.requestedTime?.toISOString() || "",
      payment_status:
        generator.user.paidTransactions[0]?.status || "Pending",
    };
  } catch (error) {
    console.error("Error getting generator by ID:", error);
    return null;
  }
}