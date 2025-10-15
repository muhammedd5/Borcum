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
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Stack, router } from 'expo-router';
import { useAuth } from '@/providers/auth';

export default function AccountScreen() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.email?.split('@')[0] || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [address, setAddress] = useState('');

  const handleSave = () => {
    Alert.alert(
      'Başarılı',
      'Profil bilgileriniz güncellendi',
      [{ text: 'Tamam', onPress: () => setIsEditing(false) }]
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Profil Bilgileri',
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
          <View style={styles.avatarSection}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarLargeText}>{name[0]?.toUpperCase() || 'K'}</Text>
            </View>
            <TouchableOpacity style={styles.changePhotoButton}>
              <Text style={styles.changePhotoText}>Fotoğrafı Değiştir</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}>
                <User size={20} color={Colors.light.textSecondary} strokeWidth={2.5} />
              </View>
              <View style={styles.inputContent}>
                <Text style={styles.inputLabel}>Ad Soyad</Text>
                <TextInput
                  style={[styles.input, !isEditing && styles.inputDisabled]}
                  value={name}
                  onChangeText={setName}
                  editable={isEditing}
                  placeholder="Adınız ve soyadınız"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}>
                <Mail size={20} color={Colors.light.textSecondary} strokeWidth={2.5} />
              </View>
              <View style={styles.inputContent}>
                <Text style={styles.inputLabel}>E-posta</Text>
                <TextInput
                  style={[styles.input, !isEditing && styles.inputDisabled]}
                  value={email}
                  onChangeText={setEmail}
                  editable={isEditing}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="ornek@email.com"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}>
                <Phone size={20} color={Colors.light.textSecondary} strokeWidth={2.5} />
              </View>
              <View style={styles.inputContent}>
                <Text style={styles.inputLabel}>Telefon</Text>
                <TextInput
                  style={[styles.input, !isEditing && styles.inputDisabled]}
                  value={phone}
                  onChangeText={setPhone}
                  editable={isEditing}
                  keyboardType="phone-pad"
                  placeholder="+90 5XX XXX XX XX"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}>
                <Calendar size={20} color={Colors.light.textSecondary} strokeWidth={2.5} />
              </View>
              <View style={styles.inputContent}>
                <Text style={styles.inputLabel}>Doğum Tarihi</Text>
                <TextInput
                  style={[styles.input, !isEditing && styles.inputDisabled]}
                  value={birthDate}
                  onChangeText={setBirthDate}
                  editable={isEditing}
                  placeholder="GG/AA/YYYY"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputIcon}>
                <MapPin size={20} color={Colors.light.textSecondary} strokeWidth={2.5} />
              </View>
              <View style={styles.inputContent}>
                <Text style={styles.inputLabel}>Adres</Text>
                <TextInput
                  style={[styles.input, !isEditing && styles.inputDisabled]}
                  value={address}
                  onChangeText={setAddress}
                  editable={isEditing}
                  multiline
                  numberOfLines={3}
                  placeholder="Adresiniz"
                />
              </View>
            </View>
          </View>

          {isEditing ? (
            <View style={styles.buttonGroup}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setIsEditing(false)}
              >
                <Text style={styles.cancelButtonText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.editButtonText}>Düzenle</Text>
            </TouchableOpacity>
          )}
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
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  avatarLarge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.light.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
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
    fontSize: 48,
    fontWeight: '900',
    color: Colors.light.text,
  },
  changePhotoButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  changePhotoText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  inputGroup: {
    flexDirection: 'row',
    backgroundColor: Colors.light.surface,
    padding: 16,
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
  inputIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.light.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  inputContent: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    padding: 0,
  },
  inputDisabled: {
    color: Colors.light.textSecondary,
  },
  buttonGroup: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.light.surface,
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.light.text,
  },
  saveButton: {
    flex: 1,
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
  saveButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.light.text,
  },
  editButton: {
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
  editButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.light.text,
  },
});
