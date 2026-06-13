import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string; lotSlug: string } }
) {
  try {
    const lot = await prisma.lot.findFirst({
      where: {
        slug: params.lotSlug,
        auction: {
          slug: params.slug,
        },
      },
      include: {
        auction: true,
        images: {
          orderBy: { order: 'asc' },
        },
        bids: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    })

    if (!lot) {
      return NextResponse.json(
        { error: 'Lot not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(lot)
  } catch (error) {
    console.error('Get lot error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string; lotSlug: string } }
) {
  try {
    const { getServerSession } = await import('next-auth')
    const { authOptions } = await import('@/lib/auth')
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const lot = await prisma.lot.findFirst({
      where: {
        slug: params.lotSlug,
        auction: {
          slug: params.slug,
        },
      },
      include: {
        auction: true,
      },
    })

    if (!lot) {
      return NextResponse.json(
        { error: 'Lot not found' },
        { status: 404 }
      )
    }

    if (
      lot.auction.auctioneerId !== session.user.id &&
      session.user.role !== 'ADMIN'
    ) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const updated = await prisma.lot.update({
      where: { id: lot.id },
      data: body,
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Update lot error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string; lotSlug: string } }
) {
  try {
    const { getServerSession } = await import('next-auth')
    const { authOptions } = await import('@/lib/auth')
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const lot = await prisma.lot.findFirst({
      where: {
        slug: params.lotSlug,
        auction: {
          slug: params.slug,
        },
      },
      include: {
        auction: true,
      },
    })

    if (!lot) {
      return NextResponse.json(
        { error: 'Lot not found' },
        { status: 404 }
      )
    }

    if (
      lot.auction.auctioneerId !== session.user.id &&
      session.user.role !== 'ADMIN'
    ) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    await prisma.lot.delete({
      where: { id: lot.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete lot error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
