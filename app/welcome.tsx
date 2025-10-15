import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { CreditCard } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const card1Anim = useRef(new Animated.Value(0)).current;
  const card2Anim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(card1Anim, {
          toValue: 1,
          tension: 40,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(card2Anim, {
        toValue: 1,
        tension: 40,
        friction: 8,
        delay: 150,
        useNativeDriver: true,
      }),
      Animated.timing(contentAnim, {
        toValue: 1,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const card1TranslateY = card1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 0],
  });

  const card2TranslateY = card2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 0],
  });

  const card1Rotate = card1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-12deg', '-8deg'],
  });

  const card2Rotate = card2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['12deg', '8deg'],
  });

  return (
    <LinearGradient
      colors={['#6B4CE6', '#8B6CE8', '#A88FEA']}
      style={styles.container}
    >
      <View style={styles.cardsSection}>
        <Animated.View
          style={[
            styles.cardWrapper,
            {
              transform: [
                { translateY: card1TranslateY },
                { rotate: card1Rotate },
                { translateX: -40 },
              ],
              opacity: card1Anim,
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            <View style={styles.cardTop}>
              <View style={styles.cardLogo}>
                <CreditCard size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.cardBank}>Wise</Text>
            </View>
            <View style={styles.cardMiddle}>
              <Text style={styles.cardLabel}>Card Number</Text>
              <Text style={styles.cardNumber}>1234 5678 9012 3456</Text>
            </View>
            <View style={styles.cardBottom}>
              <View>
                <Text style={styles.cardLabel}>Cash balance</Text>
                <Text style={styles.cardBalance}>1234 5678 9012 3456</Text>
              </View>
              <View style={styles.cardExpiry}>
                <Text style={styles.cardLabel}>Expiry</Text>
                <Text style={styles.cardBalance}>12/1</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View
          style={[
            styles.cardWrapper,
            {
              transform: [
                { translateY: card2TranslateY },
                { rotate: card2Rotate },
                { translateX: 40 },
              ],
              opacity: card2Anim,
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.15)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            <View style={styles.cardTop}>
              <View style={styles.cardLogo}>
                <CreditCard size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.cardBank}>Wise</Text>
            </View>
            <View style={styles.cardMiddle}>
              <Text style={styles.cardLabel}>Card Number</Text>
              <Text style={styles.cardNumber}>1234 5678 9012 3456</Text>
            </View>
            <View style={styles.cardBottom}>
              <View>
                <Text style={styles.cardLabel}>Cash balance</Text>
                <Text style={styles.cardBalance}>1234 5678 9012 3456</Text>
              </View>
              <View style={styles.cardExpiry}>
                <Text style={styles.cardLabel}>Expiry</Text>
                <Text style={styles.cardBalance}>12/1</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>

      <Animated.View
        style={[
          styles.contentSection,
          {
            opacity: contentAnim,
            transform: [
              {
                translateY: contentAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.textContainer}>
          <Text style={styles.title}>Link your account{"\n"}in one place</Text>
          <Text style={styles.subtitle}>
            Connect all your bank accounts and credit cards{"\n"}for a better overview of your money.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => router.push('/register')}
            activeOpacity={0.9}
          >
            <Text style={styles.signupText}>Sign up for free</Text>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginQuestion}>Already signed up?</Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.loginLink}> Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardsSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
  },
  cardWrapper: {
    position: 'absolute',
  },
  card: {
    width: width * 0.8,
    height: width * 0.8 * 0.6,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardLogo: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBank: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  cardMiddle: {
    gap: 6,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  cardNumber: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardBalance: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginTop: 2,
  },
  cardExpiry: {
    alignItems: 'flex-end',
  },
  contentSection: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 40,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 50 : 32,
  },
  textContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#1C1C1E',
    marginBottom: 16,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400' as const,
    color: '#6C6C70',
    lineHeight: 22,
  },
  buttonContainer: {
    gap: 16,
  },
  signupButton: {
    backgroundColor: '#1C1C1E',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  signupText: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  arrow: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginQuestion: {
    fontSize: 15,
    fontWeight: '400' as const,
    color: '#6C6C70',
  },
  loginLink: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#1C1C1E',
  },
});
