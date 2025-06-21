import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

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

interface EditCandidateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: JobSeeker | null;
  onSave?: () => void;
}

export function EditCandidateModal({ open, onOpenChange, candidate, onSave }: EditCandidateModalProps) {
  const { toast } = useToast();
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Client-side hydration check
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Form state - matching AddResumeModal exactly
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    country: "India",
    state: "",
    city: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    jobTitle: "",
    experience: "",
    expectedSalary: "",
    noticePeriod: "",
    willingToRelocate: "",
    aadhaarNumber: "",
    panNumber: "",
    uanNumber: "",
    employerName: "",
    recruiterName: "",
    recruiterEmail: "",
    recruiterContact: "",
  });

  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  // Experiences state
  const [experiences, setExperiences] = useState([
    { client: "", startMonth: "", startYear: "", endMonth: "", endYear: "", present: false }
  ]);
  // Education state
  const [education, setEducation] = useState([
    { degree: "", year: "" }
  ]);
  // Reference details state
  const [references, setReferences] = useState([
    { name: "", designation: "", email: "", phone: "" }
  ]);
  // Other documents state
  const [otherDocs, setOtherDocs] = useState([
    { type: "", name: "", file: null as File | null }
  ]);

  // File states
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [idDocFile, setIdDocFile] = useState<File | null>(null);

  // Initialize form with candidate data
  useEffect(() => {
    if (candidate && open) {
      const { email, phone } = getContactInfo(candidate);
      setFormData({
        firstName: candidate.firstName || "",
        middleName: "",
        lastName: candidate.lastName || "",
        dateOfBirth: "",
        gender: "",
        country: "India",
        state: "",
        city: "",
        email: email || "",
        phone: phone || "",
        linkedin: "",
        github: "",
        jobTitle: candidate.jobTitle || "",
        experience: candidate.experience?.toString() || "",
        expectedSalary: "",
        noticePeriod: "",
        willingToRelocate: "",
        aadhaarNumber: "",
        panNumber: "",
        uanNumber: "",
        employerName: "",
        recruiterName: "",
        recruiterEmail: "",
        recruiterContact: "",
      });
      setSkills([...candidate.skills]);
    }
  }, [candidate, open]);

  const getContactInfo = (seeker: JobSeeker) => {
    const email = seeker.email || seeker.user?.email;
    const phone = seeker.phone || seeker.user?.phone;
    return { email, phone };
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  // Experience handlers
  const addExperience = () => setExperiences([...experiences, { client: "", startMonth: "", startYear: "", endMonth: "", endYear: "", present: false }]);
  const removeExperience = (idx: number) => setExperiences(experiences.filter((_, i) => i !== idx));
  const updateExperience = (idx: number, field: string, value: any) => {
    setExperiences(experiences.map((exp, i) => i === idx ? { ...exp, [field]: value } : exp));
  };

  // Education handlers
  const addEducation = () => setEducation([...education, { degree: "", year: "" }]);
  const removeEducation = (idx: number) => setEducation(education.filter((_, i) => i !== idx));
  const updateEducation = (idx: number, field: string, value: any) => {
    setEducation(education.map((edu, i) => i === idx ? { ...edu, [field]: value } : edu));
  };

  // Reference handlers
  const addReference = () => setReferences([...references, { name: "", designation: "", email: "", phone: "" }]);
  const removeReference = (idx: number) => setReferences(references.filter((_, i) => i !== idx));
  const updateReference = (idx: number, field: string, value: any) => {
    setReferences(references.map((ref, i) => i === idx ? { ...ref, [field]: value } : ref));
  };

  // Other document handlers
  const addOtherDoc = () => setOtherDocs([...otherDocs, { type: "", name: "", file: null }]);
  const removeOtherDoc = (idx: number) => setOtherDocs(otherDocs.filter((_, i) => i !== idx));
  const updateOtherDoc = (idx: number, field: string, value: any) => {
    setOtherDocs(otherDocs.map((doc, i) => i === idx ? { ...doc, [field]: value } : doc));
  };

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const years = Array.from({ length: 50 }, (_, i) => `${new Date().getFullYear() - i}`);

  // Add state and city options
  const stateOptions = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Puducherry", "Jammu and Kashmir", "Ladakh"
  ];
  const cityOptions = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow"
  ];

  const handleSubmit = async () => {
    if (!candidate) return;
    
    if (!formData.firstName || !formData.lastName || skills.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and add at least one skill.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (!token) {
        throw new Error('Authentication required');
      }

      // Prepare the update data - matching the structure from AddResumeModal
      const updateData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        jobTitle: formData.jobTitle.trim(),
        skills: skills,
        availability: "IMMEDIATE", // This should come from formData if available
        experience: formData.experience ? parseInt(formData.experience) : 0,
        // Add other fields as needed
      };

      const response = await fetch(`/api/candidates/${candidate.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update candidate');
      }

      toast({
        title: "Success",
        description: "Candidate updated successfully",
      });

      onSave?.();
      onOpenChange(false);
      
    } catch (error) {
      console.error('Error updating candidate:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update candidate",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isClient || !candidate) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Resume</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Documents - moved to top */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Documents</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="resume">Resume</Label>
                <Input 
                  id="resume" 
                  type="file" 
                  accept=".pdf,.doc,.docx" 
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="idDoc">ID Document</Label>
                <Input 
                  id="idDoc" 
                  type="file" 
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setIdDocFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Personal Information</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name<span className="text-red-500">*</span></Label>
                <Input 
                  id="firstName" 
                  required 
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="middleName">Middle Name</Label>
                <Input 
                  id="middleName" 
                  value={formData.middleName}
                  onChange={(e) => handleInputChange('middleName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name<span className="text-red-500">*</span></Label>
                <Input 
                  id="lastName" 
                  required 
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                />
              </div>
              <div className="space-y-2 col-span-1">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input 
                  id="dob" 
                  type="date" 
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                />
              </div>
              <div className="space-y-2 col-span-1">
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="India">India</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {stateOptions.map((state) => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input 
                  id="city" 
                  placeholder="Enter city" 
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email<span className="text-red-500">*</span></Label>
                <Input 
                  id="email" 
                  type="email" 
                  required 
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Contact Number<span className="text-red-500">*</span></Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  required 
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input 
                  id="linkedin" 
                  placeholder="LinkedIn profile URL" 
                  value={formData.linkedin}
                  onChange={(e) => handleInputChange('linkedin', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github">GitHub</Label>
                <Input 
                  id="github" 
                  placeholder="GitHub profile URL" 
                  value={formData.github}
                  onChange={(e) => handleInputChange('github', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Professional Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title<span className="text-red-500">*</span></Label>
                <Input 
                  id="jobTitle" 
                  required 
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Experience (Years)</Label>
                <Input 
                  id="experience" 
                  type="number" 
                  min="0" 
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expectedSalary">Expected Salary</Label>
                <Input 
                  id="expectedSalary" 
                  placeholder="Expected salary" 
                  value={formData.expectedSalary}
                  onChange={(e) => handleInputChange('expectedSalary', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="noticePeriod">Notice Period</Label>
                <Input 
                  id="noticePeriod" 
                  placeholder="Notice period" 
                  value={formData.noticePeriod}
                  onChange={(e) => handleInputChange('noticePeriod', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="willingToRelocate">Willing to Relocate</Label>
                <Select value={formData.willingToRelocate} onValueChange={(value) => handleInputChange('willingToRelocate', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Skills<span className="text-red-500">*</span></h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <Button type="button" onClick={addSkill}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeSkill(skill)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Experience Details */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Experience Details</h3>
              <Button type="button" variant="outline" size="sm" onClick={addExperience}>
                <Plus className="h-4 w-4 mr-2" />
                Add Experience
              </Button>
            </div>
            {experiences.map((exp, idx) => (
              <div key={idx} className="border p-4 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium">Experience {idx + 1}</h4>
                  {experiences.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeExperience(idx)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Client/Company</Label>
                    <Input 
                      value={exp.client}
                      onChange={(e) => updateExperience(idx, 'client', e.target.value)}
                      placeholder="Client/Company name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Select value={exp.startMonth} onValueChange={(value) => updateExperience(idx, 'startMonth', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((month) => (
                            <SelectItem key={month} value={month}>{month}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={exp.startYear} onValueChange={(value) => updateExperience(idx, 'startYear', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year} value={year}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Select 
                        value={exp.endMonth} 
                        onValueChange={(value) => updateExperience(idx, 'endMonth', value)}
                        disabled={exp.present}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((month) => (
                            <SelectItem key={month} value={month}>{month}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select 
                        value={exp.endYear} 
                        onValueChange={(value) => updateExperience(idx, 'endYear', value)}
                        disabled={exp.present}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year} value={year}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`present-${idx}`}
                        checked={exp.present}
                        onChange={(e) => updateExperience(idx, 'present', e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor={`present-${idx}`}>Currently working here</Label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Education Details */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Education Details</h3>
              <Button type="button" variant="outline" size="sm" onClick={addEducation}>
                <Plus className="h-4 w-4 mr-2" />
                Add Education
              </Button>
            </div>
            {education.map((edu, idx) => (
              <div key={idx} className="border p-4 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium">Education {idx + 1}</h4>
                  {education.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeEducation(idx)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Degree/Qualification</Label>
                    <Input 
                      value={edu.degree}
                      onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                      placeholder="Degree/Qualification"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Year of Completion</Label>
                    <Select value={edu.year} onValueChange={(value) => updateEducation(idx, 'year', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Government ID Numbers */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Government ID Numbers</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="aadhaar">Aadhaar Number</Label>
                <Input 
                  id="aadhaar" 
                  value={formData.aadhaarNumber}
                  onChange={(e) => handleInputChange('aadhaarNumber', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pan">PAN Number</Label>
                <Input 
                  id="pan" 
                  value={formData.panNumber}
                  onChange={(e) => handleInputChange('panNumber', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="uan">UAN Number</Label>
                <Input 
                  id="uan" 
                  value={formData.uanNumber}
                  onChange={(e) => handleInputChange('uanNumber', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Reference Details */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Reference Details</h3>
              <Button type="button" variant="outline" size="sm" onClick={addReference}>
                <Plus className="h-4 w-4 mr-2" />
                Add Reference
              </Button>
            </div>
            {references.map((ref, idx) => (
              <div key={idx} className="border p-4 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium">Reference {idx + 1}</h4>
                  {references.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeReference(idx)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input 
                      value={ref.name}
                      onChange={(e) => updateReference(idx, 'name', e.target.value)}
                      placeholder="Reference name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Designation</Label>
                    <Input 
                      value={ref.designation}
                      onChange={(e) => updateReference(idx, 'designation', e.target.value)}
                      placeholder="Designation"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input 
                      type="email"
                      value={ref.email}
                      onChange={(e) => updateReference(idx, 'email', e.target.value)}
                      placeholder="Email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input 
                      value={ref.phone}
                      onChange={(e) => updateReference(idx, 'phone', e.target.value)}
                      placeholder="Phone number"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Other Documents */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Other Documents</h3>
              <Button type="button" variant="outline" size="sm" onClick={addOtherDoc}>
                <Plus className="h-4 w-4 mr-2" />
                Add Document
              </Button>
            </div>
            {otherDocs.map((doc, idx) => (
              <div key={idx} className="border p-4 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium">Document {idx + 1}</h4>
                  {otherDocs.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeOtherDoc(idx)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Document Type</Label>
                    <Input 
                      value={doc.type}
                      onChange={(e) => updateOtherDoc(idx, 'type', e.target.value)}
                      placeholder="Document type"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Document Name</Label>
                    <Input 
                      value={doc.name}
                      onChange={(e) => updateOtherDoc(idx, 'name', e.target.value)}
                      placeholder="Document name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Upload File</Label>
                    <Input 
                      type="file"
                      onChange={(e) => updateOtherDoc(idx, 'file', e.target.files?.[0] || null)}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recruiter Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Recruiter Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employerName">Employer Name</Label>
                <Input 
                  id="employerName" 
                  value={formData.employerName}
                  onChange={(e) => handleInputChange('employerName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recruiterName">Recruiter Name</Label>
                <Input 
                  id="recruiterName" 
                  value={formData.recruiterName}
                  onChange={(e) => handleInputChange('recruiterName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recruiterEmail">Recruiter Email</Label>
                <Input 
                  id="recruiterEmail" 
                  type="email" 
                  value={formData.recruiterEmail}
                  onChange={(e) => handleInputChange('recruiterEmail', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recruiterContact">Recruiter Contact</Label>
                <Input 
                  id="recruiterContact" 
                  value={formData.recruiterContact}
                  onChange={(e) => handleInputChange('recruiterContact', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Resume"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
