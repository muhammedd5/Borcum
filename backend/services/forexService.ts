export interface ForexRate {
  symbol: string;
  name: string;
  buy: number;
  sell: number;
  change: number;
  changePercent: number;
  logo: string;
}

export interface CommodityPrice {
  symbol: string;
  name: string;
  price: number;
  unit: string;
  change: number;
  changePercent: number;
  logo: string;
}

const FOREX_SYMBOLS: Record<string, { name: string; logo: string }> = {
  USD: { name: 'Amerikan Doları', logo: 'https://flagcdn.com/w40/us.png' },
  EUR: { name: 'Euro', logo: 'https://flagcdn.com/w40/eu.png' },
  GBP: { name: 'İngiliz Sterlini', logo: 'https://flagcdn.com/w40/gb.png' },
  CHF: { name: 'İsviçre Frangı', logo: 'https://flagcdn.com/w40/ch.png' },
  JPY: { name: 'Japon Yeni', logo: 'https://flagcdn.com/w40/jp.png' },
  SAR: { name: 'Suudi Arabistan Riyali', logo: 'https://flagcdn.com/w40/sa.png' },
  CAD: { name: 'Kanada Doları', logo: 'https://flagcdn.com/w40/ca.png' },
  AUD: { name: 'Avustralya Doları', logo: 'https://flagcdn.com/w40/au.png' },
  RUB: { name: 'Rus Rublesi', logo: 'https://flagcdn.com/w40/ru.png' },
  CNY: { name: 'Çin Yuanı', logo: 'https://flagcdn.com/w40/cn.png' },
};

const COMMODITY_SYMBOLS: Record<string, { name: string; unit: string; logo: string }> = {
  GOLD: { name: 'Altın', unit: 'TRY/Gram', logo: 'https://cdn-icons-png.flaticon.com/512/2917/2917995.png' },
  SILVER: { name: 'Gümüş', unit: 'TRY/Gram', logo: 'https://cdn-icons-png.flaticon.com/512/2917/2917995.png' },
  BRENT: { name: 'Brent Petrol', unit: 'USD/Varil', logo: 'https://cdn-icons-png.flaticon.com/512/3050/3050390.png' },
  WTI: { name: 'Ham Petrol', unit: 'USD/Varil', logo: 'https://cdn-icons-png.flaticon.com/512/3050/3050390.png' },
  COPPER: { name: 'Bakır', unit: 'USD/lb', logo: 'https://cdn-icons-png.flaticon.com/512/2917/2917995.png' },
};

export async function getForexRates(): Promise<ForexRate[]> {
  try {
    console.log('[ForexService] Döviz kurları çekiliyor - TCMB API');

    const tcmbResponse = await fetch('https://www.tcmb.gov.tr/kurlar/today.xml');
    
    if (tcmbResponse.ok) {
      const xmlText = await tcmbResponse.text();
      console.log('[ForexService] TCMB XML alındı, parse ediliyor...');

      const rates: ForexRate[] = [];

      for (const [symbol, info] of Object.entries(FOREX_SYMBOLS)) {
        const regex = new RegExp(`<Currency[^>]*CurrencyCode="${symbol}"[^>]*>([\\s\\S]*?)<\\/Currency>`, 'i');
        const match = xmlText.match(regex);

        if (match) {
          const currencyBlock = match[1];
          const buyMatch = currencyBlock.match(/<ForexBuying>([^<]+)<\/ForexBuying>/);
          const sellMatch = currencyBlock.match(/<ForexSelling>([^<]+)<\/ForexSelling>/);

          const buy = buyMatch ? parseFloat(buyMatch[1]) : 0;
          const sell = sellMatch ? parseFloat(sellMatch[1]) : 0;

          if (buy > 0) {
            console.log(`[ForexService] ${symbol}: Alış ${buy.toFixed(4)} TRY, Satış ${sell.toFixed(4)} TRY`);
            rates.push({
              symbol,
              name: info.name,
              buy,
              sell,
              change: 0,
              changePercent: 0,
              logo: info.logo,
            });
          }
        }
      }

      if (rates.length > 0) {
        console.log(`[ForexService] TCMB'den ${rates.length} döviz kuru alındı`);
        return rates;
      }
    } else {
      console.error('[ForexService] TCMB API hatası:', tcmbResponse.status);
    }

    console.log('[ForexService] TCMB API başarısız, alternatif API deneniyor...');

    try {
      const freeForexResponse = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      
      if (freeForexResponse.ok) {
        const data = await freeForexResponse.json();
        const tryRate = data.rates?.TRY || 34;
        console.log('[ForexService] ExchangeRate API yanıtı alındı, USD/TRY:', tryRate);

        const rates: ForexRate[] = [
          { 
            symbol: 'USD', 
            name: 'Amerikan Doları', 
            buy: tryRate, 
            sell: tryRate * 1.003, 
            change: 0, 
            changePercent: 0, 
            logo: 'https://flagcdn.com/w40/us.png' 
          },
          { 
            symbol: 'EUR', 
            name: 'Euro', 
            buy: tryRate * (data.rates?.EUR ? 1 / data.rates.EUR : 1.1), 
            sell: tryRate * (data.rates?.EUR ? 1 / data.rates.EUR : 1.1) * 1.003, 
            change: 0, 
            changePercent: 0, 
            logo: 'https://flagcdn.com/w40/eu.png' 
          },
          { 
            symbol: 'GBP', 
            name: 'İngiliz Sterlini', 
            buy: tryRate * (data.rates?.GBP ? 1 / data.rates.GBP : 1.27), 
            sell: tryRate * (data.rates?.GBP ? 1 / data.rates.GBP : 1.27) * 1.003, 
            change: 0, 
            changePercent: 0, 
            logo: 'https://flagcdn.com/w40/gb.png' 
          },
        ];

        console.log(`[ForexService] ExchangeRate API'den ${rates.length} döviz kuru hesaplandı`);
        return rates;
      }
    } catch (altError) {
      console.error('[ForexService] Alternatif API hatası:', altError);
    }

    console.log('[ForexService] Tüm API\'ler başarısız, güncel mock veri döndürülüyor');
    const mockRates: ForexRate[] = [
      { symbol: 'USD', name: 'Amerikan Doları', buy: 34.20, sell: 34.30, change: 0.15, changePercent: 0.44, logo: 'https://flagcdn.com/w40/us.png' },
      { symbol: 'EUR', name: 'Euro', buy: 37.75, sell: 37.85, change: 0.22, changePercent: 0.58, logo: 'https://flagcdn.com/w40/eu.png' },
      { symbol: 'GBP', name: 'İngiliz Sterlini', buy: 43.50, sell: 43.65, change: 0.18, changePercent: 0.41, logo: 'https://flagcdn.com/w40/gb.png' },
      { symbol: 'CHF', name: 'İsviçre Frangı', buy: 39.20, sell: 39.35, change: 0.12, changePercent: 0.31, logo: 'https://flagcdn.com/w40/ch.png' },
      { symbol: 'JPY', name: 'Japon Yeni', buy: 0.23, sell: 0.24, change: 0.001, changePercent: 0.43, logo: 'https://flagcdn.com/w40/jp.png' },
      { symbol: 'SAR', name: 'Suudi Arabistan Riyali', buy: 9.10, sell: 9.15, change: 0.04, changePercent: 0.44, logo: 'https://flagcdn.com/w40/sa.png' },
      { symbol: 'CAD', name: 'Kanada Doları', buy: 24.50, sell: 24.60, change: 0.08, changePercent: 0.33, logo: 'https://flagcdn.com/w40/ca.png' },
      { symbol: 'AUD', name: 'Avustralya Doları', buy: 22.30, sell: 22.40, change: 0.06, changePercent: 0.27, logo: 'https://flagcdn.com/w40/au.png' },
      { symbol: 'RUB', name: 'Rus Rublesi', buy: 0.35, sell: 0.36, change: 0.002, changePercent: 0.57, logo: 'https://flagcdn.com/w40/ru.png' },
      { symbol: 'CNY', name: 'Çin Yuanı', buy: 4.70, sell: 4.75, change: 0.02, changePercent: 0.43, logo: 'https://flagcdn.com/w40/cn.png' },
    ];

    return mockRates;
  } catch (error) {
    console.error('[ForexService] Kritik hata:', error);
    
    const mockRates: ForexRate[] = [
      { symbol: 'USD', name: 'Amerikan Doları', buy: 34.20, sell: 34.30, change: 0.15, changePercent: 0.44, logo: 'https://flagcdn.com/w40/us.png' },
      { symbol: 'EUR', name: 'Euro', buy: 37.75, sell: 37.85, change: 0.22, changePercent: 0.58, logo: 'https://flagcdn.com/w40/eu.png' },
      { symbol: 'GBP', name: 'İngiliz Sterlini', buy: 43.50, sell: 43.65, change: 0.18, changePercent: 0.41, logo: 'https://flagcdn.com/w40/gb.png' },
      { symbol: 'CHF', name: 'İsviçre Frangı', buy: 39.20, sell: 39.35, change: 0.12, changePercent: 0.31, logo: 'https://flagcdn.com/w40/ch.png' },
      { symbol: 'JPY', name: 'Japon Yeni', buy: 0.23, sell: 0.24, change: 0.001, changePercent: 0.43, logo: 'https://flagcdn.com/w40/jp.png' },
      { symbol: 'SAR', name: 'Suudi Arabistan Riyali', buy: 9.10, sell: 9.15, change: 0.04, changePercent: 0.44, logo: 'https://flagcdn.com/w40/sa.png' },
      { symbol: 'CAD', name: 'Kanada Doları', buy: 24.50, sell: 24.60, change: 0.08, changePercent: 0.33, logo: 'https://flagcdn.com/w40/ca.png' },
      { symbol: 'AUD', name: 'Avustralya Doları', buy: 22.30, sell: 22.40, change: 0.06, changePercent: 0.27, logo: 'https://flagcdn.com/w40/au.png' },
      { symbol: 'RUB', name: 'Rus Rublesi', buy: 0.35, sell: 0.36, change: 0.002, changePercent: 0.57, logo: 'https://flagcdn.com/w40/ru.png' },
      { symbol: 'CNY', name: 'Çin Yuanı', buy: 4.70, sell: 4.75, change: 0.02, changePercent: 0.43, logo: 'https://flagcdn.com/w40/cn.png' },
    ];

    return mockRates;
  }
}

export async function getCommodityPrices(): Promise<CommodityPrice[]> {
  try {
    console.log('[ForexService] Emtia fiyatları çekiliyor - Metals API');

    try {
      const metalsResponse = await fetch('https://api.metals.live/v1/spot');
      
      if (metalsResponse.ok) {
        const data = await metalsResponse.json();
        console.log('[ForexService] Metals API yanıtı alındı');

        const goldPrice = data.find((m: any) => m.metal === 'gold')?.price || 2650;
        const silverPrice = data.find((m: any) => m.metal === 'silver')?.price || 31;

        const usdToTry = 34.20;
        const goldPriceGram = (goldPrice / 31.1035) * usdToTry;
        const silverPriceGram = (silverPrice / 31.1035) * usdToTry;

        console.log(`[ForexService] Altın: ${goldPriceGram.toFixed(2)} TRY/Gram, Gümüş: ${silverPriceGram.toFixed(2)} TRY/Gram`);

        const commodities: CommodityPrice[] = [
          { 
            symbol: 'GOLD', 
            name: 'Altın', 
            price: goldPriceGram, 
            unit: 'TRY/Gram', 
            change: 0, 
            changePercent: 0, 
            logo: 'https://cdn-icons-png.flaticon.com/512/2917/2917995.png' 
          },
          { 
            symbol: 'SILVER', 
            name: 'Gümüş', 
            price: silverPriceGram, 
            unit: 'TRY/Gram', 
            change: 0, 
            changePercent: 0, 
            logo: 'https://cdn-icons-png.flaticon.com/512/2917/2917995.png' 
          },
        ];

        try {
          const oilResponse = await fetch('https://api.oilpriceapi.com/v1/prices/latest');
          if (oilResponse.ok) {
            const oilData = await oilResponse.json();
            const brentPrice = oilData.data?.price || 85.20;
            console.log(`[ForexService] Brent Petrol: ${brentPrice} USD/Varil`);
            
            commodities.push(
              { symbol: 'BRENT', name: 'Brent Petrol', price: brentPrice, unit: 'USD/Varil', change: 0, changePercent: 0, logo: 'https://cdn-icons-png.flaticon.com/512/3050/3050390.png' },
              { symbol: 'WTI', name: 'Ham Petrol', price: brentPrice - 5, unit: 'USD/Varil', change: 0, changePercent: 0, logo: 'https://cdn-icons-png.flaticon.com/512/3050/3050390.png' }
            );
          }
        } catch (oilError) {
          console.log('[ForexService] Petrol fiyatları alınamadı, varsayılan değerler kullanılıyor');
          commodities.push(
            { symbol: 'BRENT', name: 'Brent Petrol', price: 85.20, unit: 'USD/Varil', change: 1.2, changePercent: 1.43, logo: 'https://cdn-icons-png.flaticon.com/512/3050/3050390.png' },
            { symbol: 'WTI', name: 'Ham Petrol', price: 80.50, unit: 'USD/Varil', change: 0.8, changePercent: 1.00, logo: 'https://cdn-icons-png.flaticon.com/512/3050/3050390.png' }
          );
        }

        commodities.push(
          { symbol: 'COPPER', name: 'Bakır', price: 8.75, unit: 'USD/lb', change: 0.15, changePercent: 1.74, logo: 'https://cdn-icons-png.flaticon.com/512/2917/2917995.png' }
        );

        console.log(`[ForexService] Toplam ${commodities.length} emtia fiyatı hazırlandı`);
        return commodities;
      }
    } catch (metalsError) {
      console.error('[ForexService] Metals API hatası:', metalsError);
    }

    console.log('[ForexService] API kullanılamıyor, güncel mock veri döndürülüyor');
    const mockCommodities: CommodityPrice[] = [
      { symbol: 'GOLD', name: 'Altın', price: 2850.00, unit: 'TRY/Gram', change: 35.00, changePercent: 1.24, logo: 'https://cdn-icons-png.flaticon.com/512/2917/2917995.png' },
      { symbol: 'SILVER', name: 'Gümüş', price: 32.50, unit: 'TRY/Gram', change: 0.80, changePercent: 2.52, logo: 'https://cdn-icons-png.flaticon.com/512/2917/2917995.png' },
      { symbol: 'BRENT', name: 'Brent Petrol', price: 85.20, unit: 'USD/Varil', change: 1.20, changePercent: 1.43, logo: 'https://cdn-icons-png.flaticon.com/512/3050/3050390.png' },
      { symbol: 'WTI', name: 'Ham Petrol', price: 80.50, unit: 'USD/Varil', change: 0.80, changePercent: 1.00, logo: 'https://cdn-icons-png.flaticon.com/512/3050/3050390.png' },
      { symbol: 'COPPER', name: 'Bakır', price: 8.75, unit: 'USD/lb', change: 0.15, changePercent: 1.74, logo: 'https://cdn-icons-png.flaticon.com/512/2917/2917995.png' },
    ];

    return mockCommodities;
  } catch (error) {
    console.error('[ForexService] Kritik hata:', error);
    
    const mockCommodities: CommodityPrice[] = [
      { symbol: 'GOLD', name: 'Altın', price: 2850.00, unit: 'TRY/Gram', change: 35.00, changePercent: 1.24, logo: 'https://cdn-icons-png.flaticon.com/512/2917/2917995.png' },
      { symbol: 'SILVER', name: 'Gümüş', price: 32.50, unit: 'TRY/Gram', change: 0.80, changePercent: 2.52, logo: 'https://cdn-icons-png.flaticon.com/512/2917/2917995.png' },
      { symbol: 'BRENT', name: 'Brent Petrol', price: 85.20, unit: 'USD/Varil', change: 1.20, changePercent: 1.43, logo: 'https://cdn-icons-png.flaticon.com/512/3050/3050390.png' },
      { symbol: 'WTI', name: 'Ham Petrol', price: 80.50, unit: 'USD/Varil', change: 0.80, changePercent: 1.00, logo: 'https://cdn-icons-png.flaticon.com/512/3050/3050390.png' },
      { symbol: 'COPPER', name: 'Bakır', price: 8.75, unit: 'USD/lb', change: 0.15, changePercent: 1.74, logo: 'https://cdn-icons-png.flaticon.com/512/2917/2917995.png' },
    ];

    return mockCommodities;
  }
}
