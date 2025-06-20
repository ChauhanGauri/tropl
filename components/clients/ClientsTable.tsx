import { useState, useEffect } from "react";
import { Eye, Pencil, Trash2, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AddClientModal } from "./AddClientModal";
import { ClientDetailsModal } from "./ClientDetailsModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Client {
  id: string;
  name: string;
  gstin?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  pincode?: string;
  contactPerson: string;
  email: string;  phone?: string;
  website?: string;
  status: string;
  notes?: string;
  createdAt: string;
  _count?: {
    jobs: number;
  };
}

interface ClientsTableProps {
  refreshTrigger?: number;
  searchParams?: {
    name?: string;
    phone?: string;
    contactPerson?: string;
  };
}

export function ClientsTable({ refreshTrigger, searchParams }: ClientsTableProps) {const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);  const [viewClient, setViewClient] = useState<Client | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [deleteClient, setDeleteClient] = useState<Client | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { token } = useAuth();
  const fetchClients = async (searchFilters?: typeof searchParams) => {
    try {
      setLoading(true);
      setError('');
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      if (searchFilters?.name) {
        queryParams.append('searchName', searchFilters.name);
      }
      if (searchFilters?.phone) {
        queryParams.append('searchPhone', searchFilters.phone);
      }
      if (searchFilters?.contactPerson) {
        queryParams.append('searchContactPerson', searchFilters.contactPerson);
      }
      
      const queryString = queryParams.toString();
      const url = queryString ? `/api/clients?${queryString}` : '/api/clients';
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setClients(data.data || []);
      } else {
        setError(data.error || 'Failed to fetch clients');
      }} catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const handleEditClient = (client: Client) => {
    setEditClient(client);
    setShowEditModal(true);
  };
  const handleViewClient = (client: Client) => {
    setViewClient(client);
    setShowViewModal(true);
  };

  const handleDeleteClient = async (client: Client) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/clients/${client.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();      if (data.success) {
        // Refresh the clients list
        fetchClients(searchParams);
        setDeleteClient(null);
      } else {
        setError(data.error || 'Failed to delete client');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };
  const handleClientUpdated = () => {
    fetchClients(searchParams);
    setShowEditModal(false);
    setEditClient(null);
  };

  // Function to perform search - can be called from parent
  const performSearch = (filters?: typeof searchParams) => {
    fetchClients(filters);
  };
  
  useEffect(() => {
    if (token) {
      fetchClients(searchParams);
    }
  }, [token, refreshTrigger, searchParams]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading clients...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-600">No clients found. Add your first client to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Contact Person</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact Number</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">{client.name}</TableCell>
              <TableCell>{client.contactPerson}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.phone || 'N/A'}</TableCell>
              <TableCell>
                <Badge
                  variant={client.status === "ACTIVE" ? "default" : "secondary"}
                >
                  {client.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleViewClient(client)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleEditClient(client)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Client</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{client.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteClient(client)}
                          disabled={isDeleting}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}        </TableBody>
      </Table>      <AddClientModal 
        open={showEditModal}
        onOpenChange={setShowEditModal}
        onClientAdded={handleClientUpdated}
        editClient={editClient ? {
          id: editClient.id,
          name: editClient.name,
          gstin: editClient.gstin || '',
          address: editClient.address || '',
          country: editClient.country || '',
          state: editClient.state || '',
          city: editClient.city || '',
          pincode: editClient.pincode || '',
          contactPerson: editClient.contactPerson,
          email: editClient.email,          phone: editClient.phone || '',
          website: editClient.website || '',
          status: editClient.status,
          notes: editClient.notes || '',} : undefined}
        isEditing={true}
      />

      <ClientDetailsModal 
        open={showViewModal}
        onOpenChange={setShowViewModal}
        client={viewClient}
      />
    </div>
  );
}