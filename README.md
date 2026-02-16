# Crevy Dashboard

A modern carbon credit management dashboard built with Next.js, TypeScript, and shadcn/ui.

## ✨ Features Implemented

### 1. **Professional Sidebar** (`src/components/AppSidebar.tsx`)
- Emerald gradient background matching the reference design
- Organized navigation with sections:
  - **Top Items**: Get Started, Compliance, Dashboard
  - **Carbon Center**: Carbon Credit Calculator, Project Profile, Carbon Credits, Track Verification
  - **Account Pages**: User Profile, Notifications (with badge), Support
- Collapsible sidebar with icon-only mode
- Active state highlighting with white background
- User profile footer with "Welcome back 👋" message

### 2. **Dashboard Header** (`src/components/DashboardHeader.tsx`)
- Welcome message with user name
- Subtitle explaining the platform
- Right-side action icons:
  - Notifications (with red dot indicator)
  - Settings
  - User avatar
- Navigation tabs:
  - Home
  - Submit project
  - Marketplace
  - Verification
  - Contact us
- Active tab indication with emerald underline

### 3. **Main Dashboard Page** (`src/app/(dashboard)/dashboard/page.tsx`)
- **Hero Section**:
  - "Ready to make an impact?" call-to-action
  - "Welcome to crevy" card with gradient background
- **Quick Actions** grid with 3 cards:
  - Start a new project (blue theme)
  - View Carbon Calculator (emerald theme)
  - Track My Verification (amber theme)
- **Project Overview** stats with 4 cards:
  - Active Projects (3)
  - Carbon Credits Earned (1,245)
  - CO₂ Savings (892 tons)
  - Verification Progress (67%)
- **Recent Activity** feed with 3 recent items

### 4. **Improved Layout** (`src/components/DashboardLayout.tsx`)
- Clean background with proper spacing
- Responsive design for mobile and desktop
- Professional footer with copyright
- Max-width container for better readability

### 5. **Type-Safe Architecture**
- Created `src/types/sidebar.types.ts` for sidebar configuration
- Exported types from `src/types.d.ts`
- Proper TypeScript interfaces throughout

### 6. **Navigation Routes**
Created placeholder pages for all navigation items:
- `/get-started`
- `/carbon-calculator`
- `/submit-project`
- And more...

## 🎨 Design System

- **Primary Color**: Emerald/Green (`#2CC295`)
- **Accent Colors**: Blue, Amber for different sections
- **Typography**: Clean, professional font stack
- **Spacing**: Consistent padding and margins
- **Shadows**: Subtle shadows for depth

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
src/
├── app/
│   └── (dashboard)/
│       ├── dashboard/          # Main dashboard
│       ├── get-started/        # Onboarding page
│       ├── carbon-calculator/  # Calculator tool
│       ├── submit-project/     # Project submission
│       └── ...                 # Other routes
├── components/
│   ├── AppSidebar.tsx         # Main sidebar component
│   ├── DashboardHeader.tsx    # Header with tabs
│   ├── DashboardLayout.tsx    # Main layout wrapper
│   ├── NavUser.tsx            # User profile dropdown
│   └── ui/                    # shadcn components
├── constants/
│   └── sidebar-items.ts       # Sidebar configuration
├── types/
│   ├── sidebar.types.ts       # Sidebar type definitions
│   └── index.ts               # Type exports
└── lib/
    └── utils.ts               # Utility functions
```

## 🎯 Key Components

### AppSidebar
- Collapsible sidebar with icon mode
- Section-based navigation
- Active route highlighting
- User profile footer

### DashboardHeader
- User welcome message
- Action buttons (notifications, settings)
- Navigation tabs
- Responsive design

### Dashboard Page
- Statistics cards
- Quick action buttons
- Recent activity feed
- Clean, modern UI

## 📝 Next Steps

1. **Icons**: Download actual icons from Figma and place in `/public/icons/`
2. **Authentication**: Integrate real auth (currently using mock user)
3. **API Integration**: Connect to backend services
4. **Forms**: Build project submission forms
5. **Charts**: Add data visualization for statistics
6. **Responsiveness**: Test and refine mobile experience

## 🔧 Customization

### Updating Sidebar Items
Edit `src/constants/sidebar-items.ts`:

```typescript
export const SIDEBAR_CONFIG: SidebarConfig = {
  topItems: [
    // Add/remove top-level items
  ],
  sections: [
    // Add/remove sections
  ],
};
```

### Changing Colors
Update `src/app/globals.css`:

```css
@theme {
  --color-myGreen: #2cc295;
  --color-myDarkGreen: #178a74;
  --color-myBlue: #131927;
}
```

## 📚 Technologies Used

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - Component library
- **Lucide React** - Icons
- **Sonner** - Toast notifications

---

Built with ❤️ for Crevy - Making carbon credit management simple and effective.


this is the data we are passing from the frontend, is it enough to be correctly populated in the database? Will it be enough to calculate the carbon captured?
{
    "name": "Project MT",
    "projectType": "regenerative_agriculture",
    "location": "Kumasi, Ghana",
    "gpsCoordinates": "34.0522, -118.2437",
    "startDate": "2026-02-20T00:00:00.000Z",
    "durationMonths": 40,
    "totalAreaHectares": 400,
    "baselineLandUse": "Current land use about something something",
    "baselineEmissionsYearly": 30,
    "soilType": "Clay",
    "initialSoilCarbonContent": 20,
    "cropLivestockTypes": "Cattle, Maize",
    "usesSyntheticFertilizers": false,
    "usesSyntheticPesticides": false,
    "organicAmendments": "Compost, Manure",
    "supportsBiodiversityConservation": true,
    "supportsWaterManagement": true,
    "description": "Project Description is about something something",
    "implementationPlan": "Implementation Plan about something something",
    "expectedOutcomes": "Expected Outcomes about something something"
}
