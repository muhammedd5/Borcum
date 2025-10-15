import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/providers/auth';
import { Eye, EyeOff } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const isDesktop = width > 768;

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { loginWithEmail, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      setError('');
      if (!email || !password) {
        setError('Lütfen tüm alanları doldurun');
        return;
      }
      await loginWithEmail(email, password);
      router.replace('/(tabs)');
    } catch {
      setError('Giriş başarısız. Lütfen tekrar deneyin.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.content}>
          {isDesktop && (
            <View style={styles.leftPanel}>
              <View style={styles.logoContainer}>
                <Text style={styles.logoText}>borcum</Text>
              </View>
              
              <Image
                source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/0qldszcb2u0xd3jeyhywb' }}
                style={styles.illustration}
                resizeMode="contain"
              />
              
              <View style={styles.infoContainer}>
                <Text style={styles.infoTitle}>Keep track of your money</Text>
                <Text style={styles.infoTitle}>and save for your future</Text>
                <Text style={styles.infoSubtitle}>
                  Personal finance app puts you in control of your spending. Track transactions, set budgets, and start to savings with family.
                </Text>
              </View>
            </View>
          )}

          <View style={[styles.rightPanel, !isDesktop && styles.rightPanelMobile]}>
            {!isDesktop && (
              <View style={styles.mobileHeader}>
                <Text style={styles.mobileLogoText}>borcum</Text>
              </View>
            )}

            <View style={styles.formContainer}>
              <Text style={styles.title}>Login</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder=""
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    value={password}
                    onChangeText={setPassword}
                    placeholder=""
                    placeholderTextColor="#999"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#666" />
                    ) : (
                      <Eye size={20} color="#666" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.loginButtonText}>Login</Text>
                )}
              </TouchableOpacity>

              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Need to create an account? </Text>
                <TouchableOpacity onPress={() => router.push('/register' as any)}>
                  <Text style={styles.signupLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    flexDirection: isDesktop ? 'row' : 'column',
  },
  leftPanel: {
    flex: 1,
    backgroundColor: '#525866',
    padding: 40,
    justifyContent: 'space-between',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  illustration: {
    width: '100%',
    height: 300,
    marginVertical: 40,
  },
  infoContainer: {
    gap: 16,
  },
  infoTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 36,
  },
  infoSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 22,
    opacity: 0.9,
    marginTop: 8,
  },
  rightPanel: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  rightPanelMobile: {
    flex: 1,
    padding: 24,
    justifyContent: 'flex-start',
  },
  mobileHeader: {
    width: '100%',
    paddingVertical: 20,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    marginBottom: 40,
    marginHorizontal: -24,
    marginTop: -24,
  },
  mobileLogoText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1C1C1E',
    backgroundColor: '#FFFFFF',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 48,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 14,
    padding: 4,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginBottom: 16,
  },
  loginButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#1C1C1E',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  signupText: {
    fontSize: 14,
    color: '#666',
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
});
