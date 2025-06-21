import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { Calendar } from "@/components/ui/calendar";
import { Mail, Phone, MessageSquare, Eye, Pencil, Calendar as CalendarIcon, Trash2, CheckSquare, Square } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { format, addDays } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { CandidateDetailsModal } from "./CandidateDetailsModal";
import { EditCandidateModal } from "./EditCandidateModal";

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

interface JobSeekersTableProps {
  refresh?: number;
  searchParams?: {
    name?: string;
    jobTitle?: string;
    skills?: string;
    location?: string;
  };
}

export function JobSeekersTable({ refresh, searchParams }: JobSeekersTableProps) {
  const { toast } = useToast();  const { token, user } = useAuth();
  const [jobSeekers, setJobSeekers] = useState<JobSeeker[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  // Modal states
  const [viewCandidate, setViewCandidate] = useState<JobSeeker | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editCandidate, setEditCandidate] = useState<JobSeeker | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [shareType, setShareType] = useState<string[]>([]);
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(addDays(new Date(), 7));
  const [maxVisit, setMaxVisit] = useState("7");
  const [expiryPopoverOpen, setExpiryPopoverOpen] = useState(false);
  const [shareTypeOpen, setShareTypeOpen] = useState(false);
  const [pipelineOpen, setPipelineOpen] = useState(false);
  const [jobSearch, setJobSearch] = useState("");
  const [jobCategory, setJobCategory] = useState("all");
  const [jobStatus, setJobStatus] = useState("all");
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  // Fetch job seekers data
  useEffect(() => {
    setIsClient(true);
  }, []);
  useEffect(() => {
    if (isClient) {
      fetchJobSeekers();
    }
  }, [refresh, isClient, token, searchParams]);  const fetchJobSeekers = async () => {
    try {
      setLoading(true);
      
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please login to view job seekers.",
          variant: "destructive"
        });
        setJobSeekers([]);
        return;
      }

      // Build query string from search parameters
      const queryParams = new URLSearchParams();
      if (searchParams?.name) queryParams.append('query', searchParams.name);
      if (searchParams?.jobTitle) queryParams.append('jobTitle', searchParams.jobTitle);
      if (searchParams?.skills) queryParams.append('skills', searchParams.skills);
      if (searchParams?.location) queryParams.append('location', searchParams.location);

      const queryString = queryParams.toString();
      const url = queryString ? `/api/candidates?${queryString}` : '/api/candidates';

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`Failed to fetch job seekers: ${response.status} ${errorText}`);
      }
      const result = await response.json();
      if (result.success) {
        setJobSeekers(result.data || []);
      } else {
        throw new Error(result.error || 'Failed to fetch job seekers');
      }
    } catch (error) {
      console.error('Error fetching job seekers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch job seekers. Please try again.",
        variant: "destructive"
      });
      setJobSeekers([]);
    } finally {
      setLoading(false);
    }
  };

  const getDisplayName = (seeker: JobSeeker) => {
    if (seeker.firstName || seeker.lastName) {
      return `${seeker.firstName || ''} ${seeker.lastName || ''}`.trim();
    }
    return seeker.user?.email || 'Unknown';
  };
  const getContactInfo = (seeker: JobSeeker) => {
    const email = seeker.email || seeker.user?.email;
    const phone = seeker.phone || seeker.user?.phone;
    return { email, phone };
  };

  // Action handlers
  const handleViewCandidate = (candidate: JobSeeker) => {
    setViewCandidate(candidate);
    setShowViewModal(true);
  };

  const handleEditCandidate = (candidate: JobSeeker) => {
    setEditCandidate(candidate);
    setShowEditModal(true);
  };
  const handleDeleteCandidate = async (candidateId: string) => {
    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/candidates/${candidateId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete candidate');
      }

      toast({
        title: "Success",
        description: "Candidate deleted successfully",
      });

      // Refresh the list
      fetchJobSeekers();
    } catch (error) {
      console.error('Error deleting candidate:', error);
      toast({
        title: "Error",
        description: "Failed to delete candidate. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCandidateUpdated = () => {
    setShowEditModal(false);
    setEditCandidate(null);
    fetchJobSeekers();
  };

  const allSelected = selectedIds.length === jobSeekers.length && jobSeekers.length > 0;
  const anySelected = selectedIds.length > 0;
  const selectedCandidates = jobSeekers.filter(j => selectedIds.includes(j.id));

  const sampleJobs = [
    { id: 1, title: "Senior Manager", client: "MARUTI", status: "OPEN", category: "Management" },
    { id: 2, title: "Associate", client: "Aditya Birla", status: "OPEN", category: "Operations" },
    { id: 3, title: "Lead Engineer", client: "Tata Motors", status: "OPEN", category: "Engineering" },
    { id: 4, title: "Business Analyst", client: "Infosys", status: "OPEN", category: "Analysis" },
  ];
  const filteredJobs = sampleJobs.filter(j =>
    (!jobSearch || j.title.toLowerCase().includes(jobSearch.toLowerCase())) &&
    (jobCategory === "all" || j.category === jobCategory) &&
    (jobStatus === "all" || j.status === jobStatus)
  );
  const handleSelectAll = () => {
    setSelectedIds(allSelected ? [] : jobSeekers.map(j => j.id));
  };
  const handleSelect = (id: string) => {
    setSelectedIds(ids => ids.includes(id) ? ids.filter(i => i !== id) : [...ids, id]);
  };
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
      {!isClient ? (
        <div className="flex justify-center py-8">
          <div className="text-gray-500">Loading...</div>
        </div>
      ) : (
        <>
          {anySelected && (
            <div className="flex gap-2 mb-2">
              <Button size="sm" variant="outline" onClick={() => setShareOpen(true)} className="bg-orange-50 hover:bg-orange-100">Share Candidate</Button>
              <Button size="sm" variant="outline" className="bg-orange-50 hover:bg-orange-100">Send Job Invitation</Button>
              <Button size="sm" variant="outline" onClick={() => setPipelineOpen(true)} className="bg-orange-50 hover:bg-orange-100">Job Pipeline</Button>
            </div>
          )}
          <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8">
              <button onClick={handleSelectAll} aria-label="Select all">
                {allSelected ? <CheckSquare className="h-5 w-5 text-primary" /> : <Square className="h-5 w-5 text-gray-400" />}
              </button>
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead>Contact Info</TableHead>
            <TableHead>Skills</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>        <TableBody>          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                Loading job seekers...
              </TableCell>
            </TableRow>            ) : !token ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Please login to view job seekers.
                </TableCell>
              </TableRow>
            ) : jobSeekers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                No job seekers found. Add a resume to get started.
              </TableCell>
            </TableRow>
          ) : (
            jobSeekers.map((seeker) => {
              const displayName = getDisplayName(seeker);
              const { email, phone } = getContactInfo(seeker);
              
              return (
                <TableRow key={seeker.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(seeker.id)}
                      onChange={() => handleSelect(seeker.id)}
                      className="accent-primary h-4 w-4"
                      aria-label={`Select ${displayName}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{displayName}</div>
                  </TableCell>
                  <TableCell>{seeker.jobTitle || 'Not specified'}</TableCell>
                  <TableCell>
                    <div>{email || 'No email'}</div>
                    <div className="text-sm text-gray-500">{phone || 'No phone'}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {seeker.skills.slice(0, 2).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                      {seeker.skills.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          +{seeker.skills.length - 2} more
                        </span>
                      )}
                      {seeker.skills.length === 0 && (
                        <span className="text-sm text-gray-500">No skills listed</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{seeker.location || 'Not specified'}</TableCell>                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleViewCandidate(seeker)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleEditCandidate(seeker)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <CalendarIcon className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Candidate</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{getDisplayName(seeker)}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteCandidate(seeker.id)}
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
              );
            })
          )}
        </TableBody>
      </Table>

      {/* Share Candidate Modal */}
      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Share Candidate</DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Email<span className="text-red-500">*</span></label>
                <Input required value={shareEmail} onChange={e => setShareEmail(e.target.value)} placeholder="Enter email address" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Share type<span className="text-red-500">*</span></label>
                <div className="relative">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full flex justify-between"
                    onClick={() => setShareTypeOpen((open) => !open)}
                  >
                    <span>
                      {shareType.length === 0
                        ? "Select Sharing Option"
                        : shareType.join(", ")}
                    </span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </Button>
                  {shareTypeOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow">
                      {['resume', 'video interview', 'rating', 'ai score', 'feedback'].map(option => (
                        <label key={option} className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50">
                          <input
                            type="checkbox"
                            checked={shareType.includes(option)}
                            onChange={() => {
                              setShareType(prev =>
                                prev.includes(option)
                                  ? prev.filter(o => o !== option)
                                  : [...prev, option]
                              );
                            }}
                            className="mr-2 accent-primary"
                          />
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block mb-1 font-medium">Link Expiry Date<span className="text-red-500">*</span></label>
                <Popover open={expiryPopoverOpen} onOpenChange={setExpiryPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Input
                      readOnly
                      value={expiryDate ? format(expiryDate, 'yyyy-MM-dd') : ''}
                      onClick={() => setExpiryPopoverOpen(true)}
                      placeholder="Select date"
                      className="cursor-pointer"
                    />
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={expiryDate}
                      onSelect={date => { setExpiryDate(date); setExpiryPopoverOpen(false); }}
                      className="border rounded-md"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="block mb-1 font-medium">Max Visit<span className="text-red-500">*</span></label>
                <Input type="number" min={1} value={maxVisit} onChange={e => setMaxVisit(e.target.value)} />
              </div>
            </div>            <div>
              <div className="mb-2 font-semibold">Selected Candidates Preview:</div>
              <div className="flex flex-wrap gap-4 mb-2">
                {selectedCandidates.map(c => {
                  const { email, phone } = getContactInfo(c);
                  return (
                    <div key={c.id} className="border rounded p-2 min-w-[180px]">
                      <div className="font-bold">{getDisplayName(c)}</div>
                      <div className="text-xs text-gray-600">{email}</div>
                      <div className="text-xs text-gray-600">{phone}</div>
                      <div className="text-xs text-gray-600">{c.availability || "-"}</div>
                    </div>
                  );
                })}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                By clicking submit you will be sharing all selected Candidates with the {shareEmail || "[email]"} and share type: {shareType.length > 0 ? shareType.join(", ") : "[type]"}.
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <Button type="submit">Submit</Button>
              <Button type="button" variant="outline" onClick={() => setShareOpen(false)}>Cancel</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Job Pipeline Modal */}
      <Dialog open={pipelineOpen} onOpenChange={setPipelineOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Job Pipeline</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            {/* Search section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Search job title"
                value={jobSearch}
                onChange={e => setJobSearch(e.target.value)}
              />
              <Select value={jobCategory} onValueChange={setJobCategory}>
                <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Management">Management</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Analysis">Analysis</SelectItem>
                </SelectContent>
              </Select>
              <Select value={jobStatus} onValueChange={setJobStatus}>
                <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="OPEN">OPEN</SelectItem>
                  <SelectItem value="CLOSED">CLOSED</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Job listings table */}
            <div className="overflow-x-auto border rounded">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead></TableHead>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobs.map(job => (
                    <TableRow key={job.id}>
                      <TableCell>
                        <input
                          type="radio"
                          name="selectedJob"
                          checked={selectedJobId === job.id}
                          onChange={() => setSelectedJobId(job.id)}
                          className="accent-primary"
                        />
                      </TableCell>
                      <TableCell>{job.title}</TableCell>
                      <TableCell>{job.client}</TableCell>
                      <TableCell>{job.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {/* Selected candidate preview */}
            <div>              <div className="mb-2 font-semibold">Selected Candidates:</div>
              <div className="flex flex-wrap gap-4 mb-2">
                {selectedCandidates.map(c => {
                  const { email, phone } = getContactInfo(c);
                  return (
                    <div key={c.id} className="border rounded p-2 min-w-[180px]">
                      <div className="font-bold">{getDisplayName(c)}</div>
                      <div className="text-xs text-gray-600">{email}</div>
                      <div className="text-xs text-gray-600">{phone}</div>
                      <div className="text-xs text-gray-600">{c.availability || "-"}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            {selectedJobId && (
              <div className="text-sm text-gray-600 italic">
                By clicking submit, you will add the above selected candidates to the job pipeline.
              </div>
            )}
            <div className="flex gap-2 justify-end mt-4">
              <Button type="submit">Submit</Button>
              <Button type="button" variant="outline" onClick={() => setPipelineOpen(false)}>Cancel</Button>
            </div>
          </div>        </DialogContent>
      </Dialog>

      {/* View Candidate Modal */}
      <CandidateDetailsModal
        open={showViewModal}
        onOpenChange={setShowViewModal}
        candidate={viewCandidate}
      />

      {/* Edit Candidate Modal */}
      <EditCandidateModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        candidate={editCandidate}
        onSave={handleCandidateUpdated}
      />
        </>
      )}
    </div>
  );
}