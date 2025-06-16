"use client";
import React, { useCallback, useState } from "react";
import CreateLabModal from "./CreateLab";
import { Venue } from "@/types";
import { VenueModel } from "@/models/Labs";

const LabsPage = () => {
  const [openCreate, setOpenCreate] = useState(false);
  const [venues, setVenues] = useState<Venue[]>([]);

  const fetchVenues = useCallback(async () => {
    try {
      setVenues(await VenueModel.getAllVenues());
    } catch (error) {
      console.error(error);
    }
  }, []);

  React.useEffect(() => {
    fetchVenues();
  }, [fetchVenues]);
  return (
    <div className="flex flex-col font-ins-sans">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Lab & Venue</h1>
        <button
          onClick={() => setOpenCreate(true)}
          className="bg-primary text-white px-4 py-2 rounded-md cursor-pointer"
        >
          Add Venue
        </button>
      </div>

      <CreateLabModal
        open={openCreate}
        onDismiss={() => setOpenCreate(false)}
        refresh={fetchVenues}
      />
      <div className="flex flex-col mt-5">
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-lg font-bold text-primary">All Venues</h1>
        </div>
        <table className="w-full mt-5 stripped table-fixed">
          <thead>
            <tr className="bg-[#FAFCFF] text-primary ">
              <th className="p-2 py-3 text-left">Venue Name</th>
              <th className="p-2 py-3 text-left">Location</th>
              <th className="p-2 py-3 text-left">Capacity</th>
              <th className="p-2 py-3 text-left">Type</th>
              {/* <th className="p-2 py-3 text-left">Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {venues?.map((venue) => (
              <tr key={venue.id}>
                <td className="p-2">{venue.name}</td>
                <td className="p-2">{venue.location}</td>
                <td className="p-2">{venue.capacity}</td>
                <td className="p-2 capitalize">
                  {venue.type.replace("_", " ")}
                </td>
                {/* <td className="p-2">
                  <button className="bg-red-400 text-white px-4 py-2 rounded-md cursor-pointer"></button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LabsPage;
