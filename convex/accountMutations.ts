import { v } from 'convex/values';
import { internalMutation } from './_generated/server';

export const deleteCurrentUserDataBatch = internalMutation({
  args: {
    clerkId: v.string(),
    batchSize: v.number(),
  },
  handler: async (ctx, { clerkId, batchSize }) => {
    const user = await ctx.db
      .query('users')
      .withIndex('byClerkId', q => q.eq('clerkId', clerkId))
      .unique();

    if (!user) {
      return { hasMore: false };
    }

    const deleteBatch = async <
      TableName extends
        | 'userVerseSuggestions'
        | 'verseNotes'
        | 'practiceSessions'
        | 'verseProgress'
        | 'collections'
        | 'affirmations'
        | 'verses',
    >(
      table: TableName
    ) => {
      const records = await (ctx.db
        .query(table)
        .withIndex('byUserId', (q: any) => q.eq('userId', user._id))
        .take(batchSize) as Promise<Array<{ _id: any }>>);

      for (const record of records) {
        await ctx.db.delete(record._id);
      }

      return records.length === batchSize;
    };

    const hasMoreFromUserSuggestions = await deleteBatch('userVerseSuggestions');
    const hasMoreFromNotes = await deleteBatch('verseNotes');
    const hasMoreFromPracticeSessions = await deleteBatch('practiceSessions');
    const hasMoreFromVerseProgress = await deleteBatch('verseProgress');
    const hasMoreFromCollections = await deleteBatch('collections');
    const hasMoreFromAffirmations = await deleteBatch('affirmations');
    const hasMoreFromVerses = await deleteBatch('verses');

    const hasMore =
      hasMoreFromUserSuggestions ||
      hasMoreFromNotes ||
      hasMoreFromPracticeSessions ||
      hasMoreFromVerseProgress ||
      hasMoreFromCollections ||
      hasMoreFromAffirmations ||
      hasMoreFromVerses;

    if (hasMore) {
      return { hasMore: true };
    }

    await ctx.db.delete(user._id);
    return { hasMore: false };
  },
});
