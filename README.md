# ModernMart - E-commerce Platform with Crypto Payments

A modern e-commerce platform built with Next.js, Supabase, and Web3 integration for cryptocurrency payments using MBONE tokens on the Polygon network.

## 🏗️ Project Structure

```
modernmart/
├── app/                          # Next.js App Router
│   ├── admin/                    # Admin panel
│   │   └── orders/              # Order management
│   ├── api/                     # API routes
│   │   ├── admin/               # Admin APIs
│   │   ├── create-order/        # Order creation
│   │   ├── settings/            # Settings management
│   │   └── verify-payment/      # Payment verification
│   ├── cart/                    # Shopping cart page
│   ├── checkout/                # Checkout process
│   ├── orders/                  # User orders page
│   ├── products/                # Product pages
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Homepage
├── components/                   # React components
│   ├── auth/                    # Authentication components
│   ├── cart/                    # Cart components
│   ├── checkout/                # Checkout components
│   ├── layout/                  # Layout components
│   ├── orders/                  # Order components
│   ├── products/                # Product components
│   ├── providers/               # Context providers
│   └── ui/                      # Reusable UI components
├── lib/                         # Utility libraries
│   ├── stores/                  # Zustand stores
│   ├── supabase/               # Supabase configuration
│   ├── types/                  # TypeScript types
│   ├── web3/                   # Web3 configuration
│   └── utils.ts                # Utility functions
├── supabase/                    # Supabase configuration
│   └── migrations/             # Database migrations
└── Configuration files
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 13** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI component library
- **Zustand** - State management
- **React Hook Form** - Form handling

### Backend & Database
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Authentication
  - Real-time subscriptions
  - Row Level Security (RLS)

### Web3 Integration
- **Wagmi** - React hooks for Ethereum
- **RainbowKit** - Wallet connection UI
- **Viem** - TypeScript interface for Ethereum
- **Polygon Network** - Layer 2 blockchain

### Payment System
- **MBONE Token** - Custom ERC-20 token for payments
- **Smart Contracts** - Payment processing on Polygon

## 💳 Payment Process Flow

### 1. Order Creation
```
User adds items to cart → Checkout → Create Order API
├── Validates cart items
├── Calculates totals (USD & MBONE)
├── Creates order record in database
├── Generates order hash and invoice ID
└── Returns order details for payment
```

### 2. Crypto Payment Process
```
Connect Wallet → Approve MBONE → Pay Order → Verify Payment
├── User connects Web3 wallet (MetaMask, etc.)
├── Switch to Polygon network if needed
├── Approve MBONE token spending
├── Execute payment transaction
├── Verify transaction on blockchain
└── Update order status to 'paid'
```

### 3. Order Fulfillment
```
Payment Confirmed → Create Shipment → Admin Management
├── Order status updated to 'paid'
├── Initial shipment record created
├── Admin can update shipping details
├── Customer receives tracking information
└── Order completion
```

## 🗄️ Database Schema

### Core Tables

#### Products
- Product catalog with pricing, discounts, and inventory
- Support for multiple product images
- Featured products and categories

#### Users
- User profiles linked to Supabase Auth
- Personal information and preferences

#### Orders & Payments
- Order management with USD and MBONE pricing
- Crypto payment tracking with transaction hashes
- Order items with individual pricing

#### Shipments
- Shipping information and tracking
- Status updates (processing → shipped → delivered)
- Courier and tracking number management

### Key Features
- **Row Level Security (RLS)** - Data access control
- **Real-time updates** - Live order status changes
- **Audit trail** - Complete payment and order history

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Web3 Configuration
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_POLYGON_RPC_URL=https://polygon-rpc.com
POLYGON_RPC_URL=https://polygon-rpc.com

# Smart Contract Addresses (TO BE DEPLOYED)
MBONE_TOKEN_ADDRESS=0x1234567890123456789012345678901234567890
PAYMENT_PROCESSOR_ADDRESS=0x0987654321098765432109876543210987654321

# Admin Configuration
ADMIN_PRIVATE_KEY=your_admin_wallet_private_key
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- WalletConnect Project ID
- Polygon wallet with MATIC for gas fees

### Installation

1. **Clone and install dependencies**
```bash
git clone <repository-url>
cd modernmart
npm install
```

2. **Set up Supabase**
- Create a new Supabase project
- Run the provided migrations in order
- Configure authentication providers (email/password, Google OAuth)
- Set up Row Level Security policies

3. **Configure environment variables**
```bash
cp .env.example .env.local
# Fill in your actual values
```

4. **Start development server**
```bash
npm run dev
```

## 🔗 Smart Contract Integration

### Current Status: DEMO MODE
The project currently uses placeholder smart contract addresses and simulated blockchain interactions.

### Required Smart Contracts

#### 1. MBONE Token Contract (ERC-20)
```solidity
// Standard ERC-20 token with additional features
contract MBONEToken {
    // Standard ERC-20 functions
    // Minting/burning capabilities
    // Access control for admin functions
}
```

#### 2. Payment Processor Contract
```solidity
contract PaymentProcessor {
    // Order payment processing
    function payOrder(bytes32 orderId, string invoiceId) external;
    
    // Order creation and validation
    function createOrder(bytes32 orderId, uint256 amount, address buyer) external;
    
    // Events for tracking
    event OrderPaid(bytes32 indexed orderId, address indexed buyer, uint256 amount, string invoiceId);
}
```

### Integration Points
- **Token Approval**: Users approve MBONE spending
- **Payment Execution**: Smart contract processes payments
- **Event Listening**: Backend listens for payment events
- **Transaction Verification**: Verify payments on-chain

## 📋 TODO: Missing Components

### 1. Smart Contract Deployment
- [ ] Deploy MBONE token contract on Polygon
- [ ] Deploy payment processor contract
- [ ] Update contract addresses in configuration
- [ ] Set up contract verification on PolygonScan

### 2. Payment Integration
- [ ] Implement real blockchain transaction verification
- [ ] Add event listeners for payment confirmations
- [ ] Handle failed payment scenarios
- [ ] Add payment retry mechanisms

### 3. Admin Features
- [ ] Admin role management and authentication
- [ ] Product management (CRUD operations)
- [ ] Order management dashboard
- [ ] Analytics and reporting
- [ ] Inventory management

### 4. Enhanced Features
- [ ] Email notifications for orders
- [ ] SMS notifications for shipping updates
- [ ] Advanced search and filtering
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Discount codes and promotions

### 5. Security & Performance
- [ ] Rate limiting for API endpoints
- [ ] Input validation and sanitization
- [ ] Image optimization and CDN
- [ ] Caching strategies
- [ ] Error monitoring (Sentry)

### 6. Testing
- [ ] Unit tests for components
- [ ] Integration tests for API routes
- [ ] E2E tests for user flows
- [ ] Smart contract tests

## 🔐 Security Considerations

### Current Implementation
- ✅ Supabase Row Level Security (RLS)
- ✅ JWT-based authentication
- ✅ Input validation on forms
- ✅ HTTPS enforcement

### Additional Security Needed
- [ ] API rate limiting
- [ ] CSRF protection
- [ ] SQL injection prevention
- [ ] XSS protection headers
- [ ] Smart contract security audit

## 🚀 Deployment

### Current Setup
- Configured for Netlify deployment
- Static site generation with Next.js
- Serverless functions for API routes

### Production Checklist
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Smart contracts deployed
- [ ] Domain and SSL configured
- [ ] Monitoring and logging set up

## 🤝 Contributing

### Development Workflow
1. Create feature branch from `main`
2. Implement changes with tests
3. Update documentation
4. Submit pull request
5. Code review and merge

### Code Standards
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Conventional commits

## 📞 Support

For questions about this project:
1. Check the documentation above
2. Review the code comments
3. Check existing issues
4. Create a new issue with detailed description

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Note**: This project is currently in development. The smart contract integration is in demo mode and requires actual contract deployment for production use.


-- Insert sample specifications for a product
INSERT INTO product_specifications (product_id, specification_name, specification_value, display_order) VALUES
('52cbe177-78f3-4d96-bfac-e84ad47415af', 'Material', 'Premium Cotton Blend', 1),
('52cbe177-78f3-4d96-bfac-e84ad47415af', 'Weight', '2.5 kg', 2),
('52cbe177-78f3-4d96-bfac-e84ad47415af', 'Dimensions', '30 x 20 x 15 cm', 3),
('52cbe177-78f3-4d96-bfac-e84ad47415af', 'Warranty', '2 Years', 4),
('52cbe177-78f3-4d96-bfac-e84ad47415af', 'Battery Life', 'Up to 10 hours', 5),
('52cbe177-78f3-4d96-bfac-e84ad47415af', 'Water Resistant', 'Yes, IPX4', 6);

-- Insert sample banners
INSERT INTO product_banners (product_id, image_url, title, subtitle, display_order) VALUES
('52cbe177-78f3-4d96-bfac-e84ad47415af', 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1', 'Premium Quality', 'Made with love for your pets', 1),
('52cbe177-78f3-4d96-bfac-e84ad47415af', 'https://images.unsplash.com/photo-1545249390-6bdfa286032f', 'Limited Time Offer', 'Get 20% off on first purchase', 2),
('52cbe177-78f3-4d96-bfac-e84ad47415af', 'https://images.unsplash.com/photo-1561037404-61cd46aa615b', 'Free Shipping', 'On orders over $50', 3);