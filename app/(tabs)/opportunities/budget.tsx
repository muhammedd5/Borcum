import React, { useState } from 'react';
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
import { Stack } from 'expo-router';
import { TrendingUp, TrendingDown, Plus, Trash2, DollarSign } from 'lucide-react-native';
import Colors from '@/constants/colors';

type Transaction = {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
};

export default function BudgetScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    type: 'expense' as 'income' | 'expense',
    category: '',
    amount: '',
    description: '',
  });

  const handleAddTransaction = () => {
    if (!newTransaction.category || !newTransaction.amount) {
      Alert.alert('Hata', 'Lütfen kategori ve tutar alanlarını doldurun');
      return;
    }

    const transaction: Transaction = {
      id: Date.now().toString(),
      type: newTransaction.type,
      category: newTransaction.category,
      amount: parseFloat(newTransaction.amount),
      description: newTransaction.description,
      date: new Date().toLocaleDateString('tr-TR'),
    };

    setTransactions([transaction, ...transactions]);
    setNewTransaction({ type: 'expense', category: '', amount: '', description: '' });
    setShowAddForm(false);
  };

  const handleDeleteTransaction = (id: string) => {
    Alert.alert(
      'İşlemi Sil',
      'Bu işlemi silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => setTransactions(transactions.filter(t => t.id !== id)),
        },
      ]
    );
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Bütçe Takibi',
          headerShown: true,
        }}
      />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.summaryContainer}>
            <View style={styles.summaryCard}>
              <View style={styles.summaryIcon}>
                <DollarSign size={24} color={Colors.light.primary} strokeWidth={2.5} />
              </View>
              <Text style={styles.summaryLabel}>Bakiye</Text>
              <Text style={[styles.summaryValue, balance >= 0 ? styles.positive : styles.negative]}>
                ₺{balance.toLocaleString('tr-TR')}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <View style={[styles.summaryCard, styles.summaryCardSmall]}>
                <TrendingUp size={20} color={Colors.light.success} strokeWidth={2.5} />
                <Text style={styles.summaryLabelSmall}>Gelir</Text>
                <Text style={[styles.summaryValueSmall, styles.positive]}>
                  ₺{totalIncome.toLocaleString('tr-TR')}
                </Text>
              </View>

              <View style={[styles.summaryCard, styles.summaryCardSmall]}>
                <TrendingDown size={20} color={Colors.light.error} strokeWidth={2.5} />
                <Text style={styles.summaryLabelSmall}>Gider</Text>
                <Text style={[styles.summaryValueSmall, styles.negative]}>
                  ₺{totalExpense.toLocaleString('tr-TR')}
                </Text>
              </View>
            </View>
          </View>

          {transactions.length === 0 && !showAddForm && (
            <View style={styles.emptyState}>
              <DollarSign size={64} color={Colors.light.textSecondary} strokeWidth={1.5} />
              <Text style={styles.emptyTitle}>Henüz işlem yok</Text>
              <Text style={styles.emptyDescription}>
                Gelir ve giderlerinizi ekleyerek bütçenizi takip etmeye başlayın
              </Text>
            </View>
          )}

          {showAddForm && (
            <View style={styles.addForm}>
              <Text style={styles.formTitle}>Yeni İşlem</Text>

              <View style={styles.typeSelector}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    newTransaction.type === 'income' && styles.typeButtonActive,
                  ]}
                  onPress={() => setNewTransaction({ ...newTransaction, type: 'income' })}
                >
                  <TrendingUp
                    size={20}
                    color={newTransaction.type === 'income' ? Colors.light.surface : Colors.light.success}
                  />
                  <Text
                    style={[
                      styles.typeButtonText,
                      newTransaction.type === 'income' && styles.typeButtonTextActive,
                    ]}
                  >
                    Gelir
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    newTransaction.type === 'expense' && styles.typeButtonActive,
                  ]}
                  onPress={() => setNewTransaction({ ...newTransaction, type: 'expense' })}
                >
                  <TrendingDown
                    size={20}
                    color={newTransaction.type === 'expense' ? Colors.light.surface : Colors.light.error}
                  />
                  <Text
                    style={[
                      styles.typeButtonText,
                      newTransaction.type === 'expense' && styles.typeButtonTextActive,
                    ]}
                  >
                    Gider
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Kategori</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Örn: Maaş, Kira, Market"
                  placeholderTextColor={Colors.light.textSecondary}
                  value={newTransaction.category}
                  onChangeText={(text) => setNewTransaction({ ...newTransaction, category: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Tutar (₺)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor={Colors.light.textSecondary}
                  keyboardType="numeric"
                  value={newTransaction.amount}
                  onChangeText={(text) => setNewTransaction({ ...newTransaction, amount: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Açıklama (Opsiyonel)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="İşlem açıklaması"
                  placeholderTextColor={Colors.light.textSecondary}
                  value={newTransaction.description}
                  onChangeText={(text) => setNewTransaction({ ...newTransaction, description: text })}
                />
              </View>

              <View style={styles.formButtons}>
                <TouchableOpacity
                  style={[styles.formButton, styles.cancelButton]}
                  onPress={() => {
                    setShowAddForm(false);
                    setNewTransaction({ type: 'expense', category: '', amount: '', description: '' });
                  }}
                >
                  <Text style={styles.cancelButtonText}>İptal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.formButton, styles.saveButton]}
                  onPress={handleAddTransaction}
                >
                  <Text style={styles.saveButtonText}>Kaydet</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {transactions.length > 0 && (
            <View style={styles.transactionsContainer}>
              <Text style={styles.transactionsTitle}>İşlemler</Text>
              {transactions.map((transaction) => (
                <View key={transaction.id} style={styles.transactionCard}>
                  <View style={styles.transactionLeft}>
                    <View
                      style={[
                        styles.transactionIcon,
                        transaction.type === 'income' ? styles.incomeIcon : styles.expenseIcon,
                      ]}
                    >
                      {transaction.type === 'income' ? (
                        <TrendingUp size={20} color={Colors.light.success} strokeWidth={2.5} />
                      ) : (
                        <TrendingDown size={20} color={Colors.light.error} strokeWidth={2.5} />
                      )}
                    </View>
                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionCategory}>{transaction.category}</Text>
                      {transaction.description ? (
                        <Text style={styles.transactionDescription}>{transaction.description}</Text>
                      ) : null}
                      <Text style={styles.transactionDate}>{transaction.date}</Text>
                    </View>
                  </View>
                  <View style={styles.transactionRight}>
                    <Text
                      style={[
                        styles.transactionAmount,
                        transaction.type === 'income' ? styles.positive : styles.negative,
                      ]}
                    >
                      {transaction.type === 'income' ? '+' : '-'}₺
                      {transaction.amount.toLocaleString('tr-TR')}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleDeleteTransaction(transaction.id)}
                      style={styles.deleteButton}
                    >
                      <Trash2 size={18} color={Colors.light.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {!showAddForm && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddForm(true)}
          >
            <Plus size={24} color={Colors.light.surface} strokeWidth={2.5} />
            <Text style={styles.addButtonText}>İşlem Ekle</Text>
          </TouchableOpacity>
        )}
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
    paddingBottom: 100,
  },
  summaryContainer: {
    padding: 20,
  },
  summaryCard: {
    backgroundColor: Colors.light.surface,
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: 'center',
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  summaryIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: `${Colors.light.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 8,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: '700',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCardSmall: {
    flex: 1,
    padding: 16,
  },
  summaryLabelSmall: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginTop: 8,
    marginBottom: 4,
    fontWeight: '600',
  },
  summaryValueSmall: {
    fontSize: 18,
    fontWeight: '700',
  },
  positive: {
    color: Colors.light.success,
  },
  negative: {
    color: Colors.light.error,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  addForm: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    backgroundColor: Colors.light.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 20,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.light.background,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
  },
  typeButtonActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  typeButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.text,
  },
  typeButtonTextActive: {
    color: Colors.light.surface,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.light.background,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.light.text,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  formButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.light.background,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  saveButton: {
    backgroundColor: Colors.light.primary,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.surface,
  },
  transactionsContainer: {
    paddingHorizontal: 20,
  },
  transactionsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 16,
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: 12,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  incomeIcon: {
    backgroundColor: 'rgba(52, 199, 89, 0.12)',
  },
  expenseIcon: {
    backgroundColor: 'rgba(255, 59, 48, 0.12)',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionCategory: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 2,
  },
  transactionDescription: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  transactionRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  deleteButton: {
    padding: 4,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    backgroundColor: Colors.light.primary,
    borderRadius: 16,
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
  addButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.light.surface,
  },
});
