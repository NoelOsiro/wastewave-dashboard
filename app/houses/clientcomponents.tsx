// Client wrapper for interactive components
"use client";

import { useState } from "react";
import { HouseTable } from "./components/HouseTable";

import { HouseData } from "./hooks/useFormSchema";
import { EditHouseSheet } from "./components/EditHouseSheet";
import { ViewHouseSheet } from "./components/ViewHouseSheet";
import { DeleteHouseSheet } from "./components/DeleteHouseSheet";
import { NewHouseModal } from "./components/NewHouseModal";

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

  const handleView = (house: HouseData) => {
    setSelectedHouse(house);
    setOpenViewSheet(true);
  };

  const handleEdit = (house: HouseData) => {
    setSelectedHouse(house);
    setOpenEditSheet(true);
    setOpenViewSheet(false);
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