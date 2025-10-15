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
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  User, 
  Mail,
  Phone,
  X,
  ChevronRight,
  Settings,
  HelpCircle,
  Shield,
  LogOut,
  Lock,
  FileText,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Stack, router } from 'expo-router';
import { useAuth } from '@/providers/auth';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  const { isAuthenticated, user, logout, loginWithEmail, loginWithGoogle, loginWithApple } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone' | null>(null);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkış yapmak istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Çıkış Yap', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await logout();
              Alert.alert('Başarılı', 'Çıkış yapıldı');
            } catch (error) {
              Alert.alert('Hata', 'Çıkış yapılırken bir hata oluştu');
            }
          }
        },
      ]
    );
  };

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    try {
      if (provider === 'google') {
        await loginWithGoogle();
        Alert.alert('Başarılı', 'Google ile giriş yapıldı!');
      } else {
        await loginWithApple();
        Alert.alert('Başarılı', 'Apple ile giriş yapıldı!');
      }
    } catch (error) {
      Alert.alert('Hata', 'Giriş yapılırken bir hata oluştu');
    }
  };

  const handleEmailPhoneLogin = async () => {
    if (loginMethod === 'email' && !email) {
      Alert.alert('Hata', 'Lütfen e-posta adresinizi girin');
      return;
    }
    if (loginMethod === 'phone' && !phone) {
      Alert.alert('Hata', 'Lütfen telefon numaranızı girin');
      return;
    }
    if (!password) {
      Alert.alert('Hata', 'Lütfen şifrenizi girin');
      return;
    }

    try {
      const loginEmail = loginMethod === 'email' ? email : phone;
      await loginWithEmail(loginEmail, password);
      setShowLoginModal(false);
      setEmail('');
      setPhone('');
      setPassword('');
      setLoginMethod(null);
      Alert.alert('Başarılı', 'Giriş yapıldı!');
    } catch (error) {
      Alert.alert('Hata', 'Giriş yapılırken bir hata oluştu');
    }
  };

  const handleKVKK = () => {
    router.push('/kvkk' as any);
  };

  const handleTerms = () => {
    router.push('/terms' as any);
  };

  if (!isAuthenticated) {
    return (
      <>
        <Stack.Screen 
          options={{ 
            title: 'Profil',
            headerShown: false,
          }} 
        />
        <SafeAreaView style={styles.container} edges={['top']}>
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <LinearGradient
              colors={[Colors.light.gradient.blue[0], Colors.light.gradient.blue[1]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroCard}
            >
              <View style={styles.heroIconContainer}>
                <User size={48} color={Colors.light.text} strokeWidth={2.5} />
              </View>
              <Text style={styles.heroTitle}>Hesabınıza Giriş Yapın</Text>
              <Text style={styles.heroSubtitle}>
                Tüm özelliklerden yararlanmak için giriş yapın veya hesap oluşturun
              </Text>
            </LinearGradient>

            <View style={styles.loginSection}>
              <TouchableOpacity 
                style={styles.googleButton}
                onPress={() => handleSocialLogin('google')}
              >
                <View style={styles.googleIcon}>
                  <Text style={styles.googleIconText}>G</Text>
                </View>
                <Text style={styles.googleButtonText}>Google ile Devam Et</Text>
                <ChevronRight size={20} color={Colors.light.textSecondary} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.appleButton}
                onPress={() => handleSocialLogin('apple')}
              >
                <View style={styles.appleIcon}>
                  <Text style={styles.appleIconText}></Text>
                </View>
                <Text style={styles.appleButtonText}>Apple ile Devam Et</Text>
                <ChevronRight size={20} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.emailButton}
                onPress={() => setShowLoginModal(true)}
              >
                <Mail size={22} color={Colors.light.text} strokeWidth={2.5} />
                <Text style={styles.emailButtonText}>E-posta ile Giriş Yap</Text>
                <ChevronRight size={20} color={Colors.light.text} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.phoneButton}
                onPress={() => setShowLoginModal(true)}
              >
                <Phone size={22} color={Colors.light.surface} strokeWidth={2.5} />
                <Text style={styles.phoneButtonText}>Telefon ile Giriş Yap</Text>
                <ChevronRight size={20} color={Colors.light.surface} />
              </TouchableOpacity>
            </View>

            <View style={styles.supportSection}>
              <Text style={styles.supportTitle}>Destek</Text>
              <Text style={styles.supportText}>
                Sorularınız için destek ekibimizle iletişime geçebilirsiniz
              </Text>
            </View>
          </ScrollView>

          <Modal
            visible={showLoginModal}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={() => setShowLoginModal(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Giriş Yap</Text>
                <TouchableOpacity onPress={() => setShowLoginModal(false)}>
                  <X size={24} color={Colors.light.text} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalContent}>
                {!loginMethod ? (
                  <>
                    <TouchableOpacity 
                      style={styles.methodButton}
                      onPress={() => setLoginMethod('email')}
                    >
                      <Mail size={24} color={Colors.light.primary} />
                      <Text style={styles.methodButtonText}>E-posta ile Giriş</Text>
                      <ChevronRight size={20} color={Colors.light.textSecondary} />
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.methodButton}
                      onPress={() => setLoginMethod('phone')}
                    >
                      <Phone size={24} color={Colors.light.primary} />
                      <Text style={styles.methodButtonText}>Telefon ile Giriş</Text>
                      <ChevronRight size={20} color={Colors.light.textSecondary} />
                    </TouchableOpacity>
                  </>
                ) : (
                  <View style={styles.loginForm}>
                    <TouchableOpacity 
                      style={styles.backButton}
                      onPress={() => setLoginMethod(null)}
                    >
                      <Text style={styles.backButtonText}>← Geri</Text>
                    </TouchableOpacity>

                    {loginMethod === 'email' ? (
                      <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>E-posta</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="ornek@email.com"
                          value={email}
                          onChangeText={setEmail}
                          keyboardType="email-address"
                          autoCapitalize="none"
                        />
                      </View>
                    ) : (
                      <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Telefon</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="+90 5XX XXX XX XX"
                          value={phone}
                          onChangeText={setPhone}
                          keyboardType="phone-pad"
                        />
                      </View>
                    )}

                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Şifre</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="••••••••"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                      />
                    </View>

                    <TouchableOpacity 
                      style={styles.submitButton}
                      onPress={handleEmailPhoneLogin}
                    >
                      <Text style={styles.submitButtonText}>Giriş Yap</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.forgotButton}>
                      <Text style={styles.forgotButtonText}>Şifremi Unuttum</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </ScrollView>
            </View>
          </Modal>
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Profil',
          headerShown: false,
        }} 
      />
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContentAuth}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.greeting}>Profil</Text>
            <Text style={styles.subtitle}>Hesap ayarlarınız</Text>
          </View>

          <View style={styles.profileHeader}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarLargeText}>{user?.email?.[0]?.toUpperCase() || 'K'}</Text>
            </View>
            <Text style={styles.profileName}>{user?.email?.split('@')[0] || 'Kullanıcı'}</Text>
            <Text style={styles.profileEmail}>{user?.email || 'email@example.com'}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hesap Bilgileri</Text>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => router.push('/(tabs)/profile/account')}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: Colors.light.pastel.blue }]}>
                  <User size={20} color={Colors.light.secondary} strokeWidth={2.5} />
                </View>
                <Text style={styles.menuItemText}>Profil Bilgileri</Text>
              </View>
              <ChevronRight size={20} color={Colors.light.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => router.push('/(tabs)/profile/change-password')}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: Colors.light.pastel.mint }]}>
                  <Lock size={20} color={Colors.light.success} strokeWidth={2.5} />
                </View>
                <Text style={styles.menuItemText}>Şifre Değiştir</Text>
              </View>
              <ChevronRight size={20} color={Colors.light.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => router.push('/(tabs)/profile/settings')}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: Colors.light.pastel.lavender }]}>
                  <Settings size={20} color="#5856D6" strokeWidth={2.5} />
                </View>
                <Text style={styles.menuItemText}>Ayarlar</Text>
              </View>
              <ChevronRight size={20} color={Colors.light.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Destek & Bilgi</Text>
            
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: Colors.light.surfaceSecondary }]}>
                  <HelpCircle size={20} color={Colors.light.textSecondary} strokeWidth={2.5} />
                </View>
                <Text style={styles.menuItemText}>Destek</Text>
              </View>
              <ChevronRight size={20} color={Colors.light.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleKVKK}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: Colors.light.pastel.mint }]}>
                  <Shield size={20} color={Colors.light.success} strokeWidth={2.5} />
                </View>
                <Text style={styles.menuItemText}>KVKK</Text>
              </View>
              <ChevronRight size={20} color={Colors.light.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleTerms}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: Colors.light.pastel.blue }]}>
                  <FileText size={20} color={Colors.light.secondary} strokeWidth={2.5} />
                </View>
                <Text style={styles.menuItemText}>Kullanım Koşulları</Text>
              </View>
              <ChevronRight size={20} color={Colors.light.textSecondary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color={Colors.light.error} strokeWidth={2.5} />
            <Text style={styles.logoutText}>Çıkış Yap</Text>
          </TouchableOpacity>

          <Text style={styles.version}>Borcum v1.0.0</Text>
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
  scrollContentAuth: {
    paddingBottom: 120,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.light.text,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  heroCard: {
    marginHorizontal: 24,
    marginTop: 8,
    padding: 40,
    borderRadius: 28,
    alignItems: 'center',
    marginBottom: 32,
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
  heroIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.light.text,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(28, 28, 30, 0.7)',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
  loginSection: {
    paddingHorizontal: 24,
    marginBottom: 40,
    gap: 12,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 20,
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
  googleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  googleIconText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#fff',
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.light.text,
    flex: 1,
  },
  appleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.shadow.color,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  appleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  appleIconText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000',
  },
  appleButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
    flex: 1,
  },
  emailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.accent,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 20,
    gap: 12,
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
  emailButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.light.text,
    flex: 1,
  },
  phoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 20,
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  phoneButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.light.surface,
    flex: 1,
  },
  supportSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  supportTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  supportText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  avatarLarge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.light.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  avatarLargeText: {
    fontSize: 40,
    fontWeight: '900',
    color: Colors.light.text,
  },
  profileName: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.light.text,
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  profileEmail: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.light.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.surface,
    padding: 16,
    borderRadius: 20,
    marginBottom: 10,
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
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginHorizontal: 24,
    padding: 18,
    backgroundColor: Colors.light.surface,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.light.error,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.light.error,
  },
  version: {
    textAlign: 'center',
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginTop: 24,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.light.text,
    letterSpacing: -0.5,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  methodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    padding: 20,
    borderRadius: 20,
    marginBottom: 12,
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
  methodButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.light.text,
    flex: 1,
    marginLeft: 16,
  },
  loginForm: {
    paddingTop: 8,
  },
  backButton: {
    marginBottom: 24,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.primary,
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
  input: {
    backgroundColor: Colors.light.surface,
    padding: 16,
    borderRadius: 16,
    fontSize: 16,
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  submitButton: {
    backgroundColor: Colors.light.accent,
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 8,
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
  submitButtonText: {
    fontSize: 17,
    fontWeight: '900',
    color: Colors.light.text,
  },
  forgotButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  forgotButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.primary,
  },
});
