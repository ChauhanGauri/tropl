import { Button } from "@/components/ui/button";
import { Plus, Upload, Mail } from "lucide-react";
import { useState } from "react";
import { AddResumeModal } from "@/components/job-seekers/AddResumeModal";
import { AddBulkResumesModal } from "@/components/job-seekers/AddBulkResumesModal";

interface JobSeekersActionsProps {
  onRefresh?: () => void;
}

export function JobSeekersActions({ onRefresh }: JobSeekersActionsProps) {
  const [showAddResume, setShowAddResume] = useState(false);
  const [showAddBulkResumes, setShowAddBulkResumes] = useState(false);

  const handleResumeSaved = () => {
    onRefresh?.();
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-3">
        <Button
          onClick={() => setShowAddResume(true)}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Resume
        </Button>
        <Button
          onClick={() => setShowAddBulkResumes(true)}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Upload className="h-4 w-4 mr-2" />
          Add Bulk Resumes
        </Button>
      </div>

      

      <AddResumeModal
        open={showAddResume}
        onOpenChange={setShowAddResume}
        onSave={handleResumeSaved}
      />
      <AddBulkResumesModal
        open={showAddBulkResumes}
        onOpenChange={setShowAddBulkResumes}
      />
    </div>
  );
}