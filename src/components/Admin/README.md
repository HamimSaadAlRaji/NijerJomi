# Admin Dashboard Components

This folder contains the modular components that make up the Admin Dashboard. Each component is responsible for a specific section of the dashboard, promoting code reusability and maintainability.

## Component Structure

### 1. `DashboardHeader.tsx`

- **Purpose**: Displays the main dashboard title and description
- **Props**: None
- **Features**:
  - Blue shield icon with dashboard title
  - Descriptive subtitle

### 2. `StatsOverview.tsx`

- **Purpose**: Shows main property-related statistics in a 4-column grid
- **Props**: `stats: DashboardStats | null`
- **Features**:
  - Total Properties count
  - Properties for Sale count
  - Properties with Disputes count
  - Total Market Value in ETH
  - Hover effects and responsive design

### 3. `UserManagementStats.tsx`

- **Purpose**: Displays user management statistics in a 6-column grid
- **Props**: `stats: DashboardStats | null`
- **Features**:
  - Total Users (blue background)
  - Pending Verifications (amber icon)
  - Verified Users (green icon)
  - Rejected Users (red icon)
  - Total Admins (black background)
  - Total Registrars (blue icon)

### 4. `PropertiesOverview.tsx`

- **Purpose**: Complete property management table with search and filtering
- **Props**:
  - `filteredProperties: Property[]`
  - `filter: PropertyFilter`
  - `setFilter: React.Dispatch<React.SetStateAction<PropertyFilter>>`
  - `formatAddress: (address: string) => string`
  - `formatMarketValue: (value: bigint) => string`
- **Features**:
  - Search functionality
  - Status filtering (All, For Sale, Disputes, Normal)
  - Property images with fallback
  - Owner address truncation
  - Status badges
  - View action buttons

### 5. `QuickActions.tsx`

- **Purpose**: Navigation buttons for key admin functions
- **Props**: None
- **Features**:
  - Property Management (blue primary button)
  - User Verification (white outline button)
  - Role Management (white outline button)
  - Analytics Dashboard (white outline button)

### 6. `SystemStatus.tsx`

- **Purpose**: Shows system health and status indicators
- **Props**: `stats: DashboardStats | null`
- **Features**:
  - Blockchain Connection status (green)
  - Smart Contract status (blue)
  - User Sessions count (gray)
  - Status badges for each component

## Design Principles

### 60-30-10 Color Rule

- **60%**: White/Light gray backgrounds for main content areas
- **30%**: Black/Dark gray for headers, text, and contrast elements
- **10%**: Blue accents for CTAs, icons, and highlights

### Typography

- **Headers**: Bold black text with blue accent icons
- **Body text**: Gray hierarchy (gray-600, gray-500, gray-400)
- **Interactive elements**: Blue primary buttons, outlined secondary buttons

### Responsive Design

- Grid layouts that adapt from 1 column on mobile to 4-6 columns on desktop
- Overflow handling for tables on smaller screens
- Hover effects for better interactivity

## Usage Example

```tsx
import {
  DashboardHeader,
  StatsOverview,
  UserManagementStats,
  PropertiesOverview,
  QuickActions,
  SystemStatus,
} from "@/components/Admin";

const AdminDashboard = () => {
  return (
    <div>
      <DashboardHeader />
      <StatsOverview stats={stats} />
      <UserManagementStats stats={stats} />
      <PropertiesOverview
        filteredProperties={filteredProperties}
        filter={filter}
        setFilter={setFilter}
        formatAddress={formatAddress}
        formatMarketValue={formatMarketValue}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <QuickActions />
        <SystemStatus stats={stats} />
      </div>
    </div>
  );
};
```

## Benefits of This Structure

1. **Modularity**: Each component has a single responsibility
2. **Reusability**: Components can be reused in other admin pages
3. **Maintainability**: Easy to update individual sections
4. **Testing**: Components can be tested in isolation
5. **Performance**: Smaller bundle sizes with tree shaking
6. **Readability**: Clear separation of concerns
