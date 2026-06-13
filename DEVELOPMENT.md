# McMaster & Paul Auctions - Complete Setup Guide

## Project Overview

McMaster & Paul Auctions is a full-featured online auction platform built with Next.js, React, TypeScript, and PostgreSQL. The platform allows users to browse auctions, view lots, place bids, and manage their accounts.

## Architecture

### Frontend
- **Framework**: Next.js 14 with React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Forms**: React Hook Form + Zod validation
- **Authentication**: NextAuth.js

### Backend
- **Runtime**: Node.js
- **Server**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with JWT
- **Validation**: Zod schemas

### Infrastructure
- **Hosting**: Vercel
- **Database**: PostgreSQL (Vercel Postgres or managed)
- **Storage**: AWS S3
- **Monitoring**: Vercel Analytics

## Local Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Git
- VS Code (recommended)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/McMasterAuctions/Mcmaster-Paul-auctions.git
cd Mcmaster-Paul-auctions
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with:
```
DATABASE_URL="postgresql://user:password@localhost:5432/mcmaster_paul_auctions"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
AWS_ACCESS_KEY_ID="your-key"
AWS_SECRET_ACCESS_KEY="your-secret"
AWS_S3_BUCKET="your-bucket"
AWS_S3_REGION="us-east-1"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

4. **Create PostgreSQL database**
```bash
creatdb mcmaster_paul_auctions
```

5. **Run migrations**
```bash
npm run db:push
```

6. **Seed the database (optional)**
```bash
npm run db:seed
```

7. **Start development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── auth/                # Authentication endpoints
│   │   ├── auctions/            # Auction endpoints
│   │   ├── lots/                # Lot endpoints
│   │   ├── users/               # User endpoints
│   │   └── search/              # Search endpoint
│   ├── auctions/                # Auction pages
│   ├── admin/                   # Admin dashboard
│   ├── account/                 # Account management
│   ├── login/                   # Login page
│   ├── register/                # Registration page
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Homepage
│   └── globals.css             # Global styles
├── components/                  # React components
│   ├── auction/                # Auction components
│   ├── lot/                    # Lot components
│   ├── layout/                 # Layout components
│   ├── common/                 # Shared components
│   └── admin/                  # Admin components
├── lib/                         # Utilities & helpers
│   ├── api.ts                 # API client
│   ├── auth.ts                # Authentication config
│   ├── prisma.ts              # Prisma client
│   ├── validators.ts          # Form validators
│   ├── utils.ts               # Utility functions
│   └── constants.ts           # Constants
├── types/                       # TypeScript types
└── styles/                      # Additional styles

prisma/
└── schema.prisma              # Database schema

scripts/
└── seed.js                    # Database seeding script
```

## Database Schema

### Users
- Stores user accounts with roles (ADMIN, AUCTIONEER, BIDDER)
- Authentication with hashed passwords
- User profile information

### Auctions
- Auction listings with dates and locations
- Preview and pickup periods
- Auction status tracking
- Featured auctions support

### Lots
- Individual auction items
- Category classification
- Reserve price support
- Bid tracking

### Bids
- Bid history for each lot
- User bidding information
- Automatic bidding support
- Bid timestamps

### Supporting Tables
- LotImage: Multiple images per lot
- WatchlistItem: User watchlist tracking
- Purchase: Lot purchase records
- NextAuth tables: Session management

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### Auctions
- `GET /api/auctions` - List auctions (with pagination)
- `POST /api/auctions` - Create auction (auctioneer only)
- `GET /api/auctions/[slug]` - Get auction details
- `PUT /api/auctions/[slug]` - Update auction
- `DELETE /api/auctions/[slug]` - Delete auction (admin only)

### Lots
- `GET /api/auctions/[slug]/lots` - List lots with filtering
- `POST /api/auctions/[slug]/lots` - Create lot
- `GET /api/auctions/[slug]/lots/[lotSlug]` - Get lot details
- `PUT /api/auctions/[slug]/lots/[lotSlug]` - Update lot
- `DELETE /api/auctions/[slug]/lots/[lotSlug]` - Delete lot

### Bidding
- `GET /api/lots/[id]/bids` - Get bid history
- `POST /api/lots/[id]/bids` - Place new bid

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/bids` - Get bidding history
- `GET /api/users/purchases` - Get purchases

### Watchlist
- `GET /api/lots/[id]/watchlist` - Check watchlist status
- `POST /api/lots/[id]/watchlist` - Toggle watchlist

### Search
- `GET /api/search` - Global search

## Key Features

### User Features
- ✅ User registration and authentication
- ✅ Profile management
- ✅ Bid placement with automatic bidding
- ✅ Bid history tracking
- ✅ Watchlist functionality
- ✅ Purchase history
- ✅ Real-time bid counter
- ✅ Auction countdown timer

### Auction Features
- ✅ Browse active/upcoming/past auctions
- ✅ Advanced filtering and sorting
- ✅ Category-based browsing
- ✅ Search functionality
- ✅ Featured auctions
- ✅ Auction details with location and dates
- ✅ Preview and pickup date information

### Lot Features
- ✅ Multiple image gallery with zoom
- ✅ Detailed lot descriptions
- ✅ Condition information
- ✅ Reserve price display
- ✅ Real-time bid updates
- ✅ Bid increment calculation
- ✅ Lot filtering and sorting
- ✅ Category classification

### Admin Features
- ✅ Admin dashboard
- ✅ Auction management
- ✅ Lot management
- ✅ User management
- ✅ Statistics and reporting

## Deployment

### Prerequisites
- Vercel account
- PostgreSQL database
- AWS S3 account

### Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Select GitHub repository
5. Add environment variables
6. Click "Deploy"
7. Run migrations: `vercel env pull .env.local && npm run db:push`

### Environment Variables for Production
```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=<generate-new>
NEXTAUTH_URL=https://yourdomain.com
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=...
AWS_S3_REGION=...
NEXT_PUBLIC_API_URL=https://yourdomain.com
```

## Testing

### Test Accounts (After Seeding)
```
Admin:
  Email: admin@mcmaster-paul-auctions.com
  Password: admin123456

Auctioneer:
  Email: auctioneer@example.com
  Password: auctioneer123456

Bidder:
  Email: bidder1@example.com
  Password: bidder123456
```

## Security

- ✅ Password hashing with bcrypt
- ✅ JWT session tokens
- ✅ HTTPS enforced in production
- ✅ Environment variables for secrets
- ✅ Role-based access control
- ✅ API route authentication
- ✅ CORS configuration
- ✅ SQL injection prevention with Prisma
- ✅ XSS protection with React escaping

## Performance Optimization

- ✅ Image optimization with Next.js Image
- ✅ Code splitting and lazy loading
- ✅ Database query optimization with Prisma
- ✅ Pagination for large datasets
- ✅ Caching strategies
- ✅ CDN support via Vercel
- ✅ Gzip compression

## SEO

- ✅ Dynamic metadata generation
- ✅ SEO-friendly URLs
- ✅ Meta descriptions
- ✅ Open Graph tags
- ✅ Sitemap support
- ✅ Mobile-responsive design

## Bonus Features (Roadmap)

- 🔄 WebSocket real-time bidding
- 📧 Email notifications
- 💬 SMS bidding notifications
- 🗺️ Auction location maps
- 📄 PDF invoice generation
- 📊 CSV export functionality
- 💳 Payment processing integration
- 📱 Mobile app (React Native)

## Troubleshooting

### Database Connection Error
```bash
# Check PostgreSQL is running
pg_isready -h localhost

# Verify DATABASE_URL format
# postgresql://user:password@localhost:5432/dbname
```

### NextAuth Error
```bash
# Generate new secret
openssl rand -base64 32

# Update NEXTAUTH_SECRET
```

### Build Error
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

## Support & Contributing

For issues or questions:
1. Check existing GitHub issues
2. Create detailed bug report
3. Include environment details
4. Provide reproduction steps

## License

MIT

## Contact

- Email: info@mcmaster-paul-auctions.com
- Website: https://mcmaster-paul-auctions.com
