"use node";

import { createClerkClient } from '@clerk/backend';
import { action } from './_generated/server';
import { internal } from './_generated/api';

const DELETE_BATCH_SIZE = 100;

export const deleteCurrentUserAccount = action({
  args: {},
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Authentication required');
    }

    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) {
      throw new Error('CLERK_SECRET_KEY is required to delete accounts.');
    }

    let hasMore = true;
    while (hasMore) {
      const result: { hasMore: boolean } = await ctx.runMutation(
        internal.accountMutations.deleteCurrentUserDataBatch,
        {
          clerkId: identity.subject,
          batchSize: DELETE_BATCH_SIZE,
        }
      );
      hasMore = result.hasMore;
    }

    const clerkClient = createClerkClient({ secretKey });
    await clerkClient.users.deleteUser(identity.subject);

    return { success: true };
  },
});
