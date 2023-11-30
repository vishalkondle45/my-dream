import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import dayjs from "dayjs";

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
    const userId = identity.subject;
    const notifications = await ctx.db
      .query("notifications")
      // ?.filter((q) => q.eq(q.field("receiver"), userId))
      .filter((q) => q.eq(q.field("readedOn"), undefined))
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
      // ?.filter((q) => q.eq(q.field("receiver"), userId))
      .order("desc")
      .collect();

    await ctx.db.patch(args._id, {
      readedOn: dayjs().format("MM-DD-YYYY HH:MM"),
    });

    return notifications;
  },
});

export const readAll = mutation({
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const notifications = await ctx.db
      .query("notifications")
      // ?.filter((q) => q.eq(q.field("receiver"), userId))
      .order("desc")
      .collect();

    notifications.map(async (child) => {
      console.log(child);
      await ctx.db.patch(child._id, {
        readedOn: dayjs().format("MM-DD-YYYY HH:MM"),
      });
    });

    return notifications;
  },
});
