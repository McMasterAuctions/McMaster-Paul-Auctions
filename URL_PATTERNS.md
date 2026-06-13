# URL Patterns

This document describes the URL routing patterns used throughout the McMaster & Paul Auctions platform.

## Public Pages

### Homepage
- **URL**: `/`
- **Description**: Platform homepage with featured auctions and search

### Authentication
- **URL**: `/login`
- **Description**: User login page
- **URL**: `/register`
- **Description**: User registration page

### Auctions
- **URL**: `/auctions`
- **Description**: List of all auctions with filters
- **Query**: `?page=1&status=ACTIVE&featured=true`

- **URL**: `/auctions/[slug]`
- **Example**: `/auctions/farm-equipment-sale`
- **Description**: Auction detail page

### Lots
- **URL**: `/auctions/[slug]/lots`
- **Example**: `/auctions/farm-equipment-sale/lots`
- **Description**: Browse lots in an auction with filters/sort
- **Query**: `?page=1&sortBy=LOT_NUMBER_ASC&category=TOOLS`

- **URL**: `/auctions/[slug]/lots/[lotSlug]`
- **Example**: `/auctions/farm-equipment-sale/lot-125-john-deere-tractor`
- **Description**: Lot detail page with bidding panel

## User Pages

### Account
- **URL**: `/account`
- **Description**: User dashboard (profile, bids, purchases, watchlist)
- **Requires**: Authentication

## Admin Pages

### Dashboard
- **URL**: `/admin`
- **Description**: Admin dashboard with stats
- **Requires**: Admin role

### Auction Management
- **URL**: `/admin/auctions`
- **Description**: List of all auctions for management
- **Requires**: Admin role

- **URL**: `/admin/auctions/new`
- **Description**: Create new auction form
- **Requires**: Admin role

- **URL**: `/admin/auctions/[id]/edit`
- **Description**: Edit auction form
- **Requires**: Admin role

### User Management
- **URL**: `/admin/users`
- **Description**: Manage user accounts
- **Requires**: Admin role

### Lot Management
- **URL**: `/admin/lots`
- **Description**: Manage auction lots
- **Requires**: Admin role

## API Endpoints

See API documentation in code for complete endpoint list.

## URL Slug Format

### Auction Slugs
- **Pattern**: `lowercase-with-hyphens`
- **Example**: `farm-equipment-sale`
- **Generated**: Via `generateSlug()` function

### Lot Slugs
- **Pattern**: `lot-[number]-[title-slug]`
- **Example**: `lot-125-john-deere-tractor`
- **Generated**: From lot number and title

## Query Parameters

### Auction Filters
- `page` - Page number (default: 1)
- `status` - Auction status (UPCOMING, ACTIVE, CLOSED)
- `featured` - Featured auctions only (true/false)
- `search` - Search term

### Lot Filters
- `page` - Page number (default: 1)
- `sortBy` - Sort option (LOT_NUMBER_ASC, PRICE_DESC, etc.)
- `category` - Lot category (TOOLS, AUTOMOTIVE, etc.)
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `hasBids` - Filter by bid status (true/false)
- `reserveMet` - Filter by reserve (true/false)
- `featured` - Featured lots only (true/false)
- `search` - Search term

## Redirects

- Unauthenticated users accessing protected pages → `/login?callbackUrl=/[original-page]`
- Non-admin users accessing admin pages → `/`
- Non-auctioneer users creating auctions → `/`
