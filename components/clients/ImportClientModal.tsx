import { Upload, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ImportClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImportClientModal({ open, onOpenChange }: ImportClientModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
        <DialogTitle>Import Clients</DialogTitle>
        </DialogHeader>

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="csvFile">Upload CSV*</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Input
                id="csvFile"
                type="file"
                accept=".csv"
                className="hidden"
              />
              <div className="text-gray-500">
                Drag and drop your CSV file here or click to browse
              </div>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => document.getElementById("csvFile")?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload CSV
              </Button>
            </div>
          </div>

          
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button>Import</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 