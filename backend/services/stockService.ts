export interface StockPrice {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  exchange: string;
  logo?: string;
}

export interface StockSearchResult {
  symbol: string;
  name: string;
  exchange: string;
  logo: string;
}

const TURKEY_STOCKS = [
  { symbol: 'ASELS', name: 'Aselsan Elektronik', exchange: 'BIST', logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/icon/generic.svg' },
  { symbol: 'THYAO', name: 'Türk Hava Yolları', exchange: 'BIST', logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/icon/generic.svg' },
  { symbol: 'GARAN', name: 'Garanti BBVA', exchange: 'BIST', logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/icon/generic.svg' },
  { symbol: 'EREGL', name: 'Ereğli Demir Çelik', exchange: 'BIST', logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/icon/generic.svg' },
  { symbol: 'AKBNK', name: 'Akbank', exchange: 'BIST', logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/icon/generic.svg' },
  { symbol: 'TUPRS', name: 'Tüpraş', exchange: 'BIST', logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/icon/generic.svg' },
  { symbol: 'SAHOL', name: 'Sabancı Holding', exchange: 'BIST', logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/icon/generic.svg' },
  { symbol: 'KCHOL', name: 'Koç Holding', exchange: 'BIST', logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/icon/generic.svg' },
  { symbol: 'SISE', name: 'Şişe Cam', exchange: 'BIST', logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/icon/generic.svg' },
  { symbol: 'PETKM', name: 'Petkim', exchange: 'BIST', logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/icon/generic.svg' },
  { symbol: 'TCELL', name: 'Turkcell', exchange: 'BIST', logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/icon/generic.svg' },
  { symbol: 'ISCTR', name: 'İş Bankası', exchange: 'BIST', logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/icon/generic.svg' },
  { symbol: 'YKBNK', name: 'Yapı Kredi', exchange: 'BIST', logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/icon/generic.svg' },
  { symbol: 'HALKB', name: 'Halkbank', exchange: 'BIST', logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/icon/generic.svg' },
  { symbol: 'VAKBN', name: 'Vakıfbank', exchange: 'BIST', logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/icon/generic.svg' },
  { symbol: 'BIMAS', name: 'BIM', exchange: 'BIST', logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/icon/generic.svg' },
  { symbol: 'MGROS', name: 'Migros', exchange: 'BIST', logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/icon/generic.svg' },
  { symbol: 'KOZAL', name: 'Koza Altın', exchange: 'BIST', logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/icon/generic.svg' },
  { symbol: 'PGSUS', name: 'Pegasus', exchange: 'BIST', logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/icon/generic.svg' },
  { symbol: 'FROTO', name: 'Ford Otosan', exchange: 'BIST', logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/icon/generic.svg' },
];

const GLOBAL_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ', logo: 'https://logo.clearbit.com/apple.com' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', exchange: 'NASDAQ', logo: 'https://logo.clearbit.com/microsoft.com' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', exchange: 'NASDAQ', logo: 'https://logo.clearbit.com/google.com' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', exchange: 'NASDAQ', logo: 'https://logo.clearbit.com/amazon.com' },
  { symbol: 'TSLA', name: 'Tesla Inc.', exchange: 'NASDAQ', logo: 'https://logo.clearbit.com/tesla.com' },
  { symbol: 'META', name: 'Meta Platforms Inc.', exchange: 'NASDAQ', logo: 'https://logo.clearbit.com/meta.com' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', exchange: 'NASDAQ', logo: 'https://logo.clearbit.com/nvidia.com' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', exchange: 'NYSE', logo: 'https://logo.clearbit.com/jpmorganchase.com' },
  { symbol: 'V', name: 'Visa Inc.', exchange: 'NYSE', logo: 'https://logo.clearbit.com/visa.com' },
  { symbol: 'WMT', name: 'Walmart Inc.', exchange: 'NYSE', logo: 'https://logo.clearbit.com/walmart.com' },
  { symbol: 'DIS', name: 'The Walt Disney Company', exchange: 'NYSE', logo: 'https://logo.clearbit.com/disney.com' },
  { symbol: 'NFLX', name: 'Netflix Inc.', exchange: 'NASDAQ', logo: 'https://logo.clearbit.com/netflix.com' },
  { symbol: 'BA', name: 'Boeing Company', exchange: 'NYSE', logo: 'https://logo.clearbit.com/boeing.com' },
  { symbol: 'NKE', name: 'Nike Inc.', exchange: 'NYSE', logo: 'https://logo.clearbit.com/nike.com' },
  { symbol: 'INTC', name: 'Intel Corporation', exchange: 'NASDAQ', logo: 'https://logo.clearbit.com/intel.com' },
];

export async function getStockPrices(symbols: string[], market: 'turkey' | 'global'): Promise<Record<string, StockPrice>> {
  try {
    console.log('[StockService] Fiyatlar çekiliyor:', symbols, market);

    if (market === 'turkey') {
      const response = await fetch('https://api.collectapi.com/economy/hisseSenedi', {
        headers: {
          'authorization': 'apikey 3YourCollectAPIKey',
          'content-type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('[StockService] BIST API yanıtı alındı');

        const result: Record<string, StockPrice> = {};
        
        for (const symbol of symbols) {
          const stock = data.result?.find((s: any) => s.code === symbol);
          const stockInfo = TURKEY_STOCKS.find(s => s.symbol === symbol);

          if (stock && stockInfo) {
            result[symbol] = {
              symbol,
              name: stockInfo.name,
              price: parseFloat(stock.price) || 0,
              change: parseFloat(stock.change) || 0,
              changePercent: parseFloat(stock.rate) || 0,
              exchange: 'BIST',
              logo: stockInfo.logo,
            };
          }
        }

        if (Object.keys(result).length > 0) {
          return result;
        }
      }
    }

    console.log('[StockService] API kullanılamıyor, mock veri döndürülüyor');
    const result: Record<string, StockPrice> = {};
    const stockList = market === 'turkey' ? TURKEY_STOCKS : GLOBAL_STOCKS;

    for (const symbol of symbols) {
      const stockInfo = stockList.find(s => s.symbol === symbol);
      if (stockInfo) {
        const basePrice = market === 'turkey' ? 100 : 200;
        const price = basePrice + Math.random() * 100;
        const change = (Math.random() - 0.5) * 10;
        const changePercent = (change / price) * 100;

        result[symbol] = {
          symbol,
          name: stockInfo.name,
          price,
          change,
          changePercent,
          exchange: stockInfo.exchange,
          logo: stockInfo.logo,
        };
      }
    }

    return result;
  } catch (error) {
    console.error('[StockService] Hata:', error);
    return {};
  }
}

export async function searchStocks(query: string, market?: 'turkey' | 'global'): Promise<StockSearchResult[]> {
  try {
    console.log('[StockService] Hisse arama:', query, market);

    const allStocks = market === 'turkey' 
      ? TURKEY_STOCKS 
      : market === 'global' 
      ? GLOBAL_STOCKS 
      : [...TURKEY_STOCKS, ...GLOBAL_STOCKS];

    const filtered = allStocks.filter(
      stock =>
        stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
        stock.name.toLowerCase().includes(query.toLowerCase())
    );

    return filtered;
  } catch (error) {
    console.error('[StockService] Arama hatası:', error);
    return [];
  }
}
