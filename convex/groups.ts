import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    name: v.string(),
    type: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const group = await ctx.db.insert("groups", {
      name: args?.name,
      type: args?.type,
      userId: userId,
    });
    return { group, userId };
  },
});

export const get = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const userId = identity.subject;

    const groups = await ctx.db
      .query("groups")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
    return groups;
  },
});

export const getGroup = query({
  args: {
    group: v.id("groups"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const group = await ctx.db.get(args.group);
    return group;
  },
});

export const removeUserFromGroup = mutation({
  args: {
    user: v.id("groupUsers"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const groupUser = await ctx.db.delete(args.user);
    return groupUser;
  },
});

export const deleteGroup = mutation({
  args: {
    group: v.id("groups"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const groupUsers = await ctx.db
      .query("groupUsers")
      .filter((q) => q.eq(q.field("group"), args.group))
      .collect();

    groupUsers.map(async (user) => {
      await ctx.db.delete(user._id);
    });

    const group = await ctx.db.delete(args.group);
    return group;
  },
});

export const changeGroupType = mutation({
  args: {
    group: v.id("groups"),
    type: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const group = await ctx.db.patch(args.group, {
      type: args.type.trim().toLowerCase(),
    });
    return group;
  },
});

export const updateGroupName = mutation({
  args: {
    group: v.id("groups"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const group = await ctx.db.patch(args?.group, { name: args?.name });
    return group;
  },
});
