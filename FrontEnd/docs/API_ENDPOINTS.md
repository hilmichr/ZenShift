# API Endpoints Structure

This document outlines the API endpoint structure that corresponds to our entity-based store architecture.

## Authentication Endpoints

### Auth Store (`stores/auth.ts`)

```
POST   /api/auth/login                    # User login
POST   /api/auth/logout                   # User logout
GET    /api/auth/me                       # Get current user profile
GET    /api/auth/verify-admin             # Verify admin access
POST   /api/auth/verify-permission        # Verify specific permission
POST   /api/auth/refresh-token            # Refresh JWT token
```

## User Management Endpoints

### User Store (`stores/user.ts`)

```
# Basic CRUD
GET    /api/users                         # Get all users (paginated)
GET    /api/users/{id}                    # Get user by ID
POST   /api/users                         # Create new user
PUT    /api/users/{id}                    # Update user
PATCH  /api/users/{id}                    # Partial update user
DELETE /api/users/{id}                    # Delete user

# Profile Management
GET    /api/users/me                      # Get current user profile
PUT    /api/users/me                      # Update current user profile
POST   /api/users/me/change-password     # Change password
POST   /api/users/me/profile-picture     # Upload profile picture

# Admin User Management
POST   /api/admin/users/{id}/roles        # Assign roles to user
POST   /api/admin/users/{id}/permissions  # Assign permissions to user
PATCH  /api/admin/users/{id}/activate     # Activate/deactivate user

# Special Queries
GET    /api/users/search                  # Search users
GET    /api/users/by-role/{role}          # Get users by role
GET    /api/users/with-cars               # Get users with cars (car sharing)
```

## Work Entry Endpoints

### Work Entry Store (`stores/workEntry.ts`)

```
# Employee Work Entries
GET    /api/work-entries/me               # Get my work entries
POST   /api/work-entries                  # Create work entry
PUT    /api/work-entries/{id}             # Update my work entry
DELETE /api/work-entries/{id}             # Delete my work entry
PATCH  /api/work-entries/{id}/submit      # Submit for approval

# Admin Work Entry Management
GET    /api/admin/work-entries            # Get all work entries (paginated)
GET    /api/admin/work-entries/{id}       # Get work entry by ID
PUT    /api/admin/work-entries/{id}       # Admin update work entry
PATCH  /api/admin/work-entries/{id}/approve    # Approve work entry
PATCH  /api/admin/work-entries/{id}/reject     # Reject work entry
PATCH  /api/admin/work-entries/bulk-approve    # Bulk approve entries
PATCH  /api/admin/work-entries/bulk-reject     # Bulk reject entries

# Statistics & Reporting
GET    /api/admin/work-entries/statistics # Get work entry statistics
GET    /api/admin/work-entries/export     # Export work entries

# Special Queries
GET    /api/admin/work-entries/pending    # Get pending entries
GET    /api/admin/work-entries/by-status/{status}  # Get by status
GET    /api/admin/work-entries/by-user/{userId}    # Get by user
```

## Vacation Request Endpoints

### Vacation Request Store (`stores/vacationRequest.ts`)

```
# Employee Vacation Requests
GET    /api/vacation-requests/me          # Get my vacation requests
POST   /api/vacation-requests             # Create vacation request
PUT    /api/vacation-requests/{id}        # Update my vacation request
PATCH  /api/vacation-requests/{id}/cancel # Cancel my vacation request
GET    /api/vacation-requests/me/balance  # Get my vacation balance

# Admin Vacation Management
GET    /api/admin/vacation-requests       # Get all vacation requests
GET    /api/admin/vacation-requests/{id}  # Get vacation request by ID
PUT    /api/admin/vacation-requests/{id}  # Admin update vacation request
PATCH  /api/admin/vacation-requests/{id}/approve  # Approve request
PATCH  /api/admin/vacation-requests/{id}/reject   # Reject request

# Calendar & Conflicts
GET    /api/admin/vacation-requests/calendar   # Get calendar events
GET    /api/admin/vacation-requests/conflicts  # Check conflicts

# Statistics & Reporting
GET    /api/admin/vacation-requests/statistics # Get vacation statistics
GET    /api/admin/vacation-requests/export     # Export vacation data

# Special Queries
GET    /api/admin/vacation-requests/pending    # Get pending requests
GET    /api/admin/vacation-requests/current    # Get current vacations
GET    /api/admin/vacation-requests/by-type/{type}    # Get by type
GET    /api/admin/vacation-requests/by-status/{status} # Get by status
```

## Request/Response Patterns

### Standard Response Format

```typescript
// Success Response
{
  "data": T,           // Entity or array of entities
  "message": string,   // Optional success message
  "success": true
}

// Paginated Response
{
  "data": T[],
  "total": number,
  "page": number,
  "pageSize": number,
  "totalPages": number
}

// Error Response
{
  "error": string,
  "message": string,
  "statusCode": number,
  "details": object    // Optional additional error details
}
```

### Common Query Parameters

```typescript
// Pagination
?page=1&pageSize=10

// Sorting
?sortBy=createdAt&sortOrder=desc

// Filtering
?status=pending&dateFrom=2023-01-01&dateTo=2023-12-31

// Search
?search=john&email=john@example.com
```

## Store Architecture Benefits

### 1. **Consistency**

- All stores follow the same pattern
- Predictable method names and behaviors
- Unified error handling

### 2. **Type Safety**

- Full TypeScript support
- Entity-specific interfaces
- Compile-time error checking

### 3. **Reusability**

- Base store class reduces code duplication
- Common patterns abstracted
- Easy to extend for new entities

### 4. **Separation of Concerns**

- Each store manages one entity type
- Clear boundaries between employee and admin actions
- Dedicated endpoints for different access levels

### 5. **Developer Experience**

- Auto-completion in IDEs
- Clear API surface
- Easy to test and mock

## Usage Examples

### Employee Work Entry Management

```typescript
const workEntry = useWorkEntry();

// Get my entries
await workEntry.getMyEntries();

// Create new entry
await workEntry.createMyEntry({
  date: "2023-12-25",
  startTime: "09:00",
  endTime: "17:00",
  breakMinutes: 30,
});

// Submit for approval
await workEntry.submitForApproval(entryId);
```

### Admin Work Entry Management

```typescript
const workEntry = useWorkEntry();

// Get all entries with filters
await workEntry.getAllEntries({
  status: "pending",
  dateFrom: "2023-12-01",
  dateTo: "2023-12-31",
});

// Bulk approve entries
await workEntry.bulkApprove({
  entryIds: ["id1", "id2", "id3"],
  actionBy: adminUserId,
});

// Get statistics
await workEntry.getStatistics();
```

### Vacation Request Management

```typescript
const vacation = useVacationRequest();

// Get my balance
await vacation.getMyBalance();

// Create vacation request
await vacation.createMyRequest({
  type: "annual",
  startDate: "2023-12-25",
  endDate: "2023-12-29",
  reason: "Christmas holidays",
});

// Admin: Check conflicts
await vacation.checkConflicts("2023-12-25", "2023-12-29");
```

This architecture provides a robust, type-safe, and scalable foundation for managing entities in your application.
