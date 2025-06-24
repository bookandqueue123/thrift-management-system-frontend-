"use client";

import React, { useState } from "react";
import { useAuth } from "@/api/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

interface Manager {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

const ExistingMerchant = () => {
  const { client } = useAuth();
  const [selectedId, setSelectedId] = useState("");
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);

  // Fetch all managers (superusers)
  const { data: managers = [], isLoading } = useQuery<Manager[]>({
    queryKey: ["allManagers"],
    queryFn: async () => {
      const res = await client.get("/api/user?role=organisation");
      return res.data;
    },
  });

  // Handle selection
  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedId(id);
    const manager = managers.find((m) => m._id === id) || null;
    setSelectedManager(manager);
  };

  return (
    <div className="p-4">
      <h1 className="text-lg font-semibold mb-4 text-white">Centre Manager Details</h1>

      {isLoading ? (
        <p>Loading managers...</p>
      ) : (
        <>
          <select
            value={selectedId}
            onChange={handleSelect}
            className="border rounded p-2 w-full max-w-sm"
          >
            <option value="">Select a merchant</option>
            {managers.map((manager) => (
              <option key={manager._id} value={manager._id}>
                {manager.firstName} {manager.lastName} ({manager.email})
              </option>
            ))}
          </select>

          {selectedManager && (
            <div className="mt-4 border rounded p-4 bg-gray-100">
              <h2 className="font-semibold">Selected Manager Info:</h2>
              <p>
                <strong>Name:</strong> {selectedManager.firstName} {selectedManager.lastName}
              </p>
              <p>
                <strong>Email:</strong> {selectedManager.email}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExistingMerchant;
