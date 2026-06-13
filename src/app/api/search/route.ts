import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const limit = 10

    if (!query || query.length < 2) {
      return NextResponse.json({
        auctions: [],
        lots: [],
      })
    }

    const [auctions, lots] = await Promise.all([
      prisma.auction.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: limit,
        select: {
          slug: true,
          title: true,
          image: true,
        },
      }),
      prisma.lot.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: limit,
        include: {
          auction: {
            select: {
              slug: true,
            },
          },
          images: {
            take: 1,
          },
        },
      }),
    ])

    return NextResponse.json({
      auctions,
      lots,
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
