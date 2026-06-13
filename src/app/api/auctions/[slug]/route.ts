import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const auction = await prisma.auction.findUnique({
      where: { slug: params.slug },
      include: {
        auctioneer: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    if (!auction) {
      return NextResponse.json(
        { error: 'Auction not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(auction)
  } catch (error) {
    console.error('Get auction error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { getServerSession } = await import('next-auth')
    const { authOptions } = await import('@/lib/auth')
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const auction = await prisma.auction.findUnique({
      where: { slug: params.slug },
    })

    if (!auction) {
      return NextResponse.json(
        { error: 'Auction not found' },
        { status: 404 }
      )
    }

    if (auction.auctioneerId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const updated = await prisma.auction.update({
      where: { slug: params.slug },
      data: body,
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Update auction error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { getServerSession } = await import('next-auth')
    const { authOptions } = await import('@/lib/auth')
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only admins can delete auctions' },
        { status: 403 }
      )
    }

    const auction = await prisma.auction.findUnique({
      where: { slug: params.slug },
    })

    if (!auction) {
      return NextResponse.json(
        { error: 'Auction not found' },
        { status: 404 }
      )
    }

    await prisma.auction.delete({
      where: { slug: params.slug },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete auction error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
