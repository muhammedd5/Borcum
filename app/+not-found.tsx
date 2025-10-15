import { Link, Stack } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';
import Colors from '@/constants/colors';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Sayfa Bulunamadı' }} />
      <View style={styles.container}>
        <Text style={styles.title}>404</Text>
        <Text style={styles.subtitle}>Bu sayfa bulunamadı</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Ana sayfaya dön</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 72,
    fontWeight: '700',
    color: Colors.light.primary,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 20,
    color: Colors.light.text,
    marginBottom: 32,
  },
  link: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
  },
  linkText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.surface,
  },
});