import { useState, useEffect } from "react";
import { 
  X, 
  Building2, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  FileText, 
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Save
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/context/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface AddClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClientAdded?: () => void;
  editClient?: ClientFormData & { id: string };
  isEditing?: boolean;
}

interface ClientFormData {
  name: string;
  gstin: string;
  address: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
  contactPerson: string;
  email: string;
  phone: string;
  website: string;
  status: string;
  notes: string;
}

export function AddClientModal({ open, onOpenChange, onClientAdded, editClient, isEditing = false }: AddClientModalProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<ClientFormData>({
    name: editClient?.name || '',
    gstin: editClient?.gstin || '',
    address: editClient?.address || '',
    country: editClient?.country || 'India',
    state: editClient?.state || '',
    city: editClient?.city || '',
    pincode: editClient?.pincode || '',
    contactPerson: editClient?.contactPerson || '',
    email: editClient?.email || '',
    phone: editClient?.phone || '',
    website: editClient?.website || '',
    status: editClient?.status || 'ACTIVE',
    notes: editClient?.notes || '',
  });
  const { token } = useAuth();

  // Reset form when editClient changes
  useEffect(() => {
    if (editClient && isEditing) {
      setFormData({
        name: editClient.name || '',
        gstin: editClient.gstin || '',
        address: editClient.address || '',
        country: editClient.country || 'India',
        state: editClient.state || '',
        city: editClient.city || '',
        pincode: editClient.pincode || '',
        contactPerson: editClient.contactPerson || '',
        email: editClient.email || '',
        phone: editClient.phone || '',
        website: editClient.website || '',
        status: editClient.status || 'ACTIVE',
        notes: editClient.notes || '',
      });
    } else if (!isEditing) {
      setFormData({
        name: '',
        gstin: '',
        address: '',
        country: 'India',
        state: '',
        city: '',
        pincode: '',
        contactPerson: '',
        email: '',
        phone: '',
        website: '',
        status: 'ACTIVE',
        notes: '',
      });
    }
  }, [editClient, isEditing]);

  // Indian states for dropdown
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
    'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 
    'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 
    'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry'
  ];

  const countries = [
    'India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 
    'France', 'Singapore', 'UAE', 'Other'
  ];

  const handleInputChange = (field: keyof ClientFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Client name is required');
      return false;
    }
    if (!formData.contactPerson.trim()) {
      setError('Contact person is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const url = isEditing ? `/api/clients/${editClient?.id}` : '/api/clients';
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Reset form
        setFormData({
          name: '',
          gstin: '',
          address: '',
          country: 'India',
          state: '',
          city: '',
          pincode: '',
          contactPerson: '',
          email: '',
          phone: '',
          website: '',
          status: 'ACTIVE',
          notes: '',
        });
        setStep(1);
        onOpenChange(false);
        onClientAdded?.();
      } else {
        setError(data.error || `Failed to ${isEditing ? 'update' : 'create'} client`);
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const steps = [
    { number: 1, title: "Client Information", icon: Building2 },
    { number: 2, title: "Contact Details", icon: User },
    { number: 3, title: "Review & Save", icon: CheckCircle }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {isEditing ? 'Edit Client' : 'Add New Client'}
              </DialogTitle>
              
            </div>
            
          </div>

          {/* Enhanced Step Indicator */}
          <div className="flex justify-between mt-6">
            {steps.map((s, index) => (
              <div
                key={s.number}
                className={`flex items-center ${
                  index !== steps.length - 1 ? "flex-1" : ""
                }`}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      step >= s.number
                        ? "bg-green-600 border-green-600 text-white shadow-lg"
                        : step === s.number - 1
                        ? "bg-green-50 border-green-300 text-green-600"
                        : "bg-gray-100 border-gray-300 text-gray-400"
                    }`}
                  >
                    {step > s.number ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <s.icon className="w-6 h-6" />
                    )}
                  </div>                  <div className="mt-2 text-center">
                    <div
                      className={`text-sm font-medium ${
                        step >= s.number ? "text-green-600" : "text-gray-600"
                      }`}
                    >
                      {s.title}
                    </div>
                  </div>
                </div>
                {index !== steps.length - 1 && (
                  <div className="flex-1 mx-4 mt-6">
                    <div 
                      className={`h-0.5 rounded-full transition-all duration-300 ${
                        step > s.number ? "bg-green-600" : "bg-gray-200"
                      }`} 
                    />
                  </div>
                )}
              </div>
            ))}
          </div>        </DialogHeader>

        <div className="py-4">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === 1 && (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center mb-6">
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Company Information</h3> 
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">                    <Label htmlFor="clientName" className="text-sm font-medium text-gray-700 flex items-center">
                      <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                      Client Name<span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input 
                      id="clientName" 
                      placeholder="Enter client name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="mt-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="gstin" className="text-sm font-medium text-gray-700 flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-gray-400" />
                      GSTIN
                    </Label>
                    <Input 
                      id="gstin" 
                      placeholder="Enter GSTIN number"
                      value={formData.gstin}
                      onChange={(e) => handleInputChange('gstin', e.target.value)}
                      className="mt-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="country" className="text-sm font-medium text-gray-700 flex items-center">
                      <Globe className="w-4 h-4 mr-2 text-gray-400" />
                      Country
                    </Label>
                    <Select 
                      value={formData.country} 
                      onValueChange={(value) => handleInputChange('country', value)}
                    >
                      <SelectTrigger className="mt-2 focus:ring-2 focus:ring-green-500 focus:border-green-500">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>{country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="address" className="text-sm font-medium text-gray-700 flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      Address
                    </Label>
                    <Input 
                      id="address" 
                      placeholder="Enter company address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="mt-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="state" className="text-sm font-medium text-gray-700">State</Label>
                    <Select 
                      value={formData.state} 
                      onValueChange={(value) => handleInputChange('state', value)}
                      disabled={formData.country !== 'India'}
                    >
                      <SelectTrigger className="mt-2 focus:ring-2 focus:ring-green-500 focus:border-green-500">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {indianStates.map((state) => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="city" className="text-sm font-medium text-gray-700">City</Label>
                    <Input 
                      id="city" 
                      placeholder="Enter city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="mt-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="pincode" className="text-sm font-medium text-gray-700">Pincode</Label>
                    <Input 
                      id="pincode" 
                      placeholder="Enter pincode"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                      className="mt-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center mb-6">
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                    
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">                    <Label htmlFor="contactPerson" className="text-sm font-medium text-gray-700 flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      Contact Person<span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input 
                      id="contactPerson" 
                      placeholder="Enter contact person name"
                      value={formData.contactPerson}
                      onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                      className="mt-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                  
                  <div>                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      Email<span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input 
                      id="email" 
                      type="email"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="mt-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      Phone Number
                    </Label>
                    <Input 
                      id="phone" 
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="mt-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="website" className="text-sm font-medium text-gray-700 flex items-center">
                      <Globe className="w-4 h-4 mr-2 text-gray-400" />
                      Website
                    </Label>
                    <Input 
                      id="website" 
                      placeholder="Enter website URL"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="mt-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center mb-6">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Review & Additional Details</h3>
                    
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="status" className="text-sm font-medium text-gray-700">Status</Label>
                      <Select 
                        value={formData.status} 
                        onValueChange={(value) => handleInputChange('status', value)}
                      >
                        <SelectTrigger className="mt-2 focus:ring-2 focus:ring-green-500 focus:border-green-500">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ACTIVE">
                            <div className="flex items-center">
                              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                              Active
                            </div>
                          </SelectItem>
                          <SelectItem value="INACTIVE">
                            <div className="flex items-center">
                              <div className="w-2 h-2 rounded-full bg-gray-400 mr-2"></div>
                              Inactive
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes" className="text-sm font-medium text-gray-700 flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-gray-400" />
                      Notes
                    </Label>
                    <textarea
                      id="notes"
                      className="w-full mt-2 p-3 border border-gray-300 rounded-md resize-none h-32 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="Add any additional notes about the client..."
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                    />
                  </div>

                  {/* Enhanced Review Section */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
                    <h4 className="font-semibold mb-4 text-gray-900 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                      Review Client Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <Building2 className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Client Name</p>
                            <p className="font-medium text-gray-900">{formData.name || 'Not provided'}</p>
                          </div>
                        </div>
                        {formData.gstin && (
                          <div className="flex items-start">
                            <FileText className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide">GSTIN</p>
                              <p className="font-medium text-gray-900">{formData.gstin}</p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-start">
                          <User className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Contact Person</p>
                            <p className="font-medium text-gray-900">{formData.contactPerson || 'Not provided'}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Mail className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                            <p className="font-medium text-gray-900">{formData.email || 'Not provided'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {formData.phone && (
                          <div className="flex items-start">
                            <Phone className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                              <p className="font-medium text-gray-900">{formData.phone}</p>
                            </div>
                          </div>
                        )}
                        {formData.website && (
                          <div className="flex items-start">
                            <Globe className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Website</p>
                              <p className="font-medium text-gray-900">{formData.website}</p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-start">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Location</p>
                            <p className="font-medium text-gray-900">
                              {[formData.city, formData.state, formData.country].filter(Boolean).join(', ') || 'Not provided'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className={`w-2 h-2 mr-2 mt-0.5 rounded-full ${formData.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
                            <p className="font-medium text-gray-900">{formData.status}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Enhanced Footer */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            {step < steps.length && `${steps.length - step} step${steps.length - step !== 1 ? 's' : ''} remaining`}
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                if (step > 1) {
                  setStep(step - 1);
                } else {
                  onOpenChange(false);
                }
              }}
              disabled={isLoading}
              className="flex items-center"
            >
              {step === 1 ? (
                <X className="w-4 h-4 mr-2" />
              ) : (
                <ArrowLeft className="w-4 h-4 mr-2" />
              )}
              {step === 1 ? "Cancel" : "Previous"}
            </Button>
            <Button
              onClick={() => {
                if (step < steps.length) {
                  setStep(step + 1);
                } else {
                  handleSubmit();
                }
              }}
              disabled={isLoading}
              className="flex items-center bg-green-600 hover:bg-green-700 focus:ring-green-500"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : step === steps.length ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isEditing ? "Update Client" : "Save Client"}
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
