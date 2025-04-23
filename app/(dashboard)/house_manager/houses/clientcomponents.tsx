
// Client wrapper for interactive components
"use client";

import { useState } from "react";
import { HouseTable } from "@/components/houses/HouseTable";


import { EditHouseSheet } from "@/components/houses/EditHouseSheet";
import { ViewHouseSheet } from "@/components/houses/ViewHouseSheet";
import { DeleteHouseSheet } from "@/components/houses/DeleteHouseSheet";
import { NewHouseModal } from "@/components/houses/NewHouseModal";
import { useRouter } from "next/navigation";
import { HouseData } from "@/lib/types";

type ClientComponentsProps = {
  initialHouses: HouseData[];
};

export default function ClientComponents({ initialHouses }: ClientComponentsProps) {
  const [houses, setHouses] = useState(initialHouses);
  const [openNewHouseModal, setOpenNewHouseModal] = useState(false);
  const [openEditSheet, setOpenEditSheet] = useState(false);
  const [openViewSheet, setOpenViewSheet] = useState(false);
  const [openDeleteSheet, setOpenDeleteSheet] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState<HouseData | null>(null);
  const router = useRouter();

  const handleView = (house: HouseData) => {
    setSelectedHouse(house);
    setOpenViewSheet(true);
  };

  const handleEdit = (house: HouseData) => {
    // Navigate to the dedicated edit page
    router.push(`/houses/edit/${house.id}`);
  };

  const handleDelete = (house: HouseData) => {
    setSelectedHouse(house);
    setOpenDeleteSheet(true);
  };

  const handleSuccess = async () => {
    await fetch("/api/houses"); // Trigger revalidation
  };

  return (
    <>
      <HouseTable initialHouses={houses} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
      <NewHouseModal open={openNewHouseModal} onOpenChange={setOpenNewHouseModal} onSuccess={handleSuccess} />
      <EditHouseSheet open={openEditSheet} onOpenChange={setOpenEditSheet} house={selectedHouse} onSuccess={handleSuccess} />
      <ViewHouseSheet open={openViewSheet} onOpenChange={setOpenViewSheet} house={selectedHouse} onEdit={handleEdit} />
      <DeleteHouseSheet open={openDeleteSheet} onOpenChange={setOpenDeleteSheet} house={selectedHouse} onSuccess={handleSuccess} />
    </>
  );
}
