'use client';

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { ClientsTable } from "@/components/clients/ClientsTable";
import { ClientsFilters } from "@/components/clients/ClientsFilters";
import { ClientsActions } from "@/components/clients/ClientsActions";

export default function ClientsPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [searchParams, setSearchParams] = useState<{
    name?: string;
    phone?: string;
    contactPerson?: string;
  }>({});

  const handleClientAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSearch = (params: {
    name?: string;
    phone?: string;
    contactPerson?: string;
  }) => {
    setSearchParams(params);
  };

  const handleReset = () => {
    setSearchParams({});
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-800">Clients</h1>
              <ClientsActions onClientAdded={handleClientAdded} />
            </div>

            <ClientsFilters onSearch={handleSearch} onReset={handleReset} />            <ClientsTable 
              refreshTrigger={refreshTrigger} 
              searchParams={searchParams}
            />
          </div>
        </main>
      </div>
    </div>
  );
}