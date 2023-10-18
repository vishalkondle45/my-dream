import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

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
      isArchived: false,
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
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();
    return notes;
  },
});

export const archive = mutation({
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
      isArchived: true,
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
      .filter((q) => q.eq(q.field("isArchived"), true))
      .order("desc")
      .collect();
    return notes;
  },
});

export const changeColor = mutation({
  args: { _id: v.id("notes"), color: v.string() },
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
      color: args.color,
    });
    return note;
  },
});
