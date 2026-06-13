# McMaster & Paul Auctions - Database Initialization

## Quick Start

### 1. Install PostgreSQL

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Ubuntu/Linux:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo service postgresql start
```

**Windows:**
Download from [postgresql.org](https://www.postgresql.org/download/windows/)

### 2. Create Database

```bash
psql -U postgres
CREATE DATABASE mcmaster_paul_auctions;
\q
```

### 3. Update .env.local

```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/mcmaster_paul_auctions"
```

### 4. Run Migrations

```bash
npm run db:push
```

### 5. Seed Sample Data

```bash
npm run db:seed
```

## Database Schema Overview

### User Table
```sql
- id: unique identifier
- email: unique email address
- password: hashed password
- name: user's name
- role: ADMIN, AUCTIONEER, or BIDDER
- status: ACTIVE, SUSPENDED, BANNED, INACTIVE
- address, city, province, postalCode: location info
```

### Auction Table
```sql
- id: unique identifier
- slug: URL-friendly name
- title: auction title
- description: auction description
- location: auction location
- status: UPCOMING, ACTIVE, CLOSING_SOON, CLOSED, CANCELLED
- startDate, endDate: auction dates
- previewStartDate, previewEndDate: preview period
- pickupStartDate, pickupEndDate: pickup period
- featured: whether auction is featured
```

### Lot Table
```sql
- id: unique identifier
- auctionId: foreign key to auction
- lotNumber: lot number within auction
- slug: URL-friendly name
- title: lot title
- description: detailed description
- category: TOOLS, AUTOMOTIVE, etc.
- startingBid: starting bid amount
- currentBid: current highest bid
- reservePrice: optional reserve
- bidCount: number of bids
- reserveMet: whether reserve is met
```

### Bid Table
```sql
- id: unique identifier
- lotId: foreign key to lot
- userId: foreign key to user
- amount: bid amount
- maxBid: optional auto-bid maximum
- isAutomatic: whether bid is automatic
- createdAt: timestamp
```

## Prisma Commands

```bash
# Push schema to database
npm run db:push

# Open Prisma Studio (visual database editor)
npm run db:studio

# Generate migration
npm run db:generate

# View database
npm run db:seed
```

## Resetting Database

```bash
# WARNING: This deletes all data!
prisma migrate reset
```

## Connection Pooling (Production)

For production, use connection pooling:

```bash
# PgBouncer or similar
# Update DATABASE_URL to use pooling endpoint
```

## Backup & Recovery

```bash
# Backup database
pg_dump -U postgres mcmaster_paul_auctions > backup.sql

# Restore database
psql -U postgres mcmaster_paul_auctions < backup.sql
```
