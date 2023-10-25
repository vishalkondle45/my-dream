import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    todo: v.string(),
    title: v.optional(v.string()),
    completedOn: v.optional(v.string()),
    isAddedToMyDay: v.optional(v.boolean()),
    isImportant: v.optional(v.boolean()),
    date: v.optional(v.string()),
    notes: v.optional(v.string()),
    category: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const document = await ctx.db.insert("todos", {
      todo: args?.todo,
      title: args?.title || "",
      completedOn: "",
      isAddedToMyDay: args?.isAddedToMyDay || false,
      isImportant: args?.isImportant || false,
      date: args?.date,
      notes: args?.notes || "",
      category: args?.category || [],
      userId,
    });
    return document;
  },
});

export const update = mutation({
  args: {
    _id: v.id("todos"),
    todo: v.optional(v.string()),
    title: v.optional(v.string()),
    completedOn: v.optional(v.string()),
    isAddedToMyDay: v.optional(v.boolean()),
    isImportant: v.optional(v.boolean()),
    date: v.optional(v.string()),
    notes: v.optional(v.string()),
    category: v.optional(v.array(v.string())),
  },
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

    const todo = await ctx.db.patch(args._id, {
      todo: args?.todo !== undefined ? args?.todo : existingTodo.todo,
      title: args?.title !== undefined ? args?.title : existingTodo.title,
      completedOn:
        args?.completedOn !== undefined
          ? args?.completedOn
          : existingTodo.completedOn,
      isAddedToMyDay:
        args?.isAddedToMyDay !== undefined
          ? args?.isAddedToMyDay
          : existingTodo.isAddedToMyDay,
      isImportant:
        args?.isImportant !== undefined
          ? args?.isImportant
          : existingTodo.isImportant,
      date: args?.date !== undefined ? args?.date : existingTodo.date,
      notes: args?.notes !== undefined ? args?.notes : existingTodo.notes,
      category:
        args?.category !== undefined ? args?.category : existingTodo.category,
    });
    return todo;
  },
});

export const remove = mutation({
  args: { _id: v.id("todos") },
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

    const todo = await ctx.db.delete(args._id);
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

    const todos = await ctx.db
      .query("todos")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      // .filter((q) => q.eq(q.field("isTrashed"), false))
      .order("desc")
      .collect();
    return todos;
  },
});

export const move = mutation({
  args: {
    _id: v.id("todos"),
    list: v.id("lists"),
  },
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

    const todo = await ctx.db.patch(args._id, {
      title: args.list,
    });
    return todo;
  },
});

export const copy = mutation({
  args: {
    _id: v.id("todos"),
    list: v.id("lists"),
  },
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

    const {
      todo,
      title,
      completedOn,
      isAddedToMyDay,
      isImportant,
      date,
      notes,
      category,
    } = existingTodo;

    const document = await ctx.db.insert("todos", {
      todo,
      title,
      completedOn,
      isAddedToMyDay,
      isImportant,
      date,
      notes,
      category,
      userId,
    });
    return document;
  },
});
