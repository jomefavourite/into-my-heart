// import { v } from 'convex/values';
import {
  // internalMutation,
  mutation,
  // query,
  // QueryCtx,
} from './_generated/server';

// export const getUserByClerkId = query({
//   args: {
//     clerkId: v.optional(v.string()),
//   },
//   handler: async (ctx, { clerkId }) => {
//     const user = await ctx.db
//       .query('users')
//       .filter(q => q.eq(q.field('clerkId'), clerkId))
//       .unique();

//     return user;
//   },
// });

// export const createUser = internalMutation({
//   args: {
//     clerkId: v.string(),
//     email: v.string(),
//     first_name: v.optional(v.string()),
//     last_name: v.optional(v.string()),
//     imageUrl: v.optional(v.string()),
//   },
//   handler: async (ctx, args) => {
//     const userId = await ctx.db.insert('users', {
//       ...args,
//       role: 'user', // Default role for new users
//     });
//     return userId;
//   },
// });

// export const updateUser = mutation({
//   args: {
//     _id: v.id('users'),
//     first_name: v.optional(v.string()),
//     last_name: v.optional(v.string()),
//     imageUrl: v.optional(v.string()),
//     pushToken: v.optional(v.string()),
//   },
//   handler: async (ctx, args) => {
//     await getCurrentUserOrThrow(ctx);

//     const { _id, ...rest } = args;
//     return await ctx.db.patch(_id, rest);
//   },
// });

// export async function getCurrentUserOrThrow(ctx: QueryCtx) {
//   const userRecord = await getCurrentUser(ctx);
//   if (!userRecord) throw new Error("Can't get current user");
//   return userRecord;
// }

// export async function getCurrentUser(ctx: QueryCtx) {
//   try {
//     const identity = await ctx.auth.getUserIdentity();
//     if (identity === null) {
//       console.error('getCurrentUser: No user identity found');
//       throw new Error('Authentication required. Please sign in.');
//     }

//     // console.log(
//     //   'getCurrentUser: Identity found for subject:',
//     //   identity.subject
//     // );
//     const user = await userByExternalId(ctx, identity.subject);

//     if (!user) {
//       console.error(
//         'getCurrentUser: User not found in database for subject:',
//         identity.subject
//       );
//       throw new Error('User account not found. Please contact support.');
//     }

//     return user;
//   } catch (error) {
//     console.error('getCurrentUser error:', error);
//     // Re-throw with more specific error message
//     if (error instanceof Error) {
//       if (error.message.includes('Authentication required')) {
//         throw error; // Don't wrap again
//       }
//       if (error.message.includes('User account not found')) {
//         throw error; // Don't wrap again
//       }
//       // For any other errors, provide a generic auth error
//       throw new Error('Authentication required. Please sign in.');
//     }
//     throw new Error('Authentication required. Please sign in.');
//   }
// }

// async function userByExternalId(ctx: QueryCtx, externalId: string) {
//   return await ctx.db
//     .query('users')
//     .withIndex('byClerkId', q => q.eq('clerkId', externalId))
//     .unique();
// }

// -------------------------------------------------

import { internalMutation, query, QueryCtx } from './_generated/server';
import { UserJSON } from '@clerk/backend';
import { v, Validator } from 'convex/values';

export const current = query({
  args: {},
  handler: async ctx => {
    return await getCurrentUser(ctx);
  },
});

export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> }, // no runtime validation, trust Clerk
  async handler(ctx, { data }) {
    const userAttributes = {
      first_name: data.first_name ? (data.first_name as string) : undefined,
      last_name: data.last_name ? (data.last_name as string) : undefined,
      email: data.email_addresses[0].email_address,
      clerkId: data.id,
      imageUrl: data.image_url,
    };

    const user = await userByExternalId(ctx, data.id);
    if (user === null) {
      await ctx.db.insert('users', userAttributes);
    } else {
      await ctx.db.patch(user._id, userAttributes);
    }
  },
});

export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await userByExternalId(ctx, clerkUserId);

    if (user !== null) {
      await ctx.db.delete(user._id);
    } else {
      console.warn(
        `Can't delete user, there is none for Clerk user ID: ${clerkUserId}`
      );
    }
  },
});

export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const userRecord = await getCurrentUser(ctx);
  if (!userRecord) throw new Error("Can't get current user");
  return userRecord;
}

export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    return null;
  }
  return await userByExternalId(ctx, identity.subject);
}

async function userByExternalId(ctx: QueryCtx, externalId: string) {
  return await ctx.db
    .query('users')
    .withIndex('byClerkId', q => q.eq('clerkId', externalId))
    .unique();
}

// Admin management functions
export const getAllUsers = query({
  args: {},
  handler: async ctx => {
    const currentUser = await getCurrentUserOrThrow(ctx);
    if (currentUser.role !== 'admin') {
      throw new Error('Unauthorized - Admin access required');
    }

    return await ctx.db.query('users').collect();
  },
});

export const promoteToAdmin = mutation({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, { userId }) => {
    const currentUser = await getCurrentUserOrThrow(ctx);
    if (currentUser.role !== 'admin') {
      throw new Error('Unauthorized - Admin access required');
    }

    await ctx.db.patch(userId, { role: 'admin' });
    return { success: true };
  },
});

export const demoteFromAdmin = mutation({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, { userId }) => {
    const currentUser = await getCurrentUserOrThrow(ctx);
    if (currentUser.role !== 'admin') {
      throw new Error('Unauthorized - Admin access required');
    }

    // Prevent demoting yourself
    if (currentUser._id === userId) {
      throw new Error('Cannot demote yourself from admin');
    }

    await ctx.db.patch(userId, { role: 'user' });
    return { success: true };
  },
});

export const setUserRole = mutation({
  args: {
    userId: v.id('users'),
    role: v.union(v.literal('admin'), v.literal('user')),
  },
  handler: async (ctx, { userId, role }) => {
    const currentUser = await getCurrentUserOrThrow(ctx);
    if (currentUser.role !== 'admin') {
      throw new Error('Unauthorized - Admin access required');
    }

    // Prevent changing your own role
    if (currentUser._id === userId && role === 'user') {
      throw new Error('Cannot demote yourself from admin');
    }

    await ctx.db.patch(userId, { role });
    return { success: true };
  },
});

// Helper function to check if current user is admin
export const isCurrentUserAdmin = query({
  args: {},
  handler: async ctx => {
    try {
      const currentUser = await getCurrentUser(ctx);
      return currentUser?.role === 'admin';
    } catch {
      return false;
    }
  },
});

// Helper function to get current user's role
export const getCurrentUserRole = query({
  args: {},
  handler: async ctx => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        return 'user';
      }

      const currentUser = await getCurrentUser(ctx);
      return currentUser?.role || 'user';
    } catch (error) {
      // console.log(
      //   'getCurrentUserRole: User not authenticated or not found, returning default role'
      // );
      return 'user';
    }
  },
});

// Admin setup functions - accessible from Convex dashboard
export const setupFirstAdmin = mutation({
  args: {
    adminEmail: v.string(),
  },
  handler: async (ctx, { adminEmail }) => {
    // Find user by email
    const user = await ctx.db
      .query('users')
      .filter(q => q.eq(q.field('email'), adminEmail))
      .unique();

    if (!user) {
      throw new Error(`User with email ${adminEmail} not found`);
    }

    // Check if there are already any admins
    const existingAdmins = await ctx.db
      .query('users')
      .filter(q => q.eq(q.field('role'), 'admin'))
      .collect();

    if (existingAdmins.length > 0) {
      console.log(
        'Admin users already exist. Use the admin panel to manage roles.'
      );
      return {
        message: 'Admin users already exist',
        adminCount: existingAdmins.length,
      };
    }

    // Promote the user to admin
    await ctx.db.patch(user._id, { role: 'admin' });

    console.log(`Successfully promoted ${adminEmail} to admin`);
    return {
      success: true,
      message: `User ${adminEmail} has been promoted to admin`,
      userId: user._id,
    };
  },
});

// Alternative: Promote by Clerk ID
export const setupAdminByClerkId = mutation({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, { clerkId }) => {
    // Find user by Clerk ID
    const user = await ctx.db
      .query('users')
      .withIndex('byClerkId', q => q.eq('clerkId', clerkId))
      .unique();

    if (!user) {
      throw new Error(`User with Clerk ID ${clerkId} not found`);
    }

    // Check if there are already any admins
    const existingAdmins = await ctx.db
      .query('users')
      .filter(q => q.eq(q.field('role'), 'admin'))
      .collect();

    if (existingAdmins.length > 0) {
      console.log(
        'Admin users already exist. Use the admin panel to manage roles.'
      );
      return {
        message: 'Admin users already exist',
        adminCount: existingAdmins.length,
      };
    }

    // Promote the user to admin
    await ctx.db.patch(user._id, { role: 'admin' });

    console.log(`Successfully promoted user ${user.email} to admin`);
    return {
      success: true,
      message: `User ${user.email} has been promoted to admin`,
      userId: user._id,
    };
  },
});
