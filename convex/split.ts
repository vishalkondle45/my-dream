import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addUser = mutation({
  args: {
    user: v.string(),
    group: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const user = await ctx.db
      .query("groupUsers")
      ?.filter((q) =>
        q.and(
          q.eq(q.field("group"), args.group),
          q.eq(q.field("userId"), args.user)
        )
      )
      .collect();
    if (user?.length) {
      return { message: "User already exist in this group." };
    }
    const document = await ctx.db.insert("groupUsers", {
      userId: args.user,
      group: args?.group,
    });
    return document;
  },
});

export const getUsers = query({
  args: {
    group: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    let groupUsers = await ctx.db
      .query("groupUsers")
      ?.filter((q) => q.eq(q.field("group"), args.group))
      .order("desc")
      .collect();
    const users = await ctx.db.query("users").collect();

    groupUsers = groupUsers.map((user) => ({
      ...user,
      email: users?.find((u) => u.subject === user?.userId)?.email,
      name: users?.find((u) => u.subject === user?.userId)?.name,
      user: users?.find((u) => u.subject === user?.userId)?._id,
    }));

    return groupUsers;
  },
});
