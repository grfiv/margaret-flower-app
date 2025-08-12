# NOVA Northern Virginia Native Plants Database

A modern, full-featured web application for cataloging and managing native plants in the Northern Virginia region. Built with Next.js 15, Supabase, and TypeScript.

## 🌸 Features

### **Public Interface**
- **Plant Catalog**: Browse hundreds of native plants with detailed information
- **Advanced Search**: Search by plant name, category, height, bloom time, sun requirements, and more
- **Filter System**: Use dropdown filters to find plants by specific characteristics
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Plant Details**: Detailed modal views with photos, growing conditions, and care instructions

### **Admin Interface** 
- **Secure Authentication**: Password-based login with email verification
- **Plant Management**: Add, edit, and delete plant entries
- **Image Uploads**: Upload flower photos (auto-resized to 600×600px) and icons
- **Search & Filter**: Advanced search across all plant attributes in admin view
- **User Management**: Restricted access to authorized administrators

### **Technical Features**
- **Next.js 15**: Latest React framework with App Router
- **Supabase**: Backend-as-a-Service for database, storage, and authentication
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Modern, responsive styling
- **Server-Side Rendering**: Fast page loads and SEO optimization
- **Real-time Updates**: Live data synchronization

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (or npm/yarn)
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd margaret-flower-app
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   
   Create a `.env.local` file with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:3000`

## 🗄️ Database Schema

The application uses the following main tables in Supabase:

### Core Tables
- **`flowers`**: Main plant data with all characteristics
- **`categories`**: Plant categories (trees, shrubs, perennials, etc.)
- **`height`**: Height classifications
- **`bloom`**: Bloom time periods
- **`sun`**: Sun requirement levels
- **`moisture`**: Moisture requirements
- **`soil`**: Soil type preferences
- **`deer`**: Deer resistance ratings
- **`wildlife`**: Wildlife attraction information
- **`photo_credits`**: Photo attribution data

### Storage Buckets
- **`flowers`**: Plant photographs (600×600px)
- **`icons`**: Small icons and symbols (original size)

## 👥 User Management

### Admin Access
The system supports two types of admin users:

1. **Super Users**: Can manage other users and have full access
   - Margaret Fisher (`1margaret.e.fisher@gmail.com`)
   - George Fisher (`georgerfisher@gmail.com`)

2. **Regular Admins**: Can manage plant data (expandable by super users)

### Authentication Flow
1. **First Time Setup**: Use "Set Password" to create account password
2. **Regular Login**: Use email + password combination
3. **Password Reset**: Self-service password reset via email
4. **Magic Links**: Backup authentication method (has timeout limitations)

## 📁 Project Structure

```
margaret-flower-app/
├── app/                          # Next.js 15 App Router
│   ├── actions/                  # Server Actions
│   ├── admin/                    # Admin panel pages
│   ├── api/                      # API routes
│   ├── auth/                     # Authentication pages
│   └── page.tsx                  # Main catalog page
├── components/                   # React Components
│   ├── admin/                    # Admin-specific components
│   ├── flowers/                  # Plant display components
│   ├── search/                   # Search and filter components
│   └── ui/                       # Reusable UI components
├── lib/                          # Utilities and configurations
│   ├── supabase/                 # Supabase client configurations
│   └── types.ts                  # TypeScript type definitions
└── public/                       # Static assets
```

## 🔧 Development

### Key Technologies
- **Framework**: Next.js 15 with App Router
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with custom flows
- **Storage**: Supabase Storage for images
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Package Manager**: pnpm

### Development Commands
```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint

# Type checking
pnpm type-check
```

### Adding New Plants
1. Navigate to `/admin` and log in
2. Click "Add New Flower" (green button)
3. Fill in plant details using the enhanced editor
4. Upload photos using "Upload Images" (purple button)
5. Save the new entry

### Image Management
- **Photos**: Automatically resized to 600×600px for consistency
- **Icons**: Preserved at original size for crisp display
- **Storage**: Organized in separate Supabase storage buckets
- **Upload**: Drag-and-drop interface with progress indicators

## 🛡️ Security

### Authentication
- Password-based authentication with secure hashing
- Email verification for password resets
- Session management with automatic expiration
- Role-based access control

### Data Protection
- Row Level Security (RLS) policies in Supabase
- Server-side validation for all inputs
- Protected API endpoints
- Secure file upload handling

### Admin Access
- Restricted to pre-approved email addresses
- Super user privileges for user management
- Audit logging for administrative actions

## 🌍 Deployment

### Production Checklist
1. Set up production Supabase project
2. Configure environment variables
3. Set up custom domain and SSL
4. Configure Supabase storage policies
5. Test authentication flows
6. Verify image upload functionality

### Recommended Hosting
- **Vercel**: Seamless Next.js deployment
- **Netlify**: Alternative with good performance
- **Railway**: Full-stack deployment option

## 📝 Contributing

### Adding Features
1. Create feature branch from `main`
2. Implement changes with TypeScript
3. Add appropriate error handling
4. Test authentication flows
5. Update documentation
6. Submit pull request

### Code Standards
- Use TypeScript for all new code
- Follow Next.js 15 best practices
- Implement proper error boundaries
- Add loading states for async operations
- Use Tailwind CSS for styling

## 🆘 Troubleshooting

### Common Issues

**Authentication Problems**
- Verify Supabase environment variables
- Check email spelling in allowed users list
- Clear browser cache and cookies
- Try password reset flow

**Image Upload Issues**
- Ensure `SUPABASE_SERVICE_ROLE_KEY` is set
- Check Supabase storage bucket policies
- Verify file size limits (2MB max)
- Confirm supported formats (JPG, PNG, WebP)

**Database Connection**
- Verify Supabase project URL and keys
- Check RLS policies are properly configured
- Ensure database tables exist with correct schema

## 📧 Support

For technical support or questions:
- **Technical Issues**: George Fisher (georgerfisher@gmail.com)
- **Content Management**: Margaret Fisher (1margaret.e.fisher@gmail.com)

## 📄 License

This project is developed for the Northern Virginia Native Plants Database. All rights reserved.

---

**Built with ❤️ for the NOVA community and native plant enthusiasts.**

_Deployed on Vercel with dynamic user management._