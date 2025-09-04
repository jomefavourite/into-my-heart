# Admin Role System Setup

This document explains how to set up and use the admin role system in your Clerk + Convex application.

## Overview

The admin system allows you to:
- Designate one or more users as admins
- Control access to admin-only features
- Manage user roles through the admin panel
- Protect sensitive operations with role-based access control

## Initial Setup

### 1. Set Up the First Admin

After a user has registered and been created in your database, you can promote them to admin using one of these methods:

#### Method A: Using Convex Dashboard
1. Go to your Convex dashboard
2. Navigate to the Functions tab
3. Find `users:setupFirstAdmin` in the functions list
4. Run the function with the user's email:
   ```javascript
   {
     "adminEmail": "your-admin@example.com"
   }
   ```

#### Method B: Using Convex CLI
```bash
npx convex run users:setupFirstAdmin --adminEmail "your-admin@example.com"
```

#### Method C: Using Clerk ID
If you know the user's Clerk ID:
```bash
npx convex run users:setupAdminByClerkId --clerkId "user_xxxxx"
```

### 2. Verify Admin Setup

You can verify the admin setup by checking if the user's role is set to 'admin' in your database.

## Using the Admin System

### 1. Admin Panel Component

The `AdminPanel` component provides a UI for managing users:

```tsx
import { AdminPanel } from '../components/AdminPanel';

// Use in your admin page
export default function AdminPage() {
  return <AdminPanel />;
}
```

### 2. Role-Based Access Control

Use the provided hooks and components for role-based access:

```tsx
import { useIsAdmin, useUserRole, AdminOnly, withAdminAccess } from '../lib/admin-utils';

// Check if current user is admin
function MyComponent() {
  const isAdmin = useIsAdmin();
  const userRole = useUserRole();
  
  return (
    <div>
      {isAdmin && <AdminContent />}
      <p>Your role: {userRole}</p>
    </div>
  );
}

// Protect entire components
const AdminOnlyComponent = withAdminAccess(MyAdminComponent);

// Protect parts of components
function MyPage() {
  return (
    <div>
      <PublicContent />
      <AdminOnly>
        <AdminOnlyContent />
      </AdminOnly>
    </div>
  );
}
```

### 3. Available Functions

#### Queries
- `isCurrentUserAdmin()` - Check if current user is admin
- `getCurrentUserRole()` - Get current user's role
- `getAllUsers()` - Get all users (admin only)

#### Mutations
- `promoteToAdmin(userId)` - Promote user to admin
- `demoteFromAdmin(userId)` - Demote admin to user
- `setUserRole(userId, role)` - Set user role to 'admin' or 'user'

## Security Features

1. **Self-Protection**: Admins cannot demote themselves
2. **Role Validation**: All admin functions check for admin privileges
3. **Default Roles**: New users are automatically assigned 'user' role
4. **Access Control**: Admin-only functions throw errors for non-admin users

## Example Usage in Your App

### 1. Add Admin Route
```tsx
// app/admin/_layout.tsx
import { withAdminAccess } from '../../lib/admin-utils';
import { AdminPanel } from '../../components/AdminPanel';

export default withAdminAccess(function AdminLayout() {
  return <AdminPanel />;
});
```

### 2. Protect API Routes
```tsx
// In your Convex functions
export const adminOnlyFunction = mutation({
  args: { /* your args */ },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUserOrThrow(ctx);
    if (currentUser.role !== 'admin') {
      throw new Error('Admin access required');
    }
    
    // Your admin logic here
  },
});
```

### 3. Conditional UI Elements
```tsx
function Navigation() {
  const isAdmin = useIsAdmin();
  
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/profile">Profile</Link>
      {isAdmin && <Link href="/admin">Admin Panel</Link>}
    </nav>
  );
}
```

## Troubleshooting

### User Not Found Error
- Ensure the user has completed registration and exists in your database
- Check that the email address is correct and matches exactly
- Verify the user was created through the Clerk webhook

### Permission Denied Error
- Make sure you're running the setup function as an internal mutation
- Check that the user you're trying to promote exists
- Verify there are no existing admins if using the setup script

### Admin Panel Not Loading
- Ensure you're using the `AdminOnly` wrapper or `withAdminAccess` HOC
- Check that the current user has admin privileges
- Verify the Convex queries are working correctly

## Best Practices

1. **Limit Admin Access**: Only promote trusted users to admin
2. **Regular Audits**: Periodically review who has admin access
3. **Secure Setup**: Use the setup script in a secure environment
4. **Error Handling**: Always handle permission errors gracefully in your UI
5. **Logging**: Consider adding logging for admin actions

## Next Steps

1. Set up your first admin using one of the methods above
2. Add the admin panel to your app navigation
3. Implement role-based access control in your existing functions
4. Test the system with different user roles
5. Consider adding audit logging for admin actions
