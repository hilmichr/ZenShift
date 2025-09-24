# Security Architecture for Admin Role Management

## Overview

This document outlines the secure admin role determination strategy implemented in the application, designed to prevent unauthorized admin access and manipulation.

## Security Principles

### 1. **No Client-Side Admin Flags**

- ❌ **NEVER** use a simple `admin: boolean` property in user DTOs
- ❌ **NEVER** rely solely on client-side role checking
- ✅ **ALWAYS** verify admin status server-side

### 2. **Role-Based Access Control (RBAC)**

Instead of a simple boolean flag, we use a comprehensive RBAC system:

```typescript
interface User {
  id: string;
  email: string;
  fullName: string;
  roles: string[]; // e.g., ['admin', 'manager', 'employee']
  permissions: string[]; // e.g., ['read:all_timesheets', 'approve:vacation']
}
```

### 3. **Server-Side Verification**

All admin checks must be verified on the server:

```typescript
// Client-side (display purposes only)
const isAdmin = authStore.isAdmin;

// Server-side verification (actual security)
const isAdminVerified = await authStore.verifyAdminAccess();
```

## Implementation Details

### Authentication Store (`stores/auth.ts`)

The auth store provides:

- Secure token management
- Role and permission checking
- Server-side verification methods
- No direct admin manipulation

### Middleware Protection

#### Admin Middleware (`middleware/admin.ts`)

- Protects all `/admin/*` routes
- Performs server-side admin verification
- Logs unauthorized access attempts
- Redirects non-admin users

#### Auth Middleware (`middleware/auth.ts`)

- Protects authenticated routes
- Validates JWT tokens
- Refreshes user data periodically

### Route Structure

```
pages/
├── admin/                    # Admin-only routes (protected by admin middleware)
│   ├── arbeitszeiten.vue    # Admin work time management
│   └── urlaub.vue           # Admin vacation management
├── arbeitszeiten.vue        # Employee work time tracking
├── login.vue                # Public login page
└── index.vue                # Dashboard (role-based content)
```

## Backend Security Requirements

### 1. **Secure User Creation**

```typescript
// ❌ WRONG: Allow arbitrary role assignment
app.post("/api/users", (req, res) => {
  const user = createUser({
    ...req.body,
    roles: req.body.roles, // Security vulnerability!
  });
});

// ✅ CORRECT: Admin-only role assignment
app.post("/api/users", requireAdmin, (req, res) => {
  const user = createUser({
    email: req.body.email,
    fullName: req.body.fullName,
    roles: ["employee"], // Default role only
  });
});
```

### 2. **Role Management Endpoints**

Only super-admins should be able to assign admin roles:

```typescript
// Promote user to admin (super-admin only)
app.patch("/api/users/:id/promote", requireSuperAdmin, (req, res) => {
  // Add admin role to user
});

// Admin verification endpoint
app.get("/api/auth/verify-admin", requireAuth, (req, res) => {
  const isAdmin = req.user.roles.includes("admin");
  res.json({ isAdmin });
});
```

### 3. **JWT Token Security**

```typescript
// Include roles in JWT payload
const token = jwt.sign(
  {
    userId: user.id,
    email: user.email,
    roles: user.roles,
    permissions: user.permissions,
  },
  JWT_SECRET,
  { expiresIn: "1h" }
);
```

### 4. **Permission-Based Access**

```typescript
// Check specific permissions rather than just admin role
app.get(
  "/api/admin/work-entries",
  requirePermission("read:all_timesheets"),
  (req, res) => {
    // Return all work entries
  }
);

app.patch(
  "/api/admin/work-entries/:id/approve",
  requirePermission("approve:timesheets"),
  (req, res) => {
    // Approve timesheet entry
  }
);
```

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### User Roles Table

```sql
CREATE TABLE user_roles (
  user_id UUID REFERENCES users(id),
  role_name VARCHAR(50) NOT NULL,
  granted_by UUID REFERENCES users(id),
  granted_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, role_name)
);
```

### Roles and Permissions Tables

```sql
CREATE TABLE roles (
  name VARCHAR(50) PRIMARY KEY,
  description TEXT
);

CREATE TABLE role_permissions (
  role_name VARCHAR(50) REFERENCES roles(name),
  permission VARCHAR(100) NOT NULL,
  PRIMARY KEY (role_name, permission)
);
```

## Security Best Practices

### 1. **Initial Admin Setup**

- Create initial admin through secure setup process
- Use environment variables or separate setup script
- Never allow self-promotion to admin

### 2. **Audit Logging**

Log all admin actions:

```typescript
// Log admin actions
app.use("/api/admin/*", (req, res, next) => {
  auditLog.info({
    user: req.user.email,
    action: `${req.method} ${req.path}`,
    timestamp: new Date().toISOString(),
    ip: req.ip,
  });
  next();
});
```

### 3. **Rate Limiting**

Implement rate limiting on sensitive endpoints:

```typescript
app.use(
  "/api/auth/verify-admin",
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs
  })
);
```

### 4. **Regular Security Reviews**

- Review admin user list quarterly
- Audit role assignments
- Monitor for suspicious activity
- Rotate JWT secrets regularly

## Common Vulnerabilities to Avoid

### 1. **Client-Side Role Manipulation**

```typescript
// ❌ NEVER do this
const makeAdmin = () => {
  user.admin = true; // Can be manipulated by user
};
```

### 2. **Predictable Admin Endpoints**

```typescript
// ❌ Avoid simple patterns
PATCH /api/users/me { "admin": true }

// ✅ Use dedicated, protected endpoints
POST /api/admin/users/:id/assign-role { "role": "admin" }
```

### 3. **Insufficient Verification**

```typescript
// ❌ Trust client-side claims
if (req.headers["x-user-admin"] === "true") {
  // Grant admin access
}

// ✅ Verify server-side
const user = await getUserFromToken(req.headers.authorization);
if (user.roles.includes("admin")) {
  // Grant admin access
}
```

## Monitoring and Alerting

Set up alerts for:

- Failed admin verification attempts
- Unusual admin activity patterns
- New admin role assignments
- Multiple failed login attempts on admin accounts

## Conclusion

This security architecture ensures that:

1. Admin status cannot be manipulated client-side
2. All admin actions are verified server-side
3. Role assignments are auditable and controlled
4. The principle of least privilege is maintained

Remember: **Security is a process, not a product**. Regular reviews and updates are essential.
