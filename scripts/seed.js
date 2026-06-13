const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clear existing data
  await prisma.bid.deleteMany({})
  await prisma.lotImage.deleteMany({})
  await prisma.lot.deleteMany({})
  await prisma.auction.deleteMany({})
  await prisma.user.deleteMany({})

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123456', 10)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@mcmaster-paul-auctions.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      status: 'ACTIVE',
      country: 'Canada',
    },
  })

  // Create auctioneer user
  const auctioneerPassword = await bcrypt.hash('auctioneer123456', 10)
  const auctioneer = await prisma.user.create({
    data: {
      email: 'auctioneer@example.com',
      password: auctioneerPassword,
      name: 'John Auctioneer',
      role: 'AUCTIONEER',
      status: 'ACTIVE',
      country: 'Canada',
    },
  })

  // Create sample bidders
  const bidderPassword = await bcrypt.hash('bidder123456', 10)
  const bidder1 = await prisma.user.create({
    data: {
      email: 'bidder1@example.com',
      password: bidderPassword,
      name: 'Jane Bidder',
      role: 'BIDDER',
      status: 'ACTIVE',
      country: 'Canada',
      city: 'Toronto',
      province: 'ON',
    },
  })

  const bidder2 = await prisma.user.create({
    data: {
      email: 'bidder2@example.com',
      password: bidderPassword,
      name: 'Mike Collector',
      role: 'BIDDER',
      status: 'ACTIVE',
      country: 'Canada',
      city: 'Vancouver',
      province: 'BC',
    },
  })

  // Create auctions
  const now = new Date()
  const auction1 = await prisma.auction.create({
    data: {
      title: 'Farm Equipment Sale',
      slug: 'farm-equipment-sale',
      description: 'Liquidation auction of quality farm equipment and machinery. All items sold as-is.',
      terms: 'All sales final. 10% buyer\'s premium. 20% deposit due at sale time.',
      location: 'Brandon, Manitoba',
      auctioneerId: auctioneer.id,
      status: 'ACTIVE',
      featured: true,
      startDate: new Date(now.getTime() - 86400000),
      endDate: new Date(now.getTime() + 259200000),
      previewStartDate: new Date(now.getTime() - 604800000),
      previewEndDate: new Date(now.getTime() - 86400000),
      pickupStartDate: new Date(now.getTime() + 604800000),
      pickupEndDate: new Date(now.getTime() + 1209600000),
    },
  })

  const auction2 = await prisma.auction.create({
    data: {
      title: 'Estate Antiques & Collectibles',
      slug: 'estate-antiques-collectibles',
      description: 'Fine antiques and collectibles from a private estate collection.',
      location: 'Calgary, Alberta',
      auctioneerId: auctioneer.id,
      status: 'UPCOMING',
      featured: true,
      startDate: new Date(now.getTime() + 604800000),
      endDate: new Date(now.getTime() + 864000000),
    },
  })

  // Create lots for auction 1
  const lot1 = await prisma.lot.create({
    data: {
      auctionId: auction1.id,
      lotNumber: 1,
      slug: '125-john-deere-tractor',
      title: 'John Deere 4440 Tractor',
      description: 'Well-maintained John Deere 4440 tractor with approximately 3,200 hours. Recent paint and new tires. Runs excellent.',
      condition: 'Good',
      category: 'AUTOMOTIVE',
      featured: true,
      startingBid: 8000,
      currentBid: 12500,
      reservePrice: 10000,
      reserveMet: true,
      bidCount: 23,
    },
  })

  const lot2 = await prisma.lot.create({
    data: {
      auctionId: auction1.id,
      lotNumber: 2,
      slug: '126-farm-tools',
      title: 'Collection of Farm Tools',
      description: 'Large collection of quality farm tools including plows, harrows, and implements.',
      condition: 'Fair',
      category: 'TOOLS',
      featured: false,
      startingBid: 500,
      currentBid: 850,
      bidCount: 5,
    },
  })

  const lot3 = await prisma.lot.create({
    data: {
      auctionId: auction1.id,
      lotNumber: 3,
      slug: '127-industrial-equipment',
      title: 'Industrial Generator',
      description: 'Large industrial generator, 75 kW, recently serviced.',
      condition: 'Excellent',
      category: 'INDUSTRIAL_EQUIPMENT',
      featured: true,
      startingBid: 3000,
      currentBid: 4200,
      bidCount: 12,
    },
  })

  // Create lots for auction 2
  const lot4 = await prisma.lot.create({
    data: {
      auctionId: auction2.id,
      lotNumber: 1,
      slug: '201-victorian-chair',
      title: 'Victorian Oak Dining Chair Set',
      description: 'Set of 6 Victorian oak dining chairs with original upholstery. Circa 1920s.',
      condition: 'Excellent',
      category: 'FURNITURE',
      featured: true,
      startingBid: 200,
      currentBid: 0,
      bidCount: 0,
    },
  })

  const lot5 = await prisma.lot.create({
    data: {
      auctionId: auction2.id,
      lotNumber: 2,
      slug: '202-antique-watch',
      title: 'Antique Pocket Watch - Swiss',
      description: 'Beautiful Swiss-made pocket watch with gold case. Working condition.',
      condition: 'Good',
      category: 'JEWELRY',
      featured: false,
      startingBid: 150,
      currentBid: 0,
      bidCount: 0,
    },
  })

  // Add sample images to lots
  await prisma.lotImage.create({
    data: {
      lotId: lot1.id,
      url: 'https://via.placeholder.com/500x500?text=John+Deere+Tractor',
      altText: 'John Deere 4440 Tractor',
      order: 0,
    },
  })

  await prisma.lotImage.create({
    data: {
      lotId: lot2.id,
      url: 'https://via.placeholder.com/500x500?text=Farm+Tools',
      altText: 'Farm Tools Collection',
      order: 0,
    },
  })

  // Add sample bids
  await prisma.bid.create({
    data: {
      lotId: lot1.id,
      userId: bidder1.id,
      amount: 12500,
      isAutomatic: false,
    },
  })

  await prisma.bid.create({
    data: {
      lotId: lot1.id,
      userId: bidder2.id,
      amount: 12000,
      isAutomatic: false,
    },
  })

  console.log('✓ Database seeded successfully!')
  console.log('\nTest Accounts:')
  console.log('Admin: admin@mcmaster-paul-auctions.com / admin123456')
  console.log('Auctioneer: auctioneer@example.com / auctioneer123456')
  console.log('Bidder 1: bidder1@example.com / bidder123456')
  console.log('Bidder 2: bidder2@example.com / bidder123456')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
