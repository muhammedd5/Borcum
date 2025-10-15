import { 
  Debt, 
  Asset, 
  Campaign, 
  DashboardSummary, 
  AIRecommendation,
  BankConnection,
  Portfolio,
} from '@/types';
import { Decimal } from '@/utils/decimal';

export const MOCK_DEBTS: Debt[] = [];

export const getDebts = (): Debt[] => {
  try {
    return MOCK_DEBTS;
  } catch (error) {
    console.error('[mockData] Error getting debts:', error);
    return [];
  }
};

export const MOCK_ASSETS: Asset[] = [];

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: '1',
    bankName: 'Garanti BBVA',
    bankType: 'garanti',
    title: '0 Faizli Nakit Avans Kampanyası',
    description: '3 ay boyunca 0 faiz ile 50.000 TL\'ye kadar nakit avans çekme fırsatı. Sadece maaş müşterilerine özel. Başvuru için mobil uygulamamızı kullanabilirsiniz.',
    interestRate: '0',
    validUntil: new Date(2025, 2, 31).toISOString(),
    sourceUrl: 'https://www.garantibbva.com.tr/kampanyalar',
    campaignType: 'zero_interest',
    isVerified: true,
    createdAt: new Date(2025, 0, 1).toISOString(),
  },
  {
    id: '2',
    bankName: 'Yapı Kredi',
    bankType: 'yapikredi',
    title: 'Konut Kredisi Faiz İndirimi',
    description: 'Yeni konut kredisi başvurularında %1.69 sabit faiz fırsatı. 120 aya kadar vade seçeneği. Emlak danışmanlarımızla ücretsiz görüşme imkanı.',
    interestRate: '1.69',
    validUntil: new Date(2025, 1, 28).toISOString(),
    sourceUrl: 'https://www.yapikredi.com.tr/kampanyalar',
    campaignType: 'loan',
    isVerified: true,
    createdAt: new Date(2025, 0, 5).toISOString(),
  },
  {
    id: '3',
    bankName: 'İş Bankası',
    bankType: 'isbank',
    title: 'Kredi Kartı Limit Artırımı',
    description: 'Düzenli ödeme yapan müşterilerimize %50\'ye varan limit artırımı. Başvuru gerektirmez, otomatik değerlendirme. Anında sonuç alın.',
    validUntil: new Date(2025, 1, 15).toISOString(),
    sourceUrl: 'https://www.isbank.com.tr/kampanyalar',
    campaignType: 'credit_card',
    isVerified: true,
    createdAt: new Date(2025, 0, 10).toISOString(),
  },
  {
    id: '4',
    bankName: 'Akbank',
    bankType: 'akbank',
    title: 'İhtiyaç Kredisi Özel Faiz',
    description: '100.000 TL\'ye kadar ihtiyaç kredisinde %1.99 aylık faiz. 36 aya kadar vade imkanı. Online başvuru ile 15 dakikada onay.',
    interestRate: '1.99',
    validUntil: new Date(2025, 2, 1).toISOString(),
    sourceUrl: 'https://www.akbank.com/kampanyalar',
    campaignType: 'loan',
    isVerified: true,
    createdAt: new Date(2025, 0, 8).toISOString(),
  },
  {
    id: '5',
    bankName: 'Ziraat Bankası',
    bankType: 'ziraat',
    title: 'Taşıt Kredisi Kampanyası',
    description: 'Sıfır araç alımlarında %1.75 aylık faiz. 60 aya kadar vade, %20 peşinat ile. Tüm marka ve modellerde geçerli.',
    interestRate: '1.75',
    validUntil: new Date(2025, 1, 20).toISOString(),
    sourceUrl: 'https://www.ziraatbank.com.tr/kampanyalar',
    campaignType: 'loan',
    isVerified: true,
    createdAt: new Date(2025, 0, 12).toISOString(),
  },
  {
    id: '6',
    bankName: 'VakıfBank',
    bankType: 'vakifbank',
    title: 'Dijital Kredi Kartı Başvurusu',
    description: 'Online başvuru yapan yeni müşterilere ilk yıl kart ücreti yok. 100.000 TL\'ye kadar limit. Anında dijital kart.',
    validUntil: new Date(2025, 2, 15).toISOString(),
    sourceUrl: 'https://www.vakifbank.com.tr/kampanyalar',
    campaignType: 'credit_card',
    isVerified: true,
    createdAt: new Date(2025, 0, 15).toISOString(),
  },
  {
    id: '7',
    bankName: 'QNB Finansbank',
    bankType: 'qnb',
    title: 'Taksitli Nakit Avans',
    description: '6 ay 0 faiz ile taksitli nakit avans. Kredi kartı limitinizin %80\'ine kadar kullanım imkanı. Ek ücret yok.',
    interestRate: '0',
    validUntil: new Date(2025, 1, 25).toISOString(),
    sourceUrl: 'https://www.qnbfinansbank.com/kampanyalar',
    campaignType: 'zero_interest',
    isVerified: true,
    createdAt: new Date(2025, 0, 18).toISOString(),
  },
  {
    id: '8',
    bankName: 'DenizBank',
    bankType: 'denizbank',
    title: 'Ticari Kredi Fırsatı',
    description: 'KOBİ\'lere özel %1.85 aylık faiz ile 500.000 TL\'ye kadar ticari kredi. 48 aya kadar vade. 3 ay ödemesiz dönem.',
    interestRate: '1.85',
    validUntil: new Date(2025, 2, 10).toISOString(),
    sourceUrl: 'https://www.denizbank.com/kampanyalar',
    campaignType: 'loan',
    isVerified: true,
    createdAt: new Date(2025, 0, 20).toISOString(),
  },
  {
    id: '9',
    bankName: 'Halkbank',
    bankType: 'halkbank',
    title: 'Emekli Kredisi Kampanyası',
    description: 'Emeklilere özel %1.79 faiz oranı. 36 aya kadar vade. Maaş promosyonu ile ek avantajlar.',
    interestRate: '1.79',
    validUntil: new Date(2025, 1, 28).toISOString(),
    sourceUrl: 'https://www.halkbank.com.tr/kampanyalar',
    campaignType: 'loan',
    isVerified: true,
    createdAt: new Date(2025, 0, 22).toISOString(),
  },
  {
    id: '10',
    bankName: 'TEB',
    bankType: 'teb',
    title: 'Kredi Kartı Borç Transfer',
    description: 'Diğer bankalardan kredi kartı borcunuzu transfer edin. 12 ay %0 faiz. Transfer ücreti yok.',
    interestRate: '0',
    validUntil: new Date(2025, 2, 5).toISOString(),
    sourceUrl: 'https://www.teb.com.tr/kampanyalar',
    campaignType: 'zero_interest',
    isVerified: true,
    createdAt: new Date(2025, 0, 25).toISOString(),
  },
];

export const MOCK_AI_RECOMMENDATIONS: AIRecommendation[] = [
  {
    id: '1',
    title: 'Yüksek Faizli Kredi Kartını Önce Öde',
    description: 'Garanti BBVA kredi kartınızın faiz oranı %3.5. Bu kartı öncelikli olarak kapatarak aylık 551 TL faiz tasarrufu sağlayabilirsiniz.',
    potentialSavings: '6612.00',
    priority: 'high',
    actionType: 'pay_debt',
    relatedDebtIds: ['1'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Portföyünüzden Borç Ödemesi Yapın',
    description: 'Bitcoin varlığınızın değeri 1.6M TL ve %14.29 kârda. Bir kısmını satarak yüksek faizli borçlarınızı kapatabilirsiniz.',
    potentialSavings: '15000.00',
    priority: 'high',
    actionType: 'pay_debt',
    relatedDebtIds: ['1', '2'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Borç Konsolidasyonu Fırsatı',
    description: 'Kredi kartı borçlarınızı (toplam 27.421 TL) daha düşük faizli bir ihtiyaç kredisi ile birleştirerek aylık 450 TL tasarruf edebilirsiniz.',
    potentialSavings: '5400.00',
    priority: 'medium',
    actionType: 'consolidate',
    relatedDebtIds: ['1', '2', '4'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Gecikmiş Ödemeyi Hemen Yapın',
    description: 'Ziraat Bankası kredi kartınızda gecikmiş ödeme var. Gecikme faizi ve ceza uygulanmadan önce ödeme yapmanızı öneririz.',
    potentialSavings: '0',
    priority: 'high',
    actionType: 'pay_debt',
    relatedDebtIds: ['4'],
    createdAt: new Date().toISOString(),
  },
];

export const MOCK_BANK_CONNECTIONS: BankConnection[] = [
  {
    id: '1',
    bankType: 'garanti',
    bankName: 'Garanti BBVA',
    accountNumber: '****1234',
    isConnected: true,
    lastSyncedAt: new Date().toISOString(),
    connectionMethod: 'api',
  },
  {
    id: '2',
    bankType: 'yapikredi',
    bankName: 'Yapı Kredi',
    accountNumber: '****5678',
    isConnected: true,
    lastSyncedAt: new Date(Date.now() - 3600000).toISOString(),
    connectionMethod: 'api',
  },
  {
    id: '3',
    bankType: 'isbank',
    bankName: 'İş Bankası',
    accountNumber: '****9012',
    isConnected: true,
    lastSyncedAt: new Date(Date.now() - 7200000).toISOString(),
    connectionMethod: 'api',
  },
];

export const calculateDashboardSummary = (debts: Debt[], portfolio: Portfolio): DashboardSummary => {
  let totalDebt = Decimal.zero();
  let dueThisMonth = Decimal.zero();
  let overdueAmount = Decimal.zero();
  let monthlyInterestCost = Decimal.zero();

  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  debts.forEach(debt => {
    const balance = Decimal.fromString(debt.balance);
    totalDebt = totalDebt.add(balance);

    const dueDate = new Date(debt.dueDate);
    if (dueDate.getMonth() === thisMonth && dueDate.getFullYear() === thisYear) {
      dueThisMonth = dueThisMonth.add(Decimal.fromString(debt.monthlyPayment));
    }

    if (debt.isOverdue) {
      overdueAmount = overdueAmount.add(balance);
    }

    const monthlyRate = Decimal.fromString(debt.interestRate).divide(Decimal.fromString('100'));
    const monthlyInterest = balance.multiply(monthlyRate);
    monthlyInterestCost = monthlyInterestCost.add(monthlyInterest);
  });

  const potentialSavings = monthlyInterestCost.multiply(Decimal.fromString('12'));

  return {
    totalDebt: totalDebt.toString(),
    dueThisMonth: dueThisMonth.toString(),
    overdueAmount: overdueAmount.toString(),
    portfolioValue: portfolio.totalValue,
    availableBalance: Decimal.fromString(portfolio.totalValue).subtract(totalDebt).toString(),
    monthlyInterestCost: monthlyInterestCost.toString(),
    potentialSavings: potentialSavings.toString(),
  };
};

export const calculatePortfolio = (assets: Asset[]): Portfolio => {
  let totalValue = Decimal.zero();
  let totalCost = Decimal.zero();

  assets.forEach(asset => {
    const value = Decimal.fromString(asset.totalValue);
    totalValue = totalValue.add(value);

    const quantity = Decimal.fromString(asset.quantity);
    const avgPrice = Decimal.fromString(asset.averagePrice);
    const cost = quantity.multiply(avgPrice);
    totalCost = totalCost.add(cost);
  });

  const totalProfitLoss = totalValue.subtract(totalCost);
  const totalProfitLossPercentage = totalCost.isZero() 
    ? Decimal.zero() 
    : totalProfitLoss.divide(totalCost).multiply(Decimal.fromString('100'));

  return {
    totalValue: totalValue.toString(),
    totalCost: totalCost.toString(),
    totalProfitLoss: totalProfitLoss.toString(),
    totalProfitLossPercentage: totalProfitLossPercentage.toString(),
    assets,
    lastUpdated: new Date().toISOString(),
  };
};
