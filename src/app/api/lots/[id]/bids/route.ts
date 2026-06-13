import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculateBidIncrement } from '@/lib/utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const skip = (page - 1) * limit

    const [bids, total] = await Promise.all([
      prisma.bid.findMany({
        where: { lotId: params.id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.bid.count({ where: { lotId: params.id } }),
    ])

    return NextResponse.json({
      data: bids,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Get bids error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { amount, maxBid } = body

    const lot = await prisma.lot.findUnique({
      where: { id: params.id },
      include: {
        auction: true,
        bids: {
          orderBy: { amount: 'desc' },
          take: 1,
        },
      },
    })

    if (!lot) {
      return NextResponse.json({ error: 'Lot not found' }, { status: 404 })
    }

    if (lot.auction.endDate < new Date()) {
      return NextResponse.json(
        { error: 'Auction has ended' },
        { status: 400 }
      )
    }

    const minBid = lot.currentBid + calculateBidIncrement(lot.currentBid)

    if (amount < minBid) {
      return NextResponse.json(
        { error: `Bid must be at least $${minBid}` },
        { status: 400 }
      )
    }

    const bid = await prisma.bid.create({
      data: {
        lotId: params.id,
        userId: session.user.id,
        amount,
        maxBid,
        isAutomatic: !!maxBid,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    // Update lot with new bid info
    await prisma.lot.update({
      where: { id: params.id },
      data: {
        currentBid: amount,
        bidCount: { increment: 1 },
        highestBidder: session.user.id,
        reserveMet:
          lot.reservePrice !== null && amount >= lot.reservePrice
            ? true
            : lot.reserveMet,
      },
    })

    return NextResponse.json(bid, { status: 201 })
  } catch (error) {
    console.error('Place bid error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
