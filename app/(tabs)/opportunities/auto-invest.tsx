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
import { Repeat, Plus, Trash2, Calendar, TrendingUp } from 'lucide-react-native';
import Colors from '@/constants/colors';

type InvestmentPlan = {
  id: string;
  name: string;
  assetType: string;
  amount: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  startDate: string;
  isActive: boolean;
};

export default function AutoInvestScreen() {
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: '',
    assetType: '',
    amount: '',
    frequency: 'monthly' as 'daily' | 'weekly' | 'monthly',
    startDate: '',
  });

  const handleAddPlan = () => {
    if (!newPlan.name || !newPlan.assetType || !newPlan.amount || !newPlan.startDate) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    const plan: InvestmentPlan = {
      id: Date.now().toString(),
      name: newPlan.name,
      assetType: newPlan.assetType,
      amount: parseFloat(newPlan.amount),
      frequency: newPlan.frequency,
      startDate: newPlan.startDate,
      isActive: true,
    };

    setPlans([...plans, plan]);
    setNewPlan({ name: '', assetType: '', amount: '', frequency: 'monthly', startDate: '' });
    setShowAddForm(false);
  };

  const handleDeletePlan = (id: string) => {
    Alert.alert(
      'Planı Sil',
      'Bu yatırım planını silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => setPlans(plans.filter(p => p.id !== id)),
        },
      ]
    );
  };

  const togglePlanStatus = (id: string) => {
    setPlans(plans.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
  };

  const getFrequencyLabel = (frequency: string) => {
    const labels: Record<string, string> = {
      daily: 'Günlük',
      weekly: 'Haftalık',
      monthly: 'Aylık',
    };
    return labels[frequency] || frequency;
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Otomatik Yatırım',
          headerShown: true,
        }}
      />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Repeat size={32} color={Colors.light.primary} strokeWidth={2.5} />
            </View>
            <Text style={styles.headerTitle}>Yatırım Planlarınız</Text>
            <Text style={styles.headerSubtitle}>
              Düzenli alım planları oluşturun ve otomatik yatırım yapın
            </Text>
          </View>

          {plans.length === 0 && !showAddForm && (
            <View style={styles.emptyState}>
              <Repeat size={64} color={Colors.light.textSecondary} strokeWidth={1.5} />
              <Text style={styles.emptyTitle}>Henüz plan yok</Text>
              <Text style={styles.emptyDescription}>
                İlk otomatik yatırım planınızı oluşturun ve düzenli alım yapmaya başlayın
              </Text>
            </View>
          )}

          {plans.map((plan) => (
            <View key={plan.id} style={styles.planCard}>
              <View style={styles.planHeader}>
                <View style={styles.planHeaderLeft}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <View style={styles.statusBadge}>
                    <View style={[styles.statusDot, plan.isActive && styles.statusDotActive]} />
                    <Text style={styles.statusText}>
                      {plan.isActive ? 'Aktif' : 'Pasif'}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => handleDeletePlan(plan.id)}
                  style={styles.deleteButton}
                >
                  <Trash2 size={20} color={Colors.light.error} />
                </TouchableOpacity>
              </View>

              <View style={styles.planDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Varlık</Text>
                  <Text style={styles.detailValue}>{plan.assetType}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Tutar</Text>
                  <Text style={styles.detailValue}>₺{plan.amount.toLocaleString('tr-TR')}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Sıklık</Text>
                  <Text style={styles.detailValue}>{getFrequencyLabel(plan.frequency)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Başlangıç</Text>
                  <Text style={styles.detailValue}>{plan.startDate}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.toggleButton, plan.isActive && styles.toggleButtonActive]}
                onPress={() => togglePlanStatus(plan.id)}
              >
                <Text style={[styles.toggleButtonText, plan.isActive && styles.toggleButtonTextActive]}>
                  {plan.isActive ? 'Durdur' : 'Başlat'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}

          {showAddForm && (
            <View style={styles.addForm}>
              <Text style={styles.formTitle}>Yeni Plan</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Plan Adı</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Örn: Bitcoin Düzenli Alım"
                  placeholderTextColor={Colors.light.textSecondary}
                  value={newPlan.name}
                  onChangeText={(text) => setNewPlan({ ...newPlan, name: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Varlık Türü</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Örn: Bitcoin, Altın, BIST100"
                  placeholderTextColor={Colors.light.textSecondary}
                  value={newPlan.assetType}
                  onChangeText={(text) => setNewPlan({ ...newPlan, assetType: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Yatırım Tutarı (₺)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="1000"
                  placeholderTextColor={Colors.light.textSecondary}
                  keyboardType="numeric"
                  value={newPlan.amount}
                  onChangeText={(text) => setNewPlan({ ...newPlan, amount: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Sıklık</Text>
                <View style={styles.frequencySelector}>
                  <TouchableOpacity
                    style={[
                      styles.frequencyButton,
                      newPlan.frequency === 'daily' && styles.frequencyButtonActive,
                    ]}
                    onPress={() => setNewPlan({ ...newPlan, frequency: 'daily' })}
                  >
                    <Text
                      style={[
                        styles.frequencyButtonText,
                        newPlan.frequency === 'daily' && styles.frequencyButtonTextActive,
                      ]}
                    >
                      Günlük
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.frequencyButton,
                      newPlan.frequency === 'weekly' && styles.frequencyButtonActive,
                    ]}
                    onPress={() => setNewPlan({ ...newPlan, frequency: 'weekly' })}
                  >
                    <Text
                      style={[
                        styles.frequencyButtonText,
                        newPlan.frequency === 'weekly' && styles.frequencyButtonTextActive,
                      ]}
                    >
                      Haftalık
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.frequencyButton,
                      newPlan.frequency === 'monthly' && styles.frequencyButtonActive,
                    ]}
                    onPress={() => setNewPlan({ ...newPlan, frequency: 'monthly' })}
                  >
                    <Text
                      style={[
                        styles.frequencyButtonText,
                        newPlan.frequency === 'monthly' && styles.frequencyButtonTextActive,
                      ]}
                    >
                      Aylık
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Başlangıç Tarihi</Text>
                <TextInput
                  style={styles.input}
                  placeholder="01.01.2025"
                  placeholderTextColor={Colors.light.textSecondary}
                  value={newPlan.startDate}
                  onChangeText={(text) => setNewPlan({ ...newPlan, startDate: text })}
                />
              </View>

              <View style={styles.formButtons}>
                <TouchableOpacity
                  style={[styles.formButton, styles.cancelButton]}
                  onPress={() => {
                    setShowAddForm(false);
                    setNewPlan({ name: '', assetType: '', amount: '', frequency: 'monthly', startDate: '' });
                  }}
                >
                  <Text style={styles.cancelButtonText}>İptal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.formButton, styles.saveButton]}
                  onPress={handleAddPlan}
                >
                  <Text style={styles.saveButtonText}>Kaydet</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>

        {!showAddForm && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddForm(true)}
          >
            <Plus size={24} color={Colors.light.surface} strokeWidth={2.5} />
            <Text style={styles.addButtonText}>Plan Ekle</Text>
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
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: `${Colors.light.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
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
  planCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    backgroundColor: Colors.light.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
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
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  planHeaderLeft: {
    flex: 1,
  },
  planName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.textSecondary,
  },
  statusDotActive: {
    backgroundColor: Colors.light.success,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  deleteButton: {
    padding: 8,
  },
  planDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
  },
  toggleButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
  },
  toggleButtonActive: {
    backgroundColor: Colors.light.error,
    borderColor: Colors.light.error,
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  toggleButtonTextActive: {
    color: Colors.light.surface,
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
  frequencySelector: {
    flexDirection: 'row',
    gap: 8,
  },
  frequencyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
  },
  frequencyButtonActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  frequencyButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
  },
  frequencyButtonTextActive: {
    color: Colors.light.surface,
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
