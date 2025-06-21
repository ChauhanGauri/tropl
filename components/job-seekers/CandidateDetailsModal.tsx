import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Calendar, 
  Mail, 
  Phone, 
  MapPin, 
  User, 
  Briefcase, 
  Clock,
  Star,
  FileText
} from "lucide-react";

interface JobSeeker {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  jobTitle?: string;
  skills: string[];
  location?: string;
  availability: string;
  experience?: number;
  user?: {
    email: string;
    phone?: string;
  };
}

interface CandidateDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: JobSeeker | null;
}

export function CandidateDetailsModal({ open, onOpenChange, candidate }: CandidateDetailsModalProps) {
  if (!candidate) return null;

  const getDisplayName = () => {
    if (candidate.firstName || candidate.lastName) {
      return `${candidate.firstName || ''} ${candidate.lastName || ''}`.trim();
    }
    return candidate.user?.email || 'Unknown';
  };

  const getContactInfo = () => {
    const email = candidate.email || candidate.user?.email;
    const phone = candidate.phone || candidate.user?.phone;
    return { email, phone };
  };

  const { email, phone } = getContactInfo();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Candidate Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{getDisplayName()}</h3>
                  <p className="text-sm text-gray-600">{candidate.jobTitle || 'Job title not specified'}</p>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{email || 'No email provided'}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{phone || 'No phone provided'}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{candidate.location || 'Location not specified'}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Available: {candidate.availability}</span>
                    </div>
                  </div>
                </div>

                {candidate.experience !== undefined && candidate.experience > 0 && (
                  <>
                    <Separator />
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        {candidate.experience} year{candidate.experience !== 1 ? 's' : ''} of experience
                      </span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-gray-500" />
                  <h4 className="font-semibold">Skills</h4>
                </div>
                
                {candidate.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No skills listed</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <h4 className="font-semibold">Additional Information</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Candidate ID:</span>
                    <p className="text-gray-600">{candidate.id}</p>
                  </div>
                  
                  <div>
                    <span className="font-medium">Availability:</span>
                    <p className="text-gray-600">{candidate.availability}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
