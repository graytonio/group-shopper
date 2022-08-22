import { z } from "zod";
import { createProtectedRouter } from "./protected-router";

export const listRouter = createProtectedRouter()
  .query("getList", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input, ctx }) {
      const authUserId = ctx.session.user.id;

      const list = await ctx.prisma.list.findFirst({ where: { id: input.id }, include: { items: true, owner: true, users: true } });
      if (!list) {
        return null;
      }

      if (list.ownerId === authUserId || list.users.map((user) => user.id).includes(authUserId)) {
        return list;
      }

      return null;
    },
  })
  .query("items", {
    input: z.object({
      listId: z.string(),
      userId: z.string().optional(),
    }),
    async resolve({ input, ctx }) {
      if (input.userId) {
        return await ctx.prisma.itemInList.findMany({ where: { listId: input.listId, assignedId: input.userId }, include: { assigned: true, item: true } });
      }

      return await ctx.prisma.itemInList.findMany({ where: { listId: input.listId }, include: { assigned: true, item: true } });
    },
  })
  .mutation("createList", {
    input: z.object({
      name: z.string(),
    }),
    async resolve({ input, ctx }) {
      const authUserId = ctx.session.user.id;

      const results = await ctx.prisma.list.create({ data: { name: input.name, ownerId: authUserId } });
      return results;
    },
  })
  .mutation("additem", {
    input: z.object({
      name: z.string(),
      listId: z.string(),
      quantity: z.number().min(1),
      size: z.string().optional(),
      assignedId: z.string(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.itemInList.create({
        data: {
          list: { connect: { id: input.listId } },
          item: { connectOrCreate: { where: { name: input.name }, create: { name: input.name } } },
          quantity: input.quantity,
          size: input.size ? input.size : "",
          assigned: { connect: { id: input.assignedId } },
        },
        include: {
          item: true,
          list: true,
          assigned: true,
        },
      });
    },
  });
