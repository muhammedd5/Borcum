import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { X, Info, TrendingDown, Calendar, DollarSign, AlertCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { getAllBanks } from '@/constants/banks';
import { DebtType, InterestType, BankType } from '@/types';
import { calculateLoan, calculateCreditCardPayoffTime, simulateCreditCardPayments } from '@/utils/calculations';
import { formatCurrency } from '@/utils/decimal';
import { LinearGradient } from 'expo-linear-gradient';

export default function AddDebtScreen() {
  const [selectedBank, setSelectedBank] = useState<BankType | null>(null);
  const [debtType, setDebtType] = useState<DebtType>('credit_card');
  const [interestType, setInterestType] = useState<InterestType>('fixed');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [balance, setBalance] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('');
  const [monthlyPayment, setMonthlyPayment] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [loanTermMonths, setLoanTermMonths] = useState<string>('12');

  const banks = getAllBanks().filter(b => b.type !== 'other');

  const debtTypes: { value: DebtType; label: string }[] = [
    { value: 'credit_card', label: 'Kredi Kartı' },
    { value: 'consumer_loan', label: 'İhtiyaç Kredisi' },
    { value: 'mortgage', label: 'Konut Kredisi' },
    { value: 'vehicle_loan', label: 'Taşıt Kredisi' },
  ];

  const interestTypes: { value: InterestType; label: string }[] = [
    { value: 'fixed', label: 'Sabit Taksit' },
    { value: 'declining', label: 'Azalan Bakiye' },
  ];

  const calculationResult = useMemo<{
    type: 'credit_card' | 'loan';
    months: number;
    totalPayment: string;
    totalInterest: string;
    monthlyPayment: string;
    schedule: any[];
    error?: string;
  } | null>(() => {
    if (!balance || !interestRate) return null;

    const balanceNum = parseFloat(balance);
    const rateNum = parseFloat(interestRate);

    if (balanceNum <= 0 || rateNum < 0) return null;

    if (debtType === 'credit_card') {
      if (!monthlyPayment) return null;
      const paymentNum = parseFloat(monthlyPayment);
      if (paymentNum <= 0) return null;

      const monthlyInterest = balanceNum * (rateNum / 100);
      if (paymentNum <= monthlyInterest) {
        return {
          type: 'credit_card',
          months: 0,
          totalPayment: '0',
          totalInterest: '0',
          monthlyPayment: monthlyPayment,
          schedule: [],
          error: `Aylık ödemeniz (${formatCurrency(paymentNum.toFixed(2))}) faiz tutarından (${formatCurrency(monthlyInterest.toFixed(2))}) büyük olmalıdır. Aksi takdirde borcunuz hiç bitmez!`,
        };
      }

      try {
        const result = calculateCreditCardPayoffTime(balance, interestRate, monthlyPayment);
        const schedule = simulateCreditCardPayments(balance, interestRate, monthlyPayment);
        
        return {
          type: 'credit_card' as const,
          months: result.months,
          totalPayment: result.totalPayment,
          totalInterest: result.totalInterest,
          monthlyPayment: monthlyPayment,
          schedule,
        };
      } catch (error) {
        console.error('[AddDebt] Credit card calculation error:', error);
        return {
          type: 'credit_card',
          months: 0,
          totalPayment: '0',
          totalInterest: '0',
          monthlyPayment: monthlyPayment,
          schedule: [],
          error: error instanceof Error ? error.message : 'Hesaplama hatası',
        };
      }
    } else {
      const termMonths = parseInt(loanTermMonths) || 12;
      if (termMonths <= 0) return null;

      try {
        const result = calculateLoan({
          principal: balance,
          annualInterestRate: (rateNum * 12).toString(),
          numberOfMonths: termMonths,
          interestType,
        });

        return {
          type: 'loan' as const,
          months: termMonths,
          monthlyPayment: result.monthlyPayment,
          totalPayment: result.totalPayment,
          totalInterest: result.totalInterest,
          schedule: result.amortizationSchedule,
        };
      } catch (error) {
        console.error('[AddDebt] Loan calculation error:', error);
        return {
          type: 'loan',
          months: 0,
          totalPayment: '0',
          totalInterest: '0',
          monthlyPayment: '0',
          schedule: [],
          error: error instanceof Error ? error.message : 'Hesaplama hatası',
        };
      }
    }
  }, [balance, interestRate, monthlyPayment, debtType, interestType, loanTermMonths]);

  const handleSave = () => {
    if (!selectedBank) {
      Alert.alert('Hata', 'Lütfen banka seçiniz.');
      return;
    }
    if (!balance || parseFloat(balance) <= 0) {
      Alert.alert('Hata', 'Lütfen geçerli bir borç tutarı giriniz.');
      return;
    }
    if (!interestRate || parseFloat(interestRate) < 0) {
      Alert.alert('Hata', 'Lütfen geçerli bir faiz oranı giriniz.');
      return;
    }

    if (debtType === 'credit_card' && (!monthlyPayment || parseFloat(monthlyPayment) <= 0)) {
      Alert.alert('Hata', 'Lütfen geçerli bir aylık ödeme tutarı giriniz.');
      return;
    }

    if (debtType !== 'credit_card' && (!loanTermMonths || parseInt(loanTermMonths) <= 0)) {
      Alert.alert('Hata', 'Lütfen geçerli bir vade süresi giriniz.');
      return;
    }

    if (!calculationResult) {
      Alert.alert('Hata', 'Hesaplama yapılamadı. Lütfen girdiğiniz bilgileri kontrol edin.');
      return;
    }

    console.log('[AddDebt] Saving debt', {
      selectedBank,
      debtType,
      interestType,
      accountNumber,
      balance,
      interestRate,
      monthlyPayment: calculationResult.monthlyPayment,
      totalPayment: calculationResult.totalPayment,
      totalInterest: calculationResult.totalInterest,
      months: calculationResult.months,
      dueDate,
    });

    Alert.alert('Başarılı', 'Borç başarıyla eklendi.', [
      {
        text: 'Tamam',
        onPress: () => router.back(),
      },
    ]);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Borç Ekle',
          headerShown: true,
          presentation: 'modal',
          headerRight: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <X size={24} color={Colors.light.text} />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Banka Seçin</Text>
            <View style={styles.bankGrid}>
              {banks.map((bank) => (
                <TouchableOpacity
                  key={bank.type}
                  style={[
                    styles.bankCard,
                    selectedBank === bank.type && styles.bankCardSelected,
                  ]}
                  onPress={() => setSelectedBank(bank.type)}
                >
                  <View
                    style={[
                      styles.bankColorIndicator,
                      { backgroundColor: bank.color },
                    ]}
                  />
                  <Text style={styles.bankName}>{bank.shortName}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Borç Türü</Text>
            <View style={styles.optionGrid}>
              {debtTypes.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.optionCard,
                    debtType === type.value && styles.optionCardSelected,
                  ]}
                  onPress={() => setDebtType(type.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      debtType === type.value && styles.optionTextSelected,
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {debtType !== 'credit_card' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Faiz Türü</Text>
              <View style={styles.optionGrid}>
                {interestTypes.map((type) => (
                  <TouchableOpacity
                    key={type.value}
                    style={[
                      styles.optionCard,
                      interestType === type.value && styles.optionCardSelected,
                    ]}
                    onPress={() => setInterestType(type.value)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        interestType === type.value && styles.optionTextSelected,
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Borç Bilgileri</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Hesap/Kart Numarası (Son 4 Hane)</Text>
              <TextInput
                style={styles.input}
                value={accountNumber}
                onChangeText={setAccountNumber}
                placeholder="****1234"
                placeholderTextColor={Colors.light.textSecondary}
                maxLength={4}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Borç Tutarı (₺)</Text>
              <TextInput
                style={styles.input}
                value={balance}
                onChangeText={setBalance}
                placeholder="0.00"
                placeholderTextColor={Colors.light.textSecondary}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Aylık Faiz Oranı (%)
              </Text>
              <TextInput
                style={styles.input}
                value={interestRate}
                onChangeText={setInterestRate}
                placeholder="3.5"
                placeholderTextColor={Colors.light.textSecondary}
                keyboardType="decimal-pad"
              />
              <Text style={styles.inputHint}>
                Türkiye&apos;de kredi kartı faiz oranları genellikle aylık %2.5 - %4.5 arasındadır.
                {interestRate && balance && (
                  <Text style={{ fontWeight: '700' as const, color: Colors.light.error }}>
                    {' '}Aylık faiz: {formatCurrency((parseFloat(balance) * parseFloat(interestRate) / 100).toFixed(2))}
                  </Text>
                )}
              </Text>
            </View>

            {debtType === 'credit_card' ? (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Aylık Ödeme Tutarı (₺)</Text>
                <TextInput
                  style={styles.input}
                  value={monthlyPayment}
                  onChangeText={setMonthlyPayment}
                  placeholder="0.00"
                  placeholderTextColor={Colors.light.textSecondary}
                  keyboardType="decimal-pad"
                />
                <Text style={styles.inputHint}>
                  Kredi kartı borcunuz için her ay ne kadar ödeme yapmayı planlıyorsunuz?
                </Text>
              </View>
            ) : (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Vade Süresi (Ay)</Text>
                <TextInput
                  style={styles.input}
                  value={loanTermMonths}
                  onChangeText={setLoanTermMonths}
                  placeholder="12"
                  placeholderTextColor={Colors.light.textSecondary}
                  keyboardType="number-pad"
                />
                <Text style={styles.inputHint}>
                  Kredinizin kaç ay vadeli olduğunu girin.
                </Text>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Son Ödeme Tarihi (GG/AA/YYYY)</Text>
              <TextInput
                style={styles.input}
                value={dueDate}
                onChangeText={setDueDate}
                placeholder="15/01/2025"
                placeholderTextColor={Colors.light.textSecondary}
              />
            </View>
          </View>

          {calculationResult && !calculationResult.error && (
            <View style={styles.calculationSection}>
              <View style={styles.calculationHeader}>
                <Info size={20} color={Colors.light.primary} />
                <Text style={styles.calculationTitle}>Hesaplama Özeti</Text>
              </View>

              <LinearGradient
                colors={['#F8F9FA', '#FFFFFF']}
                style={styles.calculationCard}
              >
                <View style={styles.calculationRow}>
                  <View style={styles.calculationIconContainer}>
                    <DollarSign size={18} color={Colors.light.primary} />
                  </View>
                  <View style={styles.calculationContent}>
                    <Text style={styles.calculationLabel}>Aylık Ödeme</Text>
                    <Text style={styles.calculationValue}>
                      {formatCurrency(calculationResult.monthlyPayment)}
                    </Text>
                  </View>
                </View>

                <View style={styles.calculationDivider} />

                <View style={styles.calculationRow}>
                  <View style={styles.calculationIconContainer}>
                    <Calendar size={18} color={Colors.light.success} />
                  </View>
                  <View style={styles.calculationContent}>
                    <Text style={styles.calculationLabel}>Ödeme Süresi</Text>
                    <Text style={styles.calculationValue}>
                      {calculationResult.months} ay
                    </Text>
                  </View>
                </View>

                <View style={styles.calculationDivider} />

                <View style={styles.calculationRow}>
                  <View style={styles.calculationIconContainer}>
                    <TrendingDown size={18} color={Colors.light.error} />
                  </View>
                  <View style={styles.calculationContent}>
                    <Text style={styles.calculationLabel}>Toplam Faiz</Text>
                    <Text style={[styles.calculationValue, { color: Colors.light.error }]}>
                      {formatCurrency(calculationResult.totalInterest)}
                    </Text>
                  </View>
                </View>

                <View style={styles.calculationDivider} />

                <View style={styles.calculationRow}>
                  <View style={styles.calculationIconContainer}>
                    <DollarSign size={18} color={Colors.light.text} />
                  </View>
                  <View style={styles.calculationContent}>
                    <Text style={styles.calculationLabel}>Toplam Ödeme</Text>
                    <Text style={[styles.calculationValue, { fontWeight: '800' as const }]}>
                      {formatCurrency(calculationResult.totalPayment)}
                    </Text>
                  </View>
                </View>
              </LinearGradient>

              <View style={styles.warningBox}>
                <Info size={16} color={Colors.light.warning} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.warningText}>
                    {debtType === 'credit_card' 
                      ? `Her ay ${formatCurrency(calculationResult.monthlyPayment)} ödeme yaptığınızda borcunuzu ${calculationResult.months} ayda kapatacaksınız.`
                      : `${interestType === 'fixed' ? 'Sabit taksit' : 'Azalan bakiye'} sisteminde ${calculationResult.months} ay vadeli kredi.`
                    }
                  </Text>
                  <Text style={[styles.warningText, { marginTop: 8, fontWeight: '700' as const }]}>
                    💰 Toplam {formatCurrency(calculationResult.totalInterest)} faiz ödeyeceksiniz.
                  </Text>
                  {debtType === 'credit_card' && calculationResult.months > 12 && (
                    <Text style={[styles.warningText, { marginTop: 8, color: Colors.light.error }]}>
                      ⚠️ Ödeme süreniz 1 yıldan uzun! Daha fazla ödeme yaparak faiz tasarrufu sağlayabilirsiniz.
                    </Text>
                  )}
                </View>
              </View>
            </View>
          )}

          {calculationResult?.error && (
            <View style={styles.errorBox}>
              <AlertCircle size={20} color={Colors.light.error} />
              <Text style={styles.errorText}>{calculationResult.error}</Text>
            </View>
          )}

          <TouchableOpacity 
            style={[styles.saveButton, (!calculationResult || calculationResult.error) && styles.saveButtonDisabled]} 
            onPress={handleSave}
            disabled={!calculationResult || !!calculationResult.error}
          >
            <Text style={styles.saveButtonText}>Borç Ekle</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
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
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 12,
  },
  bankGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  bankCard: {
    width: '48%',
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.light.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  bankCardSelected: {
    borderColor: Colors.light.primary,
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
  },
  bankColorIndicator: {
    width: 32,
    height: 32,
    borderRadius: 8,
    marginBottom: 8,
  },
  bankName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.light.border,
    alignItems: 'center',
  },
  optionCardSelected: {
    borderColor: Colors.light.primary,
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  optionTextSelected: {
    color: Colors.light.primary,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  inputHint: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 6,
  },
  saveButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 12,
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
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.surface,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  calculationSection: {
    marginTop: 8,
    marginBottom: 20,
  },
  calculationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  calculationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
  },
  calculationCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 20,
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
  calculationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  calculationIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calculationContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calculationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  calculationValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  calculationDivider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: 12,
  },
  warningBox: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 149, 0, 0.2)',
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: Colors.light.text,
    fontWeight: '500',
  },
  errorBox: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
    alignItems: 'center',
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: Colors.light.error,
    fontWeight: '600',
  },
});
