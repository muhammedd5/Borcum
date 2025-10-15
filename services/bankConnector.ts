import { BankType, Debt, BankConnection } from '@/types';
import { getBankInfo } from '@/constants/banks';

export interface BankAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string[];
}

export interface BankAuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface BankAccountData {
  accountNumber: string;
  balance: string;
  currency: string;
  accountType: 'checking' | 'savings' | 'credit_card' | 'loan';
}

export interface BankDebtData {
  accountNumber: string;
  debtType: 'credit_card' | 'consumer_loan' | 'mortgage' | 'vehicle_loan';
  balance: string;
  interestRate: string;
  monthlyPayment: string;
  dueDate: string;
  minimumPayment?: string;
}

export abstract class BankConnectorAdapter {
  protected bankType: BankType;
  protected config: BankAuthConfig;

  constructor(bankType: BankType, config: BankAuthConfig) {
    this.bankType = bankType;
    this.config = config;
  }

  abstract authenticate(username: string, password: string): Promise<BankAuthResponse>;
  
  abstract refreshToken(refreshToken: string): Promise<BankAuthResponse>;
  
  abstract getAccounts(accessToken: string): Promise<BankAccountData[]>;
  
  abstract getDebts(accessToken: string): Promise<BankDebtData[]>;
  
  abstract disconnect(accessToken: string): Promise<void>;

  getBankInfo() {
    return getBankInfo(this.bankType);
  }
}

export class MockBankConnector extends BankConnectorAdapter {
  private mockDelay = 1500;

  async authenticate(username: string, password: string): Promise<BankAuthResponse> {
    console.log(`[MockBankConnector] ${this.bankType} için kimlik doğrulama başlatılıyor...`);
    console.log(`[MockBankConnector] Kullanıcı: ${username}`);
    
    await this.delay(this.mockDelay);

    if (password === 'wrong') {
      throw new Error('Geçersiz kullanıcı adı veya şifre');
    }

    const mockToken = this.generateMockToken();
    
    console.log(`[MockBankConnector] Kimlik doğrulama başarılı. Token: ${mockToken.substring(0, 20)}...`);

    return {
      accessToken: mockToken,
      refreshToken: this.generateMockToken(),
      expiresIn: 3600,
      tokenType: 'Bearer',
    };
  }

  async refreshToken(refreshToken: string): Promise<BankAuthResponse> {
    console.log(`[MockBankConnector] Token yenileniyor...`);
    
    await this.delay(500);

    return {
      accessToken: this.generateMockToken(),
      refreshToken: this.generateMockToken(),
      expiresIn: 3600,
      tokenType: 'Bearer',
    };
  }

  async getAccounts(accessToken: string): Promise<BankAccountData[]> {
    console.log(`[MockBankConnector] ${this.bankType} hesapları çekiliyor...`);
    
    await this.delay(this.mockDelay);

    const mockAccounts: BankAccountData[] = [
      {
        accountNumber: `****${Math.floor(1000 + Math.random() * 9000)}`,
        balance: (Math.random() * 50000 + 10000).toFixed(2),
        currency: 'TRY',
        accountType: 'checking',
      },
      {
        accountNumber: `****${Math.floor(1000 + Math.random() * 9000)}`,
        balance: (Math.random() * 100000 + 20000).toFixed(2),
        currency: 'TRY',
        accountType: 'savings',
      },
    ];

    console.log(`[MockBankConnector] ${mockAccounts.length} hesap bulundu`);

    return mockAccounts;
  }

  async getDebts(accessToken: string): Promise<BankDebtData[]> {
    console.log(`[MockBankConnector] ${this.bankType} borçları çekiliyor...`);
    
    await this.delay(this.mockDelay);

    const mockDebts: BankDebtData[] = [];

    if (Math.random() > 0.3) {
      mockDebts.push({
        accountNumber: `****${Math.floor(1000 + Math.random() * 9000)}`,
        debtType: 'credit_card',
        balance: (Math.random() * 20000 + 5000).toFixed(2),
        interestRate: (Math.random() * 2 + 2.5).toFixed(2),
        monthlyPayment: (Math.random() * 2000 + 500).toFixed(2),
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        minimumPayment: (Math.random() * 500 + 100).toFixed(2),
      });
    }

    if (Math.random() > 0.7) {
      mockDebts.push({
        accountNumber: `****${Math.floor(1000 + Math.random() * 9000)}`,
        debtType: 'consumer_loan',
        balance: (Math.random() * 100000 + 30000).toFixed(2),
        interestRate: (Math.random() * 1 + 1.5).toFixed(2),
        monthlyPayment: (Math.random() * 5000 + 2000).toFixed(2),
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    console.log(`[MockBankConnector] ${mockDebts.length} borç bulundu`);

    return mockDebts;
  }

  async disconnect(accessToken: string): Promise<void> {
    console.log(`[MockBankConnector] ${this.bankType} bağlantısı kesiliyor...`);
    
    await this.delay(500);

    console.log(`[MockBankConnector] Bağlantı başarıyla kesildi`);
  }

  private generateMockToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 64; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export class BankConnectorFactory {
  static create(bankType: BankType, config: BankAuthConfig): BankConnectorAdapter {
    console.log(`[BankConnectorFactory] ${bankType} için connector oluşturuluyor...`);
    
    return new MockBankConnector(bankType, config);
  }

  static getDefaultConfig(bankType: BankType): BankAuthConfig {
    return {
      clientId: `mock_client_${bankType}`,
      clientSecret: `mock_secret_${bankType}`,
      redirectUri: 'odezen://auth/callback',
      scope: ['accounts', 'debts', 'transactions'],
    };
  }
}

export const connectToBank = async (
  bankType: BankType,
  username: string,
  password: string
): Promise<{ connection: BankConnection; debts: Debt[] }> => {
  console.log(`[connectToBank] ${bankType} bankasına bağlanılıyor...`);

  const config = BankConnectorFactory.getDefaultConfig(bankType);
  const connector = BankConnectorFactory.create(bankType, config);
  
  const authResponse = await connector.authenticate(username, password);
  
  const [accounts, bankDebts] = await Promise.all([
    connector.getAccounts(authResponse.accessToken),
    connector.getDebts(authResponse.accessToken),
  ]);

  const bankInfo = connector.getBankInfo();

  const connection: BankConnection = {
    id: `conn_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    bankType,
    bankName: bankInfo.name,
    accountNumber: accounts[0]?.accountNumber || '****0000',
    isConnected: true,
    lastSyncedAt: new Date().toISOString(),
    accessToken: authResponse.accessToken,
    refreshToken: authResponse.refreshToken,
    expiresAt: new Date(Date.now() + authResponse.expiresIn * 1000).toISOString(),
    connectionMethod: 'api',
  };

  const debts: Debt[] = bankDebts.map(bankDebt => ({
    id: `debt_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    bankName: bankInfo.name,
    bankType,
    accountNumber: bankDebt.accountNumber,
    debtType: bankDebt.debtType,
    balance: bankDebt.balance,
    interestRate: bankDebt.interestRate,
    interestType: 'fixed' as const,
    monthlyPayment: bankDebt.monthlyPayment,
    minimumPayment: bankDebt.minimumPayment,
    dueDate: bankDebt.dueDate,
    isOverdue: new Date(bankDebt.dueDate) < new Date(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  console.log(`[connectToBank] Bağlantı başarılı. ${debts.length} borç bulundu.`);

  return { connection, debts };
};
