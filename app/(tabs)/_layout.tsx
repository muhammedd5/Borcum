import { Tabs } from 'expo-router';
import { Home, Wallet, CreditCard, TrendingUp, User } from 'lucide-react-native';
import React from 'react';
import { Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import Colors from '@/constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.primary,
        tabBarInactiveTintColor: Colors.light.textSecondary,
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: Platform.OS === 'ios' ? 85 : 70,
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : Colors.light.surface,
          borderTopWidth: 0,
          elevation: 0,
          ...Platform.select({
            ios: {
              shadowColor: Colors.light.shadow.color,
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
            },
            android: {
              elevation: 8,
            },
          }),
        },
        tabBarBackground: () => Platform.OS === 'ios' ? (
          <BlurView
            intensity={100}
            tint="light"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
            }}
          />
        ) : null,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: -4,
          marginBottom: 4,
        },
        tabBarItemStyle: {
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ana Sayfa',
          tabBarIcon: ({ color }) => <Home size={24} color={color} strokeWidth={2.5} />,
        }}
      />
      <Tabs.Screen
        name="portfolio"
        options={{
          title: 'Varlıklar',
          tabBarIcon: ({ color }) => <TrendingUp size={24} color={color} strokeWidth={2.5} />,
        }}
      />
      <Tabs.Screen
        name="debts"
        options={{
          title: 'Borçlar',
          tabBarIcon: ({ color }) => <CreditCard size={24} color={color} strokeWidth={2.5} />,
        }}
      />
      <Tabs.Screen
        name="opportunities"
        options={{
          title: 'Fırsatlar',
          tabBarIcon: ({ color }) => <Wallet size={24} color={color} strokeWidth={2.5} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <User size={24} color={color} strokeWidth={2.5} />,
        }}
      />
    </Tabs>
  );
}


