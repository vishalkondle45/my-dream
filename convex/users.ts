import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("subject", identity.subject))
      .unique();
    if (user !== null) {
      if (user?.name !== identity.name || user?.email !== identity.email) {
        await ctx.db.patch(user?._id, {
          name: identity.name,
          email: identity.email,
        });
      }
      return user?._id;
    }
    return await ctx.db.insert("users", {
      name: identity.name!,
      subject: identity.subject!,
      email: identity.email!,
    });
  },
});

export const getUserByEmail = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }
    const user = await ctx.db
      .query("users")
      ?.filter((q) => q.eq(q.field("email"), args.email))
      .collect();
    return user[0];
  },
});

export const getCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }
    const user = await ctx.db
      .query("users")
      ?.filter((q) => q.eq(q.field("email"), identity.email))
      .collect();
    return user[0];
  },
});
