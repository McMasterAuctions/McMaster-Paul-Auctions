import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateSlug } from '@/lib/utils'

const ITEMS_PER_PAGE = 12

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || String(ITEMS_PER_PAGE))
    const category = searchParams.get('category')
    const sortBy = searchParams.get('sortBy')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const hasBids = searchParams.get('hasBids')
    const reserveMet = searchParams.get('reserveMet')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    const where: any = {
      auction: {
        slug: params.slug,
      },
    }

    if (category) where.category = category
    if (featured === 'true') where.featured = true

    if (hasBids === 'true') where.bidCount = { gt: 0 }
    if (hasBids === 'false') where.bidCount = 0

    if (reserveMet === 'true') where.reserveMet = true
    if (reserveMet === 'false') where.reserveMet = false

    if (minPrice) where.currentBid = { gte: parseFloat(minPrice) }
    if (maxPrice) {
      where.currentBid = where.currentBid || {}
      where.currentBid.lte = parseFloat(maxPrice)
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const orderBy: any = {}
    switch (sortBy) {
      case 'LOT_NUMBER_ASC':
        orderBy.lotNumber = 'asc'
        break
      case 'LOT_NUMBER_DESC':
        orderBy.lotNumber = 'desc'
        break
      case 'PRICE_ASC':
        orderBy.currentBid = 'asc'
        break
      case 'PRICE_DESC':
        orderBy.currentBid = 'desc'
        break
      case 'NEWEST':
        orderBy.createdAt = 'desc'
        break
      case 'ENDING_SOON':
        orderBy.createdAt = 'asc'
        break
      case 'MOST_BIDS':
        orderBy.bidCount = 'desc'
        break
      case 'TITLE_ASC':
        orderBy.title = 'asc'
        break
      case 'TITLE_DESC':
        orderBy.title = 'desc'
        break
      default:
        orderBy.lotNumber = 'asc'
    }

    const [lots, total] = await Promise.all([
      prisma.lot.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          images: {
            take: 1,
            orderBy: { order: 'asc' },
          },
          bids: {
            take: 1,
            orderBy: { createdAt: 'desc' },
          },
        },
      }),
      prisma.lot.count({ where }),
    ])

    return NextResponse.json({
      data: lots,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Lots list error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
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
    const lotSlug = generateSlug(`${body.lotNumber}-${body.title}`)

    const lot = await prisma.lot.create({
      data: {
        ...body,
        slug: lotSlug,
        auctionId: auction.id,
      },
    })

    return NextResponse.json(lot, { status: 201 })
  } catch (error) {
    console.error('Create lot error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
