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

interface AddResumeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: () => void;
}

export function AddResumeModal({ open, onOpenChange, onSave }: AddResumeModalProps) {
  const { toast } = useToast();
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Client-side hydration check
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Form state
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
    if (!formData.firstName || !formData.lastName || skills.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in required fields: First Name, Last Name, and at least one skill.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {      // Prepare the data for submission
      const candidateData = {
        ...formData,
        dateOfBirth: formData.dateOfBirth || undefined,
        experience: formData.experience ? parseInt(formData.experience) : 0,
        expectedSalary: formData.expectedSalary ? parseFloat(formData.expectedSalary) : undefined,
        willingToRelocate: formData.willingToRelocate === "yes",
        skills,
        education,
        workExperience: experiences,
        location: `${formData.city}${formData.state ? `, ${formData.state}` : ''}`      };      if (!token) {
        if (isClient) {
          toast({
            title: "Authentication Required",
            description: "Please login to add candidates.",
            variant: "destructive"
          });
        }
        return;
      }

      // Submit to API
      const response = await fetch('/api/candidates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(candidateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save candidate');
      }

      toast({
        title: "Success",
        description: "Resume has been saved successfully!",
      });

      // Reset form and close modal
      resetForm();
      onOpenChange(false);
      onSave?.();

    } catch (error) {
      console.error('Error saving candidate:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
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
    setSkills([]);
    setNewSkill("");
    setExperiences([{ client: "", startMonth: "", startYear: "", endMonth: "", endYear: "", present: false }]);
    setEducation([{ degree: "", year: "" }]);
    setReferences([{ name: "", designation: "", email: "", phone: "" }]);
    setOtherDocs([{ type: "", name: "", file: null }]);
    setResumeFile(null);
    setIdDocFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Resume</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Documents - moved to top */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Documents</h3>            <div className="grid grid-cols-2 gap-4">
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
            <h3 className="text-lg font-medium">Personal Information</h3>            <div className="grid grid-cols-3 gap-4">
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
            <h3 className="text-lg font-medium">Contact Information</h3>            <div className="grid grid-cols-2 gap-4">
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
                  value={formData.linkedin}
                  onChange={(e) => handleInputChange('linkedin', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github">GitHub</Label>
                <Input 
                  id="github" 
                  value={formData.github}
                  onChange={(e) => handleInputChange('github', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Employer Info - moved to end */}
          <div className="space-y-4 mt-8">
            <h3 className="text-lg font-medium">Job Seeker's Employer Info</h3>            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employerName">Employer Name</Label>
                <Input 
                  id="employerName" 
                  placeholder="Employer Name" 
                  value={formData.employerName}
                  onChange={(e) => handleInputChange('employerName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recruiterName">Recruiter Name</Label>
                <Input 
                  id="recruiterName" 
                  placeholder="Recruiter Name" 
                  value={formData.recruiterName}
                  onChange={(e) => handleInputChange('recruiterName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recruiterEmail">Recruiter E-mail</Label>
                <Input 
                  id="recruiterEmail" 
                  placeholder="Recruiter E-mail" 
                  value={formData.recruiterEmail}
                  onChange={(e) => handleInputChange('recruiterEmail', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recruiterContact">Recruiter Contact Number</Label>
                <Input 
                  id="recruiterContact" 
                  placeholder="Recruiter Contact Number" 
                  value={formData.recruiterContact}
                  onChange={(e) => handleInputChange('recruiterContact', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Professional Information</h3>            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="salary">Expected Salary</Label>
                <Input 
                  id="salary" 
                  type="number" 
                  value={formData.expectedSalary}
                  onChange={(e) => handleInputChange('expectedSalary', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="noticePeriod">Notice Period</Label>
                <Input 
                  id="noticePeriod" 
                  value={formData.noticePeriod}
                  onChange={(e) => handleInputChange('noticePeriod', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input 
                  id="experience" 
                  type="number" 
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="relocate">Willing to Relocate</Label>
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
            <h3 className="text-lg font-medium">Technical Skills<span className="text-red-500">*</span></h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSkill()}
                  placeholder="Add a skill"
                />
                <Button onClick={addSkill}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              {/* Validation message for required skills */}
              {skills.length === 0 && (
                <div className="text-red-500 text-xs mt-1">Please add at least one technical skill.</div>
              )}
            </div>
          </div>

          {/* ID Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">ID Information</h3>            <div className="grid grid-cols-2 gap-4">
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

          {/* Client Details/Experiences */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">Client Details / Experiences
              <Button type="button" size="icon" variant="ghost" onClick={addExperience} className="ml-2"><Plus className="h-4 w-4" /></Button>
            </h3>
            {experiences.map((exp, idx) => (
              <div key={idx} className="grid grid-cols-6 gap-4 items-end border p-3 rounded-md relative">
                <div className="col-span-2 space-y-2">
                  <Label>Client Name</Label>
                  <Input value={exp.client} onChange={e => updateExperience(idx, 'client', e.target.value)} placeholder="Client Name" />
                </div>
                <div className="space-y-2">
                  <Label>Start Month</Label>
                  <Select value={exp.startMonth} onValueChange={val => updateExperience(idx, 'startMonth', val)}>
                    <SelectTrigger><SelectValue placeholder="Month" /></SelectTrigger>
                    <SelectContent>
                      {months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Start Year</Label>
                  <Select value={exp.startYear} onValueChange={val => updateExperience(idx, 'startYear', val)}>
                    <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
                    <SelectContent>
                      {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>End Month</Label>
                  <Select value={exp.endMonth} onValueChange={val => updateExperience(idx, 'endMonth', val)} disabled={exp.present}>
                    <SelectTrigger><SelectValue placeholder="Month" /></SelectTrigger>
                    <SelectContent>
                      {months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>End Year</Label>
                  <Select value={exp.endYear} onValueChange={val => updateExperience(idx, 'endYear', val)} disabled={exp.present}>
                    <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
                    <SelectContent>
                      {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={exp.present} onChange={e => updateExperience(idx, 'present', e.target.checked)} id={`present-${idx}`} />
                  <Label htmlFor={`present-${idx}`}>Present</Label>
                </div>
                <Button type="button" size="icon" variant="ghost" className="absolute top-2 right-2" onClick={() => removeExperience(idx)}><X className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>

          {/* Education Entries */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">Education / Certificates
              <Button type="button" size="icon" variant="ghost" onClick={addEducation} className="ml-2"><Plus className="h-4 w-4" /></Button>
            </h3>
            {education.map((edu, idx) => (
              <div key={idx} className="grid grid-cols-6 gap-4 items-end border p-3 rounded-md relative">
                <div className="col-span-4 space-y-2">
                  <Label>Degree / Course</Label>
                  <Input value={edu.degree} onChange={e => updateEducation(idx, 'degree', e.target.value)} placeholder="Degree or Course" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Year</Label>
                  <Select value={edu.year} onValueChange={val => updateEducation(idx, 'year', val)}>
                    <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
                    <SelectContent>
                      {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="button" size="icon" variant="ghost" className="absolute top-2 right-2" onClick={() => removeEducation(idx)}><X className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>

          {/* Reference Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">Reference Details
              <Button type="button" size="icon" variant="ghost" onClick={addReference} className="ml-2"><Plus className="h-4 w-4" /></Button>
            </h3>
            {references.map((ref, idx) => (
              <div key={idx} className="grid grid-cols-4 gap-4 items-end border p-3 rounded-md relative">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={ref.name} onChange={e => updateReference(idx, 'name', e.target.value)} placeholder="Name" />
                </div>
                <div className="space-y-2">
                  <Label>Designation</Label>
                  <Input value={ref.designation} onChange={e => updateReference(idx, 'designation', e.target.value)} placeholder="Designation" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={ref.email} onChange={e => updateReference(idx, 'email', e.target.value)} placeholder="Email" />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input value={ref.phone} onChange={e => updateReference(idx, 'phone', e.target.value)} placeholder="Phone Number" />
                </div>
                <Button type="button" size="icon" variant="ghost" className="absolute top-2 right-2" onClick={() => removeReference(idx)}><X className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>

          {/* Other Documents */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">Other Documents
              <Button type="button" size="icon" variant="ghost" onClick={addOtherDoc} className="ml-2"><Plus className="h-4 w-4" /></Button>
            </h3>
            {otherDocs.map((doc, idx) => (
              <div key={idx} className="grid grid-cols-4 gap-4 items-end border p-3 rounded-md relative">
                <div className="space-y-2">
                  <Label>Document Type</Label>
                  <Select value={doc.type} onValueChange={val => updateOtherDoc(idx, 'type', val)}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Skill Matrix">Skill Matrix</SelectItem>
                      <SelectItem value="Others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {doc.type === 'Others' && (
                  <div className="space-y-2">
                    <Label>Document Name</Label>
                    <Input value={doc.name} onChange={e => updateOtherDoc(idx, 'name', e.target.value)} placeholder="Document Name" />
                  </div>
                )}
                <div className="space-y-2 col-span-2">
                  <Label>Upload File</Label>
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <Button type="button" variant="outline" size="sm" asChild>
                      <span>+ Select File</span>
                    </Button>
                    <input
                      type="file"
                      className="hidden"
                      onChange={e => updateOtherDoc(idx, 'file', e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                    />
                    {doc.file && <span className="text-xs text-gray-600 ml-2">{doc.file.name}</span>}
                  </label>
                </div>
                <Button type="button" size="icon" variant="ghost" className="absolute top-2 right-2" onClick={() => removeOtherDoc(idx)}><X className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
        </div>        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            className="bg-green-600 hover:bg-green-700" 
            onClick={handleSubmit} 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Resume"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}