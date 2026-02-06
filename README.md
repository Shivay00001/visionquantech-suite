# VisionQuantech Business Suite 🚀

A complete, production-ready SaaS platform for enterprise business management. Comparable to Zoho, Salesforce, and other leading business suites.

## 🎯 Features

### Core Modules

- **CRM** - Customer Relationship Management with lead tracking, pipeline management, and deal scoring
- **HR** - Human Resources with employee management, attendance, payroll, and performance reviews
- **Finance** - Accounting with invoicing, expense tracking, and ledger management
- **Inventory** - Stock management with POS, purchase orders, and sales orders

### Administrative Features

- **Superadmin Panel** - Global system oversight and organization management
- **Organization Admin** - Per-org user and module management
- **Role-Based Access** - 9 distinct permission levels
- **Audit Logging** - Complete change tracking for compliance

### Premium Features (AI)

- AI-powered email drafting for CRM
- Automated proposal generation
- Predictive analytics
- Natural language queries

## 🛠 Tech Stack

- **Frontend**: Next.js 16 (App Router), React, TailwindCSS
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth with JWT
- **Security**: Row Level Security (RLS) policies
- **AI**: Apifree API / HuggingFace
- **Charts**: Recharts
- **PDFs**: jsPDF

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works)
- Apifree API key (for AI features)

## 🚀 Quick Start

### 1. Clone and Install

```bash
cd visionquantech-suite
npm install
```

### 2. Environment Setup

Create `.env.local` from the template:

```env
# Copy from ENV_TEMPLATE.txt
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
APIFREE_API_KEY=your_apifree_api_key
HUGGINGFACE_API_KEY=your_huggingface_key
```

### 3. Database Setup

In your Supabase SQL Editor, run these files in order:

1. `database/schema.sql` - Creates all tables and relationships
2. `database/policies.sql` - Sets up Row Level Security
3. `database/seed_data.sql` - Inserts demo data

### 4. Create First User

1. Run the development server: `npm run dev`
2. Navigate to `http://localhost:3000`
3. Click "Sign up" and create your account
4. The first user will need to be manually promoted to superadmin in Supabase

### 5. Promote to Superadmin

In Supabase SQL Editor:

```sql
UPDATE users 
SET role = 'superadmin' 
WHERE email = 'your-email@example.com';
```

## 📁 Project Structure

```
visionquantech-suite/
├── app/
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   ├── crm/               # CRM module
│   ├── hr/                # HR module
│   ├── finance/           # Finance module
│   ├── inventory/         # Inventory module
│   ├── admin/             # Org admin panel
│   ├── superadmin/        # Superadmin panel
│   ├── api/               # API routes
│   │   ├── crm/
│   │   ├── hr/
│   │   ├── finance/
│   │   ├── inventory/
│   │   └── ai/            # Premium AI features
│   ├── globals.css
│   └── layout.js
├── lib/
│   ├── supabaseClient.js  # Client-side Supabase
│   ├── supabaseAdmin.js   # Server-side Supabase
│   └── auth.js            # Auth utilities
├── database/
│   ├── schema.sql         # Database schema
│   ├── policies.sql       # RLS policies
│   └── seed_data.sql      # Sample data
└── middleware.js          # Route protection
```

## 🔐 Role Hierarchy

1. **superadmin** - Full system access, manage all organizations
2. **org_admin** - Manage organization, add users, configure modules
3. **hr_manager** - Full HR module access
4. **finance_manager** - Full Finance module access
5. **inventory_manager** - Full Inventory access
6. **crm_lead_manager** - Full CRM access
7. **support_staff** - Limited support functions
8. **normal_employee** - Self-service (attendance, leaves, profile)
9. **viewer** - Read-only access

## 🎨 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🔧 Configuration

### Module Access

Organizations can enable/disable modules via the Org Admin panel:

- Toggle CRM, HR, Finance, Inventory on/off
- Changes reflect immediately for all org users

### Subscription Tiers

- **Free** - Basic access, 10 employees max
- **Starter** - 50 employees, enhanced features
- **Pro** - AI features enabled, 200 employees
- **Enterprise** - Unlimited users, full AI suite, custom support

### AI Features (Premium Only)

AI features are automatically gated by subscription tier. Pro and Enterprise users can access:

- `/api/ai/chat` - General AI assistant
- `/api/ai/email/draft` - Auto-email generation

## 🔒 Security Features

- **Row Level Security (RLS)** - Every table isolated by organization
- **Role-based permissions** - Granular access control
- **Audit logging** - All changes tracked
- **JWT sessions** - Secure authentication
- **HTTPS only** - Enforced in production

## 📊 Database Schema

The system includes **47 tables** across modules:

- **Core**: 4 tables (orgs, users, sessions, audit)
- **CRM**: 9 tables (leads, contacts, accounts, deals, etc.)
- **HR**: 12 tables (employees, attendance, payroll, etc.)
- **Finance**: 8 tables (invoices, expenses, ledger, etc.)
- **Inventory**: 10 tables (products, stock, POS, etc.)
- **Workflows**: 4 tables (rules, jobs, notifications)

All with proper:

- Foreign keys and relationships
- Indexes for performance
- Auto-updated timestamps
- RLS policies

## 🌐 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy automatically

### Custom Server

```bash
npm run build
npm start
```

Ensure environment variables are set in production.

## 📱 API Reference

### Authentication

- `POST /api/auth/logout` - Sign out

### CRM

- `GET /api/crm/leads` - List leads (pagination supported)
- `POST /api/crm/leads` - Create lead
- `GET /api/crm/leads/:id` - Get lead details
- `PUT /api/crm/leads/:id` - Update lead
- `DELETE /api/crm/leads/:id` - Delete lead
- `POST /api/crm/pipeline/moveStage` - Move lead in pipeline

### HR

- `GET /api/hr/employees` - List employees
- `POST /api/hr/employees` - Create employee
- `POST /api/hr/attendance/clock-in` - Clock in
- `POST /api/hr/attendance/clock-out` - Clock out

### Finance

- `GET /api/finance/invoices` - List invoices
- `POST /api/finance/invoices` - Create invoice with items

### Inventory

- `GET /api/inventory/products` - List products
- `POST /api/inventory/products` - Create product

### AI (Premium)

- `POST /api/ai/chat` - AI assistant
- `POST /api/ai/email/draft` - Generate email

## 🤝 Contributing

This is a production codebase. For contributions:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

Proprietary - VisionQuantech Business Suite

## 🆘 Support

For issues or questions:

- Check the walkthrough documentation
- Review database schema comments
- Verify environment variables
- Check Supabase logs

## 🎯 Roadmap

### Current Version (v1.0)

✅ Complete CRM module  
✅ HR management with attendance  
✅ Finance and invoicing  
✅ Inventory and POS  
✅ Admin panels  
✅ AI features (tier-gated)

### Planned Features

- [ ] Workflow automation engine UI
- [ ] Real-time collaboration
- [ ] Mobile app (React Native)
- [ ] Advanced reporting dashboards
- [ ] Email integration (Gmail, Outlook)
- [ ] Calendar integration
- [ ] Document management system
- [ ] Advanced analytics with Recharts

## 💡 Key Features

- **Multi-tenant** - Isolated data per organization
- **Scalable** - Supports 100+ organizations
- **Secure** - RLS + Role-based access
- **Modular** - Enable/disable features per org
- **Premium Tiers** - AI features for paid plans
- **Mobile Responsive** - Works on all devices
- **Production Ready** - No placeholders, complete code

---

Built with ❤️ by VisionQuantech team
