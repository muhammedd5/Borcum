import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  Switch,
} from 'react-native';

import { 
  Moon,
  Sun,
  Trash2,
  PauseCircle,
  Bell,
  Lock,
  Eye,
  ChevronLeft,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Stack, router } from 'expo-router';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [hideBalances, setHideBalances] = useState(false);

  const handleDeleteAccount = () => {
    Alert.alert(
      'Hesabı Sil',
      'Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve tüm verileriniz kalıcı olarak silinecektir.',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Sil', 
          style: 'destructive', 
          onPress: () => {
            Alert.alert('Başarılı', 'Hesabınız silme işlemi başlatıldı. 30 gün içinde geri alabilirsiniz.');
          }
        },
      ]
    );
  };

  const handleFreezeAccount = () => {
    Alert.alert(
      'Hesabı Dondur',
      'Hesabınızı geçici olarak dondurmak istediğinize emin misiniz? Dondurulmuş hesaplara giriş yapılamaz.',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Dondur', 
          style: 'destructive', 
          onPress: () => {
            Alert.alert('Başarılı', 'Hesabınız donduruldu. Tekrar aktif etmek için destek ekibiyle iletişime geçin.');
          }
        },
      ]
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Ayarlar',
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
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Görünüm</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: darkMode ? '#1C1C1E' : Colors.light.pastel.yellow }]}>
                  {darkMode ? (
                    <Moon size={20} color="#fff" strokeWidth={2.5} />
                  ) : (
                    <Sun size={20} color="#FF9500" strokeWidth={2.5} />
                  )}
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Karanlık Mod</Text>
                  <Text style={styles.settingDescription}>
                    {darkMode ? 'Karanlık tema aktif' : 'Aydınlık tema aktif'}
                  </Text>
                </View>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: Colors.light.border, true: Colors.light.primary }}
                thumbColor={Colors.light.surface}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: Colors.light.pastel.blue }]}>
                  <Eye size={20} color={Colors.light.secondary} strokeWidth={2.5} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Bakiyeleri Gizle</Text>
                  <Text style={styles.settingDescription}>
                    Ana ekranda bakiyeleri gizle
                  </Text>
                </View>
              </View>
              <Switch
                value={hideBalances}
                onValueChange={setHideBalances}
                trackColor={{ false: Colors.light.border, true: Colors.light.primary }}
                thumbColor={Colors.light.surface}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bildirimler & Güvenlik</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: Colors.light.pastel.peach }]}>
                  <Bell size={20} color={Colors.light.warning} strokeWidth={2.5} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Bildirimler</Text>
                  <Text style={styles.settingDescription}>
                    Ödeme hatırlatmaları ve güncellemeler
                  </Text>
                </View>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: Colors.light.border, true: Colors.light.primary }}
                thumbColor={Colors.light.surface}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: Colors.light.pastel.mint }]}>
                  <Lock size={20} color={Colors.light.success} strokeWidth={2.5} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Biyometrik Giriş</Text>
                  <Text style={styles.settingDescription}>
                    Face ID / Touch ID ile giriş
                  </Text>
                </View>
              </View>
              <Switch
                value={biometric}
                onValueChange={setBiometric}
                trackColor={{ false: Colors.light.border, true: Colors.light.primary }}
                thumbColor={Colors.light.surface}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hesap Yönetimi</Text>
            
            <TouchableOpacity style={styles.dangerItem} onPress={handleFreezeAccount}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: Colors.light.pastel.lavender }]}>
                  <PauseCircle size={20} color="#5856D6" strokeWidth={2.5} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Hesabı Dondur</Text>
                  <Text style={styles.settingDescription}>
                    Hesabınızı geçici olarak devre dışı bırakın
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dangerItem} onPress={handleDeleteAccount}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: Colors.light.pastel.pink }]}>
                  <Trash2 size={20} color={Colors.light.error} strokeWidth={2.5} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingTitle, { color: Colors.light.error }]}>
                    Hesabı Sil
                  </Text>
                  <Text style={styles.settingDescription}>
                    Hesabınızı ve tüm verilerinizi kalıcı olarak silin
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Hesap ayarlarınızı değiştirmek için destek ekibiyle iletişime geçebilirsiniz.
            </Text>
          </View>
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
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.light.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  settingItem: {
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
  dangerItem: {
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
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  infoBox: {
    marginHorizontal: 24,
    padding: 20,
    backgroundColor: Colors.light.surfaceSecondary,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  infoText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },
});
