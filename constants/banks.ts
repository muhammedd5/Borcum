import { BankType } from '@/types';

export interface BankInfo {
  type: BankType;
  name: string;
  shortName: string;
  color: string;
  logo: string;
  hasAPI: boolean;
  apiEndpoint?: string;
  appScheme?: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
}

export const BANKS: Record<BankType, BankInfo> = {
  isbank: {
    type: 'isbank',
    name: 'Türkiye İş Bankası',
    shortName: 'İş Bankası',
    color: '#004B93',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Isbank_logo.svg/200px-Isbank_logo.svg.png',
    hasAPI: true,
    apiEndpoint: 'https://api.isbank.com.tr',
    appScheme: 'isbankasi://',
    appStoreUrl: 'https://apps.apple.com/tr/app/i%CC%87%C5%9Fcep/id536890629',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.pozitron.iscep',
  },
  ziraat: {
    type: 'ziraat',
    name: 'Ziraat Bankası',
    shortName: 'Ziraat',
    color: '#00843D',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Ziraat-Bankasi-logo.svg/200px-Ziraat-Bankasi-logo.svg.png',
    hasAPI: true,
    apiEndpoint: 'https://api.ziraatbank.com.tr',
    appScheme: 'ziraatmobile://',
    appStoreUrl: 'https://apps.apple.com/tr/app/ziraat-mobil/id574234518',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.ziraat.ziraatmobil',
  },
  garanti: {
    type: 'garanti',
    name: 'Garanti BBVA',
    shortName: 'Garanti',
    color: '#00A650',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Garanti_BBVA_logo.svg/200px-Garanti_BBVA_logo.svg.png',
    hasAPI: true,
    apiEndpoint: 'https://api.garantibbva.com.tr',
    appScheme: 'garantibbva://',
    appStoreUrl: 'https://apps.apple.com/tr/app/garanti-bbva-mobile/id301559683',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.garanti.cepsubesi',
  },
  yapikredi: {
    type: 'yapikredi',
    name: 'Yapı Kredi',
    shortName: 'Yapı Kredi',
    color: '#005DAA',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Yap%C4%B1_Kredi_logo.svg/200px-Yap%C4%B1_Kredi_logo.svg.png',
    hasAPI: true,
    apiEndpoint: 'https://api.yapikredi.com.tr',
    appScheme: 'yapikredi://',
    appStoreUrl: 'https://apps.apple.com/tr/app/yap%C4%B1-kredi-mobile/id417605332',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.ykb.android',
  },
  akbank: {
    type: 'akbank',
    name: 'Akbank',
    shortName: 'Akbank',
    color: '#ED1C24',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Akbank_logo.svg/200px-Akbank_logo.svg.png',
    hasAPI: true,
    apiEndpoint: 'https://api.akbank.com',
    appScheme: 'akbank://',
    appStoreUrl: 'https://apps.apple.com/tr/app/akbank-direkt/id391127622',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.akbank.android.apps.akbank_direkt',
  },
  vakifbank: {
    type: 'vakifbank',
    name: 'VakıfBank',
    shortName: 'VakıfBank',
    color: '#FFB81C',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/VakifBank_logo.svg/200px-VakifBank_logo.svg.png',
    hasAPI: true,
    apiEndpoint: 'https://api.vakifbank.com.tr',
    appScheme: 'vakifbank://',
    appStoreUrl: 'https://apps.apple.com/tr/app/vak%C4%B1fbank-mobil-bankacilik/id399161979',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.vakifbank.mobile',
  },
  halkbank: {
    type: 'halkbank',
    name: 'Halkbank',
    shortName: 'Halkbank',
    color: '#E30613',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Halkbank_logo.svg/200px-Halkbank_logo.svg.png',
    hasAPI: true,
    apiEndpoint: 'https://api.halkbank.com.tr',
    appScheme: 'halkbank://',
    appStoreUrl: 'https://apps.apple.com/tr/app/halkbank-mobil/id395899296',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.halkbank.mobil',
  },
  qnb: {
    type: 'qnb',
    name: 'QNB Finansbank',
    shortName: 'QNB',
    color: '#4E2A84',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/QNB_Finansbank_logo.svg/200px-QNB_Finansbank_logo.svg.png',
    hasAPI: true,
    apiEndpoint: 'https://api.qnbfinansbank.com',
    appScheme: 'qnbfinansbank://',
    appStoreUrl: 'https://apps.apple.com/tr/app/qnb-finansbank-cep-%C5%9Fubesi/id417175077',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=finansbank.enpara',
  },
  denizbank: {
    type: 'denizbank',
    name: 'DenizBank',
    shortName: 'DenizBank',
    color: '#00A651',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/DenizBank_logo.svg/200px-DenizBank_logo.svg.png',
    hasAPI: true,
    apiEndpoint: 'https://api.denizbank.com',
    appScheme: 'denizbank://',
    appStoreUrl: 'https://apps.apple.com/tr/app/denizbank-mobil/id395899296',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.denizbank.mobildeniz',
  },
  teb: {
    type: 'teb',
    name: 'TEB',
    shortName: 'TEB',
    color: '#0066B3',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/TEB_logo.svg/200px-TEB_logo.svg.png',
    hasAPI: true,
    apiEndpoint: 'https://api.teb.com.tr',
    appScheme: 'teb://',
    appStoreUrl: 'https://apps.apple.com/tr/app/teb/id395899296',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.teb.mobil',
  },
  other: {
    type: 'other',
    name: 'Diğer',
    shortName: 'Diğer',
    color: '#8E8E93',
    logo: 'https://via.placeholder.com/200x200/8E8E93/FFFFFF?text=Bank',
    hasAPI: false,
  },
};

export const getBankInfo = (bankType: BankType): BankInfo => {
  return BANKS[bankType];
};

export const getAllBanks = (): BankInfo[] => {
  return Object.values(BANKS);
};
