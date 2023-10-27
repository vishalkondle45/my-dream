import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    title: v.string(),
    access: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const document = await ctx.db.insert("lists", {
      title: args?.title,
      access: args?.access || [],
      userId,
    });
    return document;
  },
});

export const remove = mutation({
  args: { _id: v.id("lists") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const userId = identity.subject;

    const existingTodo = await ctx.db.get(args._id);
    if (!existingTodo) {
      throw new Error("Not found");
    }

    if (existingTodo.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const todos = await ctx.db
      .query("todos")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("list"), args._id))
      .order("desc")
      .collect();

    todos.forEach(async (item) => {
      await ctx.db.delete(item._id);
    });

    await ctx.db.delete(args._id);

    const lists = await ctx.db
      .query("lists")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    return lists[0]?._id;
  },
});

export const update = mutation({
  args: {
    _id: v.id("lists"),
    access: v.optional(v.array(v.string())),
    title: v.optional(v.string()),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const userId = identity.subject;

    const existingList = await ctx.db.get(args._id);
    if (!existingList) {
      throw new Error("Not found");
    }

    if (existingList.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const todo = await ctx.db.patch(args._id, {
      title: args?.title !== undefined ? args?.title : existingList.title,
      access: args?.access !== undefined ? args?.access : existingList.access,
      color:
        args?.color !== undefined
          ? args?.color === existingList.color
            ? ""
            : args?.color
          : existingList.color,
    });
    return todo;
  },
});

export const get = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const userId = identity.subject;

    const lists = await ctx.db
      .query("lists")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      // .order("desc")
      .collect();
    return lists;
  },
});
