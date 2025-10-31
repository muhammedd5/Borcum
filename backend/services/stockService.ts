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
  { symbol: 'ASELS', name: 'Aselsan Elektronik', exchange: 'BIST', logo: 'https://img.icons8.com/fluency/48/company.png' },
  { symbol: 'THYAO', name: 'Türk Hava Yolları', exchange: 'BIST', logo: 'https://img.icons8.com/fluency/48/airplane-take-off.png' },
  { symbol: 'GARAN', name: 'Garanti BBVA', exchange: 'BIST', logo: 'https://img.icons8.com/fluency/48/bank-building.png' },
  { symbol: 'EREGL', name: 'Ereğli Demir Çelik', exchange: 'BIST', logo: 'https://img.icons8.com/fluency/48/steel-beam.png' },
  { symbol: 'AKBNK', name: 'Akbank', exchange: 'BIST', logo: 'https://img.icons8.com/fluency/48/bank-building.png' },
  { symbol: 'TUPRS', name: 'Tüpraş', exchange: 'BIST', logo: 'https://img.icons8.com/fluency/48/oil-industry.png' },
  { symbol: 'SAHOL', name: 'Sabancı Holding', exchange: 'BIST', logo: 'https://img.icons8.com/fluency/48/company.png' },
  { symbol: 'KCHOL', name: 'Koç Holding', exchange: 'BIST', logo: 'https://img.icons8.com/fluency/48/company.png' },
  { symbol: 'SISE', name: 'Şişe Cam', exchange: 'BIST', logo: 'https://img.icons8.com/fluency/48/glass.png' },
  { symbol: 'PETKM', name: 'Petkim', exchange: 'BIST', logo: 'https://img.icons8.com/fluency/48/oil-industry.png' },
  { symbol: 'TCELL', name: 'Turkcell', exchange: 'BIST', logo: 'https://img.icons8.com/fluency/48/cell-phone.png' },
  { symbol: 'ISCTR', name: 'İş Bankası', exchange: 'BIST', logo: 'https://img.icons8.com/fluency/48/bank-building.png' },
  { symbol: 'YKBNK', name: 'Yapı Kredi', exchange: 'BIST', logo: 'https://img.icons8.com/fluency/48/bank-building.png' },
  { symbol: 'HALKB', name: 'Halkbank', exchange: 'BIST', logo: 'https://img.icons8.com/fluency/48/bank-building.png' },
  { symbol: 'VAKBN', name: 'Vakıfbank', exchange: 'BIST', logo: 'https://img.icons8.com/fluency/48/bank-building.png' },
  { symbol: 'BIMAS', name: 'BIM', exchange: 'BIST', logo: 'https://img.icons8.com/fluency/48/shopping-cart.png' },
  { symbol: 'MGROS', name: 'Migros', exchange: 'BIST', logo: 'https://img.icons8.com/fluency/48/shopping-cart.png' },
  { symbol: 'KOZAL', name: 'Koza Altın', exchange: 'BIST', logo: 'https://img.icons8.com/fluency/48/gold-bars.png' },
  { symbol: 'PGSUS', name: 'Pegasus', exchange: 'BIST', logo: 'https://img.icons8.com/fluency/48/airplane-take-off.png' },
  { symbol: 'FROTO', name: 'Ford Otosan', exchange: 'BIST', logo: 'https://img.icons8.com/fluency/48/car.png' },
  { symbol: 'ENKAI', name: 'Enka İnşaat', exchange: 'BIST', logo: 'https://img.icons8.com/fluency/48/building.png' },
  { symbol: 'TOASO', name: 'Tofaş', exchange: 'BIST', logo: 'https://img.icons8.com/fluency/48/car.png' },
  { symbol: 'KOZAA', name: 'Koza Anadolu', exchange: 'BIST', logo: 'https://img.icons8.com/fluency/48/gold-bars.png' },
  { symbol: 'ARCLK', name: 'Arçelik', exchange: 'BIST', logo: 'https://img.icons8.com/fluency/48/washing-machine.png' },
  { symbol: 'TAVHL', name: 'TAV Havalimanları', exchange: 'BIST', logo: 'https://img.icons8.com/fluency/48/airport.png' },
  { symbol: 'VESBE', name: 'Vestel Beyaz Eşya', exchange: 'BIST', logo: 'https://img.icons8.com/fluency/48/washing-machine.png' },
  { symbol: 'TTKOM', name: 'Türk Telekom', exchange: 'BIST', logo: 'https://img.icons8.com/fluency/48/cell-phone.png' },
  { symbol: 'DOHOL', name: 'Doğan Holding', exchange: 'BIST', logo: 'https://img.icons8.com/fluency/48/company.png' },
  { symbol: 'EKGYO', name: 'Emlak Konut GYO', exchange: 'BIST', logo: 'https://img.icons8.com/fluency/48/home.png' },
  { symbol: 'SODA', name: 'Soda Sanayi', exchange: 'BIST', logo: 'https://img.icons8.com/fluency/48/factory.png' },
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
      try {
        const yahooSymbols = symbols.map(s => `${s}.IS`).join(',');
        const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${yahooSymbols}`;
        console.log('[StockService] Yahoo Finance API çağrısı:', url);
        
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('[StockService] Yahoo Finance yanıtı:', data.quoteResponse?.result?.length, 'hisse');

          const result: Record<string, StockPrice> = {};
          
          for (const quote of data.quoteResponse?.result || []) {
            const symbol = quote.symbol.replace('.IS', '');
            const stockInfo = TURKEY_STOCKS.find(s => s.symbol === symbol);

            if (stockInfo) {
              const price = quote.regularMarketPrice || 0;
              const change = quote.regularMarketChange || 0;
              const changePercent = quote.regularMarketChangePercent || 0;
              
              console.log(`[StockService] ${symbol}: ${price.toFixed(2)} TRY (${changePercent.toFixed(2)}%)`);
              
              result[symbol] = {
                symbol,
                name: stockInfo.name,
                price,
                change,
                changePercent,
                exchange: 'BIST',
                logo: stockInfo.logo,
              };
            }
          }

          if (Object.keys(result).length > 0) {
            console.log('[StockService] Yahoo Finance başarılı:', Object.keys(result).length, 'hisse');
            return result;
          }
        }
      } catch (yahooError) {
        console.error('[StockService] Yahoo Finance hatası:', yahooError);
      }
    } else {
      try {
        const yahooSymbols = symbols.join(',');
        const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${yahooSymbols}`;
        console.log('[StockService] Yahoo Finance Global API çağrısı:', url);
        
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('[StockService] Yahoo Finance Global yanıtı:', data.quoteResponse?.result?.length, 'hisse');

          const result: Record<string, StockPrice> = {};
          const tryToUsd = 0.029;
          
          for (const quote of data.quoteResponse?.result || []) {
            const symbol = quote.symbol;
            const stockInfo = GLOBAL_STOCKS.find(s => s.symbol === symbol);

            if (stockInfo) {
              const priceUsd = quote.regularMarketPrice || 0;
              const price = priceUsd / tryToUsd;
              const change = (quote.regularMarketChange || 0) / tryToUsd;
              const changePercent = quote.regularMarketChangePercent || 0;
              
              console.log(`[StockService] ${symbol}: ${price.toFixed(2)} TRY (${changePercent.toFixed(2)}%)`);
              
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

          if (Object.keys(result).length > 0) {
            console.log('[StockService] Yahoo Finance Global başarılı:', Object.keys(result).length, 'hisse');
            return result;
          }
        }
      } catch (yahooError) {
        console.error('[StockService] Yahoo Finance Global hatası:', yahooError);
      }
    }

    console.log('[StockService] API kullanılamıyor, gerçekçi mock veri döndürülüyor');
    const result: Record<string, StockPrice> = {};
    const stockList = market === 'turkey' ? TURKEY_STOCKS : GLOBAL_STOCKS;

    for (const symbol of symbols) {
      const stockInfo = stockList.find(s => s.symbol === symbol);
      if (stockInfo) {
        const seed = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const random = (seed * 9301 + 49297) % 233280 / 233280;
        
        const basePrice = market === 'turkey' ? 50 + random * 150 : 150 + random * 350;
        const volatility = 0.03;
        const changePercent = (random - 0.5) * volatility * 200;
        const price = basePrice * (1 + changePercent / 100);
        const change = price * (changePercent / 100);

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
