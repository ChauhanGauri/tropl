import { Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AddClientModal } from "./AddClientModal";
import { ImportClientModal } from "./ImportClientModal";

interface ClientsActionsProps {
  onClientAdded?: () => void;
}

export function ClientsActions({ onClientAdded }: ClientsActionsProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  return (
    <div className="flex justify-end space-x-4">      <Button
        variant="outline"
        className="bg-green-600 text-white hover:bg-green-700 hover:text-gray-100"
        onClick={() => setShowImportModal(true)}
      >
        <Upload className="w-4 h-4 mr-2" />
        Import Client
      </Button>
      <Button
        variant="outline"
        className="bg-green-600 text-white hover:bg-green-700 hover:text-gray-100"
        onClick={() => setShowAddModal(true)}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Client
      </Button>

      <AddClientModal 
        open={showAddModal} 
        onOpenChange={setShowAddModal}
        onClientAdded={onClientAdded}
      />
      <ImportClientModal 
        open={showImportModal} 
        onOpenChange={setShowImportModal} 
      />
    </div>
  );
}