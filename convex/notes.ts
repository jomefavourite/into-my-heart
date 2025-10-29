import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getCurrentUserOrThrow } from './users';
import { Id } from './_generated/dataModel';

// Get note for a verse
export const getNoteByVerseId = query({
  args: { verseId: v.id('verses') },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    const note = await ctx.db
      .query('verseNotes')
      .withIndex('byVerseId', q => q.eq('verseId', args.verseId))
      .filter(q => q.eq(q.field('userId'), user._id))
      .first();

    return note;
  },
});

// Create or update note
export const upsertNote = mutation({
  args: {
    verseId: v.id('verses'),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    // Check if note already exists
    const existingNote = await ctx.db
      .query('verseNotes')
      .withIndex('byVerseId', q => q.eq('verseId', args.verseId))
      .filter(q => q.eq(q.field('userId'), user._id))
      .first();

    const now = Date.now();

    if (existingNote) {
      // Update existing note
      await ctx.db.patch(existingNote._id, {
        content: args.content,
        updatedAt: now,
      });
      return existingNote._id;
    } else {
      // Create new note
      const noteId = await ctx.db.insert('verseNotes', {
        userId: user._id,
        verseId: args.verseId,
        content: args.content,
        updatedAt: now,
      });
      return noteId;
    }
  },
});

// Delete note
export const deleteNote = mutation({
  args: { noteId: v.id('verseNotes') },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    const note = await ctx.db.get(args.noteId);
    if (!note || note.userId !== user._id) {
      throw new Error('Note not found or unauthorized');
    }

    await ctx.db.delete(args.noteId);
  },
});
