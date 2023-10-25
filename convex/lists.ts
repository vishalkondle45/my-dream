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

// export const remove = mutation({
//   args: { _id: v.id("lists") },
//   handler: async (ctx, args) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) {
//       return null;
//     }
//     const userId = identity.subject;

//     const existingTodo = await ctx.db.get(args._id);
//     if (!existingTodo) {
//       throw new Error("Not found");
//     }

//     if (existingTodo.userId !== userId) {
//       throw new Error("Unauthorized");
//     }

//     const todo = await ctx.db.delete(args._id);
//     return todo;
//   },
// });

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
      .order("desc")
      .collect();
    return lists;
  },
});
