import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, CreditCard, ArrowRight, TrendingUp, Calendar, AlertTriangle, CheckCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { formatCurrency, Decimal } from '@/utils/decimal';
import { getBankInfo } from '@/constants/banks';
import { Stack, router } from 'expo-router';
import { Debt } from '@/types';
import { useDebts } from '@/providers/debts';

export default function DebtsIndexScreen() {
  const { debts, isLoading } = useDebts();
  const [filter, setFilter] = useState<'all' | 'credit_card' | 'loan'>('all');

  const filteredDebts = debts.filter(debt => {
    if (filter === 'all') return true;
    if (filter === 'credit_card') return debt.debtType === 'credit_card';
    return debt.debtType !== 'credit_card';
  });

  const totalDebt = filteredDebts.reduce(
    (sum, debt) => sum.add(Decimal.fromString(debt.balance)),
    Decimal.zero()
  );

  const totalMonthlyPayment = filteredDebts.reduce(
    (sum, debt) => sum.add(Decimal.fromString(debt.monthlyPayment)),
    Decimal.zero()
  );

  const totalMonthlyInterest = filteredDebts.reduce(
    (sum, debt) => {
      const balance = Decimal.fromString(debt.balance);
      const rate = Decimal.fromString(debt.interestRate).divide(Decimal.fromString('100'));
      return sum.add(balance.multiply(rate));
    },
    Decimal.zero()
  );

  const overdueDebts = filteredDebts.filter(debt => debt.isOverdue).length;
  const upcomingDebts = filteredDebts.filter(debt => {
    const days = getDaysUntilDue(debt.dueDate);
    return days > 0 && days <= 7;
  }).length;



  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const handlePayment = async (debt: Debt) => {
    const bankInfo = getBankInfo(debt.bankType);
    
    if (Platform.OS === 'web') {
      Alert.alert(
        'Ödeme Yönlendirmesi',
        `${bankInfo.name} mobil uygulamasını kullanarak ödeme yapabilirsiniz.`,
        [
          { text: 'Tamam', style: 'cancel' },
        ]
      );
      return;
    }

    if (bankInfo.appScheme) {
      try {
        const canOpen = await Linking.canOpenURL(bankInfo.appScheme);
        if (canOpen) {
          await Linking.openURL(bankInfo.appScheme);
        } else {
          Alert.alert(
            'Uygulama Bulunamadı',
            `${bankInfo.name} uygulaması yüklü değil. Yüklemek ister misiniz?`,
            [
              { text: 'İptal', style: 'cancel' },
              {
                text: 'Yükle',
                onPress: () => {
                  const storeUrl = Platform.OS === 'ios' ? bankInfo.appStoreUrl : bankInfo.playStoreUrl;
                  if (storeUrl) {
                    Linking.openURL(storeUrl);
                  }
                },
              },
            ]
          );
        }
      } catch (error) {
        console.error('[DebtsScreen] Error opening bank app:', error);
        Alert.alert('Hata', 'Banka uygulaması açılamadı.');
      }
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'BORÇLARIM', headerShown: false }} />
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Borçlarım</Text>
          <TouchableOpacity 
            style={styles.addHeaderButton}
            onPress={() => router.push('/(tabs)/debts/add')}
          >
            <Plus size={22} color={Colors.light.surface} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >

          <LinearGradient
            colors={['#FF3B30', '#FF6B60']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.summaryCard}
          >
            <View style={styles.summaryMainInfo}>
              <View>
                <Text style={styles.summaryLabel}>Toplam Borç</Text>
                <Text style={styles.summaryAmount}>{formatCurrency(totalDebt.toString())}</Text>
              </View>
              <TouchableOpacity style={styles.eyeButton}>
                <Text style={styles.eyeIcon}>👁</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.summaryStats}>
              <View style={styles.statItem}>
                <View style={styles.statIcon}>
                  <CreditCard size={16} color="rgba(255,255,255,0.9)" strokeWidth={2} />
                </View>
                <View>
                  <Text style={styles.statLabel}>{filteredDebts.length} Borç</Text>
                  <Text style={styles.statValue}>{formatCurrency(totalMonthlyPayment.toString())}</Text>
                  <Text style={styles.statDesc}>Aylık Ödeme</Text>
                </View>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statItem}>
                <View style={styles.statIcon}>
                  <TrendingUp size={16} color="rgba(255,255,255,0.9)" strokeWidth={2} />
                </View>
                <View>
                  <Text style={styles.statLabel}>Aylık Faiz</Text>
                  <Text style={styles.statValue}>{formatCurrency(totalMonthlyInterest.toString())}</Text>
                  {overdueDebts > 0 && (
                    <Text style={styles.statWarning}>⚠ {overdueDebts} Gecikmiş</Text>
                  )}
                  {overdueDebts === 0 && upcomingDebts > 0 && (
                    <Text style={styles.statDesc}>{upcomingDebts} Yaklaşan</Text>
                  )}
                </View>
              </View>
            </View>
          </LinearGradient>

          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
              onPress={() => setFilter('all')}
            >
              <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
                Tümü
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filter === 'credit_card' && styles.filterButtonActive]}
              onPress={() => setFilter('credit_card')}
            >
              <Text style={[styles.filterText, filter === 'credit_card' && styles.filterTextActive]}>
                Kredi Kartı
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filter === 'loan' && styles.filterButtonActive]}
              onPress={() => setFilter('loan')}
            >
              <Text style={[styles.filterText, filter === 'loan' && styles.filterTextActive]}>
                Krediler
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            {isLoading ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateTitle}>Yükleniyor...</Text>
              </View>
            ) : filteredDebts.length === 0 ? (
              <View style={styles.emptyState}>
                <CreditCard size={64} color={Colors.light.textSecondary} strokeWidth={1.5} />
                <Text style={styles.emptyStateTitle}>Henüz borç eklenmemiş</Text>
                <Text style={styles.emptyStateText}>
                  Borçlarınızı takip etmek için yukarıdaki &quot;Borç Ekle&quot; butonuna tıklayın.
                </Text>
              </View>
            ) : (
              filteredDebts.map((debt) => {
                const bankInfo = getBankInfo(debt.bankType);
                const daysUntilDue = getDaysUntilDue(debt.dueDate);
                const isUrgent = daysUntilDue <= 7 || debt.isOverdue;

                const cardColors = [
                  '#1e3a8a',
                  '#7c3aed',
                  '#0891b2',
                  '#059669',
                  '#dc2626',
                ];
                const colorIndex = parseInt(debt.id.slice(-1), 16) % cardColors.length;
                const cardColor = cardColors[colorIndex];

                return (
                  <TouchableOpacity 
                    key={debt.id} 
                    style={[
                      styles.debtCard,
                      isUrgent && styles.debtCardUrgent
                    ]}
                  >
                    <View style={styles.debtCardHeader}>
                      <View style={styles.debtCardLeft}>
                        <View style={[styles.debtIconContainer, { backgroundColor: cardColor }]}>
                          <CreditCard size={24} color={Colors.light.surface} />
                        </View>
                        <View style={styles.debtHeaderInfo}>
                          <View style={styles.debtTitleRow}>
                            <Text style={styles.debtCardTitle}>{debt.bankName}</Text>
                            {debt.isOverdue && (
                              <View style={styles.overdueTag}>
                                <AlertTriangle size={12} color={Colors.light.error} strokeWidth={2.5} />
                                <Text style={styles.overdueTagText}>Gecikmiş</Text>
                              </View>
                            )}
                            {!debt.isOverdue && daysUntilDue <= 7 && (
                              <View style={styles.warningTag}>
                                <Calendar size={12} color={Colors.light.warning} strokeWidth={2.5} />
                                <Text style={styles.warningTagText}>{daysUntilDue}g</Text>
                              </View>
                            )}
                          </View>
                          <Text style={styles.debtCardSubtitle}>
                            {debt.debtType === 'credit_card' ? 'Kredi Kartı' : 
                             debt.debtType === 'consumer_loan' ? 'İhtiyaç Kredisi' :
                             debt.debtType === 'mortgage' ? 'Konut Kredisi' : 'Taşıt Kredisi'} •• {debt.accountNumber.slice(-4)}
                          </Text>
                        </View>
                      </View>
                      <ArrowRight size={20} color={Colors.light.textSecondary} />
                    </View>

                    <View style={styles.debtCardBody}>
                      <View style={styles.debtMainInfo}>
                        <View style={styles.debtAmountSection}>
                          <Text style={styles.debtAmountLabel}>Toplam Borç</Text>
                          <Text style={styles.debtAmount}>{formatCurrency(debt.balance)}</Text>
                        </View>
                        <View style={styles.debtInterestSection}>
                          <Text style={styles.debtInterestLabel}>Aylık Faiz</Text>
                          <Text style={styles.debtInterestValue}>
                            {formatCurrency(
                              Decimal.fromString(debt.balance)
                                .multiply(Decimal.fromString(debt.interestRate).divide(Decimal.fromString('100')))
                                .toString()
                            )}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.debtDetailsGrid}>
                        <View style={styles.debtDetailBox}>
                          <View style={styles.debtDetailIcon}>
                            <Calendar size={14} color={Colors.light.primary} strokeWidth={2} />
                          </View>
                          <View>
                            <Text style={styles.debtDetailLabel}>Aylık Ödeme</Text>
                            <Text style={styles.debtDetailValue}>{formatCurrency(debt.monthlyPayment)}</Text>
                          </View>
                        </View>

                        <View style={styles.debtDetailBox}>
                          <View style={styles.debtDetailIcon}>
                            <TrendingUp size={14} color={Colors.light.error} strokeWidth={2} />
                          </View>
                          <View>
                            <Text style={styles.debtDetailLabel}>Faiz Oranı</Text>
                            <Text style={styles.debtDetailValue}>%{debt.interestRate}</Text>
                          </View>
                        </View>

                        <View style={styles.debtDetailBox}>
                          <View style={styles.debtDetailIcon}>
                            {debt.isOverdue ? (
                              <AlertTriangle size={14} color={Colors.light.error} strokeWidth={2} />
                            ) : (
                              <CheckCircle size={14} color={Colors.light.success} strokeWidth={2} />
                            )}
                          </View>
                          <View>
                            <Text style={styles.debtDetailLabel}>Son Ödeme</Text>
                            <Text style={[styles.debtDetailValue, isUrgent && { color: Colors.light.error }]}>
                              {debt.isOverdue ? 'Gecikmiş!' : `${daysUntilDue} gün`}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    <TouchableOpacity 
                      style={styles.payButton}
                      onPress={() => handlePayment(debt)}
                    >
                      <Text style={styles.payButtonText}>Ödeme Yap</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })
            )}
          </View>


        </ScrollView>
      </SafeAreaView>
    </>
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
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginBottom: 4,
    fontWeight: '500',
  },
  userName: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.light.text,
    letterSpacing: -0.5,
  },
  addHeaderButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  summaryCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 24,
    borderRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  summaryMainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  summaryLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  summaryAmount: {
    fontSize: 36,
    fontWeight: '900',
    color: Colors.light.surface,
    letterSpacing: -1,
  },
  eyeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '600',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    color: Colors.light.surface,
    fontWeight: '800',
    marginBottom: 2,
  },
  statDesc: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.75)',
    fontWeight: '500',
  },
  statWarning: {
    fontSize: 10,
    color: '#FFD60A',
    fontWeight: '700',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: Colors.light.surfaceSecondary,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: Colors.light.primary,
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  filterText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.textSecondary,
  },
  filterTextActive: {
    color: Colors.light.surface,
  },
  section: {
    paddingHorizontal: 24,
  },
  cardWrapper: {
    marginBottom: 24,
    backgroundColor: Colors.light.surface,
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  creditCard: {
    width: '100%',
    aspectRatio: 1.586,
    padding: 28,
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardBankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardBankLogoContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  cardBankLogo: {
    width: '100%',
    height: '100%',
  },
  cardBankName: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  cardTypeIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  cardMiddle: {
    gap: 4,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  cardBalanceAmount: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  cardHolder: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardNumberContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 2,
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
  },
  cardChip: {
    width: 48,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    padding: 6,
  },
  chipInner: {
    flex: 1,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cardDetails: {
    padding: 20,
    gap: 12,
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  detailItem: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  detailIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  detailValue: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: '700',
    textAlign: 'center',
  },
  cardDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardDetailIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardDetailContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardDetailLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    fontWeight: '600',
  },
  cardDetailValue: {
    fontSize: 15,
    color: Colors.light.text,
    fontWeight: '700',
  },
  cardPayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 16,
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardPayButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.surface,
  },
  emptyState: {
    backgroundColor: Colors.light.surface,
    padding: 40,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.light.border,
    borderStyle: 'dashed',
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.light.text,
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  calculationInfo: {
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: 'rgba(255, 149, 0, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 149, 0, 0.2)',
  },
  calculationInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  calculationInfoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.text,
  },
  calculationInfoContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calculationInfoItem: {
    flex: 1,
    alignItems: 'center',
  },
  calculationInfoLabel: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  calculationInfoValue: {
    fontSize: 13,
    color: Colors.light.text,
    fontWeight: '700',
  },
  calculationInfoDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.light.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.light.text,
    letterSpacing: -0.5,
  },
  eyeIcon: {
    fontSize: 18,
  },
  debtCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  debtCardUrgent: {
    borderWidth: 2,
    borderColor: Colors.light.error,
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.error,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  debtCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  debtCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  debtHeaderInfo: {
    flex: 1,
  },
  debtTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  debtIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  debtCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  overdueTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  overdueTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.error,
    textTransform: 'uppercase' as const,
  },
  warningTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  warningTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.warning,
  },
  debtCardSubtitle: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  debtCardBody: {
    padding: 16,
  },
  debtMainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  debtAmountSection: {
    flex: 1,
  },
  debtAmountLabel: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  debtAmount: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.light.text,
    letterSpacing: -0.5,
  },
  debtInterestSection: {
    alignItems: 'flex-end',
  },
  debtInterestLabel: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontWeight: '600',
    marginBottom: 6,
  },
  debtInterestValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.error,
  },
  debtDetailsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  debtDetailBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.light.background,
    padding: 10,
    borderRadius: 12,
  },
  debtDetailIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: Colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  debtDetailLabel: {
    fontSize: 10,
    color: Colors.light.textSecondary,
    fontWeight: '600',
    marginBottom: 2,
  },
  debtDetailValue: {
    fontSize: 13,
    color: Colors.light.text,
    fontWeight: '800',
  },
  payButton: {
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 14,
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    alignItems: 'center',
  },
  payButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.surface,
  },
});
