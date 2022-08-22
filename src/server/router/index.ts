// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { listRouter } from "./list";

export const appRouter = createRouter().transformer(superjson).merge("list.", listRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
