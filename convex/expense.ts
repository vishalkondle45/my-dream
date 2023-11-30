import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const add = mutation({
  args: {
    description: v.string(),
    amount: v.number(),
    group: v.id("groups"),
    date: v.string(),
    paidBy: v.any(),
    splitAmong: v.any(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const expense = await ctx.db.insert("expenses", {
      description: args.description,
      date: args.date,
      amount: args?.amount,
      createdBy: identity.subject,
      updatedBy: identity.subject,
      group: args.group,
    });
    args.paidBy?.forEach(async (item: { user: string; amount: number }) => {
      await ctx.db.insert("paidBy", {
        expense: expense,
        user: item.user,
        amount: item.amount,
        group: args.group,
      });
    });
    args.splitAmong?.forEach(async (item: { user: string; amount: number }) => {
      await ctx.db.insert("splitAmong", {
        expense: expense,
        user: item.user,
        amount: item.amount,
        group: args.group,
      });
    });

    let paidBy = await ctx.db
      .query("paidBy")
      ?.filter((q) =>
        q.and(q.eq(q.field("expense"), expense), q.eq(q.field("amount"), 0))
      )
      .order("desc")
      .collect();

    paidBy?.forEach(async (item) => {
      await ctx.db.delete(item._id);
    });

    return expense;
  },
});

export const update = mutation({
  args: {
    _id: v.id("expenses"),
    description: v.string(),
    amount: v.number(),
    date: v.string(),
    paidBy: v.any(),
    splitAmong: v.any(),
    group: v.id("groups"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const expense = await ctx.db.patch(args._id, {
      description: args.description,
      amount: args?.amount,
      date: args.date,
      updatedBy: identity.subject,
    });

    let paidBy = await ctx.db
      .query("paidBy")
      ?.filter((q) => q.eq(q.field("expense"), args._id))
      .order("desc")
      .collect();

    args.paidBy?.forEach(async (item: { user: string; amount: number }) => {
      if (!paidBy?.find((user) => user.user === item.user)) {
        await ctx.db.insert("paidBy", {
          expense: args._id,
          user: item.user,
          amount: item.amount,
          group: args.group,
        });
      }
    });

    paidBy?.forEach(async (item) => {
      await ctx.db.patch(item._id, {
        amount:
          args.paidBy?.find(
            (i: { user: string; amount: number }) => i.user === item.user
          )?.amount || 0,
      });
    });

    paidBy = await ctx.db
      .query("paidBy")
      ?.filter((q) =>
        q.and(q.eq(q.field("expense"), args._id), q.eq(q.field("amount"), 0))
      )
      .order("desc")
      .collect();

    paidBy?.forEach(async (item) => {
      await ctx.db.delete(item._id);
    });

    let splitAmong = await ctx.db
      .query("splitAmong")
      ?.filter((q) => q.eq(q.field("expense"), args._id))
      .order("desc")
      .collect();

    splitAmong?.forEach(async (item) => {
      await ctx.db.patch(item._id, {
        amount:
          args.splitAmong?.find(
            (i: { user: string; amount: number }) => i.user === item.user
          )?.amount || 0,
      });
    });

    return expense;
  },
});

export const getExpenses = query({
  args: {
    group: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    let expenses = await ctx.db
      .query("expenses")
      ?.filter((q) => q.eq(q.field("group"), args.group))
      .order("desc")
      .collect();

    return expenses;
  },
});

export const getPaidBy = query({
  args: {
    group: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    let paidBy = await ctx.db
      .query("paidBy")
      ?.filter((q) => q.eq(q.field("group"), args.group))
      .order("desc")
      .collect();

    return paidBy;
  },
});

export const getSplitAmong = query({
  args: {
    group: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    let splitAmong = await ctx.db
      .query("splitAmong")
      ?.filter((q) => q.eq(q.field("group"), args.group))
      .order("desc")
      .collect();

    return splitAmong;
  },
});

export const deleteExpense = mutation({
  args: {
    expense: v.id("expenses"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const expense = await ctx.db.delete(args.expense);

    let paidBy = await ctx.db
      .query("paidBy")
      ?.filter((q) => q.eq(q.field("expense"), args.expense))
      .collect();
    paidBy?.forEach(async (item) => {
      await ctx.db.delete(item._id);
    });

    let splitAmong = await ctx.db
      .query("splitAmong")
      ?.filter((q) => q.eq(q.field("expense"), args.expense))
      .collect();
    splitAmong?.forEach(async (item) => {
      await ctx.db.delete(item._id);
    });

    return expense;
  },
});
