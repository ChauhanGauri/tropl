import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withRole, AuthenticatedRequest } from '@/lib/middleware'
import { createClientSchema, listQuerySchema, createApiResponse } from '@/lib/validations'

// GET /api/clients - List all clients
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const queryParams = Object.fromEntries(searchParams)
    const { page, limit, sortBy, sortOrder, query, filters } = listQuerySchema.parse(queryParams)

    const where: any = {}
    
    // Handle specific field searches
    const searchName = searchParams.get('searchName')
    const searchPhone = searchParams.get('searchPhone')
    const searchContactPerson = searchParams.get('searchContactPerson')
    
    if (searchName || searchPhone || searchContactPerson) {
      const searchConditions = []
      
      if (searchName) {
        searchConditions.push({ name: { contains: searchName, mode: 'insensitive' } })
      }
      
      if (searchPhone) {
        searchConditions.push({ phone: { equals: searchPhone } })
      }
      
      if (searchContactPerson) {
        searchConditions.push({ contactPerson: { contains: searchContactPerson, mode: 'insensitive' } })
      }
      
      if (searchConditions.length > 0) {
        where.AND = searchConditions
      }
    }
    
    // Add general search functionality (fallback)
    if (query && !searchName && !searchPhone && !searchContactPerson) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { contactPerson: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
      ]
    }

    // Add filters
    if (filters) {      if (filters.status) {
        where.status = filters.status
      }
    }

    const orderBy: any = {}
    if (sortBy) {
      orderBy[sortBy] = sortOrder    } else {
      orderBy.name = 'asc'
    }

    const skip = (page - 1) * limit

    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      prisma.client.count({ where }),
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json(
      createApiResponse(
        true,
        clients,
        'Clients retrieved successfully',
        undefined,
        { page, limit, total, totalPages }
      )
    )
  } catch (error) {
    console.error('Get clients error:', error)
    return NextResponse.json(
      createApiResponse(false, null, '', 'Internal server error'),
      { status: 500 }
    )
  }
}

// POST /api/clients - Create a new client (Recruiters and Admins only)
export const POST = withRole(['RECRUITER', 'ADMIN'], async (request: AuthenticatedRequest) => {
  try {
    const body = await request.json()
    const validatedData = createClientSchema.parse(body)

    // Check if client with this email already exists
    const existingClient = await prisma.client.findUnique({
      where: { email: validatedData.email },
    })

    if (existingClient) {
      return NextResponse.json(
        createApiResponse(false, null, '', 'Client with this email already exists'),
        { status: 400 }
      )
    }

    // Create client
    const client = await prisma.client.create({
      data: validatedData,
    })

    return NextResponse.json(
      createApiResponse(true, client, 'Client created successfully'),
      { status: 201 }
    )
  } catch (error) {
    console.error('Create client error:', error)
    return NextResponse.json(
      createApiResponse(false, null, '', 'Internal server error'),
      { status: 500 }
    )
  }
})
