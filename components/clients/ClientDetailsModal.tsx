import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Calendar, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Building, 
  Users, 
  FileText, 
  Briefcase,
  CheckCircle,
  Clock,
  ExternalLink
} from "lucide-react";

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
  email: string;
  phone?: string;
  website?: string;
  status: string;
  notes?: string;
  createdAt: string;
  _count?: {
    jobs: number;
  };
}

interface ClientDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
}

export function ClientDetailsModal({ open, onOpenChange, client }: ClientDetailsModalProps) {
  if (!client) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">        <DialogHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-900 mb-1">
                  {client.name}
                </DialogTitle>
                <p className="text-sm text-gray-500">Client Details</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant={client.status === "ACTIVE" ? "default" : "secondary"}
                className={`text-sm px-3 py-1 font-medium ${
                  client.status === "ACTIVE" 
                    ? "bg-green-100 text-green-800 hover:bg-green-200" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {client.status === "ACTIVE" ? (
                  <CheckCircle className="w-3 h-3 mr-1" />
                ) : (
                  <Clock className="w-3 h-3 mr-1" />
                )}
                {client.status}
              </Badge>
              {client._count && (
                <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                  <Briefcase className="w-3 h-3 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {client._count.jobs} job{client._count.jobs !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">          {/* Company Information Card */}
          <Card className="border-l-4 border-l-gray-500 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Building className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Company Name</p>
                      <p className="text-gray-900 font-medium">{client.name}</p>
                    </div>
                  </div>

                  {client.gstin && (
                    <div className="flex items-start gap-3">
                     
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">GSTIN</p>
                        <p className="text-gray-900 font-medium font-mono">{client.gstin}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {client.website && (
                    <div className="flex items-start gap-3">
                      
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Website</p>
                        <a 
                          href={client.website.startsWith('http') ? client.website : `https://${client.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 group"
                        >
                          {client.website}
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Added On</p>
                      <p className="text-gray-900 font-medium">{formatDate(client.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information Card */}
          <Card className="border-l-4 border-l-gray-500 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Contact Person</p>
                      <p className="text-gray-900 font-medium">{client.contactPerson}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Email</p>
                      <a 
                        href={`mailto:${client.email}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {client.email}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {client.phone && (
                    <div className="flex items-start gap-3">
                      
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Phone</p>
                        <a 
                          href={`tel:${client.phone}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {client.phone}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information Card */}
          {(client.address || client.city || client.state || client.country || client.pincode) && (
            <Card className="border-l-4 border-l-gray-500 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Address Information</h3>
                </div>
                <div className="flex items-start gap-3">
                  
                  <div className="flex-1 space-y-1">
                    {client.address && (
                      <p className="text-gray-900 font-medium">{client.address}</p>
                    )}
                    <div className="flex flex-wrap gap-2 text-gray-700">
                      {client.city && <span className="bg-gray-100 px-2 py-1 rounded text-sm">{client.city}</span>}
                      {client.state && <span className="bg-gray-100 px-2 py-1 rounded text-sm">{client.state}</span>}
                      {client.pincode && <span className="bg-gray-100 px-2 py-1 rounded text-sm">{client.pincode}</span>}
                    </div>
                    {client.country && (
                      <p className="text-gray-900 font-medium mt-2">{client.country}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes Card */}
          {client.notes && (
            <Card className="border-l-4 border-l-gray-500 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{client.notes}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
