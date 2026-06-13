import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const watchlistItem = await prisma.watchlistItem.findUnique({
      where: {
        userId_lotId: {
          userId: session.user.id,
          lotId: params.id,
        },
      },
    })

    return NextResponse.json({
      isWatched: !!watchlistItem,
    })
  } catch (error) {
    console.error('Check watchlist error:', error)
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

    const lot = await prisma.lot.findUnique({
      where: { id: params.id },
    })

    if (!lot) {
      return NextResponse.json({ error: 'Lot not found' }, { status: 404 })
    }

    const existingItem = await prisma.watchlistItem.findUnique({
      where: {
        userId_lotId: {
          userId: session.user.id,
          lotId: params.id,
        },
      },
    })

    if (existingItem) {
      await prisma.watchlistItem.delete({
        where: {
          userId_lotId: {
            userId: session.user.id,
            lotId: params.id,
          },
        },
      })
      return NextResponse.json({ isWatched: false })
    }

    await prisma.watchlistItem.create({
      data: {
        userId: session.user.id,
        lotId: params.id,
      },
    })

    return NextResponse.json({ isWatched: true }, { status: 201 })
  } catch (error) {
    console.error('Toggle watchlist error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
