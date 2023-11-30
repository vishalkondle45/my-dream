import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    title: v.optional(v.string()),
    color: v.optional(v.string()),
    category: v.optional(v.string()),
    note: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const document = await ctx.db.insert("notes", {
      title: args.title,
      note: args.note,
      color: args.color,
      isTrashed: false,
      isPinned: false,
      userId,
    });
    return document;
  },
});

export const get = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const userId = identity.subject;

    const notes = await ctx.db
      .query("notes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      ?.filter((q) => q.eq(q.field("isTrashed"), false))
      .order("desc")
      .collect();
    return notes;
  },
});

export const trash = mutation({
  args: { _id: v.id("notes") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const userId = identity.subject;

    const existingNote = await ctx.db.get(args._id);
    if (!existingNote) {
      throw new Error("Not found");
    }

    if (existingNote.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const note = await ctx.db.patch(args._id, {
      isTrashed: true,
    });
    return note;
  },
});

export const getTrash = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const userId = identity.subject;
    const notes = await ctx.db
      .query("notes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      ?.filter((q) => q.eq(q.field("isTrashed"), true))
      .order("desc")
      .collect();
    return notes;
  },
});

export const restore = mutation({
  args: { _id: v.id("notes") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const userId = identity.subject;

    const existingNote = await ctx.db.get(args._id);
    if (!existingNote) {
      throw new Error("Not found");
    }

    if (existingNote.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const note = await ctx.db.patch(args._id, {
      isTrashed: false,
    });
    return note;
  },
});

export const remove = mutation({
  args: { _id: v.id("notes") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const userId = identity.subject;

    const existingNote = await ctx.db.get(args._id);
    if (!existingNote) {
      throw new Error("Not found");
    }

    if (existingNote.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const note = await ctx.db.delete(args._id);
    return note;
  },
});

export const empty = mutation({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const userId = identity.subject;

    const notes = await ctx.db
      .query("notes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      ?.filter((q) => q.eq(q.field("isTrashed"), true))
      .order("desc")
      .collect();

    for (const child of notes) {
      await ctx.db.delete(child._id);
    }

    return notes;
  },
});

export const pin = mutation({
  args: { _id: v.id("notes") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const userId = identity.subject;

    const existingNote = await ctx.db.get(args._id);
    if (!existingNote) {
      throw new Error("Not found");
    }

    if (existingNote.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const note = await ctx.db.patch(args._id, {
      isPinned: true,
    });
    return note;
  },
});

export const unpin = mutation({
  args: { _id: v.id("notes") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const userId = identity.subject;

    const existingNote = await ctx.db.get(args._id);
    if (!existingNote) {
      throw new Error("Not found");
    }

    if (existingNote.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const note = await ctx.db.patch(args._id, {
      isPinned: false,
    });
    return note;
  },
});

export const update = mutation({
  args: {
    _id: v.id("notes"),
    title: v.optional(v.string()),
    note: v.optional(v.string()),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const userId = identity.subject;

    const existingNote = await ctx.db.get(args._id);
    if (!existingNote) {
      throw new Error("Not found");
    }

    if (existingNote.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const note = await ctx.db.patch(args._id, args);
    return note;
  },
});

export const colorSelected = mutation({
  args: { notes: v.array(v.id("notes")), color: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const userId = identity.subject;
    let notes: any[] = [];
    args.notes.forEach(async (element) => {
      const existingNote = await ctx.db.get(element);
      if (!existingNote) {
        throw new Error("Not found");
      }
      if (existingNote.userId !== userId) {
        throw new Error("Unauthorized");
      }
      const note = await ctx.db.patch(element, {
        color: args.color,
      });
      notes.push(note);
    });

    return notes;
  },
});

export const pinSelected = mutation({
  args: { notes: v.array(v.id("notes")) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const userId = identity.subject;
    let notes: any[] = [];
    args.notes.forEach(async (element) => {
      const existingNote = await ctx.db.get(element);
      if (!existingNote) {
        throw new Error("Not found");
      }

      if (existingNote.userId !== userId) {
        throw new Error("Unauthorized");
      }

      const note = await ctx.db.patch(element, {
        isPinned: true,
      });
      notes.push(note);
    });

    return notes;
  },
});

export const trashSelected = mutation({
  args: { notes: v.array(v.id("notes")) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const userId = identity.subject;

    let notes: any[] = [];
    args.notes.forEach(async (element) => {
      const existingNote = await ctx.db.get(element);
      if (!existingNote) {
        throw new Error("Not found");
      }

      if (existingNote.userId !== userId) {
        throw new Error("Unauthorized");
      }

      const note = await ctx.db.patch(element, {
        isTrashed: true,
      });
      notes.push(note);
    });

    return notes;
  },
});

export const restoreAll = mutation({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const userId = identity.subject;

    const notes = await ctx.db
      .query("notes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      ?.filter((q) => q.eq(q.field("isTrashed"), true))
      .order("desc")
      .collect();

    for (const child of notes) {
      await ctx.db.patch(child._id, {
        isTrashed: false,
      });
    }

    return notes;
  },
});

export const cloneSelected = mutation({
  args: {
    notes: v.array(v.id("notes")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const userId = identity.subject;

    let notes: any[] = [];
    args.notes.forEach(async (element) => {
      const existingNote = await ctx.db.get(element);
      if (!existingNote) {
        throw new Error("Not found");
      }

      if (existingNote.userId !== userId) {
        throw new Error("Unauthorized");
      }

      const note = await ctx.db.insert("notes", {
        title: existingNote.title,
        note: existingNote.note,
        color: existingNote.color,
        isTrashed: false,
        isPinned: false,
        userId,
      });
      notes.push(note);
    });
    return notes;
  },
});
