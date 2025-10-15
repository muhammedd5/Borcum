import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import {
  getPricesProcedure,
  searchStocksProcedure,
  searchCryptoProcedure,
  getForexRatesProcedure,
  getCommodityPricesProcedure,
} from "./routes/market/prices/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  market: createTRPCRouter({
    getPrices: getPricesProcedure,
    searchStocks: searchStocksProcedure,
    searchCrypto: searchCryptoProcedure,
    getForexRates: getForexRatesProcedure,
    getCommodityPrices: getCommodityPricesProcedure,
  }),
});

export type AppRouter = typeof appRouter;
