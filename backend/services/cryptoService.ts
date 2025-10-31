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

const EXPANDED_CRYPTO_MAP: Record<string, string> = {
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
  SHIB: 'shiba-inu',
  APE: 'apecoin',
  SAND: 'the-sandbox',
  MANA: 'decentraland',
  AXS: 'axie-infinity',
  FTM: 'fantom',
  NEAR: 'near',
  HBAR: 'hedera-hashgraph',
  APT: 'aptos',
  QNT: 'quant-network',
  ICP: 'internet-computer',
  ARB: 'arbitrum',
  OP: 'optimism',
  INJ: 'injective-protocol',
  IMX: 'immutable-x',
  STX: 'blockstack',
  RUNE: 'thorchain',
  GRT: 'the-graph',
  EGLD: 'elrond-erd-2',
  AAVE: 'aave',
  MKR: 'maker',
  CRV: 'curve-dao-token',
  SNX: 'synthetix-network-token',
  COMP: 'compound-governance-token',
  SUSHI: 'sushi',
  YFI: 'yearn-finance',
  BAT: 'basic-attention-token',
  ENJ: 'enjincoin',
  CHZ: 'chiliz',
  GALA: 'gala',
  XTZ: 'tezos',
  EOS: 'eos',
  THETA: 'theta-token',
  FLOW: 'flow',
  XMR: 'monero',
  ETC: 'ethereum-classic',
  ZEC: 'zcash',
  DASH: 'dash',
  NEO: 'neo',
  IOTA: 'iota',
  XEM: 'nem',
  WAVES: 'waves',
  ZIL: 'zilliqa',
  ONT: 'ontology',
  QTUM: 'qtum',
};



export async function getCryptoPrices(symbols: string[]): Promise<Record<string, CryptoPrice>> {
  try {
    console.log('[CryptoService] Fiyatlar çekiliyor:', symbols);

    const ids = symbols
      .map(s => EXPANDED_CRYPTO_MAP[s.toUpperCase()])
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
      const symbol = Object.keys(EXPANDED_CRYPTO_MAP).find(
        key => EXPANDED_CRYPTO_MAP[key] === coin.id
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

const CRYPTO_LIST: CryptoSearchResult[] = Object.entries(EXPANDED_CRYPTO_MAP).map(([symbol, id]) => {
  const names: Record<string, string> = {
    BTC: 'Bitcoin',
    ETH: 'Ethereum',
    BNB: 'Binance Coin',
    XRP: 'Ripple',
    ADA: 'Cardano',
    SOL: 'Solana',
    DOGE: 'Dogecoin',
    AVAX: 'Avalanche',
    DOT: 'Polkadot',
    MATIC: 'Polygon',
    LINK: 'Chainlink',
    UNI: 'Uniswap',
    ATOM: 'Cosmos',
    LTC: 'Litecoin',
    BCH: 'Bitcoin Cash',
    XLM: 'Stellar',
    ALGO: 'Algorand',
    VET: 'VeChain',
    FIL: 'Filecoin',
    TRX: 'TRON',
    SHIB: 'Shiba Inu',
    APE: 'ApeCoin',
    SAND: 'The Sandbox',
    MANA: 'Decentraland',
    AXS: 'Axie Infinity',
    FTM: 'Fantom',
    NEAR: 'NEAR Protocol',
    HBAR: 'Hedera',
    APT: 'Aptos',
    QNT: 'Quant',
    ICP: 'Internet Computer',
    ARB: 'Arbitrum',
    OP: 'Optimism',
    INJ: 'Injective',
    IMX: 'Immutable X',
    STX: 'Stacks',
    RUNE: 'THORChain',
    GRT: 'The Graph',
    EGLD: 'MultiversX',
    AAVE: 'Aave',
    MKR: 'Maker',
    CRV: 'Curve DAO',
    SNX: 'Synthetix',
    COMP: 'Compound',
    SUSHI: 'SushiSwap',
    YFI: 'yearn.finance',
    BAT: 'Basic Attention',
    ENJ: 'Enjin',
    CHZ: 'Chiliz',
    GALA: 'Gala',
    XTZ: 'Tezos',
    EOS: 'EOS',
    THETA: 'Theta',
    FLOW: 'Flow',
    XMR: 'Monero',
    ETC: 'Ethereum Classic',
    ZEC: 'Zcash',
    DASH: 'Dash',
    NEO: 'NEO',
    IOTA: 'IOTA',
    XEM: 'NEM',
    WAVES: 'Waves',
    ZIL: 'Zilliqa',
    ONT: 'Ontology',
    QTUM: 'Qtum',
  };
  return {
    symbol,
    name: names[symbol] || symbol,
    logo: `https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/${symbol.toLowerCase()}.svg`,
    network: names[symbol] || symbol,
  };
});

export async function searchCrypto(query: string): Promise<CryptoSearchResult[]> {
  try {
    console.log('[CryptoService] Kripto arama:', query);

    const filtered = CRYPTO_LIST.filter(
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
