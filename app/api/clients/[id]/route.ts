import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withRole, AuthenticatedRequest } from '@/lib/middleware';
import { updateClientSchema, createApiResponse } from '@/lib/validations';

// PUT /api/clients/[id] - Update a client (Recruiters and Admins only)
export const PUT = withRole(['RECRUITER', 'ADMIN'], async (request: AuthenticatedRequest, context: { params: { id: string } }) => {
  try {
    const { id } = context.params;
    const body = await request.json();
    const validatedData = updateClientSchema.parse(body);

    // Check if client exists
    const existingClient = await prisma.client.findUnique({
      where: { id },
    });

    if (!existingClient) {
      return NextResponse.json(
        createApiResponse(false, null, '', 'Client not found'),
        { status: 404 }
      );
    }

    // Check for email conflict
    if (validatedData.email && validatedData.email !== existingClient.email) {
      const emailConflict = await prisma.client.findUnique({
        where: { email: validatedData.email },
      });

      if (emailConflict) {
        return NextResponse.json(
          createApiResponse(false, null, '', 'Client with this email already exists'),
          { status: 400 }
        );
      }
    }

    // Update client
    const updatedClient = await prisma.client.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(
      createApiResponse(true, updatedClient, 'Client updated successfully'),
      { status: 200 }
    );
  } catch (error) {
    console.error('Update client error:', error);
    return NextResponse.json(
      createApiResponse(false, null, '', 'Internal server error'),
      { status: 500 }
    );
  }
});

// DELETE /api/clients/[id] - Delete a client (Recruiters and Admins only)
export const DELETE = withRole(['RECRUITER', 'ADMIN'], async (request: AuthenticatedRequest, context: { params: { id: string } }) => {
  try {
    const { id } = context.params;

    // Check if client exists
    const existingClient = await prisma.client.findUnique({
      where: { id },
    });

    if (!existingClient) {
      return NextResponse.json(
        createApiResponse(false, null, '', 'Client not found'),
        { status: 404 }
      );
    }

    // Delete client
    await prisma.client.delete({
      where: { id },
    });

    return NextResponse.json(
      createApiResponse(true, null, 'Client deleted successfully'),
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete client error:', error);
    return NextResponse.json(
      createApiResponse(false, null, '', 'Internal server error'),
      { status: 500 }
    );
  }
});
