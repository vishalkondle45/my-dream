import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    date: v.string(),
    time: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const event = await ctx.db.insert("events", {
      user: identity.subject,
      title: args.title,
      description: args.description,
      date: args.date,
      time: args.time,
    });
    return event;
  },
});

export const getAll = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const events = await ctx.db
      .query("events")
      ?.filter((q) => q.eq(q.field("user"), identity.subject))
      .collect();
    return events;
  },
});

export const getEventsWithDate = query({
  args: {
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const events = await ctx.db
      .query("events")
      ?.filter((q) =>
        q.and(
          q.eq(q.field("user"), identity.subject),
          q.eq(q.field("date"), args.date)
        )
      )
      .collect();
    return events;
  },
});

export const update = mutation({
  args: {
    _id: v.id("events"),
    title: v.string(),
    description: v.optional(v.string()),
    date: v.string(),
    time: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const event = await ctx.db.patch(args._id, {
      title: args.title,
      description: args.description,
      date: args.date,
      time: args.time,
    });
    return event;
  },
});
