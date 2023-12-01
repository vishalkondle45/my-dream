import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    title: v.string(),
    message: v.string(),
    receiver: v.string(),
    readedOn: v.optional(v.boolean()),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const notification = await ctx.db.insert("notifications", {
      title: args.title,
      message: args.message,
      sender: identity.subject,
      receiver: args.receiver,
      date: args.date,
    });
    return notification;
  },
});

export const get = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const notifications = await ctx.db
      .query("notifications")
      .filter((q) => q.eq(q.field("receiver"), identity.subject))
      .order("desc")
      .collect();
    return notifications;
  },
});

export const readOne = mutation({
  args: {
    _id: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const notifications = await ctx.db
      .query("notifications")
      .filter((q) => q.eq(q.field("receiver"), identity.subject))
      .order("desc")
      .collect();
    await ctx.db.delete(args._id);
    return notifications;
  },
});

export const readAll = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const notifications = await ctx.db
      .query("notifications")
      .filter((q) => q.eq(q.field("receiver"), identity.subject))
      .order("desc")
      .collect();
    notifications.map(async (child) => {
      await ctx.db.delete(child._id);
    });
    return notifications;
  },
});
