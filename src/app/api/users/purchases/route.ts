import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const ITEMS_PER_PAGE = 20

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || String(ITEMS_PER_PAGE))

    const skip = (page - 1) * limit

    const [purchases, total] = await Promise.all([
      prisma.purchase.findMany({
        where: { userId: session.user.id },
        include: {
          lot: {
            include: {
              auction: true,
              images: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.purchase.count({
        where: { userId: session.user.id },
      }),
    ])

    return NextResponse.json({
      data: purchases,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Purchases error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
