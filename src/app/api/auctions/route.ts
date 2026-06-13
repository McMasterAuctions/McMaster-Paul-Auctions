import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateSlug } from '@/lib/utils'

const ITEMS_PER_PAGE = 12

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || String(ITEMS_PER_PAGE))
    const status = searchParams.get('status')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    const where: any = {}

    if (status) {
      where.status = status
    }

    if (featured === 'true') {
      where.featured = true
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [auctions, total] = await Promise.all([
      prisma.auction.findMany({
        where,
        orderBy: { startDate: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          slug: true,
          title: true,
          description: true,
          location: true,
          image: true,
          featured: true,
          status: true,
          startDate: true,
          endDate: true,
          _count: {
            select: { lots: true },
          },
        },
      }),
      prisma.auction.count({ where }),
    ])

    return NextResponse.json({
      data: auctions,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Auctions list error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== 'AUCTIONEER') {
      return NextResponse.json(
        { error: 'Only auctioneers can create auctions' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const slug = generateSlug(body.title)

    const auction = await prisma.auction.create({
      data: {
        ...body,
        slug,
        auctioneerId: session.user.id,
      },
    })

    return NextResponse.json(auction, { status: 201 })
  } catch (error) {
    console.error('Create auction error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
