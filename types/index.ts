export type BankType = 
  | 'isbank'
  | 'ziraat'
  | 'garanti'
  | 'yapikredi'
  | 'akbank'
  | 'vakifbank'
  | 'halkbank'
  | 'qnb'
  | 'denizbank'
  | 'teb'
  | 'other';

export type DebtType = 'credit_card' | 'consumer_loan' | 'mortgage' | 'vehicle_loan';

export type InterestType = 'fixed' | 'declining';

export interface Debt {
  id: string;
  bankName: string;
  bankType: BankType;
  accountNumber: string;
  contractNumber?: string;
  debtType: DebtType;
  balance: string;
  interestRate: string;
  interestType: InterestType;
  monthlyPayment: string;
  dueDate: string;
  minimumPayment?: string;
  isOverdue: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AmortizationRow {
  month: number;
  payment: string;
  principal: string;
  interest: string;
  remainingBalance: string;
  date: string;
}

export interface PaymentPlan {
  debtId: string;
  totalPayment: string;
  totalInterest: string;
  totalPrincipal: string;
  numberOfPayments: number;
  amortizationSchedule: AmortizationRow[];
  createdAt: string;
}

export type AssetType = 'stock' | 'crypto' | 'gold' | 'forex' | 'fund';

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  assetType: AssetType;
  quantity: string;
  averagePrice: string;
  currentPrice: string;
  totalValue: string;
  profitLoss: string;
  profitLossPercentage: string;
  lastUpdated: string;
  logo?: string;
}

export interface Portfolio {
  totalValue: string;
  totalCost: string;
  totalProfitLoss: string;
  totalProfitLossPercentage: string;
  assets: Asset[];
  lastUpdated: string;
}

export interface Campaign {
  id: string;
  bankName: string;
  bankType: BankType;
  title: string;
  description: string;
  interestRate?: string;
  validUntil: string;
  sourceUrl: string;
  campaignType: 'loan' | 'credit_card' | 'limit_increase' | 'zero_interest';
  isVerified: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  phone?: string;
  fullName: string;
  hasCompletedOnboarding: boolean;
  hasBiometricEnabled: boolean;
  hasKVKKConsent: boolean;
  hasOpenBankingConsent: boolean;
  createdAt: string;
}

export interface DashboardSummary {
  totalDebt: string;
  dueThisMonth: string;
  overdueAmount: string;
  portfolioValue: string;
  availableBalance: string;
  monthlyInterestCost: string;
  potentialSavings: string;
}

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  potentialSavings: string;
  priority: 'high' | 'medium' | 'low';
  actionType: 'pay_debt' | 'refinance' | 'consolidate' | 'invest';
  relatedDebtIds?: string[];
  createdAt: string;
}

export interface BankConnection {
  id: string;
  bankType: BankType;
  bankName: string;
  accountNumber: string;
  isConnected: boolean;
  lastSyncedAt?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
  connectionMethod: 'api' | 'manual' | 'csv_import';
}
