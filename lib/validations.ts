import { z } from 'zod'

// User validation schemas
export const loginSchema = z.object({
  contact: z.string().min(1, 'Contact is required'),
  method: z.enum(['email', 'mobile']),
  otp: z.string().optional(),
})

export const verifyOTPSchema = z.object({
  contact: z.string().min(1, 'Contact is required'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  method: z.enum(['email', 'mobile']),
})

export const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  role: z.enum(['ADMIN', 'RECRUITER', 'CANDIDATE']),
})

// Candidate validation schemas
export const createCandidateSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().optional().transform(val => val ? new Date(val) : undefined),
  gender: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  jobTitle: z.string().optional(),
  experience: z.number().min(0).optional(),
  expectedSalary: z.number().min(0).optional(),
  currentSalary: z.number().min(0).optional(),
  noticePeriod: z.string().optional(),
  location: z.string().optional(),
  willingToRelocate: z.boolean().optional(),
  skills: z.array(z.string()).default([]),
  availability: z.enum(['AVAILABLE', 'NOTICE_PERIOD', 'NOT_AVAILABLE']).default('AVAILABLE'),
  profileSummary: z.string().optional(),
  education: z.any().optional(),
  workExperience: z.any().optional(),
  // ID Information
  aadhaarNumber: z.string().optional(),
  panNumber: z.string().optional(),
  uanNumber: z.string().optional(),
  // Employer Info
  employerName: z.string().optional(),
  recruiterName: z.string().optional(),
  recruiterEmail: z.string().optional(),
  recruiterContact: z.string().optional(),
  // File URLs (will be handled separately)
  resumeUrl: z.string().optional(),
  idDocumentUrl: z.string().optional(),
})

export const updateCandidateSchema = createCandidateSchema.partial()

// Client validation schemas
export const createClientSchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  gstin: z.string().optional(),
  address: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  pincode: z.string().optional(),
  contactPerson: z.string().min(1, 'Contact person is required'),
  email: z.string().email('Invalid email format'),  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
  notes: z.string().optional(),
})

export const updateClientSchema = createClientSchema.partial()

// Vendor validation schemas
export const createVendorSchema = z.object({
  name: z.string().min(1, 'Vendor name is required'),
  contactPerson: z.string().min(1, 'Contact person is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
  address: z.string().optional(),
  specialization: z.array(z.string()).default([]),
  rating: z.number().min(0).max(5).optional(),
  notes: z.string().optional(),
})

export const updateVendorSchema = createVendorSchema.partial()

// Job validation schemas
export const createJobSchema = z.object({
  title: z.string().min(1, 'Job title is required'),
  description: z.string().optional(),
  requirements: z.array(z.string()).default([]),
  location: z.string().optional(),
  jobType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE', 'INTERNSHIP']).default('FULL_TIME'),
  experienceLevel: z.enum(['ENTRY_LEVEL', 'MID_LEVEL', 'SENIOR_LEVEL', 'EXECUTIVE']).default('MID_LEVEL'),
  minSalary: z.number().min(0).optional(),
  maxSalary: z.number().min(0).optional(),
  currency: z.string().default('USD'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  openings: z.number().min(1).default(1),
  clientId: z.string().min(1, 'Client is required'),
  vendorId: z.string().optional(),
  clientJobId: z.string().optional(),
})

export const updateJobSchema = createJobSchema.partial()

// Job Application validation schemas
export const createJobApplicationSchema = z.object({
  jobId: z.string().min(1, 'Job ID is required'),
  notes: z.string().optional(),
  coverLetter: z.string().optional(),
})

export const updateJobApplicationSchema = z.object({
  status: z.enum(['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEWED', 'SELECTED', 'REJECTED', 'WITHDRAWN']).optional(),
  currentStage: z.enum(['APPLIED', 'SCREENING', 'PHONE_INTERVIEW', 'TECHNICAL_INTERVIEW', 'FINAL_INTERVIEW', 'OFFER_EXTENDED', 'OFFER_ACCEPTED', 'REJECTED', 'WITHDRAWN']).optional(),
  notes: z.string().optional(),
})

// Interview validation schemas
export const createInterviewSchema = z.object({
  jobId: z.string().min(1, 'Job ID is required'),
  candidateId: z.string().min(1, 'Candidate ID is required'),
  applicationId: z.string().optional(),
  title: z.string().min(1, 'Interview title is required'),
  description: z.string().optional(),
  type: z.enum(['PHONE', 'VIDEO', 'IN_PERSON', 'TECHNICAL', 'HR_ROUND', 'FINAL_ROUND']).default('PHONE'),
  scheduledAt: z.string().datetime(),
  duration: z.number().min(15).default(60),
  location: z.string().optional(),
  meetingLink: z.string().url().optional().or(z.literal('')),
})

export const updateInterviewSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(['PHONE', 'VIDEO', 'IN_PERSON', 'TECHNICAL', 'HR_ROUND', 'FINAL_ROUND']).optional(),
  status: z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'RESCHEDULED']).optional(),
  scheduledAt: z.string().datetime().optional(),
  duration: z.number().min(15).optional(),
  location: z.string().optional(),
  meetingLink: z.string().url().optional().or(z.literal('')),
  feedback: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  outcome: z.enum(['SELECTED', 'REJECTED', 'ON_HOLD', 'PROCEED_TO_NEXT_ROUND']).optional(),
})

// File upload validation
export const fileUploadSchema = z.object({
  file: z.any(),
  uploadType: z.enum(['RESUME', 'DOCUMENT']).default('RESUME'),
})

// Pagination and filtering
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export const searchSchema = z.object({
  query: z.string().optional(),
  filters: z.record(z.any()).optional(),
  jobTitle: z.string().optional(),
  skills: z.string().optional(),
  location: z.string().optional(),
})

// Combine pagination with search
export const listQuerySchema = paginationSchema.merge(searchSchema)

// Response helpers
export type ApiResponse<T = any> = {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export const createApiResponse = <T = any>(
  success: boolean,
  data?: T,
  message?: string,
  error?: string,
  pagination?: ApiResponse<T>['pagination']
): ApiResponse<T> => ({
  success,
  data,
  message,
  error,
  pagination,
})
