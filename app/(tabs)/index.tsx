import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, CreditCard, ChevronRight, Plus, Repeat, Sparkles, PiggyBank, Gift, Bell } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { formatCurrency, Decimal } from '@/utils/decimal';
import { Asset, Debt } from '@/types';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const bankOffers = [
  {
    id: '1',
    bank: 'Ziraat Bankası',
    title: 'Konut Kredisi Fırsatı',
    description: '%0.99 faiz oranı ile konut kredisi',
    color: ['#FF6B6B', '#FF8E53'] as const,
  },
  {
    id: '2',
    bank: 'İş Bankası',
    title: 'İhtiyaç Kredisi',
    description: '36 aya varan vade seçenekleri',
    color: ['#4ECDC4', '#44A08D'] as const,
  },
  {
    id: '3',
    bank: 'Garanti BBVA',
    title: 'Taşıt Kredisi',
    description: 'Sıfır faiz kampanyası',
    color: ['#A8E6CF', '#56AB91'] as const,
  },
];

export default function DashboardScreen() {
  const [debts] = useState<Debt[]>([]);
  const [assets] = useState<Asset[]>([]);
  const [userName] = useState<string>('Kullanıcı');

  const portfolio = useMemo(() => {
    let totalValue = Decimal.zero();
    assets.forEach(a => {
      totalValue = totalValue.add(Decimal.fromString(a.totalValue));
    });
    return { totalValue: totalValue.toString() };
  }, [assets]);

  const summary = useMemo(() => {
    let totalDebt = Decimal.zero();
    let dueThisMonth = Decimal.zero();
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    debts.forEach(d => {
      totalDebt = totalDebt.add(Decimal.fromString(d.balance));
      const due = new Date(d.dueDate);
      if (due.getMonth() === month && due.getFullYear() === year) {
        dueThisMonth = dueThisMonth.add(Decimal.fromString(d.monthlyPayment));
      }
    });

    return {
      totalDebt: totalDebt.toString(),
      dueThisMonth: dueThisMonth.toString(),
      portfolioValue: portfolio.totalValue,
    };
  }, [debts, portfolio]);

  const netWorth = useMemo(() => {
    const assets = parseFloat(summary.portfolioValue || '0');
    const debts = parseFloat(summary.totalDebt || '0');
    return (assets - debts).toFixed(2);
  }, [summary]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Merhaba,</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton}>
              <Bell size={22} color={Colors.light.text} strokeWidth={2.5} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.avatarButton} onPress={() => router.push('/(tabs)/profile')}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{userName[0]}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.offersSection}>
          <View style={styles.offersSectionHeader}>
            <Gift size={20} color={Colors.light.text} strokeWidth={2.5} />
            <Text style={styles.offersSectionTitle}>Banka Fırsatları</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.offersScroll}
            snapToInterval={width - 64}
            decelerationRate="fast"
          >
            {bankOffers.map((offer) => (
              <TouchableOpacity key={offer.id} activeOpacity={0.9}>
                <LinearGradient
                  colors={offer.color}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.offerCard}
                >
                  <Text style={styles.offerBank}>{offer.bank}</Text>
                  <Text style={styles.offerTitle}>{offer.title}</Text>
                  <Text style={styles.offerDescription}>{offer.description}</Text>
                  <View style={styles.offerButton}>
                    <Text style={styles.offerButtonText}>Detaylar</Text>
                    <ChevronRight size={16} color="#fff" strokeWidth={3} />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.balanceSection}>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Net Değer</Text>
            <Text style={styles.balanceAmount}>{formatCurrency(netWorth)}</Text>
            <View style={styles.balanceRow}>
              <View style={styles.balanceItem}>
                <Text style={styles.balanceItemLabel}>Varlıklar</Text>
                <Text style={styles.balanceItemValue}>{formatCurrency(summary.portfolioValue)}</Text>
              </View>
              <View style={styles.balanceDivider} />
              <View style={styles.balanceItem}>
                <Text style={styles.balanceItemLabel}>Borçlar</Text>
                <Text style={styles.balanceItemValue}>{formatCurrency(summary.totalDebt)}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => router.push('/(tabs)/opportunities/auto-invest')}
          >
            <View style={styles.quickActionIcon}>
              <Repeat size={20} color={Colors.light.text} strokeWidth={2.5} />
            </View>
            <Text style={styles.quickActionLabel}>Oto Yatırım</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => router.push('/(tabs)/opportunities')}
          >
            <View style={styles.quickActionIcon}>
              <Sparkles size={20} color={Colors.light.text} strokeWidth={2.5} />
            </View>
            <Text style={styles.quickActionLabel}>Fırsatlar</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => router.push('/(tabs)/opportunities/budget')}
          >
            <View style={styles.quickActionIcon}>
              <PiggyBank size={20} color={Colors.light.text} strokeWidth={2.5} />
            </View>
            <Text style={styles.quickActionLabel}>Bütçe</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => router.push('/(tabs)/opportunities/goals')}
          >
            <View style={styles.quickActionIcon}>
              <TrendingUp size={20} color={Colors.light.text} strokeWidth={2.5} />
            </View>
            <Text style={styles.quickActionLabel}>Hedefler</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => router.push('/(tabs)/debts/add')}
          >
            <View style={styles.quickActionIcon}>
              <Plus size={20} color={Colors.light.text} strokeWidth={2.5} />
            </View>
            <Text style={styles.quickActionLabel}>Borç Ekle</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Varlıklarım</Text>
            <TouchableOpacity 
              style={styles.seeAllButton}
              onPress={() => router.push('/(tabs)/portfolio')}
            >
              <Text style={styles.seeAllText}>Tümü</Text>
              <ChevronRight size={16} color={Colors.light.textSecondary} />
            </TouchableOpacity>
          </View>

          {assets.length === 0 ? (
            <View style={styles.emptyCard}>
              <View style={styles.emptyIconContainer}>
                <TrendingUp size={32} color={Colors.light.textSecondary} strokeWidth={2} />
              </View>
              <Text style={styles.emptyTitle}>Henüz varlık eklemediniz</Text>
              <Text style={styles.emptyText}>
                Portföyünüze varlık ekleyerek toplam değerinizi takip edin
              </Text>
              <TouchableOpacity 
                style={styles.emptyButton}
                onPress={() => router.push('/(tabs)/portfolio')}
              >
                <Plus size={18} color={Colors.light.text} strokeWidth={2.5} />
                <Text style={styles.emptyButtonText}>Varlık Ekle</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.statsCard}>
              <View style={styles.statRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Toplam Değer</Text>
                  <Text style={styles.statValue}>{formatCurrency(summary.portfolioValue)}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Varlık Sayısı</Text>
                  <Text style={styles.statValue}>{assets.length}</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Borçlarım</Text>
            <TouchableOpacity 
              style={styles.seeAllButton}
              onPress={() => router.push('/(tabs)/debts')}
            >
              <Text style={styles.seeAllText}>Tümü</Text>
              <ChevronRight size={16} color={Colors.light.textSecondary} />
            </TouchableOpacity>
          </View>

          {debts.length === 0 ? (
            <View style={styles.emptyCard}>
              <View style={styles.emptyIconContainer}>
                <CreditCard size={32} color={Colors.light.textSecondary} strokeWidth={2} />
              </View>
              <Text style={styles.emptyTitle}>Henüz borç eklemediniz</Text>
              <Text style={styles.emptyText}>
                Borçlarınızı ekleyerek takip edin ve ödemelerinizi yönetin
              </Text>
              <TouchableOpacity 
                style={styles.emptyButton}
                onPress={() => router.push('/(tabs)/debts/add')}
              >
                <Plus size={18} color={Colors.light.text} strokeWidth={2.5} />
                <Text style={styles.emptyButtonText}>Borç Ekle</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.statsCard}>
              <View style={styles.statRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Toplam Borç</Text>
                  <Text style={[styles.statValue, { color: Colors.light.error }]}>
                    {formatCurrency(summary.totalDebt)}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Bu Ay Ödeme</Text>
                  <Text style={[styles.statValue, { color: Colors.light.error }]}>
                    {formatCurrency(summary.dueThisMonth)}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 2,
    fontWeight: '500',
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.light.text,
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarButton: {
    padding: 0,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.light.text,
  },
  offersSection: {
    marginBottom: 24,
  },
  offersSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  offersSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  offersScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  offerCard: {
    width: width - 64,
    padding: 20,
    borderRadius: 20,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  offerBank: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  offerDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 12,
    fontWeight: '500',
  },
  offerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 12,
  },
  offerButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  balanceSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  balanceCard: {
    backgroundColor: Colors.light.surface,
    padding: 24,
    borderRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.shadow.color,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  balanceLabel: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginBottom: 6,
    fontWeight: '600',
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '900',
    color: Colors.light.text,
    marginBottom: 20,
    letterSpacing: -1,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceItem: {
    flex: 1,
  },
  balanceDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.light.border,
    marginHorizontal: 16,
  },
  balanceItemLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginBottom: 4,
    fontWeight: '600',
  },
  balanceItemValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.light.text,
    letterSpacing: -0.3,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 32,
  },
  quickActionButton: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  quickActionIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.shadow.color,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  quickActionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.light.text,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.light.text,
    letterSpacing: -0.5,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: Colors.light.surfaceSecondary,
    borderRadius: 12,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.textSecondary,
  },
  emptyCard: {
    backgroundColor: Colors.light.surface,
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.light.border,
    borderStyle: 'dashed',
  },
  emptyIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: Colors.light.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.light.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: Colors.light.accent,
    borderRadius: 16,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.light.text,
  },
  statsCard: {
    backgroundColor: Colors.light.surface,
    padding: 24,
    borderRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.shadow.color,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: Colors.light.shadow.opacity,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  statRow: {
    flexDirection: 'row',
    gap: 24,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginBottom: 8,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.light.text,
    letterSpacing: -0.5,
  },
});
