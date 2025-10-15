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
import { Plus, CreditCard, ArrowRight } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { formatCurrency, Decimal } from '@/utils/decimal';

import { MOCK_DEBTS } from '@/services/mockData';
import { getBankInfo } from '@/constants/banks';
import { Stack, router } from 'expo-router';
import { Debt } from '@/types';

export default function DebtsIndexScreen() {
  const [filter, setFilter] = useState<'all' | 'credit_card' | 'loan'>('all');

  const filteredDebts = MOCK_DEBTS.filter(debt => {
    if (filter === 'all') return true;
    if (filter === 'credit_card') return debt.debtType === 'credit_card';
    return debt.debtType !== 'credit_card';
  });

  const totalDebt = filteredDebts.reduce(
    (sum, debt) => sum.add(Decimal.fromString(debt.balance)),
    Decimal.zero()
  );



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
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryLabel}>Toplam Borç</Text>
              <TouchableOpacity>
                <Text style={styles.eyeIcon}>👁</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.summaryAmount}>{formatCurrency(totalDebt.toString())}</Text>
            <Text style={styles.summarySubtext}>{filteredDebts.length} borç</Text>
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
            {filteredDebts.length === 0 ? (
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
                  <TouchableOpacity key={debt.id} style={styles.debtCard}>
                    <View style={styles.debtCardHeader}>
                      <View style={styles.debtCardLeft}>
                        <View style={[styles.debtIconContainer, { backgroundColor: cardColor }]}>
                          <CreditCard size={24} color={Colors.light.surface} />
                        </View>
                        <View>
                          <Text style={styles.debtCardTitle}>{debt.bankName}</Text>
                          <Text style={styles.debtCardSubtitle}>
                            {debt.debtType === 'credit_card' ? 'Kredi Kartı' : 'Kredi'}
                          </Text>
                        </View>
                      </View>
                      <ArrowRight size={20} color={Colors.light.textSecondary} />
                    </View>

                    <View style={styles.debtCardBody}>
                      <View style={styles.debtAmountRow}>
                        <Text style={styles.debtAmountLabel}>Borç Tutarı</Text>
                        <Text style={styles.debtAmount}>{formatCurrency(debt.balance)}</Text>
                      </View>

                      <View style={styles.debtDetailsRow}>
                        <View style={styles.debtDetailItem}>
                          <Text style={styles.debtDetailLabel}>Aylık Ödeme</Text>
                          <Text style={styles.debtDetailValue}>{formatCurrency(debt.monthlyPayment)}</Text>
                        </View>
                        <View style={styles.debtDetailDivider} />
                        <View style={styles.debtDetailItem}>
                          <Text style={styles.debtDetailLabel}>Faiz Oranı</Text>
                          <Text style={styles.debtDetailValue}>%{debt.interestRate}</Text>
                        </View>
                        <View style={styles.debtDetailDivider} />
                        <View style={styles.debtDetailItem}>
                          <Text style={styles.debtDetailLabel}>Son Ödeme</Text>
                          <Text style={[styles.debtDetailValue, isUrgent && { color: Colors.light.error }]}>
                            {debt.isOverdue ? 'Gecikmiş' : `${daysUntilDue} gün`}
                          </Text>
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
    marginBottom: 32,
    padding: 28,
    borderRadius: 28,
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.shadow.color,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: Colors.light.shadow.opacity,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  summaryLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  summaryAmount: {
    fontSize: 40,
    fontWeight: '900',
    color: Colors.light.surface,
    marginTop: 8,
    marginBottom: 4,
    letterSpacing: -1,
  },
  summarySubtext: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
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
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  eyeIcon: {
    fontSize: 20,
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
  debtCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  debtCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
    marginBottom: 2,
  },
  debtCardSubtitle: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  debtCardBody: {
    padding: 16,
  },
  debtAmountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  debtAmountLabel: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    fontWeight: '600',
  },
  debtAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.light.text,
  },
  debtDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 12,
  },
  debtDetailItem: {
    flex: 1,
    alignItems: 'center',
  },
  debtDetailLabel: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  debtDetailValue: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: '700',
  },
  debtDetailDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.light.border,
    marginHorizontal: 8,
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
