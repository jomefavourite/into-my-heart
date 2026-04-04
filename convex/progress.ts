import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getCurrentUserOrThrow } from './users';

const practiceMethodValidator = v.union(
  v.literal('flashcards'),
  v.literal('fillInBlanks'),
  v.literal('recitation')
);

const practiceTypeValidator = v.union(
  v.literal('verses'),
  v.literal('collections')
);

export const getPracticeSummary = query({
  args: {},
  handler: async ctx => {
    const user = await getCurrentUserOrThrow(ctx);

    const [practiceSessions, verseProgress] = await Promise.all([
      ctx.db
        .query('practiceSessions')
        .withIndex('byUserId', q => q.eq('userId', user._id))
        .collect(),
      ctx.db
        .query('verseProgress')
        .withIndex('byUserId', q => q.eq('userId', user._id))
        .collect(),
    ]);

    const sortedSessions = [...practiceSessions].sort(
      (left, right) => right.completedAt - left.completedAt
    );
    const lastSession = sortedSessions[0] ?? null;

    return {
      completedPracticeSessions: practiceSessions.length,
      trackedVerses: verseProgress.length,
      lastSession: lastSession
        ? {
            method: lastSession.method,
            practiceType: lastSession.practiceType,
            verseCount: lastSession.verseCount,
            completedAt: lastSession.completedAt,
          }
        : null,
    };
  },
});

export const recordPracticeSession = mutation({
  args: {
    method: practiceMethodValidator,
    practiceType: practiceTypeValidator,
    verseKeys: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const now = Date.now();

    const syncId = `practice-session-${now}-${args.method}-${args.verseKeys.join('_')}`;

    await ctx.db.insert('practiceSessions', {
      userId: user._id,
      syncId,
      method: args.method,
      practiceType: args.practiceType,
      verseKeys: args.verseKeys,
      verseCount: args.verseKeys.length,
      completedAt: now,
      updatedAt: now,
    });

    for (const verseKey of args.verseKeys) {
      const existing = await ctx.db
        .query('verseProgress')
        .withIndex('byUserIdVerseKey', q =>
          q.eq('userId', user._id).eq('verseKey', verseKey)
        )
        .unique();

      const patch = {
        totalCompletionCount: (existing?.totalCompletionCount ?? 0) + 1,
        flashcardsCount:
          (existing?.flashcardsCount ?? 0) +
          (args.method === 'flashcards' ? 1 : 0),
        fillInBlanksCount:
          (existing?.fillInBlanksCount ?? 0) +
          (args.method === 'fillInBlanks' ? 1 : 0),
        recitationCount:
          (existing?.recitationCount ?? 0) +
          (args.method === 'recitation' ? 1 : 0),
        lastPracticedAt: now,
        updatedAt: now,
      };

      if (existing) {
        await ctx.db.patch(existing._id, patch);
        continue;
      }

      await ctx.db.insert('verseProgress', {
        userId: user._id,
        syncId: `verse-progress-${verseKey}`,
        verseKey,
        ...patch,
      });
    }

    return { success: true, syncId };
  },
});
