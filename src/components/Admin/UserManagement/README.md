# User Management Components

This folder contains the modular components that make up the User Management section of the Admin Dashboard. Each component is responsible for a specific aspect of user management, promoting code reusability and maintainability.

## Component Structure

### 1. `UserManagementHeader.tsx`

- **Purpose**: Displays the main User Management page title and description
- **Props**: None
- **Features**:
  - Blue users icon with page title
  - Descriptive subtitle

### 2. `UserStatsOverview.tsx`

- **Purpose**: Shows user-related statistics in a 3x2 grid layout
- **Props**: `stats: UserStats | null`
- **Features**:
  - Total Users count (blue background)
  - Verified Users count (green icon)
  - Unverified Users count (red icon)
  - Pending Reviews count (amber icon)
  - Administrators count (black background)
  - Property Owners count (blue icon)
  - Hover effects and responsive design

### 3. `UserListTable.tsx`

- **Purpose**: Complete user management table with search and filtering capabilities
- **Props**:
  - `users: UserData[]`
  - `filter: UserFilter`
  - `setFilter: React.Dispatch<React.SetStateAction<UserFilter>>`
  - `onViewUser: (address: string) => void`
  - `onEditUser: (address: string) => void`
  - `formatAddress: (address: string) => string`
- **Features**:
  - Search functionality by address or role
  - Role filtering (All, Admin, Registrar, Court, Tax Authority, Citizen)
  - Verification status filtering (All, Verified, Unverified, Pending)
  - User avatars and join dates
  - Role badges with appropriate colors
  - Verification status icons
  - Property count and transaction count
  - Last activity tracking
  - View and Edit action buttons

### 4. `RecentActivity.tsx`

- **Purpose**: Shows recent user-related activities and system events
- **Props**:
  - `activities: ActivityData[]`
  - `formatAddress: (address: string) => string`
- **Features**:
  - Activity type icons (registration, verification, property actions, etc.)
  - Color-coded activity badges
  - Scrollable activity feed
  - Timestamp display
  - User address integration

### 5. `UserActions.tsx`

- **Purpose**: Action buttons for key user management functions
- **Props**:
  - `onAddUser: () => void`
  - `onBulkVerify: () => void`
  - `onExportUsers: () => void`
  - `onRefreshData: () => void`
  - `isLoading?: boolean`
- **Features**:
  - Add New User (blue primary button)
  - Bulk User Actions (white outline button)
  - Export User Data (white outline button)
  - Refresh Data with loading animation
  - Loading state handling

## Data Interfaces

### UserData

```typescript
interface UserData {
  address: string;
  role: UserRole;
  isVerified: boolean;
  verificationStatus: "approved" | "pending" | "rejected";
  propertyCount: number;
  totalTransactions: number;
  lastActivity: string;
  joinedDate: string;
}
```

### UserStats

```typescript
interface UserStats {
  totalUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  pendingVerifications: number;
  totalAdmins: number;
  totalUsersWithProperties: number;
}
```

### ActivityData

```typescript
interface ActivityData {
  id: string;
  type:
    | "user_registered"
    | "user_verified"
    | "user_rejected"
    | "property_registered"
    | "property_transferred"
    | "dispute_reported";
  userAddress: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}
```

## Design Principles

### 60-30-10 Color Rule

- **60%**: White/Light gray backgrounds for main content areas
- **30%**: Black/Dark gray for headers, text, and contrast elements
- **10%**: Blue accents for CTAs, icons, and highlights

### Role-Based Color Coding

- **Admin**: Black background/text
- **Registrar**: Blue theme
- **Court**: Purple theme
- **Tax Authority**: Orange theme
- **Citizen**: Gray theme

### Verification Status Icons

- **Approved**: Green check circle
- **Pending**: Amber clock
- **Rejected**: Red X circle

## Features

### Advanced Filtering

- Text search across user addresses and roles
- Multi-select role filtering
- Verification status filtering
- Real-time filter application

### Responsive Design

- Grid layouts that adapt from 1 column on mobile to 3 columns on desktop
- Horizontal scrolling for tables on smaller screens
- Touch-friendly action buttons

### Interactive Elements

- Hover effects for better user experience
- Loading states for all async operations
- Color-coded badges and status indicators

## Usage Example

```tsx
import {
  UserManagementHeader,
  UserStatsOverview,
  UserListTable,
  RecentActivity,
  UserActions,
} from "@/components/Admin/UserManagement";

const UserManagement = () => {
  return (
    <div>
      <UserManagementHeader />
      <UserStatsOverview stats={stats} />
      <UserListTable
        users={filteredUsers}
        filter={filter}
        setFilter={setFilter}
        onViewUser={handleViewUser}
        onEditUser={handleEditUser}
        formatAddress={formatAddress}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <UserActions
          onAddUser={handleAddUser}
          onBulkVerify={handleBulkVerify}
          onExportUsers={handleExportUsers}
          onRefreshData={handleRefreshData}
          isLoading={loading}
        />
        <RecentActivity activities={activities} formatAddress={formatAddress} />
      </div>
    </div>
  );
};
```

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live activity feed
2. **Advanced Analytics**: User behavior tracking and insights
3. **Bulk Operations**: Multi-select for bulk user actions
4. **Export Options**: CSV, PDF, and Excel export formats
5. **User Details Modal**: Quick view user details without navigation
6. **Advanced Search**: Full-text search with auto-suggestions
