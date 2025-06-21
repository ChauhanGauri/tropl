import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthenticatedRequest } from '@/lib/middleware'
import { createCandidateSchema, updateCandidateSchema, listQuerySchema, createApiResponse } from '@/lib/validations'

// GET /api/candidates - List all candidates
export const GET = withAuth(async (request: AuthenticatedRequest) => {  try {
    const { searchParams } = new URL(request.url)
    const queryParams = Object.fromEntries(searchParams)
    const { page, limit, sortBy, sortOrder, query, filters, jobTitle, skills, location } = listQuerySchema.parse(queryParams)

    const where: any = {}
    
    // Add search functionality
    if (query) {
      where.OR = [
        { firstName: { contains: query, mode: 'insensitive' } },
        { lastName: { contains: query, mode: 'insensitive' } },
        { jobTitle: { contains: query, mode: 'insensitive' } },
        { location: { contains: query, mode: 'insensitive' } },
        { user: { email: { contains: query, mode: 'insensitive' } } },
      ]
    }

    // Add specific field searches
    if (jobTitle) {
      where.jobTitle = { contains: jobTitle, mode: 'insensitive' }
    }    if (skills) {
      // Search if any skill contains the search term
      where.skills = { 
        hasSome: [skills]
      };
    }
    
    if (location) {
      where.location = { contains: location, mode: 'insensitive' }
    }

    // Add filters
    if (filters) {
      if (filters.availability) {
        where.availability = filters.availability
      }
      if (filters.location) {
        where.location = { contains: filters.location, mode: 'insensitive' }
      }
      if (filters.minExperience) {
        where.experience = { gte: parseInt(filters.minExperience) }
      }
      if (filters.maxExperience) {
        where.experience = { ...where.experience, lte: parseInt(filters.maxExperience) }
      }
    }

    const orderBy: any = {}
    if (sortBy) {
      orderBy[sortBy] = sortOrder
    } else {
      orderBy.createdAt = 'desc'
    }

    const skip = (page - 1) * limit

    const [candidates, total] = await Promise.all([
      prisma.candidate.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              phone: true,
              name: true,
              avatar: true,
              createdAt: true,
            },
          },
          _count: {
            select: {
              applications: true,
              interviews: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy,
      }),
      prisma.candidate.count({ where }),
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json(
      createApiResponse(
        true,
        candidates,
        'Candidates retrieved successfully',
        undefined,
        { page, limit, total, totalPages }
      )
    )
  } catch (error) {
    console.error('Get candidates error:', error)
    return NextResponse.json(
      createApiResponse(false, null, '', 'Internal server error'),
      { status: 500 }
    )
  }
})

// POST /api/candidates - Create a new candidate
export const POST = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const body = await request.json()
    const validatedData = createCandidateSchema.parse(body)

    // Check if user is a recruiter (recruiters can add candidates)
    const user = request.user!
    
    let userId = user.userId
    let candidateUserId = userId

    // If this is a recruiter adding a candidate, create a user record for the candidate
    if (user.role === 'RECRUITER' && validatedData.email && validatedData.email !== user.email) {
      // Check if a user with this email already exists
      let existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email }
      })

      if (!existingUser) {
        // Create a new user record for the candidate
        existingUser = await prisma.user.create({
          data: {
            email: validatedData.email,
            phone: validatedData.phone,
            name: `${validatedData.firstName || ''} ${validatedData.lastName || ''}`.trim() || undefined,
            role: 'CANDIDATE',
            verified: false,
          }
        })
      }

      candidateUserId = existingUser.id

      // Check if this user already has a candidate profile
      const existingCandidate = await prisma.candidate.findUnique({
        where: { userId: candidateUserId },
      })

      if (existingCandidate) {
        return NextResponse.json(
          createApiResponse(false, null, '', 'A candidate profile already exists for this email'),
          { status: 400 }
        )
      }
    } else {
      // User is creating their own candidate profile
      const existingCandidate = await prisma.candidate.findUnique({
        where: { userId },
      })

      if (existingCandidate) {
        return NextResponse.json(
          createApiResponse(false, null, '', 'Candidate profile already exists'),
          { status: 400 }
        )
      }
    }    // Create candidate profile
    const candidate = await prisma.candidate.create({
      data: {
        ...validatedData,
        userId: candidateUserId,
        skills: validatedData.skills || [],
        education: validatedData.education,
        workExperience: validatedData.workExperience,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
            name: true,
            avatar: true,
          },
        },
      },
    })

    return NextResponse.json(
      createApiResponse(true, candidate, 'Candidate profile created successfully'),
      { status: 201 }
    )
  } catch (error) {
    console.error('Create candidate error:', error)
    return NextResponse.json(
      createApiResponse(false, null, '', 'Internal server error'),
      { status: 500 }
    )
  }
})
