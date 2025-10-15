import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { getCryptoPrices, searchCrypto } from "../../../../services/cryptoService";
import { getStockPrices, searchStocks } from "../../../../services/stockService";
import { getForexRates, getCommodityPrices } from "../../../../services/forexService";

export const getPricesProcedure = publicProcedure
  .input(
    z.object({
      symbols: z.array(z.string()),
      assetType: z.enum(["stock", "crypto", "forex", "gold", "fund"]),
      market: z.enum(["turkey", "global"]).optional(),
    })
  )
  .query(async ({ input }) => {
    console.log("[Market] Fiyat çekiliyor:", input);

    try {
      if (input.assetType === "crypto") {
        const prices = await getCryptoPrices(input.symbols);
        return input.symbols.map((symbol) => {
          const data = prices[symbol.toUpperCase()];
          if (data) {
            return {
              symbol: data.symbol,
              price: data.price.toFixed(2),
              change: (data.price * data.change24h / 100).toFixed(2),
              changePercent: data.change24h.toFixed(2),
              lastUpdated: new Date().toISOString(),
            };
          }
          return {
            symbol: symbol.toUpperCase(),
            price: "0",
            change: "0",
            changePercent: "0",
            lastUpdated: new Date().toISOString(),
          };
        });
      }

      if (input.assetType === "stock") {
        const market = input.market || "turkey";
        const prices = await getStockPrices(input.symbols, market);
        return input.symbols.map((symbol) => {
          const data = prices[symbol.toUpperCase()];
          if (data) {
            return {
              symbol: data.symbol,
              price: data.price.toFixed(2),
              change: data.change.toFixed(2),
              changePercent: data.changePercent.toFixed(2),
              lastUpdated: new Date().toISOString(),
            };
          }
          return {
            symbol: symbol.toUpperCase(),
            price: "0",
            change: "0",
            changePercent: "0",
            lastUpdated: new Date().toISOString(),
          };
        });
      }

      if (input.assetType === "forex") {
        const rates = await getForexRates();
        return input.symbols.map((symbol) => {
          const data = rates.find(r => r.symbol === symbol.toUpperCase());
          if (data) {
            return {
              symbol: data.symbol,
              price: data.buy.toFixed(2),
              change: data.change.toFixed(2),
              changePercent: data.changePercent.toFixed(2),
              lastUpdated: new Date().toISOString(),
            };
          }
          return {
            symbol: symbol.toUpperCase(),
            price: "0",
            change: "0",
            changePercent: "0",
            lastUpdated: new Date().toISOString(),
          };
        });
      }

      if (input.assetType === "gold") {
        const commodities = await getCommodityPrices();
        return input.symbols.map((symbol) => {
          const data = commodities.find(c => c.symbol === symbol.toUpperCase());
          if (data) {
            return {
              symbol: data.symbol,
              price: data.price.toFixed(2),
              change: data.change.toFixed(2),
              changePercent: data.changePercent.toFixed(2),
              lastUpdated: new Date().toISOString(),
            };
          }
          return {
            symbol: symbol.toUpperCase(),
            price: "0",
            change: "0",
            changePercent: "0",
            lastUpdated: new Date().toISOString(),
          };
        });
      }

      return input.symbols.map((symbol) => ({
        symbol: symbol.toUpperCase(),
        price: "0",
        change: "0",
        changePercent: "0",
        lastUpdated: new Date().toISOString(),
      }));
    } catch (error) {
      console.error("[Market] Fiyat çekme hatası:", error);
      return input.symbols.map((symbol) => ({
        symbol: symbol.toUpperCase(),
        price: "0",
        change: "0",
        changePercent: "0",
        lastUpdated: new Date().toISOString(),
      }));
    }
  });

export const searchStocksProcedure = publicProcedure
  .input(
    z.object({
      query: z.string(),
      market: z.enum(["turkey", "global"]).optional(),
    })
  )
  .query(async ({ input }) => {
    console.log("[Market] Hisse arama:", input);
    return await searchStocks(input.query, input.market);
  });

export const searchCryptoProcedure = publicProcedure
  .input(z.object({ query: z.string() }))
  .query(async ({ input }) => {
    console.log("[Market] Kripto arama:", input);
    return await searchCrypto(input.query);
  });

export const getForexRatesProcedure = publicProcedure.query(async () => {
  console.log("[Market] Döviz kurları çekiliyor");
  const rates = await getForexRates();
  return rates.map(rate => ({
    symbol: rate.symbol,
    name: rate.name,
    buy: rate.buy.toFixed(2),
    sell: rate.sell.toFixed(2),
    logo: rate.logo,
  }));
});

export const getCommodityPricesProcedure = publicProcedure.query(async () => {
  console.log("[Market] Emtia fiyatları çekiliyor");
  const commodities = await getCommodityPrices();
  return commodities.map(commodity => ({
    symbol: commodity.symbol,
    name: commodity.name,
    price: commodity.price.toFixed(2),
    unit: commodity.unit,
    logo: commodity.logo,
  }));
});
