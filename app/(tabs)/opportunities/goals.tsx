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
import { Stack, router } from 'expo-router';
import { Target, Plus, Trash2, TrendingUp, Calendar } from 'lucide-react-native';
import Colors from '@/constants/colors';

type Goal = {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  createdAt: string;
};

export default function GoalsScreen() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
  });

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.targetAmount || !newGoal.deadline) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: parseFloat(newGoal.currentAmount || '0'),
      deadline: newGoal.deadline,
      createdAt: new Date().toISOString(),
    };

    setGoals([...goals, goal]);
    setNewGoal({ title: '', targetAmount: '', currentAmount: '', deadline: '' });
    setShowAddForm(false);
  };

  const handleDeleteGoal = (id: string) => {
    Alert.alert(
      'Hedefi Sil',
      'Bu hedefi silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => setGoals(goals.filter(g => g.id !== id)),
        },
      ]
    );
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Finansal Hedefler',
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
              <Target size={32} color={Colors.light.primary} strokeWidth={2.5} />
            </View>
            <Text style={styles.headerTitle}>Hedefleriniz</Text>
            <Text style={styles.headerSubtitle}>
              Finansal hedeflerinizi belirleyin ve takip edin
            </Text>
          </View>

          {goals.length === 0 && !showAddForm && (
            <View style={styles.emptyState}>
              <Target size={64} color={Colors.light.textSecondary} strokeWidth={1.5} />
              <Text style={styles.emptyTitle}>Henüz hedef yok</Text>
              <Text style={styles.emptyDescription}>
                İlk finansal hedefinizi oluşturun ve tasarruf yolculuğunuza başlayın
              </Text>
            </View>
          )}

          {goals.map((goal) => {
            const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
            const remaining = goal.targetAmount - goal.currentAmount;

            return (
              <View key={goal.id} style={styles.goalCard}>
                <View style={styles.goalHeader}>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  <TouchableOpacity
                    onPress={() => handleDeleteGoal(goal.id)}
                    style={styles.deleteButton}
                  >
                    <Trash2 size={20} color={Colors.light.error} />
                  </TouchableOpacity>
                </View>

                <View style={styles.amountRow}>
                  <View style={styles.amountItem}>
                    <Text style={styles.amountLabel}>Mevcut</Text>
                    <Text style={styles.amountValue}>
                      ₺{goal.currentAmount.toLocaleString('tr-TR')}
                    </Text>
                  </View>
                  <View style={styles.amountItem}>
                    <Text style={styles.amountLabel}>Hedef</Text>
                    <Text style={styles.amountValue}>
                      ₺{goal.targetAmount.toLocaleString('tr-TR')}
                    </Text>
                  </View>
                </View>

                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${progress}%` }]} />
                  </View>
                  <Text style={styles.progressText}>{progress.toFixed(1)}%</Text>
                </View>

                <View style={styles.goalFooter}>
                  <View style={styles.remainingContainer}>
                    <TrendingUp size={16} color={Colors.light.success} />
                    <Text style={styles.remainingText}>
                      ₺{remaining.toLocaleString('tr-TR')} kaldı
                    </Text>
                  </View>
                  <View style={styles.deadlineContainer}>
                    <Calendar size={16} color={Colors.light.textSecondary} />
                    <Text style={styles.deadlineText}>{goal.deadline}</Text>
                  </View>
                </View>
              </View>
            );
          })}

          {showAddForm && (
            <View style={styles.addForm}>
              <Text style={styles.formTitle}>Yeni Hedef</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Hedef Adı</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Örn: 1M TRY biriktir"
                  placeholderTextColor={Colors.light.textSecondary}
                  value={newGoal.title}
                  onChangeText={(text) => setNewGoal({ ...newGoal, title: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Hedef Tutar (₺)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="1000000"
                  placeholderTextColor={Colors.light.textSecondary}
                  keyboardType="numeric"
                  value={newGoal.targetAmount}
                  onChangeText={(text) => setNewGoal({ ...newGoal, targetAmount: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Mevcut Tutar (₺)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor={Colors.light.textSecondary}
                  keyboardType="numeric"
                  value={newGoal.currentAmount}
                  onChangeText={(text) => setNewGoal({ ...newGoal, currentAmount: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Hedef Tarih</Text>
                <TextInput
                  style={styles.input}
                  placeholder="31.12.2025"
                  placeholderTextColor={Colors.light.textSecondary}
                  value={newGoal.deadline}
                  onChangeText={(text) => setNewGoal({ ...newGoal, deadline: text })}
                />
              </View>

              <View style={styles.formButtons}>
                <TouchableOpacity
                  style={[styles.formButton, styles.cancelButton]}
                  onPress={() => {
                    setShowAddForm(false);
                    setNewGoal({ title: '', targetAmount: '', currentAmount: '', deadline: '' });
                  }}
                >
                  <Text style={styles.cancelButtonText}>İptal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.formButton, styles.saveButton]}
                  onPress={handleAddGoal}
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
            <Text style={styles.addButtonText}>Hedef Ekle</Text>
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
  goalCard: {
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
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
    flex: 1,
  },
  deleteButton: {
    padding: 8,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  amountItem: {
    flex: 1,
  },
  amountLabel: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginBottom: 4,
    fontWeight: '600',
  },
  amountValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.light.background,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.light.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.primary,
    minWidth: 50,
    textAlign: 'right',
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  remainingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  remainingText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.success,
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  deadlineText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    fontWeight: '500',
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
