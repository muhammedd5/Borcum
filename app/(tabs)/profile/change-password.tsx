import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  TextInput,
} from 'react-native';
import { 
  ChevronLeft,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Stack, router } from 'expo-router';

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Hata', 'Yeni şifreler eşleşmiyor');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Hata', 'Şifre en az 8 karakter olmalıdır');
      return;
    }

    Alert.alert(
      'Başarılı',
      'Şifreniz başarıyla değiştirildi',
      [{ text: 'Tamam', onPress: () => router.back() }]
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Şifre Değiştir',
          headerShown: true,
          headerStyle: {
            backgroundColor: Colors.light.background,
          },
          headerTitleStyle: {
            fontWeight: '800',
            fontSize: 18,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 8 }}>
              <ChevronLeft size={28} color={Colors.light.text} strokeWidth={2.5} />
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
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Lock size={32} color={Colors.light.success} strokeWidth={2.5} />
            </View>
          </View>

          <Text style={styles.title}>Şifrenizi Değiştirin</Text>
          <Text style={styles.subtitle}>
            Güvenliğiniz için güçlü bir şifre seçin
          </Text>

          <View style={styles.section}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Mevcut Şifre</Text>
              <View style={styles.passwordInput}>
                <TextInput
                  style={styles.input}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry={!showCurrent}
                  placeholder="Mevcut şifreniz"
                />
                <TouchableOpacity 
                  style={styles.eyeButton}
                  onPress={() => setShowCurrent(!showCurrent)}
                >
                  {showCurrent ? (
                    <EyeOff size={20} color={Colors.light.textSecondary} strokeWidth={2.5} />
                  ) : (
                    <Eye size={20} color={Colors.light.textSecondary} strokeWidth={2.5} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Yeni Şifre</Text>
              <View style={styles.passwordInput}>
                <TextInput
                  style={styles.input}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNew}
                  placeholder="Yeni şifreniz"
                />
                <TouchableOpacity 
                  style={styles.eyeButton}
                  onPress={() => setShowNew(!showNew)}
                >
                  {showNew ? (
                    <EyeOff size={20} color={Colors.light.textSecondary} strokeWidth={2.5} />
                  ) : (
                    <Eye size={20} color={Colors.light.textSecondary} strokeWidth={2.5} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Yeni Şifre (Tekrar)</Text>
              <View style={styles.passwordInput}>
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirm}
                  placeholder="Yeni şifrenizi tekrar girin"
                />
                <TouchableOpacity 
                  style={styles.eyeButton}
                  onPress={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? (
                    <EyeOff size={20} color={Colors.light.textSecondary} strokeWidth={2.5} />
                  ) : (
                    <Eye size={20} color={Colors.light.textSecondary} strokeWidth={2.5} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.requirementsBox}>
              <Text style={styles.requirementsTitle}>Şifre Gereksinimleri:</Text>
              <Text style={styles.requirementItem}>• En az 8 karakter</Text>
              <Text style={styles.requirementItem}>• En az bir büyük harf</Text>
              <Text style={styles.requirementItem}>• En az bir küçük harf</Text>
              <Text style={styles.requirementItem}>• En az bir rakam</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.changeButton}
            onPress={handleChangePassword}
          >
            <Text style={styles.changeButtonText}>Şifreyi Değiştir</Text>
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
    paddingBottom: 32,
  },
  iconContainer: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.light.pastel.mint,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.success,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 8,
    paddingHorizontal: 24,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 24,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
  },
  passwordInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.light.border,
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.shadow.color,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: Colors.light.shadow.opacity,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  eyeButton: {
    padding: 16,
  },
  requirementsBox: {
    backgroundColor: Colors.light.surfaceSecondary,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.light.border,
    marginTop: 8,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.light.text,
    marginBottom: 12,
  },
  requirementItem: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 6,
    fontWeight: '500',
  },
  changeButton: {
    marginHorizontal: 24,
    backgroundColor: Colors.light.accent,
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  changeButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.light.text,
  },
});
