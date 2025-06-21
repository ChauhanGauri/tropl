'use client';

import { Sidebar } from "@/components/dashboard/Sidebar";
import { JobSeekersTable } from "@/components/job-seekers/JobSeekersTable";
import { JobSeekersFilters } from "@/components/job-seekers/JobSeekersFilters";
import { JobSeekersActions } from "@/components/job-seekers/JobSeekersActions";
import { useState } from "react";

export default function JobSeekersPage() {
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [searchParams, setSearchParams] = useState<{
    name?: string;
    jobTitle?: string;
    skills?: string;
    location?: string;
  }>({});

  const handleRefresh = () => {
    setRefreshCounter(prev => prev + 1);
  };

  const handleSearch = (params: {
    name?: string;
    jobTitle?: string;
    skills?: string;
    location?: string;
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
        <main className="flex-1 overflow-y-auto">          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-800">Job Seekers</h1>
              <JobSeekersActions onRefresh={handleRefresh} />
            </div>

            <JobSeekersFilters onSearch={handleSearch} onReset={handleReset} />
            <JobSeekersTable refresh={refreshCounter} searchParams={searchParams} />
          </div>
        </main>
      </div>
    </div>
  );
}