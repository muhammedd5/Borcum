export interface CryptoPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  logo: string;
}

export interface CryptoSearchResult {
  symbol: string;
  name: string;
  logo: string;
  network?: string;
}

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

const CRYPTO_ID_MAP: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  BNB: 'binancecoin',
  XRP: 'ripple',
  ADA: 'cardano',
  SOL: 'solana',
  DOGE: 'dogecoin',
  AVAX: 'avalanche-2',
  DOT: 'polkadot',
  MATIC: 'matic-network',
  LINK: 'chainlink',
  UNI: 'uniswap',
  ATOM: 'cosmos',
  LTC: 'litecoin',
  BCH: 'bitcoin-cash',
  XLM: 'stellar',
  ALGO: 'algorand',
  VET: 'vechain',
  FIL: 'filecoin',
  TRX: 'tron',
};

export async function getCryptoPrices(symbols: string[]): Promise<Record<string, CryptoPrice>> {
  try {
    console.log('[CryptoService] Fiyatlar çekiliyor:', symbols);

    const ids = symbols
      .map(s => CRYPTO_ID_MAP[s.toUpperCase()])
      .filter(Boolean)
      .join(',');

    if (!ids) {
      console.log('[CryptoService] Geçersiz semboller');
      return {};
    }

    const url = `${COINGECKO_API}/coins/markets?vs_currency=try&ids=${ids}&order=market_cap_desc&sparkline=false&price_change_percentage=24h`;
    console.log('[CryptoService] API isteği:', url);

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[CryptoService] API hatası:', response.status, errorText);
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('[CryptoService] API yanıtı alındı:', data.length, 'kripto');

    const result: Record<string, CryptoPrice> = {};

    for (const coin of data) {
      const symbol = Object.keys(CRYPTO_ID_MAP).find(
        key => CRYPTO_ID_MAP[key] === coin.id
      );

      if (symbol) {
        console.log(`[CryptoService] ${symbol}: ${coin.current_price} TRY (${coin.price_change_percentage_24h?.toFixed(2)}%)`);
        result[symbol] = {
          symbol,
          name: coin.name,
          price: coin.current_price || 0,
          change24h: coin.price_change_percentage_24h || 0,
          marketCap: coin.market_cap || 0,
          volume24h: coin.total_volume || 0,
          logo: coin.image || `https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/${symbol.toLowerCase()}.svg`,
        };
      }
    }

    console.log('[CryptoService] Toplam fiyat:', Object.keys(result).length);
    return result;
  } catch (error) {
    console.error('[CryptoService] Hata:', error);
    return {};
  }
}

export async function searchCrypto(query: string): Promise<CryptoSearchResult[]> {
  try {
    console.log('[CryptoService] Kripto arama:', query);

    const cryptos: CryptoSearchResult[] = [
      { symbol: 'BTC', name: 'Bitcoin', network: 'Bitcoin', logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/btc.svg' },
      { symbol: 'ETH', name: 'Ethereum', network: 'Ethereum', logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/eth.svg' },
      { symbol: 'BNB', name: 'Binance Coin', network: 'BSC', logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/bnb.svg' },
      { symbol: 'XRP', name: 'Ripple', network: 'XRP Ledger', logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/xrp.svg' },
      { symbol: 'ADA', name: 'Cardano', network: 'Cardano', logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/ada.svg' },
      { symbol: 'SOL', name: 'Solana', network: 'Solana', logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/sol.svg' },
      { symbol: 'DOGE', name: 'Dogecoin', network: 'Dogecoin', logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/doge.svg' },
      { symbol: 'AVAX', name: 'Avalanche', network: 'Avalanche', logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/avax.svg' },
      { symbol: 'DOT', name: 'Polkadot', network: 'Polkadot', logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/dot.svg' },
      { symbol: 'MATIC', name: 'Polygon', network: 'Polygon', logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/matic.svg' },
      { symbol: 'LINK', name: 'Chainlink', network: 'Ethereum', logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/link.svg' },
      { symbol: 'UNI', name: 'Uniswap', network: 'Ethereum', logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/uni.svg' },
      { symbol: 'ATOM', name: 'Cosmos', network: 'Cosmos', logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/atom.svg' },
      { symbol: 'LTC', name: 'Litecoin', network: 'Litecoin', logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/ltc.svg' },
      { symbol: 'BCH', name: 'Bitcoin Cash', network: 'Bitcoin Cash', logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/bch.svg' },
      { symbol: 'XLM', name: 'Stellar', network: 'Stellar', logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/xlm.svg' },
      { symbol: 'ALGO', name: 'Algorand', network: 'Algorand', logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/algo.svg' },
      { symbol: 'VET', name: 'VeChain', network: 'VeChain', logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/vet.svg' },
      { symbol: 'FIL', name: 'Filecoin', network: 'Filecoin', logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/fil.svg' },
      { symbol: 'TRX', name: 'TRON', network: 'TRON', logo: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/trx.svg' },
    ];

    const filtered = cryptos.filter(
      crypto =>
        crypto.symbol.toLowerCase().includes(query.toLowerCase()) ||
        crypto.name.toLowerCase().includes(query.toLowerCase())
    );

    return filtered;
  } catch (error) {
    console.error('[CryptoService] Arama hatası:', error);
    return [];
  }
}
